import React, { useState } from 'react';
import { AdminNavbar, AdminFooter, Loading } from '../../components/index.js';
import { database, auth } from '../../utils/FirebaseConfig.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, collection, doc, getDocs, where, query } from 'firebase/firestore';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import swal from 'sweetalert';
import AdminChecker from '../../utils/adminChecker.js';
const { ethereum } = window;

const CreateAdmin = () => {
    const [ login, setLogin ] = useState(false)
    const [ showPassword, setShowPassword] = useState(false);
    const [ showConfirmPassword, setShowConfirmPassword ] = useState(false);
    const [ isLoading, setIsLoading] = useState(false);

    const checkblockchainIdExists = async (customBlockchainId) => {
        const usersCollection = collection(database, 'users');
        const q = query(usersCollection, where('blockchainId', '==', customBlockchainId));
    
        try {
            const querySnapshot = await getDocs(q);
            return !querySnapshot.empty;
        } catch (error) {
            console.error('Error checking blockchainId:', error);
            return false;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;

        const customBlockchainId = e.target.blockchainId.value;
        const blockchainIdExists = await checkblockchainIdExists(customBlockchainId);

        if(blockchainIdExists) {
            swal({
                text: "This ID is already in use, use a different blockchainID",
                closeOnClickOutside: true,
              });
            return;
        }

        if (password.length < 8) {
            swal({
                text: "Passwords should be at least 8 characters.",
                closeOnClickOutside: true,
              });
              return
        }

        if (password !== confirmPassword) {
            swal({
              text: "Passwords do not match. Please enter matching passwords.",
              closeOnClickOutside: true,
            });
            return;
          }

          try {
            const shouldProceed = await swal({
                text: 'You are about to create an admin and will be signed out',
                closeOnClickOutside: true, 
                buttons: ['Back', 'Proceed'],
                dangerMode: true,
            });
    
            if (shouldProceed) {
                await createUserWithEmailAndPassword(auth, email, password);
                const usersCollection = collection(database, 'users');
                const currentUser = auth.currentUser;
                const userDoc = doc(usersCollection, currentUser.uid);
    
                await setDoc(userDoc, {
                    email: email,
                    blockchainId: customBlockchainId,
                    userType: 'admin',
                });
    
                await auth.signOut();
            } 
        } catch (error) {
            if(error.code === 'auth/email-already-in-use'){
                swal({
                    text: "This email is already in use.",
                    closeOnClickOutside: true,
                  });
            }
            else if(error.code === 'auth/weak-password'){
                swal({
                    text: "Passwords should be at least x characters.",
                    closeOnClickOutside: true,
                  });
            }
            else{
                console.error('Error creating user:', error);
                alert(error.code);
            }
            setLogin(true);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="flex flex-col bg-[#13131a] min-h-screen">
                <AdminNavbar/>
                <AdminChecker/>
                <div className = "flex-1 flex items-center justify-center">
                    <form onSubmit={(e) => handleSubmit(e)}>
                    <div className = "my-2 w-full rounded-sm p-2 outline-none bg-transparent border-none text-lg white-glassmorphism">
                        <div className ="flex flex-col flex-1 items-center justify-start w-full md:mt-0 mt-10">
                            <div className="p-8 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
                            <h1 className = "text-2xl font-bold text-white font-epilogue"> Create Admin </h1> <br/>
                                <input name="email" placeholder="Email" required className="pl-4 input-field w-full rounded"/> <br/>
                            <div className='relative'>
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password" }
                                    placeholder="Password"
                                    required
                                    className="input-field w-full pl-4 pr-20 rounded mb-5"
                                    style={{ width: '100%' }}
                                /> <br/>
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-2 top-[15px] transform -translate-y-1/2 text-gray cursor-pointer"
                                >
                                {showPassword ? <AiFillEyeInvisible/> : <AiFillEye/> }
                                </button>

                                <input
                                    name="confirmPassword"
                                    type={showPassword ? "text" : "password" }
                                    placeholder="Confirm Password"
                                    required
                                    className="input-field w-full pl-4 pr-20 rounded mb-5"
                                    style={{ width: '100%' }}
                                /> 
                                <input
                                    name="blockchainId"
                                    placeholder="Blockchain ID"
                                    required
                                    className="input-field w-full pl-4 pr-20 rounded"
                                    style={{ width: '100%' }}
                                /> <br/>
                                
                            </div>
                                <div className="h-[1px] w-full my-2"/>
                                {isLoading? (
                                    <Loading />
                                ) : (
                                    <button className = "text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer hover:bg-[#a834eb] bg-[#8934eb]"> Create Admin Account </button>
                                )}
                                <br/>
                            </div>
                        </div>
                    </div>
                    </form>
            </div>
            <AdminFooter/>
        </div>
    );
};

export default CreateAdmin;
