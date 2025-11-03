# Faculty Reply Testing Guide

## ✅ Fixed Issues

### 1. **Reply Submission Issue - FIXED**
   - Changed order: Now reloads feedback BEFORE closing modal
   - Made reloadFeedback function properly async with await
   - Added better error handling

### 2. **Student Not Seeing Replies - FIXED**
   - Students now see ALL their feedback (whether replied or not)
   - Added visual indicators:
     - 💬 "Replied" badge on feedback cards with faculty responses
     - ⏳ "Awaiting faculty response..." for pending feedback
     - Counter showing "X with faculty reply" at the top

### 3. **Auto-Refresh Feature - NEW**
   - Student dashboard auto-refreshes every 30 seconds
   - Manual refresh button with spinning animation
   - Silent background refresh doesn't interrupt viewing

## 🧪 How to Test the Reply System

### Test 1: Submit Feedback as Student
1. Open http://localhost:5173
2. Click "Continue as Student"
3. Login/Sign-up with:
   - Student ID: `TEST001`
   - Password: `test123`
4. Click "Submit New Feedback"
5. Fill the form:
   ```
   Course: Introduction to AI
   Department: Computer Science
   Semester: Fall 2024
   Feedback: The course content is excellent but needs more practical examples.
   ```
6. Submit and go back to dashboard
7. **VERIFY**: You see your feedback with "⏳ Awaiting faculty response..."

### Test 2: Reply as Faculty
1. Logout from student account
2. Click "Faculty Login →" (top right)
3. Login with:
   - Email: `admin@university.edu`
   - Password: `admin123`
4. Click "Feedback" tab in sidebar
5. **VERIFY**: You see the student's feedback
6. Click on the feedback card to open detail modal
7. **VERIFY**: Modal opens with all feedback details
8. Scroll to "Faculty Response" section
9. Type reply:
   ```
   Thank you for your feedback! We're working on adding more hands-on labs and real-world case studies to the curriculum. Your input is valuable!
   ```
10. Click "Submit Reply" button
11. **VERIFY**: You see "Reply submitted successfully!" alert
12. **VERIFY**: Modal closes automatically
13. Click the same feedback card again
14. **VERIFY**: Your reply is now visible in the purple box

### Test 3: Student Sees Reply
1. Logout from faculty account
2. Login as student (TEST001)
3. **VERIFY**: Dashboard loads showing your feedback
4. **VERIFY**: Feedback card now shows purple "Replied" badge
5. **VERIFY**: Top shows "1 with faculty reply"
6. **VERIFY**: Purple box shows faculty's response with timestamp
7. Click "Refresh" button
8. **VERIFY**: Data refreshes (spinning animation)

### Test 4: Multiple Feedback Items
1. Submit 3 more feedback items as student
2. Logout and login as faculty
3. Reply to 2 out of 4 feedback items
4. Logout and login as student
5. **VERIFY**: Dashboard shows:
   - Total: 4 feedback items
   - Top shows: "2 with faculty reply"
   - 2 items have purple "Replied" badge
   - 2 items show "⏳ Awaiting faculty response..."

### Test 5: Update Existing Reply
1. Login as faculty
2. Open feedback that already has a reply
3. **VERIFY**: Existing reply appears in the textbox
4. Edit the reply text
5. Click "Submit Reply"
6. **VERIFY**: Reply updates successfully
7. Login as student
8. **VERIFY**: Updated reply appears

### Test 6: Auto-Refresh
1. Login as student and stay on dashboard
2. In another browser/incognito window, login as faculty
3. Reply to one of the student's feedback
4. Go back to student dashboard
5. Wait up to 30 seconds
6. **VERIFY**: Dashboard automatically refreshes and shows new reply

## 🎨 Visual Indicators

### On Student Dashboard:

**Feedback WITH Reply:**
```
┌────────────────────────────────────────┐
│ Introduction to AI    [💬Replied] [🟢Positive]│
│ Computer Science • Fall 2024          │
│─────────────────────────────────────────│
│ Your Feedback: Great course...         │
│                                         │
│ ┌─ Faculty Response: ─────────────┐   │
│ │ Thank you for your feedback!    │   │
│ │ Replied on Nov 3, 2025          │   │
│ └─────────────────────────────────┘   │
└────────────────────────────────────────┘
```

**Feedback WITHOUT Reply:**
```
┌────────────────────────────────────────┐
│ Web Development           [🔴Negative] │
│ Computer Science • Fall 2024          │
│─────────────────────────────────────────│
│ Your Feedback: Course needs work...    │
│                                         │
│ ┌──────────────────────────────────┐  │
│ │  ⏳ Awaiting faculty response... │  │
│ └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

### On Faculty Dashboard:

**Reply Modal:**
```
┌──────────────────────────────────────────┐
│ Feedback Details                    [×]  │
│──────────────────────────────────────────│
│ Course: Introduction to AI               │
│ Student ID: TEST001                      │
│ Sentiment: 🟢 Positive                   │
│                                          │
│ Feedback Text:                           │
│ "The course content is excellent..."     │
│                                          │
│ 💬 Faculty Response                      │
│ ┌──────────────────────────────────┐    │
│ │ [Reply textbox - editable]       │    │
│ │                                  │    │
│ └──────────────────────────────────┘    │
│                                          │
│        [Cancel]  [Submit Reply ➤]        │
└──────────────────────────────────────────┘
```

## 🔧 Technical Details

### What Was Fixed:

1. **FeedbackView.tsx (handleSubmitReply):**
   ```typescript
   // OLD - Wrong order
   closeModal();
   if (onFeedbackUpdated) {
     onFeedbackUpdated();
   }
   
   // NEW - Correct order
   if (onFeedbackUpdated) {
     await onFeedbackUpdated(); // Wait for reload
   }
   closeModal(); // Then close
   ```

2. **StudentDashboard.tsx - Auto-refresh:**
   ```typescript
   useEffect(() => {
     loadFeedback();
     const interval = setInterval(() => {
       loadFeedback(true); // Silent refresh
     }, 30000); // Every 30 seconds
     return () => clearInterval(interval);
   }, [studentId]);
   ```

3. **StudentDashboard.tsx - Visual indicators:**
   - Added "Replied" badge
   - Added counter of replies
   - Added "Awaiting response" placeholder
   - Added manual refresh button

### Database Columns Used:
- `faculty_reply` (TEXT) - Stores the reply text
- `reply_at` (TIMESTAMP) - Stores when reply was submitted

## ⚠️ Important Notes

1. **Make sure you ran the database migration!**
   ```sql
   ALTER TABLE feedback 
   ADD COLUMN IF NOT EXISTS faculty_reply TEXT,
   ADD COLUMN IF NOT EXISTS reply_at TIMESTAMP WITH TIME ZONE;
   ```

2. **Both student and faculty can see replies immediately**
   - Faculty: Reload happens before modal closes
   - Student: Auto-refresh every 30 seconds + manual refresh button

3. **Replies are stored in Supabase**
   - Persists across sessions
   - Available to the student who submitted the feedback

4. **Anonymous feedback can still receive replies**
   - Student sees the reply even if feedback was anonymous
   - Faculty doesn't see student name for anonymous feedback

## 🎉 Expected Behavior

✅ Faculty submits reply → Sees success message → Modal closes
✅ Faculty reopens same feedback → Sees their reply in textbox
✅ Student dashboard → Shows "Replied" badge on feedback with responses
✅ Student dashboard → Shows counter "X with faculty reply"
✅ Student clicks feedback → Sees purple reply box with faculty response
✅ Auto-refresh works → Dashboard updates every 30 seconds
✅ Manual refresh works → Button spins and refreshes data
✅ All feedback visible → Both replied and not-yet-replied items show

