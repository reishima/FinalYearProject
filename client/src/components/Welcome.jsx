import React, { useState, useEffect } from 'react';
import { IoPersonSharp } from 'react-icons/io5';
import logo from '../images/shield.png';
import { shortenAddress } from '../utils/index.js';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AuthChecker from '../utils/handle.js';
import { getDoc, doc, collection } from 'firebase/firestore';
import { database } from '../utils/FirebaseConfig.js';
import { Link } from 'react-router-dom';

const commonStyles = 'min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-[#8934eb] text-sm font-light text-white font-semibold';

const Welcome = () => {
    
    const [ user, setUser ] = useState(null);
    const [ blockchainId, setblockchainId] = useState(null);
    const [ name, setName ] = useState('');
    const [ picture, setPicture ] = useState('');
    const [ currentTime, setCurrentTime ] = useState(new Date());
    const [ referenceDate, setReferenceDate ] = useState(new Date(2023, 9, 10)); // YYYY:DD:MM Format

    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if (authUser){
                setUser(authUser);
            } else {
                setUser(null);
            }
        });

        return () => {
            unsubscribe();
        }
    }, []);

    useEffect(() => {
        const auth = getAuth();
    
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                setUser(authUser);
                const usersCollection = collection(database, 'users');
                const userDoc = doc(usersCollection, authUser.uid);
                const userDocSnapshot = await getDoc(userDoc);
    
                if (userDocSnapshot.exists()) {
                    setblockchainId(userDocSnapshot.data().blockchainId);
                    setName(userDocSnapshot.data().name || '');
                    setPicture(userDocSnapshot.data().picture || '');
                }
            } else {
                setUser(null);
                setblockchainId(null);
            }
        });
    
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearInterval(intervalId);
            unsubscribe();
        };
    }, []);
    
    const timeDifference = currentTime.getTime() - referenceDate.getTime();

    const weeks = Math.floor(timeDifference / (7 * 24 * 60 * 60 * 1000));
    const formattedTime = currentTime.toLocaleTimeString();
    const formattedDate = currentTime.toLocaleDateString();

    return(
        <div className="flex w-full justify-center items-center">
            <AuthChecker/>
            <div className="flex md:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
                <div className="flex flex-1 justify-start flex-col md:mr-10">
                    <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1" title={name !== null && name !== "" ? name : (blockchainId !== null ? blockchainId : 'Loading...')}> 
                        Welcome {name !== null && name !== "" ? name : (blockchainId !== null ? shortenAddress(blockchainId.toString()) : 'Loading...')}
                    </h1>
                    <p className = "text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
                        {formattedTime} - {formattedDate} (Week {weeks})
                    </p>
                    <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
                        <Link to="/attendance">
                            <div className={`rounded-tl-2xl ${commonStyles}`}>
                                Attendance
                            </div>
                        </Link>
                        <Link to="/profile">
                            <div className={`${commonStyles}`}>
                                Profile
                            </div>
                        </Link>
                        <Link to="/student-aide">
                            <div className={`rounded-tr-2xl ${commonStyles}`}>
                                Student Aide
                            </div>
                        </Link>
                        <Link to="/history">
                            <div className={`rounded-bl-2xl ${commonStyles}`}>
                                History
                            </div>
                        </Link>
                        <Link to="/library">
                            <div className={`${commonStyles}`}>
                                Library
                            </div>
                        </Link>
                        <Link to="/faq">
                            <div className={`rounded-br-2xl ${commonStyles}`}>
                                FAQ
                            </div>
                        </Link>
                    </div>
                    <div className="grid sm:grid-cols-1 grid-cols-1 w-full mt-10 min-w-[500px]"/>
                </div>
                
                <div className ="flex flex-col flex-1 items-center justify-start w-full md:mt-0 mt-10">
                    <div className="p-3 justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card white-glassmorphism">
                        <div className="flex justify-between flex-col w-full h-full">
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-10 flex justify-center items-center my-1 mx-0.5">
                                    <img src={logo} alt="logo" className="w-32"/>
                                </div>
                                <div className="mt-3.5 ml-2 flex">
                                {picture ? (
                                    <img src={picture} alt="Profile Picture" className="w-32 h-23" />
                                ) : (
                                    <IoPersonSharp fontSize={95} color="#fff" />
                                )}
                                </div>
                            </div>
                            <div>
                                <p className="text-white font-light text-sm flex -mt-4">
                                    {blockchainId !== null ? shortenAddress(blockchainId.toString()) : 'Loading...'}
                                </p>
                                <div className="text-white font-semibold text-sm">
                                    {user ? (
                                        <>
                                            Email: {user.email}
                                        </>
                                    ) : (
                                        <p className='text-white'> User is not signed in </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Welcome;