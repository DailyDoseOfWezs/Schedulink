-- Update labs table to add building and make it more flexible
-- Run this in Supabase SQL Editor

-- Add building column
ALTER TABLE labs 
ADD COLUMN IF NOT EXISTS building TEXT;

-- Make qr_code nullable (we'll use it as identifier but not require it)
-- Note: We'll keep it for backward compatibility but won't show "QR" in UI

-- Update existing labs with building info (optional - you can customize)
UPDATE labs 
SET building = 'Main Building'
WHERE building IS NULL;

-- Create index for building
CREATE INDEX IF NOT EXISTS idx_labs_building ON labs(building);

