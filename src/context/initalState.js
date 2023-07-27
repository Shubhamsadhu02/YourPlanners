import { fetchCart, fetchUser } from "../utils/fetchLocalStorageData";

const userInfo = fetchUser();
const cartInfo = fetchCart();

export const initialState = {
  user: userInfo,
  plannerItems: null,
  appointmentItems: null,
  cartShow: false,
  cartItems: cartInfo,
  uploadImages: null,
  uploadVideoes: null,
  uploadcontactus: null,
};
