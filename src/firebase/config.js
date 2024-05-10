
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: import.meta.env.REACT_APP_FB_API_KEY,
  authDomain: "eshop-4a00c.firebaseapp.com",
  projectId: "eshop-4a00c",
  storageBucket: "eshop-4a00c.appspot.com",
  messagingSenderId: "365038841654",
  appId: "1:365038841654:web:64d4bc6c4421274aa00d97"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app