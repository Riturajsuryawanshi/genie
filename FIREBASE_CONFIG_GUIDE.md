# How to Get Firebase Config & Add Hostinger Domain

## 🔥 Get Firebase Config

### Step 1: Go to Firebase Console
1. Visit: https://console.firebase.google.com/
2. Click "Create a project" or select existing project

### Step 2: Add Web App
1. Click the **Web icon** `</>` in project overview
2. App nickname: `CallGenie`
3. Click "Register app"

### Step 3: Copy Config
You'll see this config - **COPY IT**:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Step 4: Replace in Code
Paste it in `src/lib/firebase.ts` replacing the dummy config.

## 🌐 Add Hostinger Domain

### Step 1: Go to Authentication
1. In Firebase Console, click **Authentication**
2. Click **Get started** (if first time)

### Step 2: Sign-in Method
1. Click **Sign-in method** tab
2. Enable **Email/Password** - toggle ON
3. Enable **Google** - click on it

### Step 3: Add Authorized Domains
1. Scroll down to **Authorized domains**
2. Click **Add domain**
3. Add these domains:
   - `yourdomain.com` (your Hostinger domain)
   - `www.yourdomain.com`
   - `localhost` (for development)

### Example:
If your Hostinger domain is `callgenie.com`, add:
- `callgenie.com`
- `www.callgenie.com`
- `localhost`

## ✅ Test Setup
1. Deploy to Hostinger
2. Try signing up with email
3. Try Google sign-in
4. Check Firebase Console → Authentication → Users

Done! Your Firebase auth will work on Hostinger.