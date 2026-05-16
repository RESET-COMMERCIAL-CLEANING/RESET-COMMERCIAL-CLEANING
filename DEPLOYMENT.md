# Deployment Guide - RESET Commercial Cleaning

## Overview
This Next.js app is deployed to GitHub Pages (static) with Firebase for backend services. Form submissions (quote/contact) are created directly in Firestore using client-side code with security rules.

## Architecture
- **Frontend**: GitHub Pages (static Next.js export)
- **Backend**: Firebase Firestore (database), Firebase Storage (files)
- **Authentication**: Custom system in `lib/auth.ts`
- **Forms**: Direct Firestore writes with security rules

## Deployment Steps

### 1. Deploy to GitHub Pages

```bash
# Build static export
npm run build

# Build generates output in 'out' directory
# GitHub Actions automatically deploys from this

# Or manually push to GitHub:
git add .
git commit -m "Your message"
git push origin main
```

The GitHub Actions workflow in `.github/workflows/deploy.yml` automatically:
1. Builds the Next.js app with `output: 'export'`
2. Deploys to GitHub Pages at `https://username.github.io/RESET-Website/`

### 2. Deploy Firebase Security Rules

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Authenticate with Firebase
firebase login

# Deploy only Firestore rules
firebase deploy --only firestore:rules
```

Or deploy everything:
```bash
firebase deploy
```

### 3. Configure Firebase Hosting (Optional)

If you want to host on Firebase instead of GitHub Pages:

```bash
firebase init hosting
firebase deploy
```

## Security Features

### Firestore Rules (`firestore.rules`)

**Public (Unauthenticated) Access:**
- ✅ Can create new tickets (quote/contact forms)
- ❌ Cannot update or delete tickets

**Authenticated Users (Admin/Support):**
- ✅ Can read all tickets
- ✅ Can update assigned tickets
- ✅ Can manage users and support team
- ❌ Regular users cannot see all tickets

### Rules Summary
- Unauthenticated users create tickets with required fields only
- Admin/support roles can update tickets
- Activity logs are created by authenticated users
- User profiles protected - only owner or admin can view/update

## Form Submission Flow

1. **Quote/Contact Form** → User submits
2. **Client-side Validation** → Form checked
3. **Firestore Write** → Ticket created directly (with security rules validation)
4. **Toast Notification** → Success/error shown to user
5. **Admin Portal** → Superuser sees ticket in real-time (via onSnapshot)
6. **Support Assignment** → Ticket assigned to support member
7. **Support Resolution** → Support member updates ticket status

## Testing Locally

```bash
# Start dev server
npm run dev

# Go to http://localhost:3000/RESET-COMMERCIAL-CLEANING/quote

# Fill form and submit
# Check Firebase Console to see ticket created
# Firestore → Collections → tickets
```

## Environment Variables

See `.env.local` for required configuration:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- `NEXT_PUBLIC_ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Troubleshooting

### "Firebase not initialized" Error
- Check `.env.local` has all required variables
- Verify `NEXT_PUBLIC_*` variables are set
- Build won't include them if missing

### Tickets Not Creating
- Check browser console for errors (F12)
- Verify Firestore rules allow unauthenticated `create`
- Check Firebase Console for security rule violations

### Forms Show Popups Instead of Toasts
- This is normal during development - update error handling to use Toast component
- All form pages should use `useToast()` hook

## GitHub Actions CI/CD

The workflow in `.github/workflows/deploy.yml`:
1. Triggered on push to `main`, `deploy-*`, or `checkpoint-*` branches
2. Installs dependencies
3. Builds with `npm run build`
4. Deploys `out/` directory to GitHub Pages

To modify deployment regions or add additional steps, edit the workflow file.

## Production Checklist

- [ ] Firebase Firestore rules deployed
- [ ] Environment variables set in GitHub Secrets (if needed)
- [ ] Admin credentials changed from defaults
- [ ] Tested quote/contact form submission
- [ ] Verified tickets appear in admin portal
- [ ] Checked mobile responsiveness
- [ ] Set up Firebase backups
- [ ] Monitored Firebase quota usage
