# Quick Start Guide

## 🚀 Getting Started

### Step 1: Update Database (If Already Set Up)
If you already have the Supabase tables created, run the migration:

```sql
-- In Supabase SQL Editor, run:
-- Copy contents from supabase_migration_replies.sql
```

### Step 2: Install Dependencies (If Needed)
```bash
npm install
```

### Step 3: Run the Application
```bash
npm run dev
```

### Step 4: Test the Features

## 🧪 Testing Guide

### Test 1: Student Sign-up and Feedback Submission
1. Open http://localhost:5173
2. Click "Continue as Student"
3. Click "Sign Up" tab
4. Enter:
   - Student ID: `STU001`
   - Email: `student1@university.edu`
   - Full Name: `John Doe`
   - Password: `password123`
5. Click "Sign Up"
6. You'll be redirected to Student Dashboard
7. Click "Submit New Feedback"
8. Fill the form:
   - Course Name: `Data Structures`
   - Department: `Computer Science`
   - Semester: `Fall 2024`
   - Feedback: `Great course! The instructor explains concepts very clearly.`
   - Choose: Anonymous or Include Name
9. Click "Submit Feedback"
10. You'll see success message
11. Click "Back to Dashboard"
12. Verify your feedback appears in the dashboard

### Test 2: Submit Multiple Feedback Items
1. From Student Dashboard, click "Submit New Feedback"
2. Submit another feedback with different sentiment:
   - Course Name: `Web Development`
   - Department: `Computer Science`
   - Semester: `Fall 2024`
   - Feedback: `The course pace is too fast and assignments are unclear.`
3. Submit and return to dashboard
4. Verify you now see 2 feedback items
5. Notice different sentiment colors (Green for positive, Red for negative)

### Test 3: Faculty Reply to Feedback
1. Logout from student account
2. From landing page, click "Faculty Login →" (top right)
3. Login with:
   - Email: `admin@university.edu`
   - Password: `admin123`
4. Click "Feedback" in the sidebar
5. You should see all student feedback (from all students)
6. Click on the first feedback card to open details
7. Scroll to "Faculty Response" section
8. Type a reply: `Thank you for your positive feedback! We're glad you're enjoying the course.`
9. Click "Submit Reply"
10. Close the modal

### Test 4: Student Views Faculty Reply
1. Click "Logout" from faculty dashboard
2. From landing page, click "Continue as Student"
3. Login with:
   - Student ID: `STU001`
   - Password: `password123`
4. You should see your feedback dashboard
5. Find the feedback item you received a reply for
6. Verify the purple "Faculty Response" box appears with the reply
7. Check the timestamp of the reply

### Test 5: Multiple Students
1. Logout and create a second student account
2. Student ID: `STU002`
3. Submit feedback from this account
4. Verify Student 2 only sees their own feedback
5. Login as faculty and verify you see feedback from both students
6. Reply to Student 2's feedback
7. Login as Student 2 and verify they see the reply

### Test 6: Anonymous Feedback
1. Login as a student
2. Submit new feedback
3. Select "🔒 Anonymous Feedback"
4. Submit the form
5. Login as faculty
6. Find the anonymous feedback
7. Verify it shows "Anonymous" instead of student name
8. Reply to it
9. Login back as the student
10. Verify they can still see the reply to their anonymous feedback

## 🎯 Expected Results

### Landing Page:
- ✅ Only student card visible (centered)
- ✅ Small "Faculty Login →" link in top right
- ✅ Clean, focused interface

### Student Dashboard:
- ✅ Shows count of feedback items
- ✅ All feedback sorted by date (newest first)
- ✅ Color-coded by sentiment (Green/Red/Gray)
- ✅ Faculty replies visible in purple boxes
- ✅ "Submit New Feedback" button works
- ✅ "Logout" button returns to landing page

### Faculty Dashboard:
- ✅ Shows all feedback from all students
- ✅ Can filter by sentiment
- ✅ Can search feedback
- ✅ Click opens detailed modal
- ✅ Can write and submit replies
- ✅ Replies save successfully

### Faculty Reply Feature:
- ✅ Reply textbox appears in modal
- ✅ Can type multi-line replies
- ✅ Submit button works
- ✅ Success message appears
- ✅ Reply visible to student immediately
- ✅ Timestamp recorded

## 📱 Browser Testing
Test in these browsers:
- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## 🐛 Common Issues

### Issue: "Cannot read properties of undefined"
**Solution**: Make sure you ran the database migration to add reply columns

### Issue: Feedback not showing in faculty dashboard
**Solution**: Check Supabase connection in browser console

### Issue: Student can't see their feedback
**Solution**: Make sure student_id matches exactly (case-sensitive)

### Issue: Reply not saving
**Solution**: Check RLS policies are enabled in Supabase

## ✅ Feature Checklist

After testing, verify:
- [ ] Landing page shows only student card
- [ ] Faculty login link works from top right
- [ ] Students can sign up and login
- [ ] Students can view their feedback history
- [ ] Students can submit new feedback
- [ ] Back button works on feedback form
- [ ] Faculty can see all feedback
- [ ] Faculty can reply to feedback
- [ ] Students can see faculty replies
- [ ] Sentiment colors display correctly
- [ ] Anonymous feedback stays anonymous
- [ ] Named feedback shows student name
- [ ] Timestamps show correctly

## 🎉 Success!

If all tests pass, your system is fully functional with:
- ✨ Clean landing page design
- ✨ Student feedback history dashboard
- ✨ Faculty reply system
- ✨ Real-time sentiment analysis
- ✨ Cloud database persistence

