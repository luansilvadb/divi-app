-- Migration 001: Rollback Initial Schema
-- Drops all tables, triggers, functions, and policies created in 001_initial_schema.up.sql
-- WARNING: This will permanently delete ALL data.

-------------------------------------------------------
-- 1. Drop Triggers
-------------------------------------------------------
DROP TRIGGER IF EXISTS trg_wallets_server_updated_at ON wallets;
DROP TRIGGER IF EXISTS trg_categories_server_updated_at ON categories;
DROP TRIGGER IF EXISTS trg_payees_server_updated_at ON payees;
DROP TRIGGER IF EXISTS trg_transactions_server_updated_at ON transactions;
DROP TRIGGER IF EXISTS trg_loans_server_updated_at ON loans;
DROP TRIGGER IF EXISTS trg_subscriptions_server_updated_at ON subscriptions;
DROP TRIGGER IF EXISTS trg_budgets_server_updated_at ON budgets;
DROP TRIGGER IF EXISTS trg_goals_server_updated_at ON goals;

-------------------------------------------------------
-- 2. Drop Function
-------------------------------------------------------
DROP FUNCTION IF EXISTS update_server_updated_at();

-------------------------------------------------------
-- 3. Drop Tables (order matters due to FK constraints)
-------------------------------------------------------
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS budgets CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS loans CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS payees CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
