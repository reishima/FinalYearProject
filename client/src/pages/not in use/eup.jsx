import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Footer } from '../components/index.js';
import { AuthenticationHash } from '../utils';

const SignUp = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [digicode, setDigicode] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [status, setStatus] = useState('');
  const [signedUp, setSignedUp] = useState(false);

  const onSignUp = async () => {
    console.log('proprs:', props);
    if (username !== '' && password !== '' && digicode !== '') {
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
      const trimmedDigicode = digicode.trim();

      if (trimmedPassword.length < 8) {
        setAlertMessage("At least 8 characters for the password");
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

        if (userAddress !== '0x0000000000000000000000000000000000000000') {
          setAlertMessage('This account already exists');
          setStatus('failed');
          setUsername('');
          setPassword('');
          setDigicode('');
          return;
        } else {
          let hash = await AuthenticationHash(trimmedUsername, props.account, trimmedPassword, trimmedDigicode, props.web3);

          await props.contract.methods.register(hash).send({ from: props.account });

          setUsername('');
          setPassword('');
          setDigicode('');
          setStatus('success');
          setAlertMessage("Signup successful");
          setSignedUp(true);

          props.accountCreated(signedUp);
          return;
        }
      }
    }
  };

  return (
    <div className="relative sm:-8 p-4 pl-9 bg-[#13131a] min-h-screen">
        <div className="bg-[#13131a]">
            <Navbar/>
        <div className='p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism text-white'>
        Create an account
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
                required
                type='text'
                placeholder='username'
                value={username}
                autoComplete="username"
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="form-field required text-black">
                <input
                required
                type='password'
                placeholder='password'
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="form-field required text-black">
                <input
                required
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
                onClick={onSignUp}
                >
                Create account
                </button>
            </div>
            </div>
            <div className="signin-onUp">
            Already have an account? <Link to='/sign-in'>Sign in</Link>
            </div>
        </div>
        </div>
        <Footer/>
    </div>
  );
};

export default SignUp;
