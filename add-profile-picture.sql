-- Add avatar_url to profiles table
-- Run this in Supabase SQL Editor

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create index for avatar_url
CREATE INDEX IF NOT EXISTS idx_profiles_avatar_url ON profiles(avatar_url) 
WHERE avatar_url IS NOT NULL;

