# Apply Database Migration for Overall Rating

## Quick Steps:

1. **Open Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to: **SQL Editor**

2. **Run the Migration**
   - Copy the contents of `supabase_migration_add_overall_rating.sql`
   - Paste into the SQL Editor
   - Click **Run** to execute

3. **Verify the Migration**
   Run this query to confirm the column was added:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'feedback' AND column_name = 'overall_rating';
   ```

## What This Does:

- Adds `overall_rating` column to the `feedback` table
- Accepts values 1-5 (representing star ratings) or NULL
- Adds constraint to ensure valid rating range
- Creates index for better query performance

## After Migration:

✅ New feedback submissions will include the overall rating
✅ Existing feedback will have NULL for overall_rating (shown as "No rating provided")
✅ Faculty dashboard will display ratings properly

## Test It:

1. Submit new feedback as a student with a star rating
2. Login as faculty/admin
3. View feedback details - you should see the star rating displayed!
