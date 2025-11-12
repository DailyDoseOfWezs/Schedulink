# Quick Fix: Confirm Your Email (Copy & Paste)

## The Problem
You can register and auto-login, but after logout, you can't log in again. This is because your email isn't confirmed.

## The Fix (30 seconds)

1. **Go to Supabase Dashboard** → **SQL Editor**

2. **Copy and paste this SQL** (replace `YOUR-EMAIL@example.com` with your actual email):

```sql
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'YOUR-EMAIL@example.com';
```

3. **Click RUN**

4. **Try logging in again** - It should work! ✅

## Example

If your email is `john@gmail.com`, run:

```sql
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'john@gmail.com';
```

## For All Users (If You Have Multiple)

If you want to confirm ALL users at once:

```sql
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;
```

⚠️ **Warning:** This confirms ALL unconfirmed users. Only use if you want to confirm everyone.

## After Running

1. Log out of your app
2. Log in again
3. Should work now! 🎉

