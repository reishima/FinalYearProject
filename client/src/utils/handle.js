import { signOut } from 'firebase/auth';
import { auth } from './FirebaseConfig';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Redirecting } from '../components/index.js';
import swal from 'sweetalert';

const handleAccountsChanged = async () => {
    const excludedPaths = ['/login', '/sign-up', '/forgot-password', '/sign-out'];
    const currentPath = window.location.pathname;
    if (!excludedPaths.includes(currentPath)) {
      alert('Wallet change detected. Please re-login.');
     //window.location.href = '/login';
      await signOut(auth);
    } else {
      swal({
        text: 'Wallet change detected. Please be aware of the security implications.',
        closeOnClickOutside: true,
      });
    }
  };
  
  export const setupAccountsChangedListener = () => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
  };
  
  export const removeAccountsChangedListener = () => {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
  };

const AuthChecker = ({ children }) => {
    const navigate = useNavigate();
    const [authCheckComplete, setAuthCheckComplete] = useState(false);
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
        setAuthCheckComplete(true);
        if (!user) {
          swal({
            text: 'You must be logged in to access this page!',
            closeOnClickOutside: true,
          });
            navigate('/login');
        }
        });

        return () => {
        unsubscribe();
        };
    }, [navigate]);

    return authCheckComplete ? <>{children}</> : <Redirecting/> ;
};

export default AuthChecker;
