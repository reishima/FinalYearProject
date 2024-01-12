import React, { useState, useEffect } from 'react';
import { DisplayAides, Navbar, Footer, DisplayUnavailableAides } from '../../components/index.js';
import { useStateContext } from '../../context/AideContext.jsx';
import AuthChecker from '../../utils/handle.js';

const StudentAide = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [aides, setAides] = useState([]);
    const [isUnavailableAidesVisible, setIsUnavailableAidesVisible] = useState(false);

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

    const toggleUnavailableAides = () => {
        setIsUnavailableAidesVisible(!isUnavailableAidesVisible);
    };

    return (
        <div className="relative sm:-8 p-4 pl-9 bg-[#13131a] min-h-screen flex flex-col">
            <div className="bg-[#13131a] flex-grow">
                <Navbar />
                <AuthChecker />
                <div className="ml-[300px]">
                    <DisplayAides
                        title="Available Aides"
                        isLoading={isLoading}
                        aides={aides}
                    />
                </div>
                <br />
                <div className="ml-[300px]">
                    <div className="flex items-center cursor-pointer" onClick={toggleUnavailableAides}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-6 w-6 transform ${isUnavailableAidesVisible ? 'rotate-0 text-white' : 'rotate-180 text-white'}`}
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
                                {isUnavailableAidesVisible ? 'Collapse Unavailable Aides' : 'Expand Unavailable Aides'}
                            </h1>
                        </div>
                    </div>
                    {isUnavailableAidesVisible && (
                        <DisplayUnavailableAides
                            title={`Unavailable Aides`}
                            isLoading={isLoading}
                            aides={aides}
                            isArrowVisible={isUnavailableAidesVisible}
                        />
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default StudentAide;
