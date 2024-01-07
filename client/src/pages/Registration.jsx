import React, { useState, useEffect } from 'react';
import { Navbar, Footer } from '../components/index';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc, collection, updateDoc } from 'firebase/firestore';
import { useStateContext } from '../context/AttendanceContext.jsx'
import { database } from '../utils/FirebaseConfig.js';
import { checkIfImage } from '../utils/index.js';
import AuthChecker from '../utils/handle.js';

const CourseList = () => {
    const { getCourses } = useStateContext();
    const [courses, setCourses] = useState([]);
  
    useEffect(() => {
      const fetchCourses = async () => {
        try {
          const fetchedCourses = await getCourses();
          setCourses(fetchedCourses);
        } catch (error) {
          console.error('Error fetching courses:', error);
        }
      };
  
      fetchCourses();
    }, [getCourses]);
  
    return (
      <div className="mt-8">
        <h2 className="text-white text-2xl font-bold mb-4">List of Courses</h2>
        <ul className="list-disc list-inside">
          {courses.map((course) => (
            <li key={course.pId} className="text-white">
              {course.courseName}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
const Registration = () => {
    const [ user, setUser ] = useState(null);
    const [ blockchainId, setblockchainId] = useState(null);
    const [ course, setCourse ] = useState('');
    const [ department, setDepartment ] = useState('');
    const [ name, setName ] = useState('');
    const [ picture, setPicture ] = useState('');
    const [ phone, setPhone ] = useState('');
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
                    setCourse(userDocSnapshot.data().course || '');
                    setDepartment(userDocSnapshot.data().department || '');
                    setName(userDocSnapshot.data().name || '');
                    setPicture(userDocSnapshot.data().picture || '');
                    setPhone(userDocSnapshot.data().phone || '');
                }
            } else {
                setUser(null);
                setblockchainId(null);
            }
        });

        const fetchCourses = async () => {
            try {
                const fetchedCourses = await getCourses();
                setCourses(fetchedCourses);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();

        return () => {
            unsubscribe();
        }
    }, [getCourses]);

    const handleSave = async () => {
        try {
            // Check if the provided picture URL is not empty and is a valid image
            if (picture.trim() !== '') {
                checkIfImage(picture, (isValidImage) => {
                    if (isValidImage) {
                        updateProfile();
                    } else {
                        alert('Invalid image URL');
                        // Handle invalid image URL case (e.g., show an error message)
                    }
                });
            } else {
                // If picture URL is empty, update the profile without image check
                updateProfile();
            }
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
                course: course,
                department: department,
                name: name,
                picture: picture,
                phone: phone,
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
                    // If the user is signed in, display their information.
                    <div className='text-white font-epilogue text-center'>
                        <p>Blockchain ID: {blockchainId}</p>
                        <p>Email: {user.email}</p>
                        {/* Editable form for description and image */}
                        {editMode ? (
                            <form>
                                <label>
                                    Course:
                                    <input
                                        type="text"
                                        className="text-black"
                                        placeholder="course"
                                        value={course}
                                        onChange={(e) => setCourse(e.target.value)}
                                    />
                                </label>
                                <br/>
                                <label>
                                    Department:
                                    <input
                                        type="text"
                                        className="text-black"
                                        placeholder="Department"
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                    />
                                </label>
                                <br />
                                <label>
                                    Name:
                                    <input
                                        type="text"
                                        className="text-black"
                                        placeholder="Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </label>
                                <br />
                                 <label>
                                    Picture URL:
                                    <input
                                        type="text"
                                        className="text-black"
                                        placeholder="picture url"
                                        value={picture}
                                        onChange={(e) => setPicture(e.target.value)}
                                    />
                                </label>
                                <br/>
                                <label>
                                    Phone Number:
                                    <input
                                        type="text"
                                        className="text-black"
                                        placeholder="Phone Number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </label>
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
                      <label htmlFor="courseSelect" className="text-white font-epilogue mr-2">Select Course 2:</label>
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
                                <p> Course: {course || 'Please edit'} </p>
                                <p> Department: {department || 'Please edit'} </p>
                                <p> Phone Number: {phone || 'Please edit'} </p>
                                <p> Profile Picture: {picture && <img src={picture} alt="no user image available" className='object-scale-down h-48 w-96'/> || 'Please edit'} </p>
                                <br />
                                <button type="button" onClick={handleEdit} className ="bg-[#8934eb] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#a834eb]">
                                    Edit
                                </button>
                                <CourseList/>
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