import React from "react";
import logo from "../assets/fssa.png";

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-md p-8">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="logo" className="w-10 h-10" />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">
          Sign in to FSSA LMS
        </h2>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">
              Email address
            </label>
            <input
              type="email"
              placeholder="student@fssa.org"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>

        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-sm text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-100 transition">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5 h-5"
          />
          <span>Sign in with Google</span>
        </button>

        <p className="text-center text-sm text-gray-600 mt-5 cursor-pointer hover:underline">
          Forgot password?
        </p>
      </div>

      <p className="absolute bottom-4 text-xs text-gray-500">
        © copyright Freshworks STS Software Academy
      </p>
    </div>
  );
}

export default Login;
