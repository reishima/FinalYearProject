import React, { useEffect, useState } from 'react';
import { auth, database} from '../utils/FirebaseConfig.js';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc, collection } from 'firebase/firestore';
import Redirecting from '../components/Redirecting';
import swal from 'sweetalert';

const RegisterCheck = ({ children }) => {
    const navigate = useNavigate();
    const [registerCheckComplete, setRegisterCheckComplete] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setRegisterCheckComplete(true);
    
            if (user) {
                const usersCollection = collection(database, 'users');
                const userDoc = doc(usersCollection, user.uid);
                const userDocSnapshot = await getDoc(userDoc);

                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    const selectedCourses = userData.selectedCourses;

                    if (!selectedCourses || selectedCourses.length === 0 || selectedCourses.every(course => course === "")) {
                        // User can access registration
                        console.log('User can access registration.');
                    } else {
                        swal({
                            text: 'You have already registered for courses',
                            closeOnClickOutside: true,
                        });
                        navigate('/home');
                    }
                } else {
                    
                    // Handle the case when user data doesn't exist
                    console.error('User data not found.');
                }
            }
        });

        return () => {
            unsubscribe();
        };
    }, [navigate]);

    if (!registerCheckComplete) {
        return <Redirecting />;
    }

    return <>{children}</>;
};

export default RegisterCheck;
