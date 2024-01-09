import React, { useState, useEffect } from 'react';
import { Navbar, Footer } from '../components/index';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc, collection, updateDoc } from 'firebase/firestore';
import { useStateContext } from '../context/AttendanceContext.jsx'
import { database } from '../utils/FirebaseConfig.js';
import AuthChecker from '../utils/handle.js';
/*
const CourseList = () => {
    const { getCourses } = useStateContext();
    const [courses, setCourses] = useState([]);
  
    useEffect(() => {
      const fetchCourses = async () => {
        try {
          const fetchedCourses = await getCourses(userDepartment);
          setCourses(fetchedCourses);
        } catch (error) {
          console.error('Error fetching courses:', error);
        }
      };
  
      fetchCourses();
    }, [getCourses]);
  
    return (
      <div className="mt-8">
        <h2 className="text-white font-epilogue text-center font-semibold">List of Courses</h2>
        <ul className="list-disc list-inside">
          {courses.map((course) => (
            <li key={course.pId} className="text-white">
              {course.courseName}
            </li>
          ))}
        </ul>
      </div>
    );
  };*/
  
const Registration = () => {
    const [ user, setUser ] = useState(null);
    const [ blockchainId, setblockchainId] = useState(null);
    const [ department, setDepartment ] = useState('');
    const [ name, setName ] = useState('');
    const [ editMode, setEditMode ] = useState(false);
    const [ selectedCourse1, setSelectedCourse1 ] = useState('');
    const [ selectedCourse2, setSelectedCourse2 ] = useState('');
    const [ selectedCourse3, setSelectedCourse3 ] = useState('');
    const [courses, setCourses] = useState([]);

    const { getCourses } = useStateContext();

    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser){
                setUser(authUser);
                const usersCollection = collection(database, 'users');
                const userDoc = doc(usersCollection, authUser.uid);
                const userDocSnapshot = await getDoc(userDoc);
                if(userDocSnapshot.exists()) {
                    setblockchainId(userDocSnapshot.data().blockchainId);
                    setDepartment(userDocSnapshot.data().department || '');
                    setName(userDocSnapshot.data().name || '');
                }
            } else {
                setUser(null);
                setblockchainId(null);
            }
        });

        const fetchCourses = async () => {
            try {
              const userDepartmentCourses = getCourses(department);
              const multiDepartmentCourses = getCourses('multi');
  
              // Wait for both requests to complete
              const [userDepartmentCoursesData, multiDepartmentCoursesData] = await Promise.all([
                  userDepartmentCourses,
                  multiDepartmentCourses
              ]);
  
              // Combine the results
              const allCourses = [...userDepartmentCoursesData, ...multiDepartmentCoursesData];
  
              setCourses(allCourses);
              console.log(allCourses);
                console.log(courses);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();

        return () => {
            unsubscribe();
        }
    }, [getCourses, department]);
    
    const handleSave = async () => {
        try {
            updateProfile();
        } catch (error) {
            console.error('Error updating user information: ', error);
        }
    };

    const updateProfile = async () => {
        try {
            const usersCollection = collection(database, 'users');
            const userDoc = doc(usersCollection, user.uid);

            const existingUserData = (await getDoc(userDoc)).data();

            // Update selectedCourses array based on the index
            const updatedCourses = [
                selectedCourse1 || '',
                selectedCourse2 || '',
                selectedCourse3 || ''
            ];

            await updateDoc(userDoc, {
                selectedCourses: updatedCourses,
            });
            setEditMode(false);
            console.log('User information updated successfully');
        } catch (error) {
            console.error('Error updating user information: ', error);
        }
    };

    const handleEdit = () => {
        setEditMode(true);
    }

    const handleCancel = () => {
        setEditMode(false);
    }

    return(
        <div className="min-h-screen flex flex-col bg-[#13131a] min-h-screen">
             <Navbar/>
             <AuthChecker>
            <div className="justify-center flex-1 flex items-center">
            {user ? (
                    <div className='text-white font-epilogue text-center'>
                        <p>Blockchain ID: {blockchainId}</p>
                        <p>Email: {user.email}</p>
                        {editMode ? (
                        <form>
                        <p> Name: {name || 'Please edit'} </p>
                        <p> Department: {department || 'Please edit'} </p>
                        {/*<CourseList/>*/}
                            <br />
                        <label htmlFor="courseSelect" className="text-white font-epilogue mr-2">Select Course 1:</label>
                        <select
                          id="courseSelect"
                          name="courseSelect"
                          value={selectedCourse1}
                          onChange={(e) => setSelectedCourse1(e.target.value)}
                          className="rounded-md px-2 py-1 text-black"
                        >
                        <option value="" disabled>Select a course</option>
                        {courses.map((course) => (
                          <option key={course.pId} value={course.courseName}>
                            {course.courseName}
                          </option>
                        ))}
                      </select>
                      <br/>
                      <label htmlFor="courseSelect" className="text-white font-epilogue mr-2 ">Select Course 2:</label>
                        <select
                          id="courseSelect"
                          name="courseSelect"
                          value={selectedCourse2}
                          onChange={(e) => setSelectedCourse2(e.target.value)}
                          className="rounded-md px-2 py-1 text-black"
                        >
                        <option value="" disabled>Select a course</option>
                        {courses.map((course) => (
                          <option key={course.pId} value={course.courseName}>
                            {course.courseName}
                          </option>
                        ))}
                      </select>
                      <br/>
                      <label htmlFor="courseSelect" className="text-white font-epilogue mr-2">Select Course 3:</label>
                        <select
                          id="courseSelect"
                          name="courseSelect"
                          value={selectedCourse3}
                          onChange={(e) => setSelectedCourse3(e.target.value)}
                          className="rounded-md px-2 py-1 text-black"
                        >
                        <option value="" disabled>Select a course</option>
                        {courses.map((course) => (
                          <option key={course.pId} value={course.courseName}>
                            {course.courseName}
                          </option>
                        ))}
                      </select>
                      <br/>
                            <button type="button" onClick={handleSave}>
                                Save
                            </button>
                            <br/>
                            <button type="button" onClick={handleCancel}>
                                Cancel
                            </button>
                        </form>
                        ) : (
                            <div className='flex flex-col justify-center items-center'>
                                <p> Name: {name || 'Please edit'} </p>
                                <p> Department: {department || 'Please edit'} </p>
                                {/*<CourseList/>*/}
                                <br />
                                <button type="button" onClick={handleEdit} className ="bg-[#8934eb] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#a834eb]">
                                    Edit
                                </button>
                            </div>
                            
                        )}
                    </div>
                ) : (
                    <p className='text-white'>User is not signed in!</p>
                )}
            </div>
            </AuthChecker>
            <Footer/>
        </div>
    )
}

export default Registration ;