import React, { useContext, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const { backendURL, isLoggedIn, getUserData, userData } =
    useContext(AppContext);
  const inputRefs = useRef([]);

  const handleInput = (event, index) => {
    if (event.target.value.length && index < inputRefs.current.length - 1)
      inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && event.target.value === "" && index > 0)
      inputRefs.current[index - 1].focus();
  };

  const handlePaste = (event) => {
    const paste = event.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const otpArray = inputRefs.current.map((event) => event.value);
    const otp = otpArray.join("");

    try {
      const { data } = await axios.post(
        backendURL + "/api/auth/verifyAccount",
        {
          otp,
        }
      );

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else toast.error(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedIn, userData]);
  return (
    <div className="flex items-center justify-center min-h-screen p-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer "
        onClick={() => navigate("/")}
      />

      <form
        className="bg-slate-900 rounded-lg p-8 shadow-lg w-96 text-sm"
        onSubmit={onSubmitHandler}
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify OTP
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter the 8 Digit OTP Sent To Your Email Id
        </p>

        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <input
                maxLength="1"
                key={index}
                type="text"
                required
                className="w-8 h-8 bg-[#333A5C] text-white text-xl text-center rounded-md"
                ref={(event) => (inputRefs.current[index] = event)}
                onInput={(event) => handleInput(event, index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              />
            ))}
        </div>
        <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white">
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default VerifyEmail;
