import { Link } from "react-router-dom";
import React, { useState } from "react";
import { handleSignup } from "../services/auth_servce";
export const LoginForm = () => {
  return (
    <div className="flex justify-center items-center w-full h-screen ">
      <div className="w-[90%] max-w-md bg-white border border-gray-300 rounded-2xl p-8 shadow-lg">
        {/* Logo inside the box */}
        <div className="w-20 h-20 rounded-full bg-gray-200 border border-gray-300 mx-auto mb-6 flex items-center justify-center">
          {/* Replace with your logo image */}
          <span className="text-gray-500 text-xl font-semibold">Logo</span>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Login
        </h2>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-700 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
          >
            Login
          </button>
        </form>

        {/* Signup link */}
        <p className="text-center text-gray-600 text-sm mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

interface FormData {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export const SignUpForm = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Password strength checker
  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return "";
    if (pwd.length < 6) return "weak";
    if (pwd.match(/[A-Z]/) && pwd.match(/[0-9]/) && pwd.length >= 6)
      return "strong";
    return "medium";
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const strengthColor: Record<string, string> = {
    weak: "bg-red-500",
    medium: "bg-yellow-500",
    strong: "bg-green-500",
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    const { confirmPassword, ...data } = formData;

    const submit = async () => {
      const res = await handleSignup(data);
      if (res) {
        console.log(res);
      } else {
        return;
      }
    };
    submit();
  };

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="w-[90%] max-w-md bg-white border border-gray-300 rounded-2xl p-8 shadow-lg">
        {/* Logo */}
        <div className="w-20 h-20 rounded-full bg-gray-200 border border-gray-300 mx-auto mb-6 flex items-center justify-center">
          <span className="text-gray-500 text-xl font-semibold">Logo</span>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Sign Up
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Password strength */}
            {passwordStrength && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm capitalize">{passwordStrength}</span>
                <div className="flex-1 h-2 rounded bg-gray-200">
                  <div
                    className={`h-2 rounded ${strengthColor[passwordStrength]}`}
                    style={{
                      width:
                        passwordStrength === "weak"
                          ? "33%"
                          : passwordStrength === "medium"
                            ? "66%"
                            : "100%",
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                formData.confirmPassword &&
                formData.confirmPassword !== formData.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {formData.confirmPassword &&
              formData.confirmPassword !== formData.password && (
                <span className="text-red-500 text-sm">
                  Passwords do not match
                </span>
              )}
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
          >
            Sign Up
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-gray-600 text-sm mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
