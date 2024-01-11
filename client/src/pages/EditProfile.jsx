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
    const [ selectedCourses, setSelectedCourses ] = useState('');

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
                    setSelectedCourses(userDocSnapshot.data().selectedCourses);
                }
            } else {
                setUser(null);
                setblockchainId(null);
            }
        });

        return () => {
            unsubscribe();
        }
    }, [selectedCourses]);

    const uploadFile = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        if (!imageUpload) return;
    
        try {
            const imageRef = ref(storage, `pictures/profiles/${imageUpload.name}`);
            const snapshot = await uploadBytes(imageRef, imageUpload);
            const url = await getDownloadURL(snapshot.ref);
    
            console.log('Uploaded image URL:', url);
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
            await updateDoc(userDoc, {
                course: course,
                department: department,
                programLevel: programLevel,
                name: name,
                picture: picture,
                phone: phone,
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

    const handleRegister = () => {
        navigate('/registration');
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
                        {/* Editable form for description and image */}
                        {editMode ? (
                            <form>
                                <div className={`rounded-tl-2xl rounded-tr-2xl  ${commonStyles}`}>
                                        <p className={`text-white font-light text-base flex min-w-[500px] justify-center`} title={picture}>
                                            <p> <span style={{ marginRight: '20px' }}></span>
                                            <input
                                                type="file"
                                                onChange={(event) => {
                                                    setImageUpload(event.target.files[0]);
                                                }}
                                            />
                                            <button onClick = {uploadFile} className ="bg-[#8934eb] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#a834eb]"> Upload </button>
                                            </p>
                                        </p>
                                    </div>
                                    <div className={`${commonStyles}`}>
                                        <p className="text-white font-light text-base flex " title={blockchainId}>
                                            <p> <span style={{ marginRight: '20px' }}>Blockchain ID:</span>{blockchainId !== null ? shortenAddress(blockchainId.toString()) : 'Loading...'}</p>
                                        </p>
                                    </div>
                                    <div className={`${commonStyles}`}>
                                        <p className="text-white font-light text-base flex " title={user.email}>
                                            <p> <span style={{ marginRight: '20px' }}>Email Address:</span>{user.email !== null ? user.email : 'Loading...'} </p>
                                        </p>
                                    </div>
                                    <div className={`  ${commonStyles}`}>
                                        <p className={`text-white font-light text-base flex min-w-[500px] justify-center`} title={name}>
                                            <p> <span style={{ marginRight: '20px' }}>Name:</span>
                                            <input
                                                type="text"
                                                className="text-black"
                                                placeholder="Name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                            </p>
                                        </p>
                                    </div>
                                    <div className={`  ${commonStyles}`}>
                                        <p className={`text-white font-light text-base flex min-w-[500px] justify-center`} title={department}>
                                            <p> <span style={{ marginRight: '20px' }}>Department:</span>
                                            <select
                                                className="text-black"
                                                value={department}
                                                onChange={(e) => setDepartment(e.target.value)}
                                            >
                                                <option value="" disabled>Select Department</option>
                                                {departmentOptions.map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                            </p>
                                        </p>
                                    </div>
                                <div className={`  ${commonStyles}`}>
                                        <p className={`text-white font-light text-base flex min-w-[500px] justify-center`} title={programLevel}>
                                            <p> <span style={{ marginRight: '20px' }}>Level of Study:</span>
                                            <select
                                                className="text-black"
                                                value={programLevel}
                                                onChange={(e) => setProgramLevel(e.target.value)}
                                            >
                                                <option value="" disabled>Select program level</option>
                                                {programOptions.map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                            </p>
                                        </p>
                                    </div>
                                    <div className={` rounded-br-2xl rounded-bl-2xl  ${commonStyles}`}>
                                        <p className={`text-white font-light text-base flex min-w-[500px] justify-center`} title={phone}>
                                            <p> <span style={{ marginRight: '20px' }}>Name:</span>
                                            <input
                                                type="text"
                                                className="text-black"
                                                placeholder="Phone"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            />
                                            </p>
                                        </p>
                                    </div>
                                
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
                                        <p className="text-white font-light text-base flex mt-5 mb-5 " title={picture}>
                                        {picture ? (
                                        <img
                                            src={picture}
                                            alt="no user image available"
                                            className="object-scale-down max-h-48 max-w-96"
                                        />
                                        ) : (
                                        <p>No profile picture uploaded</p>
                                        )}
                                        </p>
                                    </div>
                                    <div className={`${commonStyles}`}>
                                        <p className="text-white font-light text-base flex " title={blockchainId}>
                                            <p> <span style={{ marginRight: '20px' }}>Blockchain ID:</span>{blockchainId !== null ? shortenAddress(blockchainId.toString()) : 'Loading...'}</p>
                                        </p>
                                    </div>
                                    <div className={`${commonStyles}`}>
                                        <p className="text-white font-light text-base flex " title={user.email}>
                                            <p> <span style={{ marginRight: '20px' }}>Email Address:</span>{user.email !== null ? user.email : 'Loading...'} </p>
                                        </p>
                                    </div>
                                    <div className={`  ${commonStyles}`}>
                                        <p className={`text-white font-light text-base flex`} title={name}>
                                            <p> <span style={{ marginRight: '20px' }}>Name:</span>{name !== "" ? name : <span className="opacity-50">Please enter your name</span>} </p>
                                        </p>
                                    </div>
                                    <div className={`  ${commonStyles}`}>
                                        <p className={`text-white font-light text-base flex`} title={department}>
                                            <p> <span style={{ marginRight: '20px' }}>Department:</span>{department !== "" ? department : <span className="opacity-50">Please select your department</span>} </p>
                                        </p>
                                    </div>
                                    <div className={` r ${commonStyles}`}>
                                        <p className={`text-white font-light text-base flex`} title={programLevel}>
                                            <p> <span style={{ marginRight: '20px' }}>Level of Study:</span>{programLevel !== "" ? programLevel : <span className="opacity-50">Please select your level of study</span>} </p>
                                        </p>
                                    </div>
                                    <div className={` rounded-br-2xl rounded-bl-2xl ${commonStyles}`}>
                                        <p className={`text-white font-light text-base flex`} title={phone}>
                                            <p> <span style={{ marginRight: '20px' }}>Phone Number:</span>{phone !== "" ? phone : <span className="opacity-50">Please enter your phone number</span>} </p>
                                        </p>
                                    </div>
                                </div>
                                <br />
                                <button type="button" onClick={handleEdit} className ="bg-[#8934eb] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#a834eb]">
                                    Edit
                                </button>
                                <br/>
                                
                                {!selectedCourses.length > 0? (
                                <button type="button" onClick={handleRegister} className ="bg-[#8934eb] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#a834eb]">
                                    Course Registration
                                </button>) : ("")
                                }
                                
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