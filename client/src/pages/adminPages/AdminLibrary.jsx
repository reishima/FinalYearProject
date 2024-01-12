import React, { useState, useEffect } from 'react';
import { AdminNavbar, AdminFooter } from '../../components/index.js';
import { DisplayUnavailableBooksAdmin, DisplayAvailableBooksAdmin } from './adminindex.js';
import { useStateContext } from '../../context/LibraryContext.jsx';
import AdminChecker from '../../utils/adminChecker.js';

const AdminLibrary = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [unavailable, setUnavailable] = useState([]);
    const [isAvailableBooksVisible, setIsAvailableBooksVisible] = useState(false);

    const { address, contract, getUnavailable } = useStateContext();

    const fetchUnavailable = async () => {
        setIsLoading(true);
        const data = await getUnavailable();
        setUnavailable(data);
        setIsLoading(false);
    }

    useEffect(() => {
        if (contract) fetchUnavailable();
    }, [address, contract]);

    const toggleAvailableBooks = () => {
        setIsAvailableBooksVisible(!isAvailableBooksVisible);
    };

    return (
        <div className="relative sm:-8 p-4 pl-9 bg-[#13131a] min-h-screen flex flex-col">
            <div className="bg-[#13131a] flex-grow">
                <AdminNavbar />
                <AdminChecker />
                <div className='ml-[300px]'>
                    <DisplayUnavailableBooksAdmin
                        title="Books to be Returned"
                        isLoading={isLoading}
                        unavailable={unavailable}
                    />
                </div>
                <br />
                <div className='ml-[300px]'>
                    <div className="flex items-center cursor-pointer" onClick={toggleAvailableBooks}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-6 w-6 transform ${isAvailableBooksVisible ? 'rotate-0 text-white' : 'rotate-180 text-white'}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                        <div className="ml-2">
                            <h1 className="text-white text-lg font-semibold">
                                {isAvailableBooksVisible ? 'Collapse Available Books' : 'Expand Available Books'}
                            </h1>
                        </div>
                    </div>
                    <br/>
                    {isAvailableBooksVisible && (
                        <DisplayAvailableBooksAdmin
                            title="Available Books"
                            isLoading={isLoading}
                            available={unavailable}
                        />
                    )}
                </div>
            </div>
            <AdminFooter />
        </div>
    )
}

export default AdminLibrary;
