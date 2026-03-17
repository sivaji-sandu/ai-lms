// // 
// import React from 'react';
// import { Navigate, Route, Routes } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { ToastContainer } from 'react-toastify';

// import Home from './pages/Home';
// import Login from './pages/Login';
// import SignUp from './pages/SignUp';
// import ForgotPassword from './pages/ForgotPassword';
// import Profile from './pages/Profile';
// import EditProfile from './pages/EditProfile';
// import Dashboard from './pages/admin/Dashboard';
// import Courses from './pages/admin/Courses';
// import AllCouses from './pages/AllCouses';
// import AddCourses from './pages/admin/AddCourses';
// import CreateCourse from './pages/admin/CreateCourse';
// import CreateLecture from './pages/admin/CreateLecture';
// import EditLecture from './pages/admin/EditLecture';
// import ViewCourse from './pages/ViewCourse';
// import ScrollToTop from './components/ScrollToTop';
// import EnrolledCourse from './pages/EnrolledCourse';
// import ViewLecture from './pages/ViewLecture';
// import SearchWithAi from './pages/SearchWithAi';

// import useCurrentUser from './customHooks/useCurrentUser';
// import useCourseData from './customHooks/useCourseData';
// import useCreatorCourseData from './customHooks/useCreatorCourseData';
// import useAllReviews from './customHooks/useAllReviews';

// export const serverUrl = "http://localhost:8000";

// function App() {
//   const { userData } = useSelector((state) => state.user);

//   // ✅ Correct usage — call hooks INSIDE the component
//   useCurrentUser();
//   useCourseData();
//   useCreatorCourseData();
//   useAllReviews();

//   return (
//     <>
//       <ToastContainer />
//       <ScrollToTop />

//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" />} />
//         <Route path="/profile" element={userData ? <Profile /> : <Navigate to="/signup" />} />
//         <Route path="/allcourses" element={userData ? <AllCouses /> : <Navigate to="/signup" />} />
//         <Route path="/viewcourse/:courseId" element={userData ? <ViewCourse /> : <Navigate to="/signup" />} />
//         <Route path="/editprofile" element={userData ? <EditProfile /> : <Navigate to="/signup" />} />
//         <Route path="/enrolledcourses" element={userData ? <EnrolledCourse /> : <Navigate to="/signup" />} />
//         <Route path="/viewlecture/:courseId" element={userData ? <ViewLecture /> : <Navigate to="/signup" />} />
//         <Route path="/searchwithai" element={userData ? <SearchWithAi /> : <Navigate to="/signup" />} />

//         <Route path="/dashboard" element={userData?.role === "educator" ? <Dashboard /> : <Navigate to="/signup" />} />
//         <Route path="/courses" element={userData?.role === "educator" ? <Courses /> : <Navigate to="/signup" />} />
//         <Route path="/addcourses/:courseId" element={userData?.role === "educator" ? <AddCourses /> : <Navigate to="/signup" />} />
//         <Route path="/createcourses" element={userData?.role === "educator" ? <CreateCourse /> : <Navigate to="/signup" />} />
//         <Route path="/createlecture/:courseId" element={userData?.role === "educator" ? <CreateLecture /> : <Navigate to="/signup" />} />
//         <Route path="/editlecture/:courseId/:lectureId" element={userData?.role === "educator" ? <EditLecture /> : <Navigate to="/signup" />} />
//         <Route path="/forgotpassword" element={<ForgotPassword />} />
//       </Routes>
//     </>
//   );
// }

// export default App;

import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { ToastContainer } from 'react-toastify'
import ForgotPassword from './pages/ForgotPassword'
import { useSelector } from 'react-redux'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Dashboard from './pages/admin/Dashboard'
import Courses from './pages/admin/Courses'
import AllCouses from './pages/AllCouses'
import AddCourses from './pages/admin/AddCourses'
import CreateCourse from './pages/admin/CreateCourse'
import CreateLecture from './pages/admin/CreateLecture'
import EditLecture from './pages/admin/EditLecture'
import ViewCourse from './pages/ViewCourse'
import ScrollToTop from './components/ScrollToTop'
import EnrolledCourse from './pages/EnrolledCourse'
import ViewLecture from './pages/ViewLecture'
import SearchWithAi from './pages/SearchWithAi'

// ✅ renamed hook imports (assuming you kept same file names)
import useCurrentUser from './customHooks/getCurrentUser'
import useCouseData from './customHooks/getCouseData'
import useCreatorCourseData from './customHooks/getCreatorCourseData'
import useAllReviews from './customHooks/getAllReviews'
import OtpVerification from './pages/OtpVerification'

export const serverUrl = "http://localhost:8000"

function App() {
  const { userData } = useSelector((state) => state.user)

  // ✅ correct way to use hooks
  useCurrentUser()
  useCouseData()
  useCreatorCourseData()
  useAllReviews()

  return (
    <>
      <ToastContainer />
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to='/' />} />
        <Route path='/profile' element={userData ? <Profile /> : <Navigate to='/signup' />} />
        <Route path='/allcourses' element={userData ? <AllCouses /> : <Navigate to='/signup' />} />
        <Route path='/viewcourse/:courseId' element={userData ? <ViewCourse /> : <Navigate to='/signup' />} />
        <Route path='/editprofile' element={userData ? <EditProfile /> : <Navigate to='/signup' />} />
        <Route path='/enrolledcourses' element={userData ? <EnrolledCourse /> : <Navigate to='/signup' />} />
        <Route path='/viewlecture/:courseId' element={userData ? <ViewLecture /> : <Navigate to='/signup' />} />
        <Route path='/searchwithai' element={userData ? <SearchWithAi /> : <Navigate to='/signup' />} />

        <Route path='/dashboard' element={userData?.role === "educator" ? <Dashboard /> : <Navigate to='/signup' />} />
        <Route path='/courses' element={userData?.role === "educator" ? <Courses /> : <Navigate to='/signup' />} />
        <Route path='/addcourses/:courseId' element={userData?.role === "educator" ? <AddCourses /> : <Navigate to='/signup' />} />
        <Route path='/createcourses' element={userData?.role === "educator" ? <CreateCourse /> : <Navigate to='/signup' />} />
        <Route path='/createlecture/:courseId' element={userData?.role === "educator" ? <CreateLecture /> : <Navigate to='/signup' />} />
        <Route path='/editlecture/:courseId/:lectureId' element={userData?.role === "educator" ? <EditLecture /> : <Navigate to='/signup' />} />
        <Route path='/verifyotp' element={<OtpVerification/>}/>
        <Route path='/forgotpassword' element={<ForgotPassword />} />
      </Routes>
    </>
  )
}

export default App
