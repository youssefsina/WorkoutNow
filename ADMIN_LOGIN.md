# Admin Login Credentials

## Quick Test Account

Use the **Sign Up** page to create your admin account:

**Recommended:**
- Email: `admin@workoutnow.com`
- Password: `Admin123!` (or any password you prefer)

---

## How to Create Admin User

### Option 1: Sign Up Through UI (Easiest)
1. Go to http://localhost:3001/signup
2. Fill in the form:
   - Email: `admin@workoutnow.com`
   - Password: `Admin123!`
   - Click "Create Account"
3. Check your email for confirmation (if required)
4. Sign in at http://localhost:3001/login

### Option 2: Create in Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project: `txzkmifbrjjnfylshjlf`
3. Navigate to **Authentication > Users**
4. Click **"Add User"** or **"Invite User"**
5. Enter:
   - Email: `admin@workoutnow.com`
   - Password: `Admin123!`
   - ✅ Check "Auto Confirm User" (important!)
6. Click **Create User**
7. Now you can log in at http://localhost:3001/login

---

## Test Credentials

Once you create the account using either method above, use these to log in:

```
Email: admin@workoutnow.com
Password: Admin123!
```

---

## Alternative: Create Your Own

You can also create an account with your own email:

1. Go to http://localhost:3001/signup
2. Enter your email and password
3. Sign in at http://localhost:3001/login

**Note:** Supabase may require email confirmation. To skip this in development:
- Go to Supabase Dashboard > Authentication > Settings
- Disable "Enable email confirmations" for testing

---

## Current Supabase Project

- **Project URL:** https://txzkmifbrjjnfylshjlf.supabase.co
- **Project ID:** txzkmifbrjjnfylshjlf
- **Dashboard:** https://supabase.com/dashboard/project/txzkmifbrjjnfylshjlf

---

## Troubleshooting

### Can't Sign Up
- Make sure backend is running (http://localhost:4000)
- Check Supabase credentials in `frontend\.env.local`
- Check email confirmation settings in Supabase Dashboard

### Email Confirmation Required
- Go to Supabase Dashboard > Authentication > Settings
- Disable "Enable email confirmations" for development
- Or check your email inbox for confirmation link

### "Invalid Credentials" Error
- Make sure you created the user first
- Check that "Auto Confirm User" was enabled
- Try resetting password in Supabase Dashboard
