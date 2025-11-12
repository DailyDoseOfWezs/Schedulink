# Quick Start Guide - Schedulink

## 🚀 Quick Setup on Laptop

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Create `.env.local` File
Create a file named `.env.local` in the root directory:
```env
VITE_SUPABASE_URL=https://oftrbcajibokcuyzumgr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHJiY2FqaWJva2N1eXp1bWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjYxOTMsImV4cCI6MjA3ODU0MjE5M30.o56-j407U9Bro1TBv5t0jK5Ift8ycNVlW79tvsr5DUc
```

### 3. Run the App
```bash
pnpm dev
```

### 4. Open Browser
Go to `http://localhost:5173`

---

## 📤 Push to GitHub

### 1. Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. Create GitHub Repository
- Go to [github.com](https://github.com)
- Click "New repository"
- Name it: `schedulink`
- Click "Create repository"

### 3. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/schedulink.git
git branch -M main
git push -u origin main
```

---

## 🌐 Deploy to Netlify

### 1. Create Netlify Account
- Go to [netlify.com](https://netlify.com)
- Sign up with GitHub

### 2. Import from GitHub
- Click "Add new site" → "Import an existing project"
- Select "GitHub"
- Select your `schedulink` repository

### 3. Configure Build
- **Build command**: `pnpm build`
- **Publish directory**: `dist`

### 4. Add Environment Variables
- `VITE_SUPABASE_URL` = `https://oftrbcajibokcuyzumgr.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHJiY2FqaWJva2N1eXp1bWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjYxOTMsImV4cCI6MjA3ODU0MjE5M30.o56-j407U9Bro1TBv5t0jK5Ift8ycNVlW79tvsr5DUc`

### 5. Deploy
- Click "Deploy site"
- Wait for deployment (2-3 minutes)
- Your site will be live at `https://schedulink-123.netlify.app`

---

## 🗄️ Database Setup (Run in Supabase SQL Editor)

### 1. Add Profile Picture Support
```sql
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;
```

### 2. Setup Labs
Run `setup-all-labs.sql` or copy the SQL from `DEPLOYMENT_GUIDE.md`

---

## ✅ Checklist

- [ ] Code is on laptop
- [ ] Dependencies installed (`pnpm install`)
- [ ] `.env.local` file created
- [ ] App runs locally (`pnpm dev`)
- [ ] Code is pushed to GitHub
- [ ] Netlify account created
- [ ] Site is deployed on Netlify
- [ ] Environment variables set in Netlify
- [ ] Database SQL scripts run in Supabase
- [ ] App works on Netlify URL

---

## 📝 New Features

### Profile Settings
- **Access**: Click "Settings" in the navbar
- **Features**:
  - Upload profile picture (Max 2MB)
  - Change full name
  - Change password
  - View role and email

### Lab Monitoring
- **Removed Buildings**: Annex Building, Science Building
- **Available Buildings**: COMLAB BUILDING, Main Building, Library Building, Other
- **Features**: Time in/out tracking, occupant tracking, teacher name display

---

## 🆘 Need Help?

Check `DEPLOYMENT_GUIDE.md` for detailed instructions.

