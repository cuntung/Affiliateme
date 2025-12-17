-- UP
CREATE TABLE IF NOT EXISTS affiliate_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    network_id UUID REFERENCES affiliate_networks(id) ON DELETE SET NULL,
    original_url TEXT NOT NULL,
    short_code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255),
    description TEXT,
    category VARCHAR(100),
    clicks INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_links_user_id ON affiliate_links(user_id);
CREATE INDEX idx_links_short_code ON affiliate_links(short_code);
CREATE INDEX idx_links_network_id ON affiliate_links(network_id);
CREATE INDEX idx_links_created_at ON affiliate_links(created_at);

-- DOWN
DROP TABLE IF EXISTS affiliate_links;
