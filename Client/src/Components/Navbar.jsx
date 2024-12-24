import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../Context/AppContext";

import axios from "axios";

const Navbar = () => {
  const { userData, setUserData, setIsLoggedIn, backendURL } =
    useContext(AppContext);
  const navigate = useNavigate();

  const sendVerificationOTP = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendURL + "/api/auth/sendVerificationOTP"
      );

      if (data.success) {
        navigate("/verifyEmail");
        toast.success(data.message);
      } else {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendURL + "/api/auth/logout");

      data.success && setIsLoggedIn(false);
      data.success && setUserData(false);
      toast.success(data.message);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} className="w-28 sm:w-32" />
      {userData ? (
        <div className="flex justify-center items-center w-8 h-8 rounded-full bg-black text-white relative group">
          {userData.name[0].toUpperCase()}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {!userData.isAccountVerified && (
                <li
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => sendVerificationOTP()}
                >
                  Verify Email
                </li>
              )}
              <li
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
                onClick={() => logout()}
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 tranisition-all"
          onClick={() => navigate("login")}
        >
          Login <img src={assets.arrow_icon} alt="Arrow Icon" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
