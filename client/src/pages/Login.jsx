import React, { useState } from 'react';
import { NavbarInOut, FooterInOut, Loading } from '../components/index.js';
import { auth } from '../utils/FirebaseConfig.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { ethers } from 'ethers';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { database } from '../utils/FirebaseConfig.js';

const SignIn = () => {
  const [login, setLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const history = useNavigate();

  const getCurrentBlockchainId = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        return address;
      } else {
        console.error('Metamask not found or not connected');
        return null;
      }
    } catch (error) {
      console.error('Error fetching blockchain ID:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const blockchainId = await getCurrentBlockchainId();

    if (blockchainId !== null) {
      if (await isValidblockchainId(blockchainId, email)) {
        try {
          const authData = await signInWithEmailAndPassword(auth, email, password);
          console.log(authData, 'authData');
          history('/home');
        } catch (err) {
          alert(err.code);
          setLogin(true);
        }
      }
    } else {
      alert('Metamask not found or not connected. Please connect Metamask and try again.');
    }
  };

  const isValidblockchainId = async (blockchainId, email) => {
    try {
      const usersCollection = collection(database, 'users');
      const q = query(usersCollection, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userBlockchainId = querySnapshot.docs[0].data().blockchainId;
        const currentBlockchainId = await getCurrentBlockchainId();

        if (userBlockchainId === currentBlockchainId) {
          return true;
        } else {
          alert('Please change your active wallet.');
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error checking blockchainId:', error);
      return false;
    }
  };

  const handleReset = () => {
    history('/forgot-password');
  };

  const handleSignUp = () => {
    history('/sign-up');
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col bg-[#13131a] min-h-screen">
      <NavbarInOut />
      <div className="justify-center flex-1 flex items-center">
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent border-none text-sm white-glassmorphism ">
            <div className="flex flex-col flex-1 items-center justify-start w-full md:mt-0 mt-10">
              <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
                <h1 className="text-white"> Login </h1> <br />
                <input name="email" placeholder="Email" /> <br />
                <div className='relative'>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                /> <br />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray cursor-pointer"
                >
                  {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
                </div>
                <div className="h-[1px] w-full my-2" />
                {isLoading ? (
                  <Loading />
                ) : (
                  <button className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer hover:bg-[#a834eb] bg-[#8934eb]">
                    Login
                  </button>
                )}
                <br />
                <p onClick={handleReset} className="text-white cursor-pointer">
                  Forgot Password?
                </p>
                <p onClick={handleSignUp} className="text-white cursor-pointer">
                  Don't have an account?
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
      <FooterInOut />
    </div>
  );
};

export default SignIn;
