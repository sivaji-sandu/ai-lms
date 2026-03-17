import React, { useState, useEffect }  from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { serverUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";

function EnrolledCourse() {
 const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  
  const [courses, setCourses] = useState([]);

  const getEnrolledCourseDetails = async () => {
    try {
      const allCourses = await Promise.all(
        userData.enrolledCourses.map(async (id) => {
          const response = await axios.get(
            `${serverUrl}/api/course/getcourse/${id}`,
            { withCredentials: true }
          );
          return response.data;
        })
      );
      setCourses(allCourses);
      console.log(allCourses);
    } catch (error) {
      console.error("Error fetching enrolled course details:", error);
    }
  };

  useEffect(() => {
    getEnrolledCourseDetails();
  }, [userData]);


  return (
    <div className="min-h-screen w-full px-4 py-9 bg-gray-50">
      

      <FaArrowLeftLong  className='absolute top-[3%] md:top-[6%] left-[5%] w-[22px] h-[22px] cursor-pointer' onClick={()=>navigate("/")}/>
      <h1 className="text-3xl text-center font-bold text-gray-800 mb-6  ">
          
      </h1>

      {courses.length === 0 ? (
        <p className="text-gray-500 text-center w-full">You haven’t enrolled in any course yet.</p>
      ) : (
        <div className="flex items-center justify-center flex-wrap gap-[30px]">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden border"
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">{course.title}</h2>
                <p className="text-sm text-gray-600 mb-2">{course.category}</p>
                <p className="text-sm text-gray-700">{course.level}</p>
                <h1 className='px-[10px] text-center  py-[10px] border-2  bg-black border-black text-white  rounded-[10px] text-[15px] font-light flex items-center justify-center gap-2 cursor-pointer mt-[10px] hover:bg-gray-600' onClick={()=>navigate(`/viewlecture/${course._id}`)}>Watch Now</h1>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EnrolledCourse   