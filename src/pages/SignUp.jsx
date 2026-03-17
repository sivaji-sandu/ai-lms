import React, { useState } from 'react';
import logo from '../logo1.jpg';
import axios from 'axios';
import { serverUrl } from '../App';
import { MdOutlineRemoveRedEye, MdRemoveRedEye } from "react-icons/md";
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function SignUp() {
  const [step, setStep] = useState('signup'); // 'signup' | 'otp'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Validate Signup Inputs
  const validateInputs = () => {
    if (!email.trim() || !password.trim() || !name.trim()) {
      toast.error("Please fill in all fields!");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address!");
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      toast.error("Password must contain at least 6 characters, one uppercase letter, one lowercase letter, and one digit!");
      return false;
    }
    return true;
  };

  // Signup Handler
  const handleSignUp = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password, role },
        { withCredentials: true }
      );

      // Do NOT dispatch user data yet
      toast.success("OTP sent successfully!");
      setStep('otp'); // Show OTP input UI
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  //  Validate OTP
  const validateOtp = () => {
    if (otp.trim().length !== 6) {
      toast.error("Please enter a 6-digit OTP!");
      return false;
    }
    return true;
  };

  // Verify OTP Handler
  const handleOtpVerification = async (e) => {
    e.preventDefault();
    if (!validateOtp()) return;
    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/verifyotp`,
        { email, otp },
        { withCredentials: true }
      );

      // Now set user data only after OTP is verified
      dispatch(setUserData(result.data.user));
      toast.success(result.data.message || "OTP verified successfully!");

      // Redirect to home or login
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "OTP verification failed. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center flex-col gap-3">
      <div className="w-[90%] md:w-200 h-150 bg-white shadow-xl rounded-2xl flex flex-col md:flex-row">

        {/* Left Section */}
        <div className="md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3">
          {step === 'signup' ? (
            <>
              <div>
                <h1 className="font-semibold text-black text-2xl">Let's get Started</h1>
                <h2 className="text-[#999797] text-[18px]">Create your account</h2>
              </div>

              <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3">
                <label className="font-semibold">Name</label>
                <input type="text" className="border w-full h-[35px] border-[#e7e6e6] text-[15px] px-[20px]" placeholder="Your name"
                  value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3">
                <label className="font-semibold">Email</label>
                <input type="text" className="border w-full h-[35px] border-[#e7e6e6] text-[15px] px-[20px]" placeholder="Your email"
                  value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3 relative">
                <label className="font-semibold">Password</label>
                <input type={show ? "text" : "password"} className="border w-full h-[35px] border-[#e7e6e6] text-[15px] px-[20px]"
                  placeholder="***********" value={password} onChange={(e) => setPassword(e.target.value)} />
                {!show ? (
                  <MdOutlineRemoveRedEye className="absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]" onClick={() => setShow(true)} />
                ) : (
                  <MdRemoveRedEye className="absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]" onClick={() => setShow(false)} />
                )}
              </div>

              <div className="flex md:w-[50%] w-[70%] items-center justify-between">
                <span className={`px-[10px] py-[5px] border rounded-2xl cursor-pointer ${role === 'student' ? "border-black" : "border-[#646464]"}`} onClick={() => setRole("student")}>Student</span>
                <span className={`px-[10px] py-[5px] border rounded-2xl cursor-pointer ${role === 'educator' ? "border-black" : "border-[#646464]"}`} onClick={() => setRole("educator")}>Educator</span>
              </div>

              <button className="w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-[5px]"
                disabled={loading} onClick={handleSignUp}>
                {loading ? <ClipLoader size={30} color="white" /> : "GET OTP"}
              </button>

              <div className="text-[#6f6f6f]">
                Already have an account?{" "}
                <span className="underline text-black cursor-pointer" onClick={() => navigate("/login")}>Login</span>
              </div>
            </>
          ) : (
            // ✅ OTP Verification Section
            <form onSubmit={handleOtpVerification} className="w-[80%] flex flex-col items-center gap-4">
              <h1 className="font-semibold text-2xl text-gray-800">Verify Your Email</h1>
              <p className="text-sm text-gray-500 text-center">
                Please enter the 6-digit OTP sent to <b>{email}</b>
              </p>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-black"
                placeholder="Enter OTP here"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-700 text-white py-2 px-4 rounded-md font-medium"
                disabled={loading}
              >
                {loading ? <ClipLoader size={30} color="white" /> : "Verify OTP"}
              </button>
              <div
                className="text-sm text-center mt-2 text-gray-600 cursor-pointer"
                onClick={() => setStep('signup')}
              >
                Back to Sign Up
              </div>
            </form>
          )}
        </div>

        {/* Right Section */}
        <div className="w-[50%] h-[100%] rounded-r-2xl bg-black md:flex items-center justify-center flex-col hidden">
          <img src={logo} className="w-30 shadow-2xl" alt="logo" />
          <span className="text-white text-2xl">LEARNING</span>
          <span className="text-white text-2xl">MANAGEMENT</span>
          <span className="text-white text-2xl">SYSTEM</span>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
