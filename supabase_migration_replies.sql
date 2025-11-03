-- Migration to add faculty reply functionality
-- Run this in Supabase SQL Editor if you already have the tables created

-- Add faculty_reply and reply_at columns to feedback table
ALTER TABLE feedback 
ADD COLUMN IF NOT EXISTS faculty_reply TEXT,
ADD COLUMN IF NOT EXISTS reply_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS student_reply TEXT,
ADD COLUMN IF NOT EXISTS student_reply_at TIMESTAMP WITH TIME ZONE;

-- Create or update the policy to allow updates for faculty replies
DROP POLICY IF EXISTS "Enable update for all users" ON feedback;

CREATE POLICY "Enable update for all users" ON feedback
  FOR UPDATE
  USING (true);

-- Add index for better query performance on replied feedback
CREATE INDEX IF NOT EXISTS idx_feedback_has_reply ON feedback(faculty_reply) WHERE faculty_reply IS NOT NULL;

