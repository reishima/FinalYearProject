import React, { useEffect, useState } from 'react';
import { auth } from '../utils/FirebaseConfig.js';
import { useNavigate } from 'react-router-dom';
import { Redirecting } from '../components/index.js';

const AuthChecker = ({ children }) => {
    const navigate = useNavigate();
    const [authCheckComplete, setAuthCheckComplete] = useState(false);
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
        setAuthCheckComplete(true);
        if (!user) {
            alert('You must be logged in to access this page.');
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
