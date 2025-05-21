import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Helper function to send requests to MT5 API
export const sendToMT5 = async (endpoint, data) => {
  try {
    const response = await axios.post(
      `${process.env.MT5_API_URL}/${endpoint}`,
      data,
      {
        headers: { Authorization: `Bearer ${process.env.MT5_API_KEY}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("MT5 API error:", error);
    throw new Error("MT5 API request failed");
  }
};

// Function to log user into MT5
export const loginToMT5 = async (userName, password) => {
  const mt5LoginData = {
    login: userName,
    password: password,
  };

  const result = await sendToMT5("user/login", mt5LoginData); // Adjust the endpoint
  if (result.status !== "success") {
    throw new Error(`MT5 login failed: ${result.message}`);
  }

  return result;
};
