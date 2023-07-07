export const actionType = {
  SET_USER: "SET_USER",
  SET_PLANNER_DETAILS: "SET_PLANNER_DETAILS",
  SET_APPOINTMENT_DETAILS: "SET_APPOINTMENT_DETAILS",
  SET_CART_SHOW: "SET_CART_SHOW",
  SET_CARTITEMS: "SET_CARTITEMS",
  SET_IMAGES: "SET_IMAGE_DETAILS",
  SET_VIDEOES: "SET_VIDEO_DETAILS",
  SET_CONTACTUS: "SET_CONTACTUS_DETAILS",
};

const reducer = (state, action) => {
  // console.log(action);

  switch (action.type) {
    case actionType.SET_USER:
      return {
        ...state,
        user: action.user,
      };

    case actionType.SET_PLANNER_DETAILS:
      return {
        ...state,
        plannerItems: action.plannerItems,
      };

    case actionType.SET_APPOINTMENT_DETAILS:
      return {
          ...state,
          appointmentItems: action.appointmentItems,
      };

    case actionType.SET_IMAGES:
      return {
          ...state,
          uploadImages: action.uploadImages,
      };
    
    case actionType.SET_VIDEOES:
      return {
          ...state,
          uploadVideoes: action.uploadVideoes,
      };

      case actionType.SET_CONTACTUS:
        return {
            ...state,
            uploadcontacus: action.uploadcontacus,
        };

    case actionType.SET_CART_SHOW:
      return {
        ...state,
        cartShow: action.cartShow,
      };

    case actionType.SET_CARTITEMS:
      return {
        ...state,
        cartItems: action.cartItems,
      };

    default:
      return state;
  }
};

export default reducer;
