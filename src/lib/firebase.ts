import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyB9mMWdHEgwyfKfoRd7Aa6Q4rZSwDAwzSw',
  authDomain: 'blanca-mulata-app.firebaseapp.com',
  databaseURL: 'https://blanca-mulata-app-default-rtdb.firebaseio.com',
  projectId: 'blanca-mulata-app',
  storageBucket: 'blanca-mulata-app.firebasestorage.app',
  messagingSenderId: '858927651558',
  appId: '1:858927651558:web:e53c83da21ec62f32f927',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getDatabase(app);
