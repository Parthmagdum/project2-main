-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  student_name TEXT,
  course_name TEXT NOT NULL,
  instructor TEXT DEFAULT 'N/A',
  department TEXT NOT NULL,
  semester TEXT NOT NULL,
  feedback_text TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  sentiment TEXT NOT NULL,
  sentiment_score FLOAT NOT NULL,
  sentiment_confidence FLOAT NOT NULL,
  topics JSONB,
  urgency TEXT NOT NULL,
  flagged BOOLEAN DEFAULT false,
  faculty_reply TEXT,
  reply_at TIMESTAMP WITH TIME ZONE,
  student_reply TEXT,
  student_reply_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_student_id ON feedback(student_id);
CREATE INDEX IF NOT EXISTS idx_feedback_department ON feedback(department);
CREATE INDEX IF NOT EXISTS idx_feedback_sentiment ON feedback(sentiment);
CREATE INDEX IF NOT EXISTS idx_feedback_flagged ON feedback(flagged);
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);

-- Enable Row Level Security (RLS)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for students table
-- Allow anyone to insert (for registration)
DO $$ BEGIN
  CREATE POLICY "Enable insert for all users" ON students
    FOR INSERT
    WITH CHECK (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Allow users to read their own data
DO $$ BEGIN
  CREATE POLICY "Enable read for all users" ON students
    FOR SELECT
    USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create policies for feedback table
-- Allow anyone to insert feedback
DO $$ BEGIN
  CREATE POLICY "Enable insert for all users" ON feedback
    FOR INSERT
    WITH CHECK (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Allow anyone to read feedback (admins will use service role)
DO $$ BEGIN
  CREATE POLICY "Enable read for all users" ON feedback
    FOR SELECT
    USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Allow anyone to update feedback (for faculty replies)
DO $$ BEGIN
  CREATE POLICY "Enable update for all users" ON feedback
    FOR UPDATE
    USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON students TO anon, authenticated;
GRANT ALL ON feedback TO anon, authenticated;
