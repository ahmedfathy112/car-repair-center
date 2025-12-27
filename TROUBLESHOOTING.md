# Troubleshooting: "Database error querying schema"

## Quick Fix (Most Common Issue)

**If you're on Supabase Free Tier:** Your database is likely **paused**.

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **Database**
4. Look for a **"Resume"** or **"Restore"** button
5. Click it to wake up your database
6. Wait 1-2 minutes for the database to fully start
7. Try logging in again

## Step-by-Step Diagnosis

### 1. Check Database Status

**In Supabase Dashboard:**
- Navigate to: **Settings** → **Database**
- Check if database status shows "Active" or "Paused"
- If paused, click "Resume"

### 2. Verify Environment Variables

Check your `.env` file (or `.env.local`) contains:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**To find these values:**
1. Go to Supabase Dashboard → Your Project
2. Go to **Settings** → **API**
3. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

### 3. Initialize Database Schema

If your database is active but still showing errors:

1. Go to Supabase Dashboard → **SQL Editor**
2. Copy the contents of `supabase-setup.sql`
3. Paste into SQL Editor
4. Click **Run** (or press Ctrl+Enter)
5. Verify no errors appear
6. Try logging in again

### 4. Check Network Connection

- Ensure you have internet connectivity
- Check if Supabase status page shows any outages: https://status.supabase.com
- Try accessing your Supabase dashboard to confirm project is accessible

### 5. Verify Project Configuration

**In Supabase Dashboard:**
- Go to **Settings** → **API**
- Ensure **"Enable API"** is checked
- Check **"Enable Auth"** is enabled
- Verify **"Enable Database"** is enabled

### 6. Check Browser Console

Open browser DevTools (F12) and check:
- **Console tab**: Look for detailed error messages
- **Network tab**: Check if requests to Supabase are failing
- Look for CORS errors or 500 status codes

## Common Error Messages & Solutions

### "Database error querying schema"
**Cause:** Database is paused or schema not initialized  
**Solution:** Resume database + run setup SQL script

### "Failed to load resource: 500"
**Cause:** Database connection issue  
**Solution:** Resume database, wait 2 minutes, try again

### "Invalid API key"
**Cause:** Wrong or missing environment variable  
**Solution:** Verify `.env` file has correct `VITE_SUPABASE_ANON_KEY`

### "Network request failed"
**Cause:** Internet connection or CORS issue  
**Solution:** Check internet, verify Supabase URL is correct

## Still Not Working?

1. **Check Supabase Logs:**
   - Dashboard → **Logs** → **Postgres Logs**
   - Look for error messages

2. **Test Connection Manually:**
   - Use the "Test Connection" button on login page
   - Check console for detailed diagnostics

3. **Verify User Exists:**
   - Dashboard → **Authentication** → **Users**
   - Ensure the user you're trying to log in with exists

4. **Create New User:**
   - Dashboard → **Authentication** → **Users** → **Add User**
   - Try logging in with the new user

5. **Contact Support:**
   - If on paid plan, contact Supabase support
   - Include error messages and steps you've tried

## Prevention

- **Keep database active:** Free tier pauses after 7 days of inactivity
- **Monitor usage:** Check Dashboard → **Settings** → **Usage** for limits
- **Set up alerts:** Configure email notifications for database issues






