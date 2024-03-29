import React, { useState, useEffect } from 'react';
import { Navbar, Footer } from '../components/index';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc, collection, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database, storage} from '../utils/FirebaseConfig.js';
import { checkIfImage } from '../utils/index.js';
import AuthChecker from '../utils/handle.js';
import { useNavigate } from 'react-router-dom';
import { shortenAddress } from '../utils/index.js';
import swal from 'sweetalert';

const EditProfile = () => {
    const navigate = useNavigate();
    const [ user, setUser ] = useState(null);
    const [ blockchainId, setblockchainId] = useState(null);
    const [ course, setCourse ] = useState('');
    const [ department, setDepartment ] = useState('');
    const [ programLevel, setProgramLevel] = useState('');
    const [ name, setName ] = useState('');
    const [ picture, setPicture ] = useState('');
    const [ phone, setPhone ] = useState('');
    const [ editMode, setEditMode ] = useState(false);
    const [ imageUpload, setImageUpload ] = useState('');
    const [phoneValid, setPhoneValid] = useState(true);
    const [initialPhone, setInitialPhone] = useState('');
    const [ selectedCourses, setSelectedCourses ] = useState([]);


    const commonStyles = 'min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-[#8934eb] text-sm font-light text-white font-semibold';
    const departmentOptions = ['Artificial Intelligence', 'Computer System and Network', 'Information Systems', 'Software Engineering', 'Multimedia Computing', 'Data Science'];
    const programOptions = ['Bachelor', 'Master', 'PhD'];

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
                    setProgramLevel(userDocSnapshot.data().programLevel || '');
                    setName(userDocSnapshot.data().name || '');
                    setPicture(userDocSnapshot.data().picture || '');
                    setPhone(userDocSnapshot.data().phone || '');
                    setSelectedCourses(userDocSnapshot.data().selectedCourses || []);

                }
            } else {
                setUser(null);
                setblockchainId(null);
            }
        });

        return () => {
            unsubscribe();
        }
    }, []);

    const uploadFile = async (event) => {
        event.preventDefault(); 
        if (!imageUpload) return;
    
        try {
            const imageRef = ref(storage, `pictures/profiles/${imageUpload.name}`);
            const snapshot = await uploadBytes(imageRef, imageUpload);
            const url = await getDownloadURL(snapshot.ref);
    
            setPicture(url);
            swal({
                text: 'Picture saved succesfully',
              })
        } catch (error) {
            console.error('Error getting download URL:', error);
        }
    };
    

    const handleSave = async () => {
        try {
            if (phone.trim() !== "" &&  !/^[0-9]{10}$/.test(phone)) {
                setPhoneValid(false);
                return;
            }
            setPhoneValid(true);
            if (picture.trim() !== '') {
                checkIfImage(picture, (isValidImage) => {
                    if (isValidImage) {
                        updateProfile();
                    } else {
                        alert('Invalid image URL');
                    }
                });
            } else {
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
            await updateDoc(userDoc, {
                course: course,
                department: department,
                programLevel: programLevel,
                name: name,
                picture: picture,
                phone: phone,
            });
            setEditMode(false);
        } catch (error) {
            console.error('Error updating user information: ', error);
        }
    };

    const handleEdit = () => {
        setEditMode(true);
        setInitialPhone(phone);
    }

    const handleRegister = () => {
        navigate('/registration');
    }

    const handleCancel = () => {
        setEditMode(false);
        setPhone(initialPhone);
    }

    return(
        <div className="min-h-screen flex flex-col bg-[#13131a] min-h-screen">
             <Navbar/>
             <AuthChecker>
            <div className="justify-center flex-1 flex items-center">
            {user ? (
                    <div className='text-white font-epilogue text-center'>
                        {editMode ? (
                            <form>
                                <div className={`rounded-tl-2xl rounded-tr-2xl  ${commonStyles}`}>
                                        <div className={`text-white font-light text-base flex min-w-[500px] justify-center`} title={picture}>
                                            <p> <span style={{ marginRight: '20px' }}></span>
                                            <input
                                                type="file"
                                                onChange={(event) => {
                                                    setImageUpload(event.target.files[0]);
                                                }}
                                            />
                                            <button onClick = {uploadFile} className ="bg-[#8934eb] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#a834eb]"> Upload </button>
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`${commonStyles}`}>
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
                                        <div className={`text-white font-light text-base flex min-w-[500px] justify-center`} title={name}>
                                            <p> <span style={{ marginRight: '20px' }}>Name:</span>
                                            <input
                                                type="text"
                                                className="text-white px-2 rounded"
                                                placeholder="Name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                style = {{ backgroundColor: '#13131a', border: '2px solid black', height: '30px' }}
                                            />
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`  ${commonStyles}`}>
                                        <div className={`text-white font-light text-base flex min-w-[500px] justify-center`} title={department}>
                                            <p> <span style={{ marginRight: '20px' }}>Department:</span>
                                            <select
                                                className="text-white px-2 rounded"
                                                value={department}
                                                onChange={(e) => setDepartment(e.target.value)}
                                                style = {{ backgroundColor: '#13131a', border: '2px solid black', height: '30px' }}
                                            >
                                                <option value="" disabled>Select Department</option>
                                                {departmentOptions.map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                            </p>
                                        </div>
                                    </div>
                                <div className={`  ${commonStyles}`}>
                                        <div className={`text-white font-light text-base flex min-w-[500px] justify-center`} title={programLevel}>
                                            <p> <span style={{ marginRight: '20px' }}>Level of Study:</span>
                                            <select
                                                className="text-white border-black px-2 rounded"
                                                value={programLevel}
                                                onChange={(e) => setProgramLevel(e.target.value)}
                                                style = {{ backgroundColor: '#13131a', border: '2px solid black', height: '30px'  }}
                                            >
                                                <option value="" disabled>Select program level</option>
                                                {programOptions.map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                            </p>
                                        </div>
                                    </div>
                                    <div className={` rounded-br-2xl rounded-bl-2xl  ${commonStyles}`}>
                                        <div className={`text-white font-light text-base flex min-w-[500px] justify-center`} title={phone}>
                                            <p> <span style={{ marginRight: '20px' }}>Phone Number:</span>
                                            <input
                                                type="text"
                                                className="text-white border-black px-2 rounded"
                                                placeholder="e.g.(0123456789)"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                pattern="[0-9]{10}"
                                                style = {{ backgroundColor: '#13131a', border: '2px solid black', height: '30px' }}
                                            />
                                            </p>
                                        </div>
                                    </div>
                                    {editMode ? (
                                    !phoneValid && (
                                        <p className="text-red-500 text-sm mt-1">Please enter a valid phone number (10 digits)</p>
                                    )
                                ) : null}
                                
                                <br />
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
                            <div className='flex flex-col justify-left items-left'>
                                <div className="grid sm:grid-cols-1 grid-cols-1 w-full mt-10 min-w-[500px]">
                                <div className={`rounded-tl-2xl rounded-tr-2xl ${commonStyles}`}>
                                        <div className="text-white font-light text-base flex mt-5 mb-5 " title={picture}>
                                        {picture ? (
                                        <img
                                            src={picture}
                                            alt="no user image available"
                                            className="object-scale-down max-h-48 max-w-96"
                                        />
                                        ) : (
                                        <div>No profile picture uploaded</div>
                                        )}
                                        </div>
                                    </div>
                                    <div className={`${commonStyles}`}>
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
                                    <div className={`${commonStyles}`}>
                                        <div className={`text-white font-light text-base flex`} title={phone}>
                                            <p> <span style={{ marginRight: '20px' }}>Phone Number:</span>{phone !== "" ? phone : <span className="opacity-50">Please enter your phone number</span>} </p>
                                        </div>
                                    </div>
                                    <div className={` rounded-br-2xl rounded-bl-2xl ${commonStyles}`}>
                                    <div className={`text-white font-light text-base flex`} title={selectedCourses}>
                                            <div>
                                                <span>Taken Courses: </span>
                                                {selectedCourses.length > 0 ? (
                                                    <ul>
                                                        {selectedCourses.map((course, index) => (
                                                            <li key={index}>{course}</li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <span className="opacity-50">User has not taken any courses</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <button type="button" onClick={handleEdit} className ="bg-[#8934eb] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#a834eb]">
                                    Edit
                                </button>
                                <br/>
                                
                                <button
                                    type="button"
                                    onClick={handleRegister}
                                    className="bg-[#8934eb] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#a834eb]"
                                    style={{ display: selectedCourses && selectedCourses.some(course => course.trim() !== '') ? 'none' : 'block' }}
                                >
                                    Course Registration
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

export default EditProfile ;