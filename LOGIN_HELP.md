# 🔐 LOGIN INSTRUCTIONS

## ⚠️ IMPORTANT: You Need to Sign Up First!

The "Failed to fetch" error means **you don't have an account yet**.

---

## 📝 How to Create Your Account

### Step 1: Go to Sign Up Page
Click the **"Sign Up"** link at the bottom of the login page, or visit:
```
http://localhost:3001/signup
```

### Step 2: Create Your Account
Fill in the form:
- **Email**: `yourusername@gmail.com` (or any email)
- **Password**: `YourPassword123!` (minimum 8 characters)
- Click **"Create Account"**

### Step 3: Login
After signing up, you'll be redirected to the dashboard automatically.

---

## 🎯 Quick Test Account

### To Sign Up:
1. Go to: http://localhost:3001/signup
2. Use these details:
   - Email: `test@workoutnow.com`
   - Password: `Test123456!`
3. Click "Create Account"

### To Login (after signup):
1. Go to: http://localhost:3001/login
2. Enter the same credentials:
   - Email: `test@workoutnow.com`
   - Password: `Test123456!`
3. Click "Sign In"

---

## 🔍 What's Happening

The app uses **Supabase Authentication**. When you try to login:
- Supabase checks if your account exists
- If it doesn't exist → "Failed to fetch" error
- **Solution**: Create an account first using Sign Up

---

## ✅ After Creating Account

Once you sign up, you can:
1. ✅ Login anytime with your email/password
2. ✅ Generate workouts
3. ✅ Track your progress
4. ✅ Save favorite exercises
5. ✅ View workout history

---

## 🆘 Still Getting Errors?

### If "Failed to fetch" persists:

1. **Check both servers are running:**
   ```powershell
   # Backend should be on port 4000
   Invoke-WebRequest http://localhost:4000/health
   
   # Frontend should be on port 3001
   Invoke-WebRequest http://localhost:3001
   ```

2. **Clear browser cache:**
   - Press `Ctrl + Shift + Delete`
   - Clear cached images and files
   - Refresh page (`Ctrl + F5`)

3. **Check browser console:**
   - Press `F12` → Console tab
   - Look for specific error messages
   - Share them if you need help

---

## 🚀 Quick Start Steps

1. ✅ **Both servers running** (Backend: 4000, Frontend: 3001)
2. 👉 **Go to Sign Up**: http://localhost:3001/signup
3. 📝 **Create account** with any email/password
4. ✅ **Automatically logged in** → Start using app!

---

## 📧 No Email Confirmation Required

The app is configured to **auto-confirm** users, so:
- ✅ No need to check email
- ✅ No confirmation link needed
- ✅ Instant access after signup

---

## 💡 Pro Tip

**Use the Sign Up page**, not the Login page! You can't login if you haven't created an account yet.

**Current Status:**
- Backend: ✅ Running (port 4000)
- Frontend: ✅ Running (port 3001)
- Supabase: ✅ Connected

**Next Step:** Click "Sign Up" on the login page or go to http://localhost:3001/signup

---

## 🎉 Ready to Go!

**Sign Up Here:** http://localhost:3001/signup

After signing up, you'll be ready to start your fitness journey! 💪
