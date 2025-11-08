-- Migration: Remove urgency column from feedback table
-- Date: 2025-11-08
-- Description: Removes the urgency field as it's no longer needed

-- Drop the urgency column from feedback table
ALTER TABLE feedback 
DROP COLUMN IF EXISTS urgency;

-- Note: The urgency field has been removed as feedback urgency
-- is now determined solely by the flagged boolean field
