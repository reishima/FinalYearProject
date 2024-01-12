import React, { useState } from 'react';
import { Navbar, Footer } from '../../components/index.js';
import AdminChecker from '../../utils/adminChecker.js';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { database } from '../../utils/FirebaseConfig.js';
import swal from 'sweetalert';
import { shortenAddress } from '../../utils/index.js';

const QueryUser = () => {
    const [blockchainId, setBlockchainId] = useState('');
    const [userData, setUserData] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('');
    const [programLevel, setProgramLevel] = useState('');
    const [phone, setPhone] = useState('');
    const [picture, setPicture] = useState('');
    const [ selectedCourses, setSelectedCourses ] = useState('');
    const commonStyles = 'min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-[#8934eb] text-sm font-light text-white font-semibold';

    const handleQuery = async () => {
        try {
            const usersCollection = collection(database, 'users');
            const q = query(usersCollection, where('blockchainId', '==', blockchainId));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                swal({
                    text: "That blockchain ID does not exist in our database.",
                    closeOnClickOutside: true,
                })
            } else {
                // Assuming there's only one user with the provided blockchain ID
                querySnapshot.forEach((doc) => {
                    const user = doc.data();
                    
                    // Set user attributes one by one
                    setName(user.name || ''); // Set default value if attribute is undefined
                    setEmail(user.email || '');
                    setDepartment(user.department || '');
                    setProgramLevel(user.programLevel || '');
                    setPhone(user.phone || '');
                    setPicture(user.picture || '');
                    setSelectedCourses(user.selectedCourses || []);
                });
                setUserData(querySnapshot.docs[0].data());
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
                <div className="text-white text-center">
                    <label htmlFor="blockchainIdInput" className="mr-2">
                        Enter User Blockchain ID:
                    </label>
                    <br/>
                    <input
                        type="text"
                        className="border-[0.5px] border-[#8934eb] text-white px-2 py-1 rounded min-w-[400px] mt-[20px]"
                        placeholder="Enter blockchainId"
                        style = {{ backgroundColor: '#13131a', border: '2px solid black', height: '30px' }}
                        id="blockchainIdInput"
                        value={blockchainId}
                        onChange={(e) => setBlockchainId(e.target.value)}
                    />
                    <br/>
                    <button onClick={handleQuery} className="bg-[#8934eb] py-2 px-4 ml-2 rounded-full cursor-pointer hover:bg-[#a834eb] mt-5">
                        Query User
                    </button>

                    {userData && (
                        <div className='flex flex-col justify-left items-left'>
                        <div className="grid sm:grid-cols-1 grid-cols-1 w-full mt-10 min-w-[500px]">
                        <div className={`rounded-tl-2xl rounded-tr-2xl ${commonStyles}`}>
                                <div className="text-white font-light text-base flex mt-5 mb-5 " title={picture}>
                                {picture ? (
                                <img
                                    src={picture}
                                    alt="no user image available"
                                    className="object-scale-down max-h-48 max-w-96"
                                />
                                ) : (
                                <div>No profile picture uploaded</div>
                                )}
                                </div>
                            </div>
                            <div className={`${commonStyles}`}>
                                <div className="text-white font-light text-base flex " title={blockchainId}>
                                    <p> <span style={{ marginRight: '20px' }}>Blockchain ID:</span>{blockchainId !== null ? shortenAddress(blockchainId.toString()) : 'Loading...'}</p>
                                </div>
                            </div>
                            <div className={`${commonStyles}`}>
                                <div className="text-white font-light text-base flex " title={email}>
                                    <p> <span style={{ marginRight: '20px' }}>Email Address:</span>{email !== null ? email : 'Loading...'} </p>
                                </div>
                            </div>
                            <div className={`  ${commonStyles}`}>
                                <div className={`text-white font-light text-base flex`} title={name}>
                                    <p> <span style={{ marginRight: '20px' }}>Name:</span>{name !== "" ? name : <span className="opacity-50"> User has not set a name </span>} </p>
                                </div>
                            </div>
                            <div className={`  ${commonStyles}`}>
                                <div className={`text-white font-light text-base flex`} title={department}>
                                    <p> <span style={{ marginRight: '20px' }}>Department:</span>{department !== "" ? department : <span className="opacity-50"> User has not seleted a department </span>} </p>
                                </div>
                            </div>
                            <div className={` ${commonStyles}`}>
                                <div className={`text-white font-light text-base flex`} title={programLevel}>
                                    <p> <span style={{ marginRight: '20px' }}>Level of Study:</span>{programLevel !== "" ? programLevel : <span className="opacity-50"> User has not selected level of study</span>} </p>
                                </div>
                            </div>
                            <div className={` ${commonStyles}`}>
                                <div className={`text-white font-light text-base flex`} title={phone}>
                                    <p> <span style={{ marginRight: '20px' }}>Phone Number:</span>{phone !== "" ? phone : <span className="opacity-50"> User has not set phone number</span>} </p>
                                </div>
                            </div>
                            <div className={` rounded-br-2xl rounded-bl-2xl ${commonStyles}`}>
                            <div className={`text-white font-light text-base flex`} title={selectedCourses}>
                                    <div>
                                        <span style={{ marginRight: '20px' }}>Taken Courses:</span>
                                        {selectedCourses.length > 0 ? (
                                            <ul>
                                                {selectedCourses.map((course, index) => (
                                                    <li key={index}>{course}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span className="opacity-50">User has not taken any courses</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br />
                    </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default QueryUser;
