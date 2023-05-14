import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Header, MainContainer } from "./components";
import { useStateValue } from "./context/StateProvider";
import { getAllPlannerItems } from "./utils/firebaseFunctions";
import { getAllAppointmentItems } from "./utils/firebaseFunctions";
import { actionType } from "./context/reducer";
import BecomeAPlanner from "./components/BecomeAPlanner";
import Appointment from "./components/Appointment";
import Customer from "./components/Customer";
import EditDetails from "./components/EditDetails";
import Profile from "./components/Profile";
import UploadImage from "./components/UploadImage";
import Admin from "./components/Admin/Admin";
import Copyright from "./components/Copyright";

const App = () => {
  const [{ plannerItems, appointmentItems }, dispatch] = useStateValue();

  const fetchData = async () => {
    await getAllPlannerItems().then((data) => {
      dispatch({
        type: actionType.SET_PLANNER_DETAILS,
        plannerItems: data,
      });
    });
    await getAllAppointmentItems().then((dataApp) => {
      dispatch({
        type: actionType.SET_APPOINTMENT_DETAILS,
        appointmentItems: dataApp,
      });
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AnimatePresence exitBeforeEnter>
      <div className="w-screen h-auto flex flex-col bg-primary">
        <Header />

        <main className="mt-14 md:mt-20 px-4 md:px-16 py-4 w-full">
          <Routes>
            <Route path="/*" element={<MainContainer />} />
            <Route path="/planner-form" element={<BecomeAPlanner />} />
            <Route path="/appointment-form" element={<Appointment />} />
            <Route path="/profile" element={<Profile/> } />
            <Route path="/customer" element={<Customer/>} />
            <Route path="/edit" element={<EditDetails/>} />
            <Route path="/upload-image" element={<UploadImage/>} />
            <Route path="/admin-dashboard" element={<Admin/>} />
          </Routes>
        </main>

        <Copyright/>
      </div>
    </AnimatePresence>
  );
};

export default App;
