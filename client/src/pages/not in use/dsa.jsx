import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../utils/constants/aideConstant';
import { Navbar, Footer } from '../components/index.js';

const Login = () => {

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [address, setAddress ] = useState('');
    const [signatureHash, setSignatureHash] = useState('');
    const [message, setMessage] = useState('');

    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    useEffect(() => {
        if(typeof window.ethereum !== 'undefined') {
            const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(ethProvider);
            const ethSigner = ethProvider.getSigner();
            setSigner(ethSigner);
        }
    }, []);

    const handleRegister = async () => {
        if (signer) {
          try {
            const signature = await signer.signMessage('Registration'); // You can use a random message here
            await contract.register(signature);
            setMessage('Registration successful');
          } catch (error) {
            setMessage('Registration failed');
          }
        } else {
          setMessage('Metamask not connected');
        }
      };
    
      const handleLogin = async () => {
        if (signer) {
          try {
            const userAddress = await signer.getAddress();
            const userSignatureHash = await contract.getSignatureHash();
            if (userSignatureHash === signatureHash && userAddress === address) {
              setMessage('Login successful');
            } else {
              setMessage('Login failed');
            }
          } catch (error) {
            setMessage('Login failed');
          }
        } else {
          setMessage('Metamask not connected');
        }
      };

  return (
    <div className="relative sm:-8 p-4 pl-9 bg-[#13131a] min-h-screen">
            <div className="bg-[#13131a]">
                <Navbar/>
            
            <input
                type="text"
                placeholder="Metamask Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />
            <input
            type="password"
            placeholder="Signature Hash"
            value={signatureHash}
            onChange={(e) => setSignatureHash(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleRegister}>Register</button>
            <div>{message}</div>
            </div>
            <Footer/>
        </div>
  )
}

export default Login;