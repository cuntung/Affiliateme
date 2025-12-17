const db = require('../config/database');

async function getOverview(req, res) {
  try {
    const userId = req.user.userId;
    const { startDate, endDate } = req.query;
    
    // Get total clicks
    let clickQuery = `
      SELECT COUNT(*) as total_clicks
      FROM clicks c
      JOIN affiliate_links l ON c.link_id = l.id
      WHERE l.user_id = $1
    `;
    const clickParams = [userId];
    
    if (startDate && endDate) {
      clickQuery += ' AND c.clicked_at BETWEEN $2 AND $3';
      clickParams.push(startDate, endDate);
    }
    
    const clickResult = await db.query(clickQuery, clickParams);
    const totalClicks = parseInt(clickResult.rows[0].total_clicks);
    
    // Get total links
    const linksResult = await db.query(
      'SELECT COUNT(*) as total_links FROM affiliate_links WHERE user_id = $1',
      [userId]
    );
    const totalLinks = parseInt(linksResult.rows[0].total_links);
    
    // Get total earnings
    let earningsQuery = `
      SELECT COALESCE(SUM(amount), 0) as total_earnings
      FROM earnings
      WHERE user_id = $1
    `;
    const earningsParams = [userId];
    
    if (startDate && endDate) {
      earningsQuery += ' AND transaction_date BETWEEN $2 AND $3';
      earningsParams.push(startDate, endDate);
    }
    
    const earningsResult = await db.query(earningsQuery, earningsParams);
    const totalEarnings = parseFloat(earningsResult.rows[0].total_earnings);
    
    // Get top links
    const topLinksQuery = `
      SELECT 
        l.id, l.title, l.clicks,
        COALESCE(SUM(e.amount), 0) as earnings
      FROM affiliate_links l
      LEFT JOIN earnings e ON l.id = e.link_id
      WHERE l.user_id = $1
      GROUP BY l.id, l.title, l.clicks
      ORDER BY l.clicks DESC
      LIMIT 5
    `;
    
    const topLinksResult = await db.query(topLinksQuery, [userId]);
    const topLinks = topLinksResult.rows.map(row => ({
      id: row.id,
      title: row.title,
      clicks: row.clicks,
      earnings: parseFloat(row.earnings),
    }));
    
    // Get clicks by date (last 30 days)
    const clicksByDateQuery = `
      SELECT 
        DATE(c.clicked_at) as date,
        COUNT(*) as clicks
      FROM clicks c
      JOIN affiliate_links l ON c.link_id = l.id
      WHERE l.user_id = $1
        AND c.clicked_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(c.clicked_at)
      ORDER BY date ASC
    `;
    
    const clicksByDateResult = await db.query(clicksByDateQuery, [userId]);
    const clicksByDate = clicksByDateResult.rows.map(row => ({
      date: row.date,
      clicks: parseInt(row.clicks),
    }));
    
    // Get earnings by date (last 30 days)
    const earningsByDateQuery = `
      SELECT 
        transaction_date as date,
        SUM(amount) as earnings
      FROM earnings
      WHERE user_id = $1
        AND transaction_date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY transaction_date
      ORDER BY transaction_date ASC
    `;
    
    const earningsByDateResult = await db.query(earningsByDateQuery, [userId]);
    const earningsByDate = earningsByDateResult.rows.map(row => ({
      date: row.date,
      earnings: parseFloat(row.earnings),
    }));
    
    res.json({
      success: true,
      data: {
        totalClicks,
        totalEarnings,
        totalLinks,
        topLinks,
        clicksByDate,
        earningsByDate,
      },
    });
  } catch (error) {
    console.error('Get overview error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch analytics overview',
      },
    });
  }
}

async function getLinkStats(req, res) {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { startDate, endDate } = req.query;
    
    // Verify link belongs to user
    const linkCheck = await db.query(
      'SELECT id FROM affiliate_links WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    
    if (linkCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'RESOURCE_NOT_FOUND',
          message: 'Link not found',
        },
      });
    }
    
    // Get total clicks
    let clickQuery = 'SELECT COUNT(*) as total_clicks FROM clicks WHERE link_id = $1';
    const clickParams = [id];
    
    if (startDate && endDate) {
      clickQuery += ' AND clicked_at BETWEEN $2 AND $3';
      clickParams.push(startDate, endDate);
    }
    
    const clickResult = await db.query(clickQuery, clickParams);
    const totalClicks = parseInt(clickResult.rows[0].total_clicks);
    
    // Get unique clicks (by IP)
    let uniqueQuery = 'SELECT COUNT(DISTINCT ip_address) as unique_clicks FROM clicks WHERE link_id = $1';
    const uniqueParams = [id];
    
    if (startDate && endDate) {
      uniqueQuery += ' AND clicked_at BETWEEN $2 AND $3';
      uniqueParams.push(startDate, endDate);
    }
    
    const uniqueResult = await db.query(uniqueQuery, uniqueParams);
    const uniqueClicks = parseInt(uniqueResult.rows[0].unique_clicks);
    
    // Get total earnings
    let earningsQuery = 'SELECT COALESCE(SUM(amount), 0) as total_earnings FROM earnings WHERE link_id = $1';
    const earningsParams = [id];
    
    if (startDate && endDate) {
      earningsQuery += ' AND transaction_date BETWEEN $2 AND $3';
      earningsParams.push(startDate, endDate);
    }
    
    const earningsResult = await db.query(earningsQuery, earningsParams);
    const totalEarnings = parseFloat(earningsResult.rows[0].total_earnings);
    
    // Get clicks by date
    const clicksByDateQuery = `
      SELECT 
        DATE(clicked_at) as date,
        COUNT(*) as clicks
      FROM clicks
      WHERE link_id = $1
      GROUP BY DATE(clicked_at)
      ORDER BY date DESC
      LIMIT 30
    `;
    
    const clicksByDateResult = await db.query(clicksByDateQuery, [id]);
    const clicksByDate = clicksByDateResult.rows.map(row => ({
      date: row.date,
      clicks: parseInt(row.clicks),
    }));
    
    // Get clicks by referrer
    const referrerQuery = `
      SELECT 
        COALESCE(NULLIF(referrer, ''), 'Direct') as referrer,
        COUNT(*) as clicks
      FROM clicks
      WHERE link_id = $1
      GROUP BY referrer
      ORDER BY clicks DESC
      LIMIT 10
    `;
    
    const referrerResult = await db.query(referrerQuery, [id]);
    const clicksByReferrer = referrerResult.rows.map(row => ({
      referrer: row.referrer,
      clicks: parseInt(row.clicks),
    }));
    
    const conversionRate = totalClicks > 0 ? (totalEarnings / totalClicks).toFixed(2) : 0;
    
    res.json({
      success: true,
      data: {
        linkId: id,
        totalClicks,
        uniqueClicks,
        totalEarnings,
        conversionRate: parseFloat(conversionRate),
        clicksByDate,
        clicksByReferrer,
      },
    });
  } catch (error) {
    console.error('Get link stats error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch link statistics',
      },
    });
  }
}

module.exports = {
  getOverview,
  getLinkStats,
};
