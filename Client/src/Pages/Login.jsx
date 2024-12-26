import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("signup");
  const navigate = useNavigate();

  const { backendURL, isLoggedIn, setIsLoggedIn, getUserData } =
    useContext(AppContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      axios.defaults.withCredentials = true;

      if (state === "signup") {
        const { data } = await axios.post(backendURL + "/api/auth/signup", {
          name,
          email,
          username,
          password,
        });

        console.log(data);

        if (data.success == true) {
          toast.success(data.message);
          setState("login");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendURL + "/api/auth/login", {
          email,
          username,
          password,
        });

        console.log(data);

        if (data.success == true) {
          setIsLoggedIn(true);
          getUserData();
          toast.success(`${data.message}`);
          navigate("/");
        } else {
          toast.error(`${data.message}`);
        }
      }
    } catch (error) {
      console.log(error);
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

      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "signup" ? "Create Account" : "Login To Your Account"}
        </h2>

        <p className="text-center text-sm mb-6">
          {state === "signup" ? "Create Your Account" : "Login To Your Account"}
        </p>

        <form className="" onSubmit={onSubmitHandler}>
          {state === "signup" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" />
              <input
                type="text"
                placeholder="Full Name"
                required
                className="outline-none bg-transparent"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
          )}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.person_icon} alt="" />
            <input
              type="text"
              placeholder="Username"
              required
              className="outline-none bg-transparent"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              type="email"
              placeholder="Email ID"
              required
              className="outline-none bg-transparent"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              type="password"
              placeholder="Password"
              required
              className="outline-none bg-transparent"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <p
            onClick={() => navigate("/resetPassword")}
            className="mb-4 text-indigo-500 cursor-pointer"
          >
            Forgot Password?
          </p>
          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            {state === "signup" ? "Sign Up" : "Login"}
          </button>
        </form>

        {state === "signup" ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already Have An Account {"  "}
            <span
              className="underline text-blue-400 cursor-pointer"
              onClick={() => setState("login")}
            >
              Login Here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            Dont Have An Account? {"  "}
            <span
              className="underline text-blue-400 cursor-pointer"
              onClick={() => setState("signup")}
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
