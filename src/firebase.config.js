import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD-EQjjL8CBggPle1w8kU1TYhj7Bz3POH4",
  authDomain: "your-planner-761ea.firebaseapp.com",
  databaseURL: "https://your-planner-761ea-default-rtdb.firebaseio.com",
  projectId: "your-planner-761ea",
  storageBucket: "your-planner-761ea.appspot.com",
  messagingSenderId: "277278760408",
  appId: "1:277278760408:web:b4a118179ddf06797c66ad",
  measurementId: "G-3HM6J90XSX"
}

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

const firestore = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { app, firestore, storage, analytics };
