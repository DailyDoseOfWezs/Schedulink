-- Add teacher_comment field to task_submissions table
-- Run this in Supabase SQL Editor

ALTER TABLE task_submissions 
ADD COLUMN IF NOT EXISTS teacher_comment TEXT;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_task_submissions_teacher_comment 
ON task_submissions(task_id) 
WHERE teacher_comment IS NOT NULL;

