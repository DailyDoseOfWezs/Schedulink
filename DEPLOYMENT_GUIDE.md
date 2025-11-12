# Deployment Guide - Schedulink

Complete guide for transferring the code to your laptop and deploying to Netlify via GitHub.

## 📋 Table of Contents
1. [Transfer Code to Laptop](#transfer-code-to-laptop)
2. [Setup on Laptop](#setup-on-laptop)
3. [Deploy to Netlify via GitHub](#deploy-to-netlify-via-github)
4. [Environment Variables Setup](#environment-variables-setup)
5. [Database Setup](#database-setup)
6. [Troubleshooting](#troubleshooting)

---

## 🖥️ Transfer Code to Laptop

### Option 1: Using GitHub (Recommended)

1. **Create a GitHub Account** (if you don't have one)
   - Go to [github.com](https://github.com)
   - Sign up for a free account

2. **Create a New Repository**
   - Click the "+" icon in the top right
   - Select "New repository"
   - Name it: `schedulink`
   - Choose **Private** (or Public if you prefer)
   - **Don't** initialize with README, .gitignore, or license
   - Click "Create repository"

3. **Push Code from Your PC**
   ```bash
   # Open terminal/PowerShell in your project folder
   cd C:\Users\2ez4w\OneDrive\Documents\Schedulink
   
   # Initialize git (if not already done)
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit"
   
   # Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
   git remote add origin https://github.com/YOUR_USERNAME/schedulink.git
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

4. **Clone on Your Laptop**
   ```bash
   # On your laptop, open terminal
   git clone https://github.com/YOUR_USERNAME/schedulink.git
   cd schedulink
   ```

### Option 2: Using USB/External Drive

1. **Copy Project Folder**
   - Copy the entire `Schedulink` folder to your USB drive
   - Transfer to your laptop

2. **Extract on Laptop**
   - Paste the folder to your desired location (e.g., `Documents`)

---

## 💻 Setup on Laptop

### Prerequisites
- **Node.js** (v18 or higher): [Download](https://nodejs.org/)
- **pnpm** (Package Manager): Install via `npm install -g pnpm`
- **Git** (Optional, for GitHub): [Download](https://git-scm.com/)

### Step 1: Install Dependencies

```bash
# Navigate to project folder
cd schedulink

# Install dependencies
pnpm install
```

### Step 2: Create Environment File

1. **Create `.env.local` file** in the root directory:
   ```env
   VITE_SUPABASE_URL=https://oftrbcajibokcuyzumgr.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHJiY2FqaWJva2N1eXp1bWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjYxOTMsImV4cCI6MjA3ODU0MjE5M30.o56-j407U9Bro1TBv5t0jK5Ift8ycNVlW79tvsr5DUc
   ```

2. **Save the file**

### Step 3: Run the Development Server

```bash
# Start development server
pnpm dev
```

3. **Open browser**
   - Go to `http://localhost:5173`
   - The app should load!

---

## 🚀 Deploy to Netlify via GitHub

### Step 1: Push Code to GitHub

If you haven't already, follow the [Transfer Code to Laptop](#transfer-code-to-laptop) section to push your code to GitHub.

### Step 2: Create Netlify Account

1. **Go to Netlify**: [netlify.com](https://netlify.com)
2. **Sign up** with your GitHub account (recommended)
3. **Complete registration**

### Step 3: Deploy from GitHub

1. **Click "Add new site"** → **"Import an existing project"**
2. **Select "GitHub"** as your Git provider
3. **Authorize Netlify** to access your GitHub account
4. **Select your repository**: `schedulink`
5. **Configure build settings**:
   - **Build command**: `pnpm build`
   - **Publish directory**: `dist`
   - **Base directory**: (leave empty)

6. **Add Environment Variables**:
   - Click "Show advanced" → "New variable"
   - Add:
     - **Key**: `VITE_SUPABASE_URL`
     - **Value**: `https://oftrbcajibokcuyzumgr.supabase.co`
   - Click "New variable" again:
     - **Key**: `VITE_SUPABASE_ANON_KEY`
     - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHJiY2FqaWJva2N1eXp1bWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjYxOTMsImV4cCI6MjA3ODU0MjE5M30.o56-j407U9Bro1TBv5t0jK5Ift8ycNVlW79tvsr5DUc`

7. **Click "Deploy site"**

### Step 4: Wait for Deployment

- Netlify will build your site (takes 2-3 minutes)
- You'll see a progress log
- Once done, you'll get a URL like: `https://schedulink-123.netlify.app`

### Step 5: Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain name
4. Follow Netlify's DNS instructions

---

## 🔐 Environment Variables Setup

### Local Development (`.env.local`)

Create a file named `.env.local` in the root directory:

```env
VITE_SUPABASE_URL=https://oftrbcajibokcuyzumgr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHJiY2FqaWJva2N1eXp1bWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjYxOTMsImV4cCI6MjA3ODU0MjE5M30.o56-j407U9Bro1TBv5t0jK5Ift8ycNVlW79tvsr5DUc
```

### Netlify Environment Variables

1. Go to **Site settings** → **Environment variables**
2. Add:
   - `VITE_SUPABASE_URL` = `https://oftrbcajibokcuyzumgr.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHJiY2FqaWJva2N1eXp1bWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjYxOTMsImV4cCI6MjA3ODU0MjE5M30.o56-j407U9Bro1TBv5t0jK5Ift8ycNVlW79tvsr5DUc`

---

## 🗄️ Database Setup

### Step 1: Run SQL Scripts in Supabase

1. **Go to Supabase Dashboard**: [supabase.com](https://supabase.com)
2. **Select your project**
3. **Go to SQL Editor**
4. **Run these scripts in order**:

   a. **`database-schema.sql`** (if not already run)
   
   b. **`add-profile-picture.sql`**:
   ```sql
   ALTER TABLE profiles 
   ADD COLUMN IF NOT EXISTS avatar_url TEXT;
   ```

   c. **`setup-all-labs.sql`** (for lab monitoring):
   ```sql
   -- Add building column
   ALTER TABLE labs 
   ADD COLUMN IF NOT EXISTS building TEXT;

   -- Add time tracking
   ALTER TABLE labs 
   ADD COLUMN IF NOT EXISTS time_in TIMESTAMPTZ,
   ADD COLUMN IF NOT EXISTS time_out TIMESTAMPTZ,
   ADD COLUMN IF NOT EXISTS occupant TEXT;

   -- Update existing labs
   UPDATE labs 
   SET building = 'COMLAB BUILDING'
   WHERE building IS NULL;

   -- Create index
   CREATE INDEX IF NOT EXISTS idx_labs_building ON labs(building);
   ```

   d. **`auto-confirm-email.sql`** (for auto email confirmation):
   ```sql
   CREATE OR REPLACE FUNCTION public.auto_confirm_email()
   RETURNS TRIGGER AS $$
   BEGIN
     UPDATE auth.users
     SET email_confirmed_at = NOW()
     WHERE id = NEW.id;
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_email();
   ```

### Step 2: Verify Database Tables

- Go to **Table Editor** in Supabase
- Verify these tables exist:
  - `profiles`
  - `classes`
  - `class_members`
  - `tasks`
  - `task_submissions`
  - `labs`

---

## 🐛 Troubleshooting

### Issue: "Cannot find module" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
pnpm install
```

### Issue: "Environment variables not found"

**Solution:**
- Make sure `.env.local` exists in the root directory
- Restart the development server
- Check that variable names start with `VITE_`

### Issue: "Build failed on Netlify"

**Solution:**
1. Check Netlify build logs
2. Verify environment variables are set in Netlify
3. Make sure `pnpm` is installed (Netlify should auto-detect)
4. Add `netlify.toml` file (optional):
   ```toml
   [build]
     command = "pnpm build"
     publish = "dist"
   ```

### Issue: "Database connection errors"

**Solution:**
- Verify Supabase URL and key in `.env.local`
- Check Supabase project is active
- Verify RLS (Row Level Security) policies are set

### Issue: "Blank page on Netlify"

**Solution:**
1. Check browser console for errors
2. Verify environment variables in Netlify
3. Clear browser cache
4. Check Netlify build logs

---

## 📝 Presentation Tips

### Before Presentation

1. **Test on Laptop**:
   - Run `pnpm dev` locally
   - Test all features (login, register, tasks, labs)
   - Take screenshots if needed

2. **Test Netlify Deployment**:
   - Open your Netlify URL
   - Test all features
   - Verify it works on mobile (optional)

3. **Prepare Demo Accounts**:
   - Create a teacher account
   - Create a student account
   - Test both roles

4. **Prepare SQL Scripts**:
   - Have SQL scripts ready to run
   - Document any manual setup steps

### During Presentation

1. **Show Local Version**:
   - Run `pnpm dev`
   - Demonstrate features

2. **Show Netlify Deployment**:
   - Open Netlify URL
   - Show it's live and accessible

3. **Show Code**:
   - Open GitHub repository
   - Show project structure
   - Explain key features

---

## ✅ Checklist

### Before Transfer
- [ ] Code is working on PC
- [ ] All dependencies are in `package.json`
- [ ] `.env.local` file exists (don't commit to GitHub)
- [ ] Database is set up in Supabase

### After Transfer to Laptop
- [ ] Code is cloned/copied
- [ ] Dependencies installed (`pnpm install`)
- [ ] `.env.local` file created
- [ ] App runs locally (`pnpm dev`)
- [ ] All features work

### Before Netlify Deployment
- [ ] Code is pushed to GitHub
- [ ] Netlify account is created
- [ ] Environment variables are ready

### After Netlify Deployment
- [ ] Build succeeded
- [ ] Environment variables are set
- [ ] App is accessible via Netlify URL
- [ ] All features work on Netlify

---

## 🎉 You're Done!

Your Schedulink app is now:
- ✅ Transferred to your laptop
- ✅ Deployed to Netlify
- ✅ Accessible worldwide
- ✅ Ready for presentation!

**Need Help?**
- Check Netlify docs: [docs.netlify.com](https://docs.netlify.com)
- Check Supabase docs: [supabase.com/docs](https://supabase.com/docs)
- Check React docs: [react.dev](https://react.dev)

