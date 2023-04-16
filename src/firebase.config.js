import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA72Wb2BkGBHV-fmruaTiq6vYnXcMvJyS4",
  authDomain: "yourplanner-7a2c0.firebaseapp.com",
  databaseURL: "https://yourplanner-7a2c0-default-rtdb.firebaseio.com",
  projectId: "yourplanner-7a2c0",
  storageBucket: "yourplanner-7a2c0.appspot.com",
  messagingSenderId: "339601064975",
  appId: "1:339601064975:web:ba62f5fffd428a2ecc8f7a"
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, firestore, storage };
