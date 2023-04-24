import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { firestore } from "../firebase.config";

// Saving new Item
export const saveItem = async (data, emailId) => {
  await setDoc(doc(firestore, "plannerItems", emailId), data, {
    merge: true,
  });
};

export const saveAppointment = async (dataApp) => {
  await setDoc(doc(firestore, "appointmentItems", `${Date.now()}`), dataApp, {
    merge: true,
  });
};

export const uploadImageItem = async (dataimg, emailId) => {
  await setDoc(doc(firestore, "uploadImages", emailId+`${Date.now()}`), dataimg, {
    merge: true,
  });
};

export const uploadVideoItem = async (datavideo, emailId) => {
  await setDoc(doc(firestore, "uploadVideoes", emailId+`${Date.now()}`), datavideo, {
    merge: true,
  });
};


// getall items
export const getAllPlannerItems = async () => {
  const items = await getDocs(
    query(collection(firestore, "plannerItems"), orderBy("id", "desc"))
  );

  return items.docs.map((doc) => doc.data());
};

export const getAllAppointmentItems = async () => {
  const items = await getDocs(
    query(collection(firestore, "appointmentItems"), orderBy("id", "desc"))
  );

  return items.docs.map((doc) => doc.data());
};

export const getAllImagesItems = async () => {
  const items = await getDocs(
    query(collection(firestore, "uploadImages"), orderBy("id", "desc"))
  );

  return items.docs.map((doc) => doc.data());
};

export const getAllVideoesItems = async () => {
  const items = await getDocs(
    query(collection(firestore, "uploadVideoes"), orderBy("id", "desc"))
  );

  return items.docs.map((doc) => doc.data());
};
