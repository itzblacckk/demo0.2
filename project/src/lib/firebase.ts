import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA330W9XA6QIWQIy8FvdV4P9xMWw8IFS9E",
  authDomain: "fir-bd73b.firebaseapp.com",
  projectId: "fir-bd73b",
  storageBucket: "fir-bd73b.firebasestorage.app",
  messagingSenderId: "471447708758",
  appId: "1:471447708758:web:8f109152a8bde0110647f7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);