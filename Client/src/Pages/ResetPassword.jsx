import React, { useContext, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { backendURL } = useContext(AppContext);
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [OTP, setOTP] = useState(0);
  const [isOTPSubmitted, setIsOTPSubmitted] = useState(false);

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

  const onSubmitNewPassword = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post(
        backendURL + "/api/auth/resetPassword",
        { email, otp: OTP, newPassword }
      );

      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  const onSubmitOTP = async (event) => {
    event.preventDefault();

    const otpArray = inputRefs.current.map((event) => event.value);
    setOTP(otpArray.join(""));

    setIsOTPSubmitted(true);
  };

  const onSubmitEmail = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post(
        backendURL + "/api/auth/sendPasswordResetOTP",
        { email }
      );

      data.success ? toast.success(data.message) : toast.error(data.message);

      data.success && setIsEmailSent(true);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen p-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer "
        onClick={() => navigate("/")}
      />

      {!isEmailSent && (
        <form
          className="bg-slate-900 rounded-lg p-8 shadow-lg w-96 text-sm"
          onSubmit={onSubmitEmail}
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter Your Registered Email ID
          </p>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} className="w-3 h-3"></img>
            <input
              placeholder="Email Id"
              className="bg-transparent outline-none text-white"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            Submit
          </button>
        </form>
      )}

      {/* OTP input Form */}

      {!isOTPSubmitted && isEmailSent && (
        <form
          className="bg-slate-900 rounded-lg p-8 shadow-lg w-96 text-sm"
          onSubmit={onSubmitOTP}
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password OTP
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
            Submit
          </button>
        </form>
      )}

      {/* New Password */}

      {isOTPSubmitted && isEmailSent && (
        <form
          className="bg-slate-900 rounded-lg p-8 shadow-lg w-96 text-sm"
          onSubmit={onSubmitNewPassword}
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter Your Password
          </p>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} className="w-3 h-3"></img>
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent outline-none text-white"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
          </div>
          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
