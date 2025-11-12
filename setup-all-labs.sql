-- Complete Lab Setup - Run This Once
-- This adds all required columns and sets up COMLAB BUILDING
-- Run this in Supabase SQL Editor

-- Step 1: Add building column (if it doesn't exist)
ALTER TABLE labs 
ADD COLUMN IF NOT EXISTS building TEXT;

-- Step 2: Add time tracking columns (if they don't exist)
ALTER TABLE labs 
ADD COLUMN IF NOT EXISTS time_in TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS time_out TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS occupant TEXT;

-- Step 3: Update existing labs to COMLAB BUILDING
UPDATE labs 
SET building = 'COMLAB BUILDING'
WHERE building IS NULL;

-- Step 4: Create index for building
CREATE INDEX IF NOT EXISTS idx_labs_building ON labs(building);

-- Step 5: Insert COMLAB BUILDING labs (Lab1-5) if they don't exist
INSERT INTO labs (name, number, qr_code, building, is_available) VALUES
  ('Lab1', 1, 'COMLAB-LAB1-001', 'COMLAB BUILDING', true),
  ('Lab2', 2, 'COMLAB-LAB2-002', 'COMLAB BUILDING', true),
  ('Lab3', 3, 'COMLAB-LAB3-003', 'COMLAB BUILDING', true),
  ('Lab4', 4, 'COMLAB-LAB4-004', 'COMLAB BUILDING', true),
  ('Lab5', 5, 'COMLAB-LAB5-005', 'COMLAB BUILDING', true)
ON CONFLICT (qr_code) DO UPDATE
SET building = 'COMLAB BUILDING',
    name = EXCLUDED.name;

-- Done! Your labs table now has:
-- ✅ building column
-- ✅ time_in, time_out, occupant columns
-- ✅ COMLAB BUILDING with Lab1-5

