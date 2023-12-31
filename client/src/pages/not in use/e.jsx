import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';
import { contractABI, contractAddress } from '../utils/constants/loginConstant';
import { Navbar, Footer } from '../components/index.js';
import { AuthValidation } from '../utils';

const SignIn = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [digicode, setDigicode] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [status, setStatus] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
  
    const onSignIn = async () => {
      if (username !== '' && password !== '' && digicode !== '') {
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();
        const trimmedDigicode = digicode.trim();
  
        let usernameToSend = trimmedUsername;
  
        if (trimmedPassword.length < 8) {
          setAlertMessage("at least 8 characters for the password");
          setStatus('failed');
          setPassword('');
          setDigicode('');
          return;
        } else if (trimmedDigicode.length !== 6) {
          setAlertMessage("6 digits required for digicode");
          setStatus('failed');
          setDigicode('');
          return;
        } else {
          let userAddress = await props.contract.methods.getUserAddress()
            .call({ from: props.account });
  
          if (userAddress === '0x0000000000000000000000000000000000000000') {
            setAlertMessage('Account does not exist');
            setStatus('failed');
            setUsername('');
            setPassword('');
            setDigicode('');
            return;
          } else {
            let validated = await AuthValidation(
              trimmedUsername,
              props.account,
              trimmedPassword,
              trimmedDigicode,
              props.web3,
              props.contract
            );
  
            if (!validated) {
              setAlertMessage('Incorrect login');
              setStatus('failed');
              setUsername('');
              setPassword('');
              setDigicode('');
            } else {
              setUsername('');
              setPassword('');
              setDigicode('');
              setStatus('success');
              setAlertMessage("Sign in successful");
              setLoggedIn(true);
  
              props.userSignedIn(
                loggedIn,
                usernameToSend
              );
            }
          }
        }
      }
  
      setUsername('');
      setPassword('');
      setDigicode('');
    };
  
    return (
      <div className="relative sm:-8 p-4 pl-9 bg-[#13131a] min-h-screen">
        <div className="bg-[#13131a]">
          <Navbar />
          <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism text-white">
            Sign in to your account
              <div className="card-container">
                {alertMessage !== '' && status === 'failed' ? (
                  <div className="message negative">{alertMessage}</div>
                ) : alertMessage !== '' && status === 'success' ? (
                  <div className="message positive">{alertMessage}</div>
                ) : (
                  <div></div>
                )}
                <div className="form-field required text-black">
                  <input
                    type='text'
                    placeholder='username'
                    value={username}
                    autoComplete="username"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-field required text-black">
                  <input
                    type='password'
                    placeholder='password'
                    value={password}
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-field required text-black">
                  <input
                    type='text'
                    placeholder='6 digit code'
                    value={digicode}
                    autoComplete="digicode"
                    onChange={(e) => setDigicode(e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <button
                    type='submit'
                    className="button primary"
                    onClick={onSignIn}
                  >
                    Sign in
                  </button>
                </div>
              {props.signedUp ? (
                <div></div>
              ) : (
                <div className="signin-onUp">
                  Don't have an account? <Link to='/sign-up'>Sign up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  };

export default SignIn;