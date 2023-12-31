import React, { useEffect, useState } from 'react';
import { auth } from '../utils/FirebaseConfig.js';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc, collection } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import Redirecting from '../components/Redirecting';
import { database } from '../utils/FirebaseConfig.js';

const AdminChecker = ({ children }) => {
    const navigate = useNavigate();
    const [adminCheckComplete, setAdminCheckComplete] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setAdminCheckComplete(true);
            
            if (!user) {
                alert('You must be logged in to access this page.');
                navigate('/login');
            } else {
                // Check if the user has admin privileges in Firestore
                const usersCollection = collection(database, 'users');
                const userDoc = doc(usersCollection, user.uid);
                const userDocSnapshot = await getDoc(userDoc);

                if (!userDocSnapshot.exists() || userDocSnapshot.data().userType !== 'admin') {
                    alert('This page is for admins only!');
                    await signOut(auth);
                    navigate('/login');
                }
            }
        });

        return () => {
            unsubscribe();
        };
    }, [navigate]);

    if (!adminCheckComplete) {
        return <Redirecting />;
    }

    return <>{children}</>;
};

export default AdminChecker;
