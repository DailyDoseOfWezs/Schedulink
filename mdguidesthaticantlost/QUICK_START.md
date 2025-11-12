# 🚀 Quick Start Guide - 5 Minutes to Get Running

Follow these steps in order. Each step takes about 1 minute!

---

## ⚡ Step 1: Create .env.local File (1 minute)

### Option A: Using VS Code / Cursor
1. In your project folder, right-click in the file explorer (left side)
2. Click "New File"
3. Type exactly: `.env.local` (with the dot at the start!)
4. Press Enter
5. Copy-paste this content:

```env
VITE_SUPABASE_URL=https://oftrbcajibokcuyzumgr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHJiY2FqaWJva2N1eXp1bWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjYxOTMsImV4cCI6MjA3ODU0MjE5M30.o56-j407U9Bro1TBv5t0jK5Ift8ycNVlW79tvsr5DUc
```

6. Save (Ctrl+S)

### Option B: Using File Explorer (Windows)
1. Open File Explorer
2. Navigate to your project folder: `C:\Users\2ez4w\OneDrive\Documents\Schedulink`
3. Right-click in empty space → New → Text Document
4. Rename it to `.env.local` (you might need to enable "Show file extensions" in View settings)
5. Open it with Notepad
6. Paste the content above
7. Save and close

### Option C: Using Terminal
```bash
# In your project folder, run:
echo "VITE_SUPABASE_URL=https://oftrbcajibokcuyzumgr.supabase.co" > .env.local
echo "VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHJiY2FqaWJva2N1eXp1bWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjYxOTMsImV4cCI6MjA3ODU0MjE5M30.o56-j407U9Bro1TBv5t0jK5Ift8ycNVlW79tvsr5DUc" >> .env.local
```

✅ **Done?** You should see `.env.local` in your project folder.

---

## ⚡ Step 2: Open Supabase Dashboard (1 minute)

1. Go to: **https://supabase.com/dashboard**
2. Sign in with your account
3. Click on your project (should be named something like "My Project" or similar)
4. You're now in the Supabase dashboard!

✅ **Done?** You should see a dashboard with a sidebar on the left.

---

## ⚡ Step 3: Run SQL Script (2 minutes)

1. **In Supabase dashboard**, click **"SQL Editor"** in the left sidebar (looks like a database icon)

2. **Open the file** `database-schema.sql` from your project folder
   - You can open it in Notepad, VS Code, or any text editor
   - Select ALL the text (Ctrl+A)
   - Copy it (Ctrl+C)

3. **Go back to Supabase SQL Editor**
   - Click in the editor area
   - Paste the SQL code (Ctrl+V)
   - You should see a lot of SQL code

4. **Click the green "RUN" button** (bottom right, or press Ctrl+Enter)

5. **Wait for it to finish** - You should see:
   - ✅ "Success. No rows returned" 
   - OR a list of "CREATE TABLE" messages
   - Some "already exists" messages are OK!

✅ **Done?** SQL script ran successfully.

---

## ⚡ Step 4: Verify Tables Created (30 seconds)

1. **In Supabase dashboard**, click **"Table Editor"** in the left sidebar

2. **You should see these tables:**
   - profiles
   - classes
   - class_members
   - tasks
   - task_submissions
   - labs

3. **Click on "labs"** - You should see 5 rows (LAB1 through LAB5)

✅ **Done?** All tables are created!

---

## ⚡ Step 5: Disable Email Confirmation (30 seconds) - Optional but Recommended

This lets you test without email verification:

1. **In Supabase dashboard**, click **"Authentication"** → **"Settings"**
2. **Scroll down** to "Email Auth"
3. **Find "Enable email confirmations"**
4. **Toggle it OFF** (gray = off)
5. **Click "Save"**

✅ **Done?** Email confirmation is disabled.

---

## ⚡ Step 6: Test Your App! (1 minute)

1. **Make sure your dev server is running:**
   ```bash
   pnpm run dev
   ```

2. **Open browser**: http://localhost:5173

3. **Register a new account:**
   - Click "Sign up"
   - Enter: Name, Email, Password
   - Choose "Teacher" or "Student"
   - Click "Create Account"

4. **Check Supabase:**
   - Go to Supabase → Authentication → Users
   - You should see your new user! 🎉

5. **Try logging in** with your new account

✅ **Done?** You can register and log in!

---

## 🎉 You're All Set!

Your app is now fully connected to Supabase! Try these:

- **As Teacher**: Create a class, create tasks
- **As Student**: Join a class using the class code, submit tasks
- **Lab Monitoring**: Use QR codes LAB1, LAB2, etc.

---

## ❌ Something Not Working?

### "Missing Supabase environment variables"
→ Make sure `.env.local` exists and has the correct content
→ Restart your dev server

### "Failed to fetch" 
→ Check your internet connection
→ Verify the Supabase URL in `.env.local` is correct

### Can't see tables
→ Make sure you ran the SQL script completely
→ Check SQL Editor for error messages

### Can't register/login
→ Check Supabase → Authentication → Settings
→ Make sure email auth is enabled

---

## 📚 Need More Help?

See `SUPABASE_SETUP_GUIDE.md` for detailed explanations of everything!

---

**Total time: ~5 minutes** ⏱️

