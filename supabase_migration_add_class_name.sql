-- Migration: Add class_name column to feedback table
-- This adds support for storing class/section information

-- Add class_name column
ALTER TABLE feedback 
ADD COLUMN IF NOT EXISTS class_name TEXT;

-- Add comment to document the column
COMMENT ON COLUMN feedback.class_name IS 'Class or section identifier (e.g., CS-101-A, Section A)';

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'feedback' 
AND column_name = 'class_name';
