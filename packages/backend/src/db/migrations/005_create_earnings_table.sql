-- UP
CREATE TABLE IF NOT EXISTS earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    link_id UUID REFERENCES affiliate_links(id) ON DELETE SET NULL,
    network_id UUID REFERENCES affiliate_networks(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    currency VARCHAR(3) DEFAULT 'USD',
    transaction_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_earnings_user_id ON earnings(user_id);
CREATE INDEX idx_earnings_link_id ON earnings(link_id);
CREATE INDEX idx_earnings_network_id ON earnings(network_id);
CREATE INDEX idx_earnings_transaction_date ON earnings(transaction_date);
CREATE INDEX idx_earnings_status ON earnings(status);

-- DOWN
DROP TABLE IF EXISTS earnings;
