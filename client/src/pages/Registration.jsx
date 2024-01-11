import React, { useState, useEffect } from 'react';
import { Navbar, Footer } from '../components/index';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc, collection, updateDoc } from 'firebase/firestore';
import { useStateContext } from '../context/AttendanceContext.jsx'
import { database } from '../utils/FirebaseConfig.js';
import AuthChecker from '../utils/handle.js';
import RegisterCheck from '../utils/registerCheck.js';
import { shortenAddress } from '../utils/index.js';
import swal from 'sweetalert';

const commonStyles = 'min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-[#8934eb] text-sm font-light text-white font-semibold';
  
const Registration = () => {
    const navigate = useNavigate();
    const [ user, setUser ] = useState(null);
    const [ blockchainId, setblockchainId] = useState(null);
    const [ department, setDepartment ] = useState('');
    const [ programLevel, setProgramLevel ] = useState('');
    const [ name, setName ] = useState('');
    const [ editMode, setEditMode ] = useState(false);
    const [ selectedCourse1, setSelectedCourse1 ] = useState('');
    const [ selectedCourse2, setSelectedCourse2 ] = useState('');
    const [ selectedCourse3, setSelectedCourse3 ] = useState('');
    const [ selectedCourse4, setSelectedCourse4 ] = useState('');
    const [ selectedCourse5, setSelectedCourse5 ] = useState('');
    const [ selectedCourse6, setSelectedCourse6 ] = useState('');
    const [ selectedCourse7, setSelectedCourse7 ] = useState('');
    const [ selectedCourse8, setSelectedCourse8 ] = useState('');
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
                    setProgramLevel(userDocSnapshot.data().programLevel || '');
                    setName(userDocSnapshot.data().name || '');
                }
            } else {
                setUser(null);
                setblockchainId(null);
            }
        });

        const fetchCourses = async () => {
            try {
              const userDepartmentCourses = getCourses(department, programLevel);
              const multiDepartmentCourses = getCourses('All', programLevel);
  
              // Wait for both requests to complete
              const [userDepartmentCoursesData, multiDepartmentCoursesData ] = await Promise.all([
                  userDepartmentCourses,
                  multiDepartmentCourses,
              ]);
  
              // Combine the results
              const allCourses = [...userDepartmentCoursesData, ...multiDepartmentCoursesData ];
  
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
    }, [getCourses, department, programLevel]);
    
    const handleSave = () => {
      swal({
        text: 'Once saved, you cannot undo this action.',
        buttons: ['Back', 'Proceed'],
        dangerMode: true,
      }).then((proceed) => {
        if (proceed) {
          updateProfile();
        } 
      });
    };

    const updateProfile = async () => {
        try {
            const usersCollection = collection(database, 'users');
            const userDoc = doc(usersCollection, user.uid);

            const existingUserData = (await getDoc(userDoc)).data();

            const updatedCourses = [
                selectedCourse1 || '',
                selectedCourse2 || '',
                selectedCourse3 || '',
                selectedCourse4 || '',
                selectedCourse5 || '',
                selectedCourse6 || '',
                selectedCourse7 || '',
                selectedCourse8 || '',
            ];

            await updateDoc(userDoc, {
                selectedCourses: updatedCourses,
            });
            setEditMode(false);
            console.log('User information updated successfully');
            navigate('/home');
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
            <RegisterCheck/>
             <Navbar/>
             <AuthChecker>
            <div className="justify-center flex-1 flex items-center">
            {user ? (
                    <div className='text-white font-epilogue text-center'>
                        {editMode ? (
                        <form>
                        <div className='flex flex-col justify-center items-center'>
                              <div className="grid sm:grid-cols-1 grid-cols-1 w-full mt-10 min-w-[500px]">
                              <div className={`rounded-tr-2xl rounded-tl-2xl ${commonStyles}`}>
                                        <div className="text-white font-light text-base flex " title={blockchainId}>
                                            <p> <span style={{ marginRight: '20px' }}>Blockchain ID:</span>{blockchainId !== null ? shortenAddress(blockchainId.toString()) : 'Loading...'}</p>
                                        </div>
                                    </div>
                                    <div className={`${commonStyles}`}>
                                        <div className="text-white font-light text-base flex " title={user.email}>
                                            <p> <span style={{ marginRight: '20px' }}>Email Address:</span>{user.email !== null ? user.email : 'Loading...'} </p>
                                        </div>
                                    </div>
                                    <div className={`  ${commonStyles}`}>
                                        <div className={`text-white font-light text-base flex`} title={name}>
                                            <p> <span style={{ marginRight: '20px' }}>Name:</span>{name !== "" ? name : <span className="opacity-50">Please enter your name</span>} </p>
                                        </div>
                                    </div>
                                <div className={`  ${commonStyles}`}>
                                        <div className={`text-white font-light text-base flex`} title={department}>
                                            <p> <span style={{ marginRight: '20px' }}>Department:</span>{department !== "" ? department : <span className="opacity-50">Please select your department</span>} </p>
                                        </div>
                                    </div>
                                    <div className={` ${commonStyles}`}>
                                        <div className={`text-white font-light text-base flex`} title={programLevel}>
                                            <p> <span style={{ marginRight: '20px' }}>Level of Study:</span>{programLevel !== "" ? programLevel : <span className="opacity-50">Please select your level of study</span>} </p>
                                        </div>
                                    </div>
                                    </div>
                                    </div>
                        {/*<CourseList/>*/}
                            <div className={`  ${commonStyles}`}>
                                        <div className={`text-white font-light text-base flex min-w-[500px] justify-center`} title={selectedCourse1}>
                                            <p> <span style={{ marginRight: '20px' }}>Select Course 1:</span>
                                            <select
                                                className="text-black"
                                                value={selectedCourse1}
                                                onChange={(e) => {
                                                  const selectedValue = e.target.value;
                                                  // Filter out the selected course from other dropdowns
                                                  setSelectedCourse1(selectedValue);
                                                  setSelectedCourse2(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse3(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse4(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse5(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse6(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse7(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse8(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                              }}
                                            >
                                                <option value="" disabled>Select Course 1</option>
                                                {courses.map((course) => (
                                                    <option key={course.pId} value={course.courseName}>
                                                        {course.courseName}
                                                    </option>
                                                ))}
                                            </select>
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`  ${commonStyles}`}>
                                        <div className={`text-white font-light text-base flex min-w-[500px] justify-center`} title={selectedCourse2}>
                                            <p> <span style={{ marginRight: '20px' }}>Select Course 2:</span>
                                            <select
                                                className="text-black"
                                                value={selectedCourse2}
                                                onChange={(e) => {
                                                  const selectedValue = e.target.value;
                                                  // Filter out the selected course from other dropdowns
                                                  setSelectedCourse1(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse2(selectedValue);
                                                  setSelectedCourse3(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse4(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse5(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse6(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse7(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse8(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                              }}
                                            >
                                                <option value="" disabled>Select Course 2</option>
                                                {courses.map((course) => (
                                                    <option key={course.pId} value={course.courseName}>
                                                        {course.courseName}
                                                    </option>
                                                ))}
                                            </select>
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`  ${commonStyles}`}>
                                        <div className={`text-white font-light text-base flex min-w-[500px] justify-center`} title={selectedCourse3}>
                                            <p> <span style={{ marginRight: '20px' }}>Select Course 3:</span>
                                            <select
                                                className="text-black"
                                                value={selectedCourse3}
                                                onChange={(e) => {
                                                  const selectedValue = e.target.value;
                                                  // Filter out the selected course from other dropdowns
                                                  setSelectedCourse1(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse2(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse3(selectedValue);
                                                  setSelectedCourse4(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse5(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse6(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse7(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse8(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                              }}
                                            >
                                                <option value="" disabled>Select Course 3</option>
                                                {courses.map((course) => (
                                                    <option key={course.pId} value={course.courseName}>
                                                        {course.courseName}
                                                    </option>
                                                ))}
                                            </select>
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`  ${commonStyles}`}>
                                        <div className={`text-white font-light text-base flex min-w-[500px] justify-center`} title={selectedCourse4}>
                                            <p> <span style={{ marginRight: '20px' }}>Select Course 4:</span>
                                            <select
                                                className="text-black"
                                                value={selectedCourse4}
                                                onChange={(e) => {
                                                  const selectedValue = e.target.value;
                                                  // Filter out the selected course from other dropdowns
                                                  setSelectedCourse1(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse2(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse3(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse4(selectedValue);
                                                  setSelectedCourse5(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse6(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse7(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse8(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                              }}
                                            >
                                                <option value="" disabled>Select Course 4</option>
                                                {courses.map((course) => (
                                                    <option key={course.pId} value={course.courseName}>
                                                        {course.courseName}
                                                    </option>
                                                ))}
                                            </select>
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`  ${commonStyles}`}>
                                        <div className={`text-white font-light text-base flex min-w-[500px] justify-center`} title={selectedCourse5}>
                                            <p> <span style={{ marginRight: '20px' }}>Select Course 5:</span>
                                            <select
                                                className="text-black"
                                                value={selectedCourse5}
                                                onChange={(e) => {
                                                  const selectedValue = e.target.value;
                                                  setSelectedCourse1(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse2(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse3(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse4(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse5(selectedValue);
                                                  setSelectedCourse6(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse7(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse8(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                              }}
                                            >
                                                <option value="" disabled>Select Course 5</option>
                                                {courses.map((course) => (
                                                    <option key={course.pId} value={course.courseName}>
                                                        {course.courseName}
                                                    </option>
                                                ))}
                                            </select>
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`  ${commonStyles}`}>
                                        <div className={`text-white font-light text-base flex min-w-[500px] justify-center`} title={selectedCourse6}>
                                            <p> <span style={{ marginRight: '20px' }}>Select Course 6:</span>
                                            <select
                                                className="text-black"
                                                value={selectedCourse6}
                                                onChange={(e) => {
                                                  const selectedValue = e.target.value;
                                                  setSelectedCourse1(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse2(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse3(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse4(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse5(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse6(selectedValue);
                                                  setSelectedCourse7(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse8(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                              }}
                                            >
                                                <option value="" disabled>Select Course 6</option>
                                                {courses.map((course) => (
                                                    <option key={course.pId} value={course.courseName}>
                                                        {course.courseName}
                                                    </option>
                                                ))}
                                            </select>
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`  ${commonStyles}`}>
                                        <div className={`text-white font-light text-base flex min-w-[500px] justify-center`} title={selectedCourse7}>
                                            <p> <span style={{ marginRight: '20px' }}>Select Course 7:</span>
                                            <select
                                                className="text-black"
                                                value={selectedCourse7}
                                                onChange={(e) => {
                                                  const selectedValue = e.target.value;
                                                  setSelectedCourse1(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse2(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse3(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse4(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse5(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse6(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse7(selectedValue);
                                                  setSelectedCourse8(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                              }}
                                            >
                                                <option value="" disabled>Select Course 7</option>
                                                {courses.map((course) => (
                                                    <option key={course.pId} value={course.courseName}>
                                                        {course.courseName}
                                                    </option>
                                                ))}
                                            </select>
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`rounded-br-2xl rounded-bl-2xl ${commonStyles}`}>
                                        <div className={`text-white font-light text-base flex min-w-[500px] justify-center`} title={selectedCourse8}>
                                            <p> <span style={{ marginRight: '20px' }}>Select Course 8:</span>
                                            <select
                                                className="text-black"
                                                value={selectedCourse8}
                                                onChange={(e) => {
                                                  const selectedValue = e.target.value;
                                                  setSelectedCourse1(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse2(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse3(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse4(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse5(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse6(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse7(prevCourse => (prevCourse === selectedValue ? '' : prevCourse));
                                                  setSelectedCourse8(selectedValue);
                                              }}
                                            >
                                                <option value="" disabled>Select Course 8</option>
                                                {courses.map((course) => (
                                                    <option key={course.pId} value={course.courseName}>
                                                        {course.courseName}
                                                    </option>
                                                ))}
                                            </select>
                                            </p>
                                        </div>
                                    </div>
                        <br/>
                          <button type="button" onClick={handleSave} className ="bg-[#8934eb] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#a834eb] min-w-[500px]">
                                    Save
                                </button>
                                <br/>
                                <br/>
                                <button type="button" onClick={handleCancel} className ="bg-[#8934eb] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#a834eb] min-w-[500px]">
                                    Cancel
                                </button>
                        </form>
                        ) : (
                            <div className='flex flex-col justify-center items-center'>
                              <div className="grid sm:grid-cols-1 grid-cols-1 w-full mt-10 min-w-[500px]">
                              <div className={`rounded-tr-2xl rounded-tl-2xl ${commonStyles}`}>
                                        <div className="text-white font-light text-base flex " title={blockchainId}>
                                            <p> <span style={{ marginRight: '20px' }}>Blockchain ID:</span>{blockchainId !== null ? shortenAddress(blockchainId.toString()) : 'Loading...'}</p>
                                        </div>
                                    </div>
                                    <div className={`${commonStyles}`}>
                                        <div className="text-white font-light text-base flex " title={user.email}>
                                            <p> <span style={{ marginRight: '20px' }}>Email Address:</span>{user.email !== null ? user.email : 'Loading...'} </p>
                                        </div>
                                    </div>
                                    <div className={`  ${commonStyles}`}>
                                        <div className={`text-white font-light text-base flex`} title={name}>
                                            <p> <span style={{ marginRight: '20px' }}>Name:</span>{name !== "" ? name : <span className="opacity-50">Please enter your name</span>} </p>
                                        </div>
                                    </div>
                                <div className={`  ${commonStyles}`}>
                                        <div className={`text-white font-light text-base flex`} title={department}>
                                            <p> <span style={{ marginRight: '20px' }}>Department:</span>{department !== "" ? department : <span className="opacity-50">Please select your department</span>} </p>
                                        </div>
                                    </div>
                                    <div className={`rounded-br-2xl rounded-bl-2xl  ${commonStyles}`}>
                                        <div className={`text-white font-light text-base flex`} title={programLevel}>
                                            <p> <span style={{ marginRight: '20px' }}>Level of Study:</span>{programLevel !== "" ? programLevel : <span className="opacity-50">Please select your level of study</span>} </p>
                                        </div>
                                    </div>
                                    </div>
                                    {/* display course list here */}
                                    <br/>
                                    <div className={`rounded-tr-2xl rounded-tl-2xl w-[500px] ${commonStyles}`}>
                                      List of Courses
                                      </div>
                                    <div className={`rounded-br-2xl rounded-bl-2xl w-[500px] ${commonStyles}`}>
                                        <ul className="list-disc list-inside">
                                            {courses.map((course) => (
                                                <li key={course.pId} className="text-white">
                                                    {course.courseName}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                <br />
                                <button type="button" onClick={handleEdit} className ="bg-[#8934eb] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#a834eb] min-w-[500px]">
                                    Select Courses
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