import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);
  const getAuthStatus = async () => {
    try {
      const { data } = await axios.get(
        backendURL + "/api/auth/isAuthenticated"
      );

      if (data.success) setIsLoggedIn(true);
      getUserData();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendURL + "/api/user/data");
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getAuthStatus();
  }, []);
  const value = {
    backendURL,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};