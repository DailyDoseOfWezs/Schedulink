-- Add default rooms to the labs table
-- Run this in Supabase SQL Editor after running update-labs-schema.sql

-- Insert default rooms (only if they don't exist)
INSERT INTO labs (name, number, qr_code, building, is_available) VALUES
  ('INFIRMARY', 1, 'INFIRMARY-001', 'Main Building', true),
  ('COMLAB', 2, 'COMLAB-002', 'Main Building', true),
  ('DEVCOM', 3, 'DEVCOM-003', 'Main Building', true),
  ('VL', 4, 'VL-004', 'Main Building', true),
  ('MINI THEATRE', 5, 'MINI-THEATRE-005', 'Main Building', true),
  ('OLD COM LAB', 6, 'OLD-COM-LAB-006', 'Main Building', true),
  ('Computer Laboratory 1', 7, 'COMLAB1-007', 'Main Building', true),
  ('Computer Laboratory 2', 8, 'COMLAB2-008', 'Main Building', true),
  ('Computer Laboratory 3', 9, 'COMLAB3-009', 'Main Building', true),
  ('Computer Laboratory 4', 10, 'COMLAB4-010', 'Main Building', true),
  ('Computer Laboratory 5', 11, 'COMLAB5-011', 'Main Building', true)
ON CONFLICT (qr_code) DO NOTHING;

-- Note: You can add more rooms by editing them in the UI after this

