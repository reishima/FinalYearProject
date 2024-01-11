import React, { useState } from 'react';
import { Navbar, Footer } from '../../components/index.js';
import AdminChecker from '../../utils/adminChecker.js';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { database } from '../../utils/FirebaseConfig.js';

const QueryUser = () => {
    const [blockchainId, setBlockchainId] = useState('');
    const [userData, setUserData] = useState(null);

    const handleQuery = async () => {
        try {
            const usersCollection = collection(database, 'users');
            const q = query(usersCollection, where('blockchainId', '==', blockchainId));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                alert(`User with Blockchain ID ${blockchainId} is not in our database.`);
            } else {
                // Assuming there's only one user with the provided blockchain ID
                querySnapshot.forEach((doc) => {
                    setUserData(doc.data());
                });
            }
        } catch (error) {
            console.error('Error querying user: ', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#13131a] min-h-screen">
            <AdminChecker />
            <Navbar />
            <div className="justify-center flex-1 flex items-center">
                <div className="text-white">
                    <label htmlFor="blockchainIdInput" className="mr-2">
                        Enter Blockchain ID:
                    </label>
                    <input
                        type="text"
                        id="blockchainIdInput"
                        value={blockchainId}
                        onChange={(e) => setBlockchainId(e.target.value)}
                    />
                    <button onClick={handleQuery} className="bg-[#8934eb] py-2 px-4 ml-2 rounded-full cursor-pointer hover:bg-[#a834eb]">
                        Query User
                    </button>

                    {userData && (
                        <div className="mt-4">
                            <h2>User Information:</h2>
                            <p>Email: {userData.email}</p>
                            <p>Department: {userData.department}</p>
                            <p>Name: {userData.name}</p>
                            <p>Phone: {userData.phone}</p>
                            {userData.picture && (
                                <div>
                                    <p>Picture:</p>
                                    <img src={userData.picture} alt="user" className="max-w-[200px] max-h-[200px]" />
                                </div>
                            )}
                            <p>Program Level: {userData.programLevel}</p>
                            <p>User Type: {userData.userType}</p>
                            {userData.selectedCourses && userData.selectedCourses.length > 0 && (
                                <div>
                                    <p>Selected Courses:</p>
                                    <ul>
                                        {userData.selectedCourses.map((course, index) => (
                                            <li key={index}>{course}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default QueryUser;
