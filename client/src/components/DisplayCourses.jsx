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
  const [ isLoading, setIsLoading ] = useState(false);; // Set initial loading state
  const [ courses, setCourses ] = useState([]); // Initialize aides as an empty array
  const [ userDepartment, setUserDepartment ] = useState([]);
  const [ takenCourses, setTakenCourses ] = useState([]);

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
              setTakenCourses(userData.selectedCourses);
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
      setIsLoading(true);
  
      const fetchCoursesForDepartment = getCourses(userDepartment, takenCourses);
      const fetchCoursesForMulti = getCourses('multi', takenCourses);
  
      Promise.all([fetchCoursesForDepartment, fetchCoursesForMulti])
        .then(([parsedCoursesDepartment, parsedCoursesMulti]) => {
          // Combine courses from both departments
          const combinedCourses = [...parsedCoursesDepartment, ...parsedCoursesMulti];
          setCourses(combinedCourses);
        })
        .catch((error) => {
          console.error('Failed to fetch courses:', error);
        })
        .finally(() => {
          setIsLoading(false); // Set loading state to false when courses are fetched (or on error)
        });
    }
  }, [userDepartment, takenCourses]);

  const getCourses = async (userDepartment, courseNames) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const signer = provider.getSigner();
    const contractWithSigner = contract.connect(signer);
    const courses = await contractWithSigner.getCourses(userDepartment); //needs to pass user department

    const parsedCourses = courses.map((course, i) => ({
      lecturer: course.lecturer,
      courseName: course.courseName,
      description: course.description,
      department: course.department,
      startTime: course.startTime,
      endTime: course.endTime,
      image: course.image,
      pId: i,
    }));
    console.log(parsedCourses);
    const filteredCourses = parsedCourses.filter( course => courseNames.includes(course.courseName));

    console.log(filteredCourses);
    return filteredCourses;
  };
  /*
  const getBlockTime = async() => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const signer = provider.getSigner();
    const contractWithSigner = contract.connect(signer);
    const blockTime = await contractWithSigner.getBlockTime();
    return blockTime;
  }*/

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
