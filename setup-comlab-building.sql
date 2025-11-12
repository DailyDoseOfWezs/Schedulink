-- Setup COMLAB BUILDING with Lab1-5
-- Run this in Supabase SQL Editor after running add-time-tracking-labs.sql

-- Update existing labs to COMLAB BUILDING
UPDATE labs 
SET building = 'COMLAB BUILDING'
WHERE name LIKE 'Computer Laboratory%' OR name LIKE 'Lab%';

-- Insert COMLAB BUILDING labs if they don't exist
INSERT INTO labs (name, number, qr_code, building, is_available) VALUES
  ('Lab1', 1, 'COMLAB-LAB1-001', 'COMLAB BUILDING', true),
  ('Lab2', 2, 'COMLAB-LAB2-002', 'COMLAB BUILDING', true),
  ('Lab3', 3, 'COMLAB-LAB3-003', 'COMLAB BUILDING', true),
  ('Lab4', 4, 'COMLAB-LAB4-004', 'COMLAB BUILDING', true),
  ('Lab5', 5, 'COMLAB-LAB5-005', 'COMLAB BUILDING', true)
ON CONFLICT (qr_code) DO UPDATE
SET building = 'COMLAB BUILDING',
    name = EXCLUDED.name;

