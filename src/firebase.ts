// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyC9CWhepVRnINMpvw0XWzMjxulCQ7vEEJQ',
  authDomain: 'view4u-prod.firebaseapp.com',
  projectId: 'view4u-prod',
  storageBucket: 'view4u-prod.firebasestorage.app',
  messagingSenderId: '118229518324',
  appId: '1:118229518324:web:f94c4a704c5a5022081ba1',
  measurementId: 'G-MH5TVRQ32F',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
