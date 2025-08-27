# Firebase Setup for CallGenie

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name: `callgenie-ai` (or any name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Enable **Email/Password**
5. Enable **Google** (add your domain: `yourdomain.com`)

## 3. Add Web App

1. Click **Project Settings** (gear icon)
2. Click **Add app** → Web app
3. App nickname: `CallGenie Web`
4. Check "Also set up Firebase Hosting"
5. Click **Register app**

## 4. Get Firebase Config

Copy the config object and replace in `src/lib/firebase.ts`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## 5. Configure Google OAuth

1. In Firebase Console → Authentication → Sign-in method
2. Click **Google**
3. Add authorized domains:
   - `localhost` (for development)
   - `yourdomain.com` (your Hostinger domain)
   - `www.yourdomain.com`

## 6. Deploy to Hostinger

### Option A: Build and Upload
```bash
npm run build
```
Upload `dist/` folder contents to your Hostinger public_html

### Option B: Use Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 7. Environment Variables (Optional)

Create `.env.local`:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

Then update `firebase.ts`:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // ... rest of config
};
```

## 8. Test Authentication

1. Try email signup/signin
2. Try Google authentication
3. Check Firebase Console → Authentication → Users

Your authentication will now work on Hostinger!