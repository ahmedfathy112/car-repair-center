# Fix HTTP 521 Error - Supabase Project Paused

## Understanding the Error

**HTTP 521** means "Web Server Is Down" - This indicates your Supabase project is **paused** or **unavailable**.

The CORS error you see is a **side effect** - it appears because the server isn't responding, so the browser can't get CORS headers.

## Why This Happens

On Supabase **Free Tier**, projects automatically pause after **7 days of inactivity** to save resources.

## Quick Fix (5 Steps)

### Step 1: Go to Supabase Dashboard
Visit: https://app.supabase.com

### Step 2: Select Your Project
Click on your project: `wvhbhaafwezqensepgto`

### Step 3: Go to Database Settings
- Click **Settings** (gear icon in sidebar)
- Click **Database** in the settings menu

### Step 4: Resume the Database
- Look for a **"Resume"** or **"Restore"** button
- Click it to wake up your database

### Step 5: Wait and Retry
- Wait **1-2 minutes** for the database to fully start
- Try logging in again

## Visual Guide

```
Supabase Dashboard
  └─ Your Project (wvhbhaafwezqensepgto)
      └─ Settings ⚙️
          └─ Database
              └─ [Resume Button] ← Click here!
```

## Alternative: Check Project Status

1. Go to your project dashboard
2. Look at the top of the page
3. If you see "Paused" or "Inactive", click to resume

## Prevention

- **Keep your project active**: Use it regularly (at least once per week)
- **Upgrade to Pro**: Paid plans don't pause automatically
- **Set up monitoring**: Get notified when your project pauses

## Still Having Issues?

1. **Check Supabase Status**: https://status.supabase.com
2. **Verify Environment Variables**: Make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
3. **Check Network**: Ensure you have internet connection
4. **Try Incognito Mode**: Rule out browser cache issues

## Error Messages You'll See

- ✅ **Fixed**: "Login successful!"
- ❌ **Still Paused**: "Failed to fetch" or HTTP 521
- ❌ **Wrong Credentials**: "Invalid login credentials"

## After Resuming

Once you resume the database:
1. Wait 1-2 minutes
2. Refresh your browser
3. Try logging in again
4. It should work! ✅






