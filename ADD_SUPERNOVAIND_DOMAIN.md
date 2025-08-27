# Add supernovaind.com to Firebase

## 🌐 Your Domain: https://supernovaind.com/

### Step 1: Find Authorized Domains
1. Firebase Console → Authentication → **Settings** tab
2. OR click **Google** provider → scroll down

### Step 2: Add These Domains
- `supernovaind.com`
- `www.supernovaind.com`
- `localhost` (for development)

### Step 3: If You Can't Find Authorized Domains
**Just deploy first!** Firebase might auto-allow your domain.

### Step 4: Deploy to Hostinger
```bash
npm run build
```
Upload `dist/` folder contents to your Hostinger `public_html`

### Step 5: Test Authentication
1. Go to https://supernovaind.com/signup
2. Try Google sign-in
3. If it fails with domain error, then add the domain manually

## 🚨 Quick Fix:
Firebase usually auto-detects domains. Deploy first, test, then add domains only if needed!