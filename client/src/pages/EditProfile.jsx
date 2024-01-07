import React, { useState, useEffect } from 'react';
import { Navbar, Footer } from '../components/index';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc, collection, updateDoc } from 'firebase/firestore';
import { database } from '../utils/FirebaseConfig.js';
import { checkIfImage } from '../utils/index.js';
import AuthChecker from '../utils/handle.js';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const navigate = useNavigate();
    const [ user, setUser ] = useState(null);
    const [ blockchainId, setblockchainId] = useState(null);
    const [ course, setCourse ] = useState('');
    const [ department, setDepartment ] = useState('');
    const [ name, setName ] = useState('');
    const [ picture, setPicture ] = useState('');
    const [ phone, setPhone ] = useState('');
    const [ editMode, setEditMode ] = useState(false);

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

        return () => {
            unsubscribe();
        }
    }, []);

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
                                <p> Phone Number: {phone|| 'Please edit'} </p>
                                <p> Profile Picture: {picture && <img src={picture} alt="no user image available" className='object-scale-down h-48 w-96'/> || 'Please edit'} </p>
                                <br />
                                <button type="button" onClick={handleEdit} className ="bg-[#8934eb] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#a834eb]">
                                    Edit
                                </button>
                                <br/>
                                <button type="button" onClick={handleRegister} className ="bg-[#8934eb] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#a834eb]">
                                    Registration
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