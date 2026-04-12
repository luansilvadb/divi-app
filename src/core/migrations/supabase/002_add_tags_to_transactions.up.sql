-- Migration 002: Add Tags to Transactions
-- Adds a tags column (JSONB array) with GIN index for fast lookups

ALTER TABLE transactions ADD COLUMN IF NOT EXISTS tags JSONB NOT NULL DEFAULT '[]'::jsonb;

-- GIN index for efficient tag queries (e.g., WHERE tags @> '["groceries"]')
CREATE INDEX IF NOT EXISTS idx_transactions_tags ON transactions USING GIN (tags);
