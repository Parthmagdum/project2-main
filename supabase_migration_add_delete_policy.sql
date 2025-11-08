-- Migration: Add DELETE policy for feedback table
-- This allows students to delete their own feedback

-- Drop the policy if it already exists
DROP POLICY IF EXISTS "Enable delete for all users" ON feedback;

-- Create policy to allow anyone to delete feedback
CREATE POLICY "Enable delete for all users" ON feedback
  FOR DELETE
  USING (true);

-- Verify the policy was created
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'feedback' 
AND policyname = 'Enable delete for all users';
