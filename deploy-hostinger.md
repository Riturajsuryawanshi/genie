# Hostinger Deployment Instructions

## 1. Backend Deployment

### Upload Backend Files:
1. Compress the `backend` folder (exclude node_modules)
2. Upload to Hostinger File Manager
3. Extract in your domain's root directory

### Set Environment Variables in Hostinger Control Panel:
```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/callgenie
JWT_SECRET=f6d80a141056f55dfcfdb4e22712acb8096d69b3391288302de2e2185016a75a728d16b9350f3d17a35948c7ea3533365697416520414a51f67e3c516f9f6286
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=https://odzagbhwjbphufqgcray.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Set Startup File:
- Startup File: `src/index.js`
- Node.js Version: 18+

## 2. Frontend Deployment

### Update API URL:
Replace `yourdomain.com` in `src/config/api.ts` with your actual Hostinger domain

### Build Frontend:
```bash
npm run build
```

### Upload Frontend:
Upload the `dist` folder contents to your domain's public_html

## 3. Test Deployment

### Test Health Endpoint:
```
https://yourdomain.com/health
```

### Test Account Creation:
```
https://yourdomain.com/api/auth/signup
```

### Test Google OAuth:
Click "Sign up with Google" button

## 4. Google OAuth Setup

Your Google OAuth is already configured for:
- Authorized JavaScript origins: Add your Hostinger domain
- Authorized redirect URIs: Add `https://yourdomain.com/dashboard`

## Current Status:
✅ Google OAuth configured with Supabase
✅ Account creation with success animation
✅ Backend API endpoints ready
✅ MongoDB integration available
✅ JWT authentication working