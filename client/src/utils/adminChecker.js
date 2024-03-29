import React, { useEffect, useState } from 'react';
import { auth, database} from '../utils/FirebaseConfig.js';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc, collection } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import Redirecting from '../components/Redirecting';
import swal from 'sweetalert';

const AdminChecker = ({ children }) => {
    const navigate = useNavigate();
    const [adminCheckComplete, setAdminCheckComplete] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setAdminCheckComplete(true);
            
            if (!user) {
                navigate('/login');
            } else {
                const usersCollection = collection(database, 'users');
                const userDoc = doc(usersCollection, user.uid);
                const userDocSnapshot = await getDoc(userDoc);

                if (!userDocSnapshot.exists() || userDocSnapshot.data().userType !== 'admin') {
                    swal({
                        text: 'This page is only for admins!',
                        closeOnClickOutside: true,
                      });
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
