const { customAlphabet } = require('nanoid');
const db = require('../config/database');

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);

async function getAllLinks(req, res) {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20, category, networkId, sortBy = 'created_at', order = 'DESC' } = req.query;
    
    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        l.id, l.original_url, l.short_code, l.title, l.description, 
        l.category, l.clicks, l.created_at, l.updated_at,
        n.id as network_id, n.name as network_name
      FROM affiliate_links l
      LEFT JOIN affiliate_networks n ON l.network_id = n.id
      WHERE l.user_id = $1
    `;
    
    const params = [userId];
    let paramCount = 1;
    
    if (category) {
      paramCount++;
      query += ` AND l.category = $${paramCount}`;
      params.push(category);
    }
    
    if (networkId) {
      paramCount++;
      query += ` AND l.network_id = $${paramCount}`;
      params.push(networkId);
    }
    
    const validSortFields = ['created_at', 'clicks', 'title'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    query += ` ORDER BY l.${sortField} ${sortOrder} LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);
    
    const result = await db.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM affiliate_links WHERE user_id = $1';
    const countParams = [userId];
    
    if (category) {
      countQuery += ' AND category = $2';
      countParams.push(category);
    }
    
    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);
    
    const links = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      originalUrl: row.original_url,
      shortCode: row.short_code,
      shortUrl: `${process.env.SHORT_URL_BASE || 'http://localhost:3000/r'}/${row.short_code}`,
      category: row.category,
      description: row.description,
      networkId: row.network_id,
      networkName: row.network_name,
      clicks: row.clicks,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
    
    res.json({
      success: true,
      data: {
        links,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get links error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch links',
      },
    });
  }
}

async function getLinkById(req, res) {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    
    const result = await db.query(
      `SELECT 
        l.id, l.original_url, l.short_code, l.title, l.description, 
        l.category, l.clicks, l.created_at, l.updated_at,
        n.id as network_id, n.name as network_name
      FROM affiliate_links l
      LEFT JOIN affiliate_networks n ON l.network_id = n.id
      WHERE l.id = $1 AND l.user_id = $2`,
      [id, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'RESOURCE_NOT_FOUND',
          message: 'Link not found',
        },
      });
    }
    
    const row = result.rows[0];
    const link = {
      id: row.id,
      title: row.title,
      originalUrl: row.original_url,
      shortCode: row.short_code,
      shortUrl: `${process.env.SHORT_URL_BASE || 'http://localhost:3000/r'}/${row.short_code}`,
      category: row.category,
      description: row.description,
      networkId: row.network_id,
      networkName: row.network_name,
      clicks: row.clicks,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
    
    res.json({
      success: true,
      data: { link },
    });
  } catch (error) {
    console.error('Get link error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch link',
      },
    });
  }
}

async function createLink(req, res) {
  try {
    const userId = req.user.userId;
    const { originalUrl, title, description, category, networkId } = req.body;
    
    if (!originalUrl || !title) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Original URL and title are required',
        },
      });
    }
    
    // Generate unique short code
    let shortCode;
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      shortCode = nanoid();
      const existing = await db.query(
        'SELECT id FROM affiliate_links WHERE short_code = $1',
        [shortCode]
      );
      isUnique = existing.rows.length === 0;
      attempts++;
    }
    
    if (!isUnique) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to generate unique short code',
        },
      });
    }
    
    const result = await db.query(
      `INSERT INTO affiliate_links (user_id, network_id, original_url, short_code, title, description, category)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, original_url, short_code, title, description, category, clicks, created_at, updated_at`,
      [userId, networkId || null, originalUrl, shortCode, title, description || null, category || null]
    );
    
    const link = result.rows[0];
    
    res.status(201).json({
      success: true,
      data: {
        link: {
          id: link.id,
          title: link.title,
          originalUrl: link.original_url,
          shortCode: link.short_code,
          shortUrl: `${process.env.SHORT_URL_BASE || 'http://localhost:3000/r'}/${link.short_code}`,
          category: link.category,
          description: link.description,
          networkId: networkId || null,
          clicks: link.clicks,
          createdAt: link.created_at,
          updatedAt: link.updated_at,
        },
      },
    });
  } catch (error) {
    console.error('Create link error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create link',
      },
    });
  }
}

async function updateLink(req, res) {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { title, description, category } = req.body;
    
    // Check if link exists and belongs to user
    const existing = await db.query(
      'SELECT id FROM affiliate_links WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'RESOURCE_NOT_FOUND',
          message: 'Link not found',
        },
      });
    }
    
    const result = await db.query(
      `UPDATE affiliate_links 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           category = COALESCE($3, category),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 AND user_id = $5
       RETURNING id, original_url, short_code, title, description, category, clicks, created_at, updated_at`,
      [title, description, category, id, userId]
    );
    
    const link = result.rows[0];
    
    res.json({
      success: true,
      data: {
        link: {
          id: link.id,
          title: link.title,
          originalUrl: link.original_url,
          shortCode: link.short_code,
          shortUrl: `${process.env.SHORT_URL_BASE || 'http://localhost:3000/r'}/${link.short_code}`,
          category: link.category,
          description: link.description,
          clicks: link.clicks,
          createdAt: link.created_at,
          updatedAt: link.updated_at,
        },
      },
    });
  } catch (error) {
    console.error('Update link error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update link',
      },
    });
  }
}

async function deleteLink(req, res) {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    
    const result = await db.query(
      'DELETE FROM affiliate_links WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'RESOURCE_NOT_FOUND',
          message: 'Link not found',
        },
      });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Delete link error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete link',
      },
    });
  }
}

async function redirectLink(req, res) {
  try {
    const { shortCode } = req.params;
    
    const result = await db.query(
      'SELECT id, original_url FROM affiliate_links WHERE short_code = $1',
      [shortCode]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).send('Link not found');
    }
    
    const link = result.rows[0];
    
    // Track click
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';
    const referrer = req.headers.referer || req.headers.referrer || '';
    
    await db.query(
      'INSERT INTO clicks (link_id, ip_address, user_agent, referrer) VALUES ($1, $2, $3, $4)',
      [link.id, ip, userAgent, referrer]
    );
    
    // Increment click count
    await db.query(
      'UPDATE affiliate_links SET clicks = clicks + 1 WHERE id = $1',
      [link.id]
    );
    
    res.redirect(link.original_url);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).send('Internal server error');
  }
}

module.exports = {
  getAllLinks,
  getLinkById,
  createLink,
  updateLink,
  deleteLink,
  redirectLink,
};
