# Supabase Setup Instructions

## Database Configuration

Your Supabase project is configured with:
- **Project URL:** https://qmzmlsfcafujvvkjevlh.supabase.co
- **API Key:** Already configured in the application

## Setup Steps

### 1. Create Database Tables

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Go to **SQL Editor** in the left sidebar
4. Copy the contents of `supabase_schema.sql`
5. Paste it into the SQL Editor
6. Click **Run** to create the tables

### 2. Verify Tables

After running the SQL, verify that these tables were created:

- **students** - Stores student registration information
  - id (UUID, primary key)
  - student_id (text, unique)
  - email (text)
  - full_name (text)
  - created_at (timestamp)

- **feedback** - Stores all student feedback
  - id (text, primary key)
  - student_id (text)
  - student_name (text, nullable)
  - course_name (text)
  - instructor (text)
  - department (text)
  - semester (text)
  - feedback_text (text)
  - is_anonymous (boolean)
  - sentiment (text)
  - sentiment_score (float)
  - sentiment_confidence (float)
  - topics (jsonb)
  - urgency (text)
  - flagged (boolean)
  - created_at (timestamp)

### 3. Test the Connection

1. Start your application: `npm run dev`
2. Register as a student (Sign Up)
3. Submit feedback
4. Login as admin and check if feedback appears

### 4. View Data in Supabase

1. Go to **Table Editor** in Supabase Dashboard
2. Select `feedback` or `students` table
3. View all submitted data

## Features

### Student Features
- ✅ Registration with Supabase database
- ✅ Student verification on login
- ✅ Feedback stored in cloud database
- ✅ Automatic sentiment analysis
- ✅ Anonymous or named submissions

### Admin Features
- ✅ Real-time feedback from database
- ✅ No more localStorage limitations
- ✅ Persistent data across devices
- ✅ Can be accessed from anywhere
- ✅ Scalable to unlimited feedback

## Security

- Row Level Security (RLS) enabled
- Anonymous users can insert and read
- Data is secured with Supabase authentication
- API key is public (anon key) - safe for client-side use

## Troubleshooting

### If feedback doesn't appear:
1. Check browser console for errors
2. Verify SQL schema was executed successfully
3. Check Supabase Table Editor to see if data is being saved
4. The app will fallback to localStorage if Supabase fails

### If registration fails:
- Check if student_id already exists
- Verify email format is correct
- Check Supabase logs in Dashboard

## Database Backup

To backup your data:
1. Go to Supabase Dashboard
2. Database → Backups
3. Enable automatic backups
4. Download manual backup if needed

## Advanced: Custom Queries

You can run custom queries in SQL Editor:

```sql
-- Get all feedback count
SELECT COUNT(*) FROM feedback;

-- Get feedback by sentiment
SELECT sentiment, COUNT(*) 
FROM feedback 
GROUP BY sentiment;

-- Get flagged feedback
SELECT * FROM feedback 
WHERE flagged = true 
ORDER BY created_at DESC;

-- Get recent feedback
SELECT * FROM feedback 
ORDER BY created_at DESC 
LIMIT 10;
```

## Migration from localStorage

If you have existing data in localStorage:
1. Old data will remain accessible as fallback
2. New submissions go to Supabase
3. localStorage is used if Supabase connection fails
4. Data is automatically synced when possible
