# Quick Fix: Can't Sign In

## The Problem
You're getting "Invalid login credentials" because **you need to create an account first**.

## Solution: Register First, Then Sign In

### Step 1: Register a New Account

1. **Go to the Register page**:
   - Click "Sign up" on the login page, OR
   - Go directly to: `http://localhost:5173/register`

2. **Fill in the form**:
   - **Full Name**: Your name (e.g., "John Doe")
   - **Email**: Your email (e.g., "test@example.com")
   - **Password**: At least 6 characters (e.g., "password123")
   - **I am a...**: Choose "Teacher" or "Student"

3. **Click "Create Account"**

4. **What should happen**:
   - You should see "Registration successful" message
   - You should be automatically logged in
   - You should be redirected to your dashboard

### Step 2: If Registration Works, You're Done!

If registration was successful, you're already logged in. You don't need to sign in separately.

### Step 3: If You Need to Sign In Later

After you log out or close the browser:

1. Go to `http://localhost:5173/login`
2. Use the **exact same email and password** you used to register
3. Click "Sign In"

## Troubleshooting

### "Email already exists" when registering
- This means the account already exists
- Try signing in with that email instead
- Or use a different email to register

### "Registration failed" 
- Check the error message - it will tell you what's wrong
- Make sure password is at least 6 characters
- Make sure email is valid format

### Still can't sign in after registering?
1. **Check Supabase Dashboard**:
   - Go to https://supabase.com/dashboard
   - Click your project
   - Go to **Authentication** → **Users**
   - See if your email is listed there

2. **Check Email Confirmation**:
   - In Supabase: **Authentication** → **Configuration**
   - Make sure "Enable email confirmations" is **OFF**
   - Click **Save**

3. **Try registering again** with a different email

## Quick Test Account

Try registering with these test credentials:
- **Name**: Test User
- **Email**: test@example.com
- **Password**: test123456
- **Role**: Teacher

Then try signing in with the same credentials.

