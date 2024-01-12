import React, { useState, useEffect } from 'react';
import { AdminNavbar, AdminFooter } from '../../components/index.js';
import { DisplayAidesAdmin, DisplayAidesToClose } from '../adminPages/adminindex.js';
import { useStateContext } from '../../context/AideContext.jsx';
import AdminChecker from '../../utils/adminChecker.js';

const AdminAides = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [aides, setAides] = useState([]);
    const [isAvailableAidesVisible, setIsAvailableAidesVisible] = useState(false);

    const { address, contract, getAides } = useStateContext;

    const fetchAides = async () => {
        setIsLoading(true);
        const data = await getAides();
        setAides(data);
        setIsLoading(false);
    }

    useEffect(() => {
        if (contract) fetchAides();
    }, [address, contract]);

    const toggleAvailableAides = () => {
        setIsAvailableAidesVisible(!isAvailableAidesVisible);
    };

    return (
        <div className="relative sm:-8 p-4 pl-9 bg-[#13131a] min-h-screen flex flex-col">
            <div className="bg-[#13131a] flex-grow">
                <AdminNavbar />
                <AdminChecker />
                <div className="ml-[300px]">
                    <DisplayAidesAdmin
                        title="Aides to Approve"
                        isLoading={isLoading}
                        aides={aides}
                    />
                </div>
                <br />
                <div className="ml-[300px]">
                    <div className="flex items-center cursor-pointer" onClick={toggleAvailableAides}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-6 w-6 transform ${isAvailableAidesVisible ? 'rotate-0 text-white' : 'rotate-180 text-white'}`}
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
                                {isAvailableAidesVisible ? 'Collapse Available Aides' : 'Expand Available Aides'}
                            </h1>
                        </div>
                    </div>
                    <br/>
                    {isAvailableAidesVisible && (
                        <DisplayAidesToClose
                            title="Available Aides"
                            isLoading={isLoading}
                            aides={aides}
                        />
                    )}
                </div>
            </div>
            <AdminFooter />
        </div>
    )
}

export default AdminAides;
