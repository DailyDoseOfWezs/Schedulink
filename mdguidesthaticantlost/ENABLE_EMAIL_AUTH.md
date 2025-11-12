# Fix: "Email logins are disabled"

## The Problem
You're getting the error: **"Email logins are disabled"**

This means the Email authentication provider is turned OFF in Supabase.

## Solution: Enable Email Authentication

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Sign in
3. Select your project

### Step 2: Enable Email Provider
1. **Click "Authentication"** in the left sidebar
2. **Click "Providers"** (this is important - not Configuration, but Providers)
3. **Find "Email"** in the list of providers
4. **Click on "Email"** or toggle it ON
5. You should see email provider settings

### Step 3: Enable the Provider
Look for:
- A **toggle/switch** that says "Enable email provider" or similar
- Or a checkbox to enable email authentication
- **Turn it ON** ✅

### Step 4: Save
- Click **"Save"** button (usually at the bottom)
- Or the settings might save automatically

### Step 5: Test
1. Go back to your app
2. Try logging in again
3. It should work now! ✅

## What You Should See

In **Authentication → Providers → Email**, you should see:
- ✅ Email provider enabled/turned ON
- Settings like:
  - "Enable email provider" (should be ON)
  - "Confirm email" (can be ON or OFF for testing)
  - Other email-related settings

## If You Can't Find "Providers"

Some Supabase versions have it in different places:

### Option 1: Authentication → Settings
1. Authentication → **Settings**
2. Look for "Providers" section
3. Enable Email

### Option 2: Direct URL
Try going directly to:
- Your Supabase dashboard URL + `/project/YOUR_PROJECT_ID/auth/providers`

### Option 3: Check All Tabs
Under Authentication, check:
- Providers ← **This is where it should be**
- Configuration
- Settings
- URL Configuration

## After Enabling

Once you enable email authentication:
1. ✅ Registration will work
2. ✅ Login will work
3. ✅ Everything should be functional

## Still Can't Find It?

If you absolutely can't find the Providers section:

1. **Take a screenshot** of your Authentication page
2. **List all the options** you see under Authentication
3. I can help you find the right place based on your Supabase version

## Quick Checklist

- [ ] Went to Authentication → Providers
- [ ] Found "Email" provider
- [ ] Enabled/turned ON the Email provider
- [ ] Saved the settings
- [ ] Tried logging in again

Once email authentication is enabled, your login should work! 🎉

