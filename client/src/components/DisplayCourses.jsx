import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading, CourseCard } from '../components/index.js';
import { contractABI, contractAddress } from '../utils/constants/attendanceConstant.js';
import { ethers } from 'ethers';
import { v4 as uuidv4 } from "uuid";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getFirestore, getDoc } from 'firebase/firestore';

const { ethereum } = window;

const DisplayCourses= ({ title }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // Set initial loading state
  const [courses, setCourses] = useState([]); // Initialize aides as an empty array
  const [userDepartment, setUserDepartment ] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const firestore = getFirestore();
          const userDocRef = doc(firestore, 'users', user.uid);
          
          try {
            const userDocSnapshot = await getDoc(userDocRef);
            if (userDocSnapshot.exists()) {
              const userData = userDocSnapshot.data();
              setUserDepartment(userData.department);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
      });
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Fetch courses when userDepartment changes
    if (userDepartment !== null) {
      getCourses(userDepartment)
        .then((parsedCourses) => {
          setCourses(parsedCourses);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch courses:', error);
          setIsLoading(false);
        });
    }
  }, [userDepartment]);

  const getCourses = async (userDepartment) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const provider = new ethers.providers.Web3Provider(ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const signer = provider.getSigner();
    const contractWithSigner = contract.connect(signer);
    const courses = await contractWithSigner.getCourses(userDepartment); //needs to pass user department

    const parsedCourses = courses.map((course, i) => ({
      lecturer: course.leturer,
      courseName: course.courseName,
      description: course.description,
      department: course.department,
      startTime: course.startTime,
      endTime: course.endTime,
      date: course.date,
      image: course.image,
      pId: i,
    }));
    return parsedCourses;
  };

  const handleNavigate = (course) => {
    navigate(`/attendance/${course.courseName}`, {state : course})
  }
    
  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        {title} ({courses.length})
      </h1>
  
      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <Loading />
        )}
        {!isLoading && courses.length === 0 && (
          <p className="font-epilogue dont-semibold text-[14px] leading-[30px] text-[#818183]">
            You have not created any courses yet.
          </p>
        )}

        {!isLoading && courses.length > 0 && courses.map((course) => <CourseCard 
          key={uuidv4()}
          {...course}
          handleClick = {() => handleNavigate(course)}
        />)}
      </div>
    </div>
  );
};

export default DisplayCourses;
