import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../App";

function OtpVerification() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Email passed from signup page
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ OTP Validation
  const validateOtp = () => {
    if (otp.trim().length !== 6) {
      toast.error("Please enter a 6-digit OTP!");
      return false;
    }
    return true;
  };

  // ✅ Handle Verify OTP
const handleOtpVerification = async () => {
  if (!validateOtp()) return;
  setLoading(true);
  try {
    const result = await axios.post(
      `${serverUrl}/api/auth/verifyotp`,
      { email, otp },
      { withCredentials: true }
    );

    dispatch(setUserData(result.data)); // ✅ Now userData is safe to store
    toast.success("OTP verified successfully!");
    navigate("/"); // or navigate("/login") if you want them to log in manually
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Invalid OTP");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Verify Your Email
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Please enter the 6-digit code sent to your email:{" "}
          <span className="font-semibold text-gray-800">{email}</span>
        </p>

        <form className="space-y-4" onSubmit={handleOtpVerification}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              OTP Code
            </label>
            <input
              type="text"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[black]"
              placeholder="Enter OTP here"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[black] hover:bg-[#4b4b4b] text-white py-2 px-4 rounded-md font-medium cursor-pointer"
            disabled={loading}
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Verify OTP"}
          </button>
        </form>

        <div
          className="text-sm text-center mt-4 text-gray-600 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </div>
      </div>
    </div>
  );
}

export default OtpVerification;
