# Fix SQL Order - Run These in Order

## The Problem
You got an error because the `building` column doesn't exist yet. You need to run the SQL scripts in the correct order.

## Solution: Run These SQL Scripts in Order

### Step 1: Add Building Column (Run This First!)
**File**: `update-labs-schema.sql`

```sql
-- Add building column
ALTER TABLE labs 
ADD COLUMN IF NOT EXISTS building TEXT;

-- Update existing labs with building info
UPDATE labs 
SET building = 'COMLAB BUILDING'
WHERE building IS NULL;

-- Create index for building
CREATE INDEX IF NOT EXISTS idx_labs_building ON labs(building);
```

### Step 2: Add Time Tracking (Run This Second)
**File**: `add-time-tracking-labs.sql`

```sql
ALTER TABLE labs 
ADD COLUMN IF NOT EXISTS time_in TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS time_out TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS occupant TEXT;
```

### Step 3: Setup COMLAB BUILDING (Run This Third)
**File**: `setup-comlab-building.sql`

```sql
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
```

## Quick Fix: Run This All at Once

If you want to run everything in one go, copy and paste this into Supabase SQL Editor:

```sql
-- Step 1: Add building column
ALTER TABLE labs 
ADD COLUMN IF NOT EXISTS building TEXT;

-- Step 2: Add time tracking
ALTER TABLE labs 
ADD COLUMN IF NOT EXISTS time_in TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS time_out TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS occupant TEXT;

-- Step 3: Update existing labs
UPDATE labs 
SET building = 'COMLAB BUILDING'
WHERE building IS NULL;

-- Step 4: Create index
CREATE INDEX IF NOT EXISTS idx_labs_building ON labs(building);

-- Step 5: Insert COMLAB BUILDING labs
INSERT INTO labs (name, number, qr_code, building, is_available) VALUES
  ('Lab1', 1, 'COMLAB-LAB1-001', 'COMLAB BUILDING', true),
  ('Lab2', 2, 'COMLAB-LAB2-002', 'COMLAB BUILDING', true),
  ('Lab3', 3, 'COMLAB-LAB3-003', 'COMLAB BUILDING', true),
  ('Lab4', 4, 'COMLAB-LAB4-004', 'COMLAB BUILDING', true),
  ('Lab5', 5, 'COMLAB-LAB5-005', 'COMLAB BUILDING', true)
ON CONFLICT (qr_code) DO UPDATE
SET building = 'COMLAB BUILDING',
    name = EXCLUDED.name;
```

## After Running SQL

1. **Refresh your browser** (the blank page should be fixed)
2. **Check the browser console** (F12) for any errors
3. **Try the app again** - everything should work now!

