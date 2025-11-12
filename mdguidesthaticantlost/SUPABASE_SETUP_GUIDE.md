# Complete Supabase Setup Guide for Beginners

This guide will walk you through setting up Supabase step-by-step, even if you've never used it before!

## What is Supabase?

Supabase is like a free online database that stores all your app's data (users, classes, tasks, etc.) in the cloud. Think of it as Google Sheets but for apps - it stores data and makes it accessible from anywhere.

---

## Step 1: Create the Environment File

First, we need to tell your app where to find your Supabase database.

1. **Open your project folder** in your code editor (VS Code, Cursor, etc.)

2. **In the root folder** (same level as `package.json`), create a new file called `.env.local`

   - If you're using VS Code: Right-click in the file explorer → New File → Name it `.env.local`
   - Make sure it starts with a dot (`.env.local` not `env.local`)

3. **Copy and paste this EXACT content** into `.env.local`:

```env
VITE_SUPABASE_URL=https://oftrbcajibokcuyzumgr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHJiY2FqaWJva2N1eXp1bWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjYxOTMsImV4cCI6MjA3ODU0MjE5M30.o56-j407U9Bro1TBv5t0jK5Ift8ycNVlW79tvsr5DUc
```

4. **Save the file** (Ctrl+S or Cmd+S)

✅ **Checkpoint**: You should now have a `.env.local` file in your project root.

---

## Step 2: Access Your Supabase Dashboard

1. **Go to**: https://supabase.com
2. **Click "Sign In"** (top right)
3. **Sign in** with your account (the one you used to create the project)
4. **You should see your project** - click on it to open the dashboard

If you don't have an account:
- Click "Start your project"
- Sign up with GitHub, Google, or email
- Create a new project (it's free!)
- Use the URL and key from your project settings

---

## Step 3: Open the SQL Editor

1. **In the Supabase dashboard**, look at the left sidebar
2. **Click on "SQL Editor"** (it has a database icon 📊)
3. You should see a blank editor area

---

## Step 4: Run the Database Schema

This creates all the tables your app needs (like creating columns in a spreadsheet).

1. **Open the file** `database-schema.sql` from your project folder
2. **Select ALL the text** (Ctrl+A or Cmd+A)
3. **Copy it** (Ctrl+C or Cmd+C)
4. **Go back to Supabase SQL Editor**
5. **Paste the SQL code** into the editor (Ctrl+V or Cmd+V)
6. **Click the green "RUN" button** (bottom right of the editor)

**What you should see:**
- A success message saying "Success. No rows returned"
- Or a list of "CREATE TABLE" messages

**If you see errors:**
- Don't worry! Some parts might already exist
- Scroll down to see if there are any red error messages
- If it says "already exists", that's okay - it means it was created before

✅ **Checkpoint**: The SQL should run successfully (you might see some "already exists" messages, which is fine).

---

## Step 5: Verify Tables Were Created

Let's make sure everything was created correctly:

1. **In the Supabase dashboard**, click on **"Table Editor"** in the left sidebar
2. **You should see these tables:**
   - `profiles` - stores user information
   - `classes` - stores classes created by teachers
   - `class_members` - tracks which students are in which classes
   - `tasks` - stores assignments/tasks
   - `task_submissions` - stores student submissions
   - `labs` - stores lab information

3. **Click on "labs" table** - you should see 5 rows (LAB1, LAB2, LAB3, LAB4, LAB5)

✅ **Checkpoint**: You should see at least 6 tables in the Table Editor.

---

## Step 6: Configure Authentication (Important!)

Your app needs to allow users to sign up and log in:

1. **In Supabase dashboard**, click **"Authentication"** in the left sidebar
2. **Click "Settings"** (under Authentication)
3. **Scroll down to "Email Auth"**
4. **For development/testing**, you can disable email confirmation:
   - Find "Enable email confirmations"
   - **Toggle it OFF** (this lets users sign up without email verification)
   - **Click "Save"**

   ⚠️ **Note**: For production, you should enable email confirmations for security.

---

## Step 7: Test Your Setup

Now let's make sure everything works:

1. **Go back to your project folder**
2. **Open terminal/command prompt** in your project folder
3. **Make sure your dev server is running**:
   ```bash
   pnpm run dev
   ```

4. **Open your browser** and go to `http://localhost:5173`

5. **Try to register a new account**:
   - Click "Sign up"
   - Enter your name, email, password
   - Choose "Teacher" or "Student"
   - Click "Create Account"

6. **Check Supabase**:
   - Go back to Supabase dashboard
   - Click "Authentication" → "Users"
   - You should see your new user account!

7. **Try logging in** with the account you just created

✅ **Checkpoint**: You should be able to register and log in successfully.

---

## Step 8: Test the Features

### As a Teacher:
1. **Create a class**:
   - Click "Create Class" or the "+" button
   - Enter a class name (e.g., "Math 101")
   - You'll get a class code (like "ABC123")
   - **Write this code down!**

2. **Create a task**:
   - Select your class
   - Click "Add Task"
   - Fill in title and description
   - Click "Create Task"

3. **Check Supabase**:
   - Go to Table Editor → `classes` table
   - You should see your new class!
   - Go to `tasks` table
   - You should see your new task!

### As a Student:
1. **Join a class**:
   - Click the "+" button next to "My Classes"
   - Enter the class code from above
   - Click "Join Class"

2. **Submit a task**:
   - Select the class
   - Click on a task
   - Fill in your answer
   - Click "Submit Answer"

3. **Check Supabase**:
   - Go to Table Editor → `class_members` table
   - You should see your enrollment!
   - Go to `task_submissions` table
   - You should see your submission!

---

## Understanding What Happened

### What is a Database?
Think of it like Excel spreadsheets:
- **Tables** = Different spreadsheets (users, classes, tasks)
- **Rows** = Individual records (one user, one class, one task)
- **Columns** = Fields (name, email, password, etc.)

### What Did the SQL Do?
The SQL script created:
1. **Tables** - Empty spreadsheets ready to store data
2. **Rules** - Who can see/edit what (security)
3. **Indexes** - Makes searching faster
4. **Initial Data** - 5 labs already created

### How Does Your App Connect?
- `.env.local` file tells your app where Supabase is
- `supabase.ts` creates the connection
- `supabaseService.ts` handles all database operations
- Your pages use the service to save/load data

---

## Common Issues & Solutions

### Issue: "Missing Supabase environment variables"
**Solution**: 
- Make sure `.env.local` exists in the root folder
- Make sure it has the exact variable names (VITE_SUPABASE_URL, etc.)
- Restart your dev server after creating/modifying `.env.local`

### Issue: "Failed to fetch" or network errors
**Solution**:
- Check that your Supabase URL is correct
- Make sure you're using the anon key (not the service role key)
- Check your internet connection

### Issue: "User already exists" when registering
**Solution**:
- This is normal! The email is already registered
- Try logging in instead, or use a different email

### Issue: Can't see tables in Table Editor
**Solution**:
- Make sure you ran the SQL script completely
- Check the SQL Editor for any error messages
- Try running the SQL script again (it's safe to run multiple times)

### Issue: "Permission denied" errors
**Solution**:
- Make sure you ran the complete SQL script (it includes security policies)
- Check that RLS (Row Level Security) policies were created
- In Supabase, go to Table Editor → Click a table → Check "RLS enabled"

---

## What's Next?

Your app is now fully connected to Supabase! Here's what you can do:

1. **Create multiple accounts** - Test as both teacher and student
2. **Create classes and tasks** - Everything saves to Supabase automatically
3. **Use Lab Monitoring** - Scan QR codes (use LAB1, LAB2, etc. for testing)
4. **Check your data** - Always see what's in your database via Supabase dashboard

---

## Need Help?

If something doesn't work:
1. **Check the browser console** (F12 → Console tab) for error messages
2. **Check Supabase logs** (Dashboard → Logs)
3. **Verify your `.env.local` file** has the correct values
4. **Make sure the SQL script ran completely**

---

## Quick Reference

**Supabase Dashboard**: https://supabase.com/dashboard

**Your Project URL**: https://oftrbcajibokcuyzumgr.supabase.co

**Key Files**:
- `.env.local` - Your Supabase connection info
- `database-schema.sql` - Database structure
- `src/lib/supabase.ts` - Connection setup
- `src/lib/supabaseService.ts` - Database operations

**Important Tables**:
- `profiles` - User accounts
- `classes` - Classes created by teachers
- `tasks` - Assignments
- `labs` - Laboratory information

---

You're all set! Your app now has a real database backend. 🎉

