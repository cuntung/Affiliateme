-- UP
CREATE TABLE IF NOT EXISTS affiliate_networks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    website_url VARCHAR(255),
    api_endpoint VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_networks_user_id ON affiliate_networks(user_id);

-- DOWN
DROP TABLE IF EXISTS affiliate_networks;
