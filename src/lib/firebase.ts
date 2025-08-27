import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB75IwnAmGjIZVZ16VBc2yCyXl43k_fIrA",
  authDomain: "callgenie-c1095.firebaseapp.com",
  projectId: "callgenie-c1095",
  storageBucket: "callgenie-c1095.firebasestorage.app",
  messagingSenderId: "457349031915",
  appId: "1:457349031915:web:95d399352adb4bb44c9bae"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();