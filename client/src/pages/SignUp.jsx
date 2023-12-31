import React, { useState, useEffect } from 'react';
import { NavbarInOut, FooterInOut, Loading } from '../components/index.js';
import { database, auth } from '../utils/FirebaseConfig.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, collection, doc, getDocs, where, query } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { ethers } from 'ethers';
const { ethereum } = window;

const SignUp = () => {

    const [ login, setLogin ] = useState(false)
    const [ showPassword, setShowPassword] = useState(false);
    const [ isLoading, setIsLoading] = useState(false);
    const [ blockchainId, setblockchainId] = useState('');

    const history = useNavigate();

    useEffect(() => {
        const getblockchainId = async () => {
            try {
                if (window.ethereum) {
                    await window.ethereum.request({method: 'eth_requestAccounts'});
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    const getAddress = async () => {
                        const address = await signer.getAddress();
                        setblockchainId(address);
                    };
                    getAddress();
                    window.ethereum.on('accountsChanged', getAddress);
                } else {
                    console.error("Metamask not found or not connected");
                }
            } catch (error){
                console.error("Error fetching blockchainId:" , error);
            }
        };

        getblockchainId();
    }, []);

    const checkblockchainIdExists = async () => {
        const usersCollection = collection(database, 'users');
        const q = query(usersCollection, where('blockchainId', '==', blockchainId));
        
        try{
            const querySnapshot = await getDocs(q);
            return !querySnapshot.empty;
        } catch (error){
            console.error('Error checking blockchainId:', error);
            return false;
        }
    }

    const handleLogin = () => {
        history('/login');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        //const matricNumber = e.target.matricNumber.value;

        const blockchainIdExists = await checkblockchainIdExists();

        if(blockchainIdExists) {
            alert('This ID is already in use, use a different blockchainID');
            return;
        }

        try {
            const authData = await createUserWithEmailAndPassword(auth, email, password);
            const uid = authData.user.uid;
            
            // Reference to the "users" collection
            const usersCollection = collection(database, 'users');

            // Reference to a document within the "users" collection using the user's UID
            const userDoc = doc(usersCollection, uid);

            // Set user information in Firestore using setDoc
            await setDoc(userDoc, {
                //matricNumber: matricNumber,
                email: email,
                blockchainId: blockchainId,
            });

            console.log('Document written with ID', uid);
            history('/'); // Navigate to the desired location
        } catch (error) {
            console.error('Error creating user:', error);
            alert(error.code);
            setLogin(true);
        }
    };



    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex flex-col bg-[#13131a] min-h-screen">
                <NavbarInOut/>
                <div className = "flex-1 flex items-center justify-center">
                    <form onSubmit={(e) => handleSubmit(e)}>
                    <div className = "my-2 w-full rounded-sm p-2 outline-none bg-transparent border-none text-sm white-glassmorphism">
                        <div className ="flex flex-col flex-1 items-center justify-start w-full md:mt-0 mt-10">
                            <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
                            <h1 className = "text-white"> Sign Up</h1> <br/>
                                <input name="email" placeholder="Email" required/> <br/>
                            <div className='relative'>
                                <input name="password" type={showPassword ? "text" : "password" } placeholder="Password" required/> <br/>
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray cursor-pointer"
                                >
                                {showPassword ? <AiFillEyeInvisible/> : <AiFillEye/> }
                                </button>
                            </div>
                                <div className="h-[1px] w-full my-2"/>
                                {isLoading? (
                                    <Loading />
                                ) : (
                                    <button className = "text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer hover:bg-[#a834eb] bg-[#8934eb]"> Sign Up </button>
                                )}
                                <br/>
                                <p onClick={handleLogin} className="text-white cursor-pointer">
                                Already have an account?
                                </p>
                            </div>
                        </div>
                    </div>
                    </form>
            </div>
            <FooterInOut/>
        </div>
    );
};

export default SignUp;
