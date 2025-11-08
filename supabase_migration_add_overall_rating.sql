-- Migration: Add overall_rating column to feedback table
-- Date: 2025-11-08
-- Description: Adds support for student overall ratings (1-5 stars)

-- Add overall_rating column to feedback table
ALTER TABLE feedback 
ADD COLUMN IF NOT EXISTS overall_rating INTEGER;

-- Add check constraint to ensure rating is between 1 and 5 (or NULL)
ALTER TABLE feedback 
ADD CONSTRAINT check_overall_rating 
CHECK (overall_rating IS NULL OR (overall_rating >= 1 AND overall_rating <= 5));

-- Create index for better query performance on ratings
CREATE INDEX IF NOT EXISTS idx_feedback_overall_rating ON feedback(overall_rating);

-- Comment on the column
COMMENT ON COLUMN feedback.overall_rating IS 'Student overall rating from 1 to 5 stars (optional)';
