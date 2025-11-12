# Auto-Confirm Email Setup

## What This Does

This automatically confirms user emails when they register, so you don't need to manually confirm them or run SQL queries.

## How to Set It Up

### Step 1: Go to Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **"SQL Editor"** in the left sidebar

### Step 2: Run the Auto-Confirm Script
1. Open the file `auto-confirm-email.sql` from your project folder
2. **Copy ALL the code** (Ctrl+A, then Ctrl+C)
3. **Paste it into the SQL Editor** (Ctrl+V)
4. **Click "RUN"** (or press Ctrl+Enter)

### Step 3: Verify It Works
You should see:
- ✅ "Success. No rows returned" or similar success message

### Step 4: Test It
1. **Register a new account** in your app
2. **Log out**
3. **Log in again** - It should work immediately! ✅

## What Happens Now

- ✅ **New registrations** → Email is automatically confirmed
- ✅ **Login after logout** → Works immediately (no confirmation needed)
- ✅ **No manual SQL needed** → Everything is automatic

## For Existing Users

If you have existing users that aren't confirmed, you can confirm them all at once:

1. Go to **SQL Editor**
2. Run this (optional):
```sql
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;
```

This confirms all existing unconfirmed users.

## How It Works

The script creates:
1. **A function** (`auto_confirm_email`) that sets `email_confirmed_at` to the current time
2. **A trigger** (`on_auth_user_created`) that runs this function whenever a new user is created

This means every new user registration will automatically have their email confirmed.

## Troubleshooting

### "Permission denied" error
- Make sure you're running this in the SQL Editor (not in your app)
- The trigger uses `SECURITY DEFINER` which should handle permissions

### Still not working?
1. Check if the trigger was created:
   - Go to **Database** → **Triggers** (if available)
   - Or run: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`

2. Try registering a new account and see if it works

3. If it still doesn't work, you can manually confirm emails using the SQL from `CONFIRM_EMAIL_SQL.md`

## Removing Auto-Confirm (If Needed)

If you want to remove the auto-confirm feature later:

```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS auto_confirm_email();
```

## Notes

- This is great for **development and testing**
- For **production**, you might want to enable email confirmation for security
- You can always disable this later if needed

---

**After running the script, all new user registrations will be automatically confirmed!** 🎉

