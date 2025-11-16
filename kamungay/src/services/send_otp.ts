
import { api } from "./api_handler";

export const requestOtp = async (phone: string) => {
  try {
    const res = await api.post("/send-otp", { phone });
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to send OTP");
  }
};

export const verifyOtp = async (phone: string, otp: string) => {
  try {
    const res = await api.post("/verify-otp", { phone, otp });
    return res.data.success;
  } catch (err) {
    console.error(err);
    return false;
  }
};
