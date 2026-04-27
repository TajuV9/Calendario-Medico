import { createContext, useState, useEffect } from "react";
import { AppConstants } from "../util/constants.js";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = AppConstants.BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserData = async () => {
    try {
      const response = await axios.get(backendUrl + "/profile", { withCredentials: true });
      if (response.status === 200) {
        setUserData(response.data);
        setIsLoggedIn(true);
      } else {
        setUserData(null);
        setIsLoggedIn(false);
        localStorage.removeItem('jwt');
        toast.error("Unable to retrieve the profile.");
      }
    } catch (error) {
      setUserData(null);
      setIsLoggedIn(false);
      localStorage.removeItem('jwt');
      toast.error(error.message || "Error retrieving user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem('jwt');
      if (token) {
        await getUserData();
      } else {
        setLoading(false); 
      }
    };
    initializeUser();
  }, []);

  const contextValue = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    loading,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};