-- Migration 001: Initial Schema
-- Creates all tables for the Divi application
-- Applied to: Supabase (PostgreSQL)

-------------------------------------------------------
-- 1. Enable UUID extension (if not already enabled)
-------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-------------------------------------------------------
-- 2. Create Tables
-------------------------------------------------------

-- Wallets
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'BRL',
  sync_status TEXT NOT NULL DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending', 'failed')),
  client_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  version INTEGER NOT NULL DEFAULT 1,
  deleted BOOLEAN NOT NULL DEFAULT false,
  last_synced_at TIMESTAMPTZ,
  server_updated_at TIMESTAMPTZ DEFAULT now()
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  sync_status TEXT NOT NULL DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending', 'failed')),
  client_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  version INTEGER NOT NULL DEFAULT 1,
  deleted BOOLEAN NOT NULL DEFAULT false,
  last_synced_at TIMESTAMPTZ,
  server_updated_at TIMESTAMPTZ DEFAULT now()
);

-- Payees
CREATE TABLE IF NOT EXISTS payees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sync_status TEXT NOT NULL DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending', 'failed')),
  client_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  version INTEGER NOT NULL DEFAULT 1,
  deleted BOOLEAN NOT NULL DEFAULT false,
  last_synced_at TIMESTAMPTZ,
  server_updated_at TIMESTAMPTZ DEFAULT now()
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category_id UUID NOT NULL REFERENCES categories(id),
  wallet_id UUID NOT NULL REFERENCES wallets(id),
  payee_id UUID REFERENCES payees(id),
  date DATE NOT NULL,
  notes TEXT,
  sync_status TEXT NOT NULL DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending', 'failed')),
  client_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  version INTEGER NOT NULL DEFAULT 1,
  deleted BOOLEAN NOT NULL DEFAULT false,
  last_synced_at TIMESTAMPTZ,
  server_updated_at TIMESTAMPTZ DEFAULT now()
);

-- Loans
CREATE TABLE IF NOT EXISTS loans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  total_value NUMERIC(12,2) NOT NULL,
  remaining_value NUMERIC(12,2) NOT NULL,
  interest_rate NUMERIC(5,2),
  due_date DATE NOT NULL,
  sync_status TEXT NOT NULL DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending', 'failed')),
  client_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  version INTEGER NOT NULL DEFAULT 1,
  deleted BOOLEAN NOT NULL DEFAULT false,
  last_synced_at TIMESTAMPTZ,
  server_updated_at TIMESTAMPTZ DEFAULT now()
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id),
  wallet_id UUID NOT NULL REFERENCES wallets(id),
  billing_day INTEGER NOT NULL CHECK (billing_day >= 1 AND billing_day <= 31),
  frequency TEXT NOT NULL CHECK (frequency IN ('monthly', 'yearly')),
  last_billed_at TIMESTAMPTZ,
  sync_status TEXT NOT NULL DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending', 'failed')),
  client_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  version INTEGER NOT NULL DEFAULT 1,
  deleted BOOLEAN NOT NULL DEFAULT false,
  last_synced_at TIMESTAMPTZ,
  server_updated_at TIMESTAMPTZ DEFAULT now()
);

-- Activities (not synced — logged locally and pushed)
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error'))
);

-- Budgets
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  category_id UUID NOT NULL REFERENCES categories(id),
  limit_value NUMERIC(12,2) NOT NULL,
  period TEXT NOT NULL DEFAULT 'monthly' CHECK (period IN ('monthly')),
  sync_status TEXT NOT NULL DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending', 'failed')),
  client_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  version INTEGER NOT NULL DEFAULT 1,
  deleted BOOLEAN NOT NULL DEFAULT false,
  last_synced_at TIMESTAMPTZ,
  server_updated_at TIMESTAMPTZ DEFAULT now()
);

-- Goals
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_value NUMERIC(12,2) NOT NULL,
  current_value NUMERIC(12,2) NOT NULL DEFAULT 0,
  type TEXT NOT NULL CHECK (type IN ('saving', 'debt')),
  color TEXT,
  icon TEXT,
  sync_status TEXT NOT NULL DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending', 'failed')),
  client_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  version INTEGER NOT NULL DEFAULT 1,
  deleted BOOLEAN NOT NULL DEFAULT false,
  last_synced_at TIMESTAMPTZ,
  server_updated_at TIMESTAMPTZ DEFAULT now()
);

-------------------------------------------------------
-- 3. Indexes
-------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_sync_status ON transactions(sync_status);
CREATE INDEX IF NOT EXISTS idx_transactions_deleted ON transactions(deleted);
CREATE INDEX IF NOT EXISTS idx_transactions_payee_id ON transactions(payee_id);

CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallets_sync_status ON wallets(sync_status);

CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_sync_status ON categories(sync_status);

CREATE INDEX IF NOT EXISTS idx_payees_user_id ON payees(user_id);
CREATE INDEX IF NOT EXISTS idx_payees_sync_status ON payees(sync_status);

CREATE INDEX IF NOT EXISTS idx_loans_user_id ON loans(user_id);
CREATE INDEX IF NOT EXISTS idx_loans_sync_status ON loans(sync_status);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_sync_status ON subscriptions(sync_status);

CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities(timestamp);

CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_sync_status ON budgets(sync_status);

CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_sync_status ON goals(sync_status);

-------------------------------------------------------
-- 4. Row Level Security (RLS)
-------------------------------------------------------
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE payees ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY wallets_user_policy ON wallets FOR ALL USING (user_id = auth.uid());
CREATE POLICY categories_user_policy ON categories FOR ALL USING (user_id = auth.uid());
CREATE POLICY payees_user_policy ON payees FOR ALL USING (user_id = auth.uid());
CREATE POLICY transactions_user_policy ON transactions FOR ALL USING (user_id = auth.uid());
CREATE POLICY loans_user_policy ON loans FOR ALL USING (user_id = auth.uid());
CREATE POLICY subscriptions_user_policy ON subscriptions FOR ALL USING (user_id = auth.uid());
CREATE POLICY activities_user_policy ON activities FOR ALL USING (user_id = auth.uid());
CREATE POLICY budgets_user_policy ON budgets FOR ALL USING (user_id = auth.uid());
CREATE POLICY goals_user_policy ON goals FOR ALL USING (user_id = auth.uid());

-------------------------------------------------------
-- 5. Auto-update server_updated_at trigger
-------------------------------------------------------
CREATE OR REPLACE FUNCTION update_server_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.server_updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all syncable tables
CREATE TRIGGER trg_wallets_server_updated_at BEFORE UPDATE ON wallets FOR EACH ROW EXECUTE FUNCTION update_server_updated_at();
CREATE TRIGGER trg_categories_server_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_server_updated_at();
CREATE TRIGGER trg_payees_server_updated_at BEFORE UPDATE ON payees FOR EACH ROW EXECUTE FUNCTION update_server_updated_at();
CREATE TRIGGER trg_transactions_server_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_server_updated_at();
CREATE TRIGGER trg_loans_server_updated_at BEFORE UPDATE ON loans FOR EACH ROW EXECUTE FUNCTION update_server_updated_at();
CREATE TRIGGER trg_subscriptions_server_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_server_updated_at();
CREATE TRIGGER trg_budgets_server_updated_at BEFORE UPDATE ON budgets FOR EACH ROW EXECUTE FUNCTION update_server_updated_at();
CREATE TRIGGER trg_goals_server_updated_at BEFORE UPDATE ON goals FOR EACH ROW EXECUTE FUNCTION update_server_updated_at();
