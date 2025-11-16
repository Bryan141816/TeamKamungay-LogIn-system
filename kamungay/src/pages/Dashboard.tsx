import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase"; // Make sure you export `db` from firebase config
import { signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
// @ts-ignore
import Identicon from "identicon.js";
import { requestOtp, verifyOtp } from "../services/send_otp";

export const Dashboard: React.FC<{ background: string }> = ({ background }) => {
  const [user, setUser] = useState<User | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [smsOtpEnabled, setSmsOtpEnabled] = useState(false);
  const [phone, setPhone] = useState("+63");
  const [textColor, setTextColor] = useState("text-gray-800"); // default

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpStatus, setOtpStatus] = useState(""); // message for OTP status

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Background brightness detection
  useEffect(() => {
    if (!background) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = background;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, img.width, img.height);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;
      let r = 0,
        g = 0,
        b = 0;

      for (let i = 0; i < data.length; i += 4 * 100) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }

      const pixelCount = data.length / (4 * 100);
      const avg = (r + g + b) / (3 * pixelCount);
      setTextColor(avg < 128 ? "text-white" : "text-gray-800");
    };
  }, [background]);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  if (!user) return null;

  const hash = user.uid;
  const data = new Identicon(hash, 40).toString();
  const avatarSrc = `data:image/png;base64,${data}`;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith("+63")) val = "+63";
    val = "+63" + val.slice(3).replace(/\D/g, "");
    setPhone(val);
  };

  const sendOtp = async () => {
    try {
      setOtpStatus("Sending OTP...");
      await requestOtp(phone);
      setOtpSent(true);
      setOtpStatus("OTP sent successfully.");
    } catch (err) {
      console.error(err);
      setOtpStatus("Failed to send OTP.");
    }
  };

  const verifyOtpCode = async () => {
    try {
      setOtpStatus("Verifying OTP...");
      const verified = await verifyOtp(phone, otp);
      if (verified) {
        setOtpVerified(true);
        setOtpStatus("OTP verified successfully.");

        // Save phone and sms_otp status to Firestore
        if (user.uid) {
          await setDoc(
            doc(db, "users", user.uid),
            { phone, sms_otp: true }, // <- added sms_otp
            { merge: true },
          );
          setOtpStatus("Phone and SMS OTP enabled in your account.");
        }
      } else {
        setOtpVerified(false);
        setOtpStatus("Invalid OTP.");
      }
    } catch (err) {
      console.error(err);
      setOtpStatus("Failed to verify OTP.");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Top bar */}
      <div className="w-full bg-white shadow flex justify-end items-center p-4 relative">
        <div className="relative">
          <img
            src={avatarSrc}
            alt="Avatar"
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={() => setShowMenu(!showMenu)}
          />
          {showMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-lg shadow-lg z-10 flex flex-col">
              <button
                onClick={() => {
                  setShowSettings(true);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-200 rounded-t-lg"
              >
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white rounded-b-lg"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Center content */}
      <div className="flex-1 flex justify-center items-center relative">
        {background && (
          <img
            src={background}
            className="w-full h-full absolute top-0 left-0 -z-10 object-cover"
          />
        )}
        <h1 className={`text-5xl font-bold ${textColor}`}>
          Welcome, {user.displayName || user.email}!
        </h1>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 flex justify-center items-center z-20">
          {/* Glass backdrop */}
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

          {/* Modal content */}
          <div className="relative bg-white/50 backdrop-blur-md rounded-xl p-6 w-96 shadow-lg border border-white/30 z-10">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Settings
            </h2>

            {/* SMS OTP Toggle */}
            <div className="flex items-center mb-4">
              <label className="mr-2 font-medium text-gray-900">
                Enable SMS OTP
              </label>
              <input
                type="checkbox"
                checked={smsOtpEnabled}
                onChange={() => {
                  setSmsOtpEnabled(!smsOtpEnabled);
                  setOtp(""); // reset OTP
                  setOtpVerified(false);
                  setOtpStatus("");
                  setOtpSent(false);
                }}
              />
            </div>

            {smsOtpEnabled && (
              <>
                {/* Phone input */}
                <div className="flex flex-col gap-1 mb-4">
                  <label className="font-medium text-gray-900">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="px-4 py-2 border border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/30 backdrop-blur-sm"
                  />
                  <span className="text-sm text-gray-800">
                    Format: +63XXXXXXXXXX
                  </span>
                </div>

                {/* Send Verification */}
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={sendOtp}
                    className="px-4 py-2 bg-blue-600/80 text-white rounded-lg hover:bg-blue-700/80"
                  >
                    Send Verification
                  </button>
                </div>

                {/* OTP input */}
                {otpSent && (
                  <div className="flex flex-col gap-1 mb-2">
                    <label className="font-medium text-gray-900">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="px-4 py-2 border border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/30 backdrop-blur-sm"
                    />
                    <button
                      onClick={verifyOtpCode}
                      className="mt-2 px-4 py-2 bg-green-600/80 text-white rounded-lg hover:bg-green-700/80"
                    >
                      Verify OTP
                    </button>
                  </div>
                )}

                {/* OTP status message */}
                {otpStatus && (
                  <p className="text-sm text-gray-900 mt-2">{otpStatus}</p>
                )}
              </>
            )}

            {/* Modal buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-gray-300/70 rounded-lg hover:bg-gray-400/70"
              >
                Close
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className={`px-4 py-2 bg-blue-600/80 text-white rounded-lg hover:bg-blue-700/80 ${
                  smsOtpEnabled && !otpVerified
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={smsOtpEnabled && !otpVerified}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
