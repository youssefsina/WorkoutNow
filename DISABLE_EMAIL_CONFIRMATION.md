# Disable Email Confirmation in Supabase

To allow users to sign up without email confirmation:

## Steps:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/txzkmifbrjjnfylshjlf

2. Navigate to **Authentication** → **Providers** (left sidebar)

3. Scroll down to **"Email"** provider section

4. **Disable** the following option:
   - ☐ **"Confirm email"** - Uncheck this box

5. Click **"Save"** at the bottom

## What this does:

- Users can sign up and immediately access the app
- No email confirmation required
- Users are auto-confirmed upon signup
- Faster onboarding experience

## Alternative: Manual User Confirmation

If you prefer to keep email confirmation enabled but want to manually confirm users:

1. Go to **Authentication** → **Users**
2. Find the user
3. Click the **"..."** menu
4. Select **"Confirm user"**

## For Development:

For testing purposes, it's recommended to disable email confirmation to speed up the development workflow.

## Security Note:

Disabling email confirmation means:
- Anyone can create an account with any email address
- No verification that the email belongs to the user
- Good for: Development, internal apps, apps that don't rely on email ownership
- Not recommended for: Production apps requiring verified email addresses

**Current code is already updated to skip email confirmation prompts.**
