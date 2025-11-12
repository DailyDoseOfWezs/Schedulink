-- Auto-confirm email trigger for Supabase
-- This automatically confirms user emails when they sign up
-- Run this in Supabase SQL Editor after running database-schema.sql

-- Function to auto-confirm email on user creation
CREATE OR REPLACE FUNCTION auto_confirm_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Automatically confirm the email when a new user is created
  NEW.email_confirmed_at = COALESCE(NEW.email_confirmed_at, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
-- This runs BEFORE a new user is inserted
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_confirm_email();

-- Also confirm any existing unconfirmed users (optional - run once)
-- Uncomment the line below if you want to confirm all existing users
-- UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;

