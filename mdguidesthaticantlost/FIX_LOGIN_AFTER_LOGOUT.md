# Fix: Can't Login After Logout

## The Problem
- ✅ Registration works and auto-logs you in
- ❌ After logging out, you can't log in again
- Error: "Invalid login credentials"

## Root Cause
**Email confirmation is enabled in Supabase.** When you register, Supabase gives you a session immediately, but when you try to log in again, it requires email confirmation first.

## Solution: Disable Email Confirmation (For Development)

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Sign in to your account
3. Select your project (the one with URL: `oftrbcajibokcuyzumgr.supabase.co`)

### Step 2: Disable Email Confirmation
1. In the left sidebar, click **"Authentication"**
2. Click **"Configuration"** (or "Settings" in some versions)
3. Scroll down to find **"Email Auth"** section
4. Look for **"Enable email confirmations"** toggle
5. **Turn it OFF** (toggle should be gray/unchecked)
6. Click **"Save"** button at the bottom

### Step 3: Test Again
1. Go back to your app
2. Try logging in with your registered email and password
3. It should work now! ✅

## Alternative: If You Can't Find the Setting

### Option A: Look in "Providers" Tab
1. Authentication → **"Providers"**
2. Click on **"Email"**
3. Find "Confirm email" or "Email confirmation" setting
4. Disable it

### Option B: Check "URL Configuration"
1. Authentication → **"URL Configuration"** (or "Configuration")
2. Look for email-related settings
3. Disable email confirmation

### Option C: Use SQL (Advanced)
If you can't find the UI setting, you can disable it via SQL:

1. Go to **SQL Editor** in Supabase
2. Run this query:
```sql
UPDATE auth.config 
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'::jsonb),
  '{email_confirm_disabled}',
  'true'::jsonb
);
```

But try the UI first - it's much easier!

## Why This Happens

When email confirmation is enabled:
- ✅ You can register and get logged in immediately (first time)
- ❌ You can't log in again until you confirm your email
- 📧 Supabase sends a confirmation email (which you might not receive in development)

For development/testing, it's best to disable email confirmation. For production, you should enable it for security.

## After Fixing

Once you disable email confirmation:
1. ✅ Registration will work
2. ✅ Login after logout will work
3. ✅ Everything should be functional

## Still Not Working?

If you've disabled email confirmation but still can't log in:

1. **Check your credentials**:
   - Make sure you're using the exact email you registered with
   - Make sure the password is correct (no extra spaces)

2. **Try registering a new account**:
   - Use a different email
   - See if that account can log in after logout

3. **Check Supabase Users**:
   - Go to Authentication → Users
   - See if your email is listed
   - Check if it shows "Confirmed" status

4. **Clear browser cache**:
   - Try in an incognito/private window
   - Or clear cookies for localhost

5. **Restart your dev server**:
   - Stop the server (Ctrl+C)
   - Run `pnpm run dev` again

