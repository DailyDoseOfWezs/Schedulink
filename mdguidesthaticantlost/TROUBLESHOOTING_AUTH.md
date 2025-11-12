# Authentication Troubleshooting Guide

## Quick Fixes for Sign-In Issues

### 1. Check Your Environment Variables

Your `.env.local` file should be in the root folder and contain:

```env
VITE_SUPABASE_URL=https://oftrbcajibokcuyzumgr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHJiY2FqaWJva2N1eXp1bWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjYxOTMsImV4cCI6MjA3ODU0MjE5M30.o56-j407U9Bro1TBv5t0jK5Ift8ycNVlW79tvsr5DUc
```

**Important:** After creating or modifying `.env.local`, you MUST restart your dev server:
1. Stop the server (Ctrl+C)
2. Run `pnpm run dev` again

### 2. Disable Email Confirmation (For Testing)

If you can't sign in after registering, email confirmation might be enabled:

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **"Authentication"** in the left sidebar
4. Click **"Configuration"** (or "Settings")
5. Scroll to **"Email Auth"** section
6. Find **"Enable email confirmations"**
7. **Toggle it OFF**
8. Click **"Save"**

### 3. Check if Your Account Exists

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Check if your email is listed there
3. If it is, try resetting your password or use the password you set

### 4. Check Browser Console for Errors

1. Open your browser (Chrome/Edge)
2. Press **F12** to open Developer Tools
3. Click the **"Console"** tab
4. Try to sign in
5. Look for any red error messages
6. Share those errors if you need help

### 5. Common Error Messages and Solutions

**"Invalid email or password"**
- Double-check your email and password
- Make sure you're using the correct account
- Try resetting your password in Supabase

**"Email not confirmed"**
- Disable email confirmation in Supabase (see step 2 above)
- Or check your email for a confirmation link

**"No user data returned"**
- This usually means a connection issue
- Check your internet connection
- Verify your `.env.local` file is correct
- Restart your dev server

**"Profile not found"**
- Your account exists but profile wasn't created
- Try registering again with a different email
- Or contact support to fix the profile

### 6. Test Registration First

Before trying to sign in, test registration:

1. Go to `/register` page
2. Fill in all fields
3. Click "Create Account"
4. Check the error message (if any)
5. If successful, try signing in with those credentials

### 7. Verify Database Tables

Make sure your database has the required tables:

1. Go to Supabase Dashboard → **Table Editor**
2. You should see these tables:
   - `profiles` (should have your user data)
   - `classes`
   - `tasks`
   - etc.

3. If `profiles` table is empty or missing, run the SQL schema again:
   - Go to **SQL Editor**
   - Copy and paste `database-schema.sql`
   - Click **RUN**

### 8. Quick Test Script

Open browser console (F12) and run:

```javascript
// Check if Supabase is connected
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

If either shows `undefined`, your `.env.local` file isn't being loaded. Restart your dev server.

## Still Not Working?

1. **Clear browser cache and cookies**
2. **Try in an incognito/private window**
3. **Check Supabase project status** - make sure it's not paused
4. **Verify you're using the correct Supabase project** - check the URL matches

## Need More Help?

Share:
1. The exact error message you see
2. Browser console errors (F12 → Console)
3. Whether registration works but login doesn't
4. Your Supabase project status

