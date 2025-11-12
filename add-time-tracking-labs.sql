-- Add time tracking fields to labs table
-- Run this in Supabase SQL Editor AFTER running update-labs-schema.sql

ALTER TABLE labs 
ADD COLUMN IF NOT EXISTS time_in TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS time_out TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS occupant TEXT;

