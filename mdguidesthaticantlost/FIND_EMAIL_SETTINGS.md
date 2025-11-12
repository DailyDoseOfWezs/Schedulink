# How to Find Email Confirmation Settings in Supabase

The location of email settings has changed in newer Supabase versions. Here's where to find it:

## Option 1: Configuration Tab (Most Likely)

1. **Click "Configuration"** in the Authentication sidebar
2. **Look for "Auth" section** or scroll down
3. **Find "Enable email confirmations"** toggle
4. **Turn it OFF** for testing (or leave it ON for production)
5. **Click "Save"**

## Option 2: Emails Tab

1. **Click "Emails"** in the Authentication sidebar
2. **Look for "Email Confirmation"** or "Confirm email" settings
3. **Toggle it OFF** if you see it
4. **Save changes**

## Option 3: It Might Already Be Disabled

If you can't find the toggle, it might already be disabled by default in your Supabase version. 

**Try this:**
1. Just proceed with registration
2. If you get an error about email confirmation, come back and we'll find another way

## What You Should See

In the **Configuration** tab, you might see settings like:
- Site URL
- Redirect URLs
- JWT Settings
- **Email confirmation** (this is what you're looking for)

## Quick Test

**Don't worry about this setting right now!** 

Just try to register an account in your app:
1. Go to http://localhost:5173
2. Click "Sign up"
3. Fill in the form
4. Click "Create Account"

**If it works** → Great! Email confirmation is already disabled or not required.

**If you get an error** → Tell me what the error says and we'll fix it.

---

## Alternative: Check Email Templates

If you want to see email settings:

1. Click **"Emails"** in Authentication
2. You'll see email templates
3. The confirmation email template is there
4. But the enable/disable toggle is usually in **Configuration**

---

**Bottom line:** Try registering first. If it works, you're good to go! If not, we'll troubleshoot. 🚀

