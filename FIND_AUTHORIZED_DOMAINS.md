# How to Find Authorized Domains in Firebase

## 🔍 Step-by-Step Location:

### Method 1: Through Authentication
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: `callgenie-c1095`
3. Click **Authentication** (left sidebar)
4. Click **Settings** tab (next to Users, Sign-in method, Templates)
5. Scroll down to **Authorized domains** section

### Method 2: Through Google Sign-in Setup
1. Go to **Authentication** → **Sign-in method**
2. Click on **Google** provider
3. In the Google popup, you'll see **Authorized domains** at the bottom
4. Click **Add domain**

### Method 3: If Still Not Visible
1. Make sure you've **enabled Google sign-in** first
2. Go to **Authentication** → **Sign-in method**
3. Toggle **Google** to ON
4. Now the **Authorized domains** section will appear

## 📍 What to Add:
- `localhost` (for development)
- Your Hostinger domain (e.g., `yourdomain.com`)
- `www.yourdomain.com`

## 🚨 If You Still Can't Find It:
The **Authorized domains** section only appears AFTER you enable at least one OAuth provider (like Google). Enable Google sign-in first, then it will show up!