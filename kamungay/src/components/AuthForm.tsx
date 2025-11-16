import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { auth, db } from "../firebase";

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { requestOtp, verifyOtp } from "../services/send_otp";
export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [otpStatus, setOtpStatus] = useState(""); // Inline OTP status messages
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpPhone, setOtpPhone] = useState("");
  const [userId, setUserId] = useState(""); // UID for OTP
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setOtpStatus("");
    localStorage.setItem("otpVerified", "false");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      if (!userCredential.user.emailVerified) {
        setError("Please verify your email before logging in.");
        return;
      }

      const uid = userCredential.user.uid;
      setUserId(uid);

      // Check Firestore if SMS OTP is required
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.data();

      if (userData?.sms_otp) {
        setOtpPhone(userData.phone);
        setOtpStatus("Sending OTP...");
        await requestOtp(userData.phone);
        setShowOtp(true);
        setOtpStatus("OTP sent to your phone.");
      } else {
        // No OTP → login normally
        navigate("/dashboard");
        localStorage.setItem("otpVerified", "true");
      }
    } catch (err: any) {
      if (err.code === "auth/user-not-found")
        setError("No user found with this email.");
      else if (err.code === "auth/wrong-password")
        setError("Incorrect password.");
      else setError(err.message);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setOtpStatus("Verifying OTP...");
      const verified = await verifyOtp(otpPhone, otp);

      if (verified) {
        // OTP verified, proceed to dashboard
        localStorage.setItem("otpVerified", "true");
        setShowOtp(false);
        setOtpStatus("OTP verified successfully.");
        navigate("/dashboard");
      } else {
        setOtpStatus("Invalid OTP, please try again.");
      }
    } catch (err) {
      console.error(err);
      setOtpStatus("Failed to verify OTP.");
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="w-[90%] max-w-md bg-white border border-gray-300 rounded-2xl p-8 shadow-lg">
        {/* Logo */}
        <div className="w-20 h-20 rounded-full bg-gray-200 border border-gray-300 mx-auto mb-6 flex items-center justify-center">
          <span className="text-gray-500 text-xl font-semibold">Logo</span>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Login
        </h2>

        {/* Display error messages */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-2">{error}</p>
        )}
        {otpStatus && (
          <p className="text-blue-600 text-sm text-center mb-2">{otpStatus}</p>
        )}

        {!showOtp ? (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
            >
              Login
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-gray-700 text-sm text-center">
              Enter the OTP sent to <strong>{otpPhone}</strong>
            </p>
            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleVerifyOtp}
              className="mt-2 px-4 py-2 bg-green-600/80 text-white rounded-lg hover:bg-green-700/80"
            >
              Verify OTP
            </button>
          </div>
        )}

        {!showOtp && (
          <p className="text-center text-gray-600 text-sm mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        )}
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
  const [activationScreen, setActivationScreen] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // 1️⃣ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );

      // 3️⃣ Save additional data to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        createdAt: serverTimestamp(),
        sms_otp: false,
      });

      // 2️⃣ Send verification email
      await sendEmailVerification(userCredential.user).then(() => {
        console.log("Verication email sent");
        setActivationScreen(true);
      });
      // 4️⃣ Show activation screen
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="w-[90%] max-w-md bg-white border border-gray-300 rounded-2xl p-8 shadow-lg">
        <div className="w-20 h-20 rounded-full bg-gray-200 border border-gray-300 mx-auto mb-6 flex items-center justify-center">
          <span className="text-gray-500 text-xl font-semibold">Logo</span>
        </div>

        {activationScreen ? (
          <p className="text-center text-gray-700">
            An email has been sent to activate your account.
            <Link
              to="/"
              className="mt-4 block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
            >
              Go to login
            </Link>
          </p>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Sign Up
            </h2>

            {error && (
              <p className="text-red-500 text-sm text-center mb-2">{error}</p>
            )}

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
                  required
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-gray-700 text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* <div className="flex flex-col gap-1"> */}
              {/*   <label className="text-gray-700 text-sm font-medium"> */}
              {/*     Phone */}
              {/*   </label> */}
              {/*   <input */}
              {/*     type="tel" */}
              {/*     name="phone" */}
              {/*     placeholder="+63XXXXXXXXX" */}
              {/*     value={formData.phone} */}
              {/*     onChange={handleChange} */}
              {/*     className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" */}
              {/*     pattern="\+63\d{10}" */}
              {/*     required */}
              {/*   /> */}
              {/* </div> */}

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
                  required
                />

                {passwordStrength && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm capitalize">
                      {passwordStrength}
                    </span>
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
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    formData.confirmPassword &&
                    formData.confirmPassword !== formData.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  required
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

            <p className="text-center text-gray-600 text-sm mt-4">
              Already have an account?{" "}
              <Link to="/" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};
