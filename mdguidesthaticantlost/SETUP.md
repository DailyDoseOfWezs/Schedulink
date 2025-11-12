# Schedulink - Supabase Setup Guide

## Prerequisites
- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm@8`)
- Supabase account (free tier works)

## Step 1: Environment Variables

Create a `.env.local` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://oftrbcajibokcuyzumgr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHJiY2FqaWJva2N1eXp1bWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjYxOTMsImV4cCI6MjA3ODU0MjE5M30.o56-j407U9Bro1TBv5t0jK5Ift8ycNVlW79tvsr5DUc
```

## Step 2: Set Up Supabase Database

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to the SQL Editor
3. Copy and paste the entire contents of `database-schema.sql` into the SQL Editor
4. Click "Run" to execute the SQL script

This will create:
- All necessary tables (profiles, classes, tasks, submissions, labs, etc.)
- Indexes for performance
- Row Level Security (RLS) policies
- Initial lab data (5 labs with QR codes: LAB1, LAB2, LAB3, LAB4, LAB5)

## Step 3: Configure Supabase Authentication

1. In your Supabase dashboard, go to **Authentication** > **Settings**
2. Make sure **Email** authentication is enabled
3. (Optional) Configure email templates if you want custom emails

## Step 4: Install Dependencies

```bash
pnpm install
```

## Step 5: Run the Development Server

```bash
pnpm run dev
```

The app will be available at `http://localhost:5173`

## Step 6: Test the Application

1. **Register a new account:**
   - Go to `/register`
   - Create a teacher account and a student account
   - Note: Supabase may require email confirmation (check your email or disable it in Supabase settings for development)

2. **Login:**
   - Use the credentials you just created
   - You should be redirected to the appropriate dashboard

3. **Teacher Features:**
   - Create classes (you'll get a unique class code)
   - Create tasks for your classes
   - View student submissions

4. **Student Features:**
   - Join classes using the class code
   - View and submit tasks
   - See your submissions

5. **Lab Monitoring:**
   - Teachers can scan QR codes (use LAB1, LAB2, etc. for testing)
   - Mark labs as in use or available
   - Real-time updates every 2 seconds

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure `.env.local` exists in the root directory
- Restart the dev server after creating/modifying `.env.local`

### Database errors
- Make sure you've run the SQL schema in Supabase SQL Editor
- Check that all tables were created successfully
- Verify RLS policies are enabled

### Authentication issues
- Check Supabase Authentication settings
- For development, you may want to disable email confirmation in Supabase dashboard
- Check browser console for detailed error messages

### CORS errors
- Make sure your Supabase project URL is correct
- Check Supabase project settings for allowed origins

## Features Implemented

✅ User authentication (Supabase Auth)
✅ Teacher dashboard with class and task management
✅ Student dashboard with class joining and task submission
✅ Lab monitoring with QR code scanning
✅ Real-time updates (polling every 2 seconds)
✅ Class code system for joining classes
✅ Task submission with multiple formats (text, link, file, image)
✅ Student enrollment tracking

## Next Steps (Optional Enhancements)

- Add file upload to Supabase Storage for task submissions
- Implement real-time subscriptions instead of polling
- Add email notifications
- Add task grading functionality
- Add calendar/scheduling features
- Add notifications system

