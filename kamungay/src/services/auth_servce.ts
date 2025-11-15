import { api } from "./api_handler";

interface SignUpData {
  username: string;
  email: string;
  phone: string;
  password: string;
}

export const handleSignup = async (data: SignUpData) => {
  try {
    const res = await api.post("/signup", data)
    if (res.data) {
      return res.data
    }
  }
  catch (e) {
    throw new Error("Error sign up")
    return false
  }
}
