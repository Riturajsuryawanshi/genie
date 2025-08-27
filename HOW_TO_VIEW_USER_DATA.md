# How to View User Data in CallGenie

## 🔥 Firebase Console (Main User Data)

### Step 1: Access Firebase Console
1. Go to: https://console.firebase.google.com/
2. Select your project: `callgenie-c1095`
3. Click **Authentication** in left sidebar

### Step 2: View Users
1. Click **Users** tab
2. See all registered users with:
   - Email addresses
   - Sign-up dates
   - Last sign-in times
   - User IDs
   - Provider (Email/Google)

### Step 3: User Details
- Click on any user to see:
  - Full profile information
  - Authentication method
  - Custom claims (if any)
  - Account creation date

## 💻 Browser Developer Tools (Local Data)

### Step 1: Open Developer Tools
1. Right-click on your website
2. Select "Inspect" or press F12
3. Go to **Application** tab

### Step 2: Check Local Storage
1. Expand **Local Storage**
2. Click on your domain
3. Look for:
   - `authToken` - Authentication token
   - `user` - User information
   - Firebase keys (auto-generated)

### Step 3: Check Session Storage
1. Expand **Session Storage**
2. View temporary session data

## 🔍 Debug User Data in Code

### Add Debug Component:
```jsx
// Add this to any component to see current user data
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';

const UserDebug = () => {
  const { user } = useFirebaseAuth();
  
  return (
    <div style={{position: 'fixed', top: 0, right: 0, background: 'black', color: 'white', padding: '10px', zIndex: 9999}}>
      <h4>Current User:</h4>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <h4>Local Storage:</h4>
      <pre>{localStorage.getItem('user')}</pre>
    </div>
  );
};
```

## 📊 View User Analytics

### Firebase Analytics:
1. Firebase Console → **Analytics**
2. See user engagement
3. Track sign-ups and activity

### Custom Logging:
```jsx
// Add to components to log user actions
console.log('Current user:', user);
console.log('User email:', user?.email);
console.log('User ID:', user?.uid);
```

## 🛠️ Admin Panel (Future Enhancement)

### Create Admin Route:
```jsx
// Add to App.tsx routes
<Route path="/admin/users" element={<UserManagement />} />
```

### User Management Component:
- List all users
- View user details
- Manage user permissions
- Export user data

## 🔐 Security Note

**Never expose sensitive user data in production!**
- Remove debug components before deployment
- Use proper admin authentication
- Follow data privacy regulations

## Quick Check Commands:

### In Browser Console:
```javascript
// Check current user
console.log('Auth Token:', localStorage.getItem('authToken'));
console.log('User Data:', localStorage.getItem('user'));

// Check Firebase user
firebase.auth().currentUser;
```

Your user data is safely stored in Firebase and can be viewed through the Firebase Console!