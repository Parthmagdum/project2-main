-- Migration: Add year column to feedback table
-- This adds support for storing academic year information (1-4 or FE/SE/TE/BE)

-- Add year column
ALTER TABLE feedback 
ADD COLUMN IF NOT EXISTS year TEXT;

-- Add comment to document the column
COMMENT ON COLUMN feedback.year IS 'Academic year (1-4 representing FE/SE/TE/BE)';

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'feedback' 
AND column_name = 'year';
