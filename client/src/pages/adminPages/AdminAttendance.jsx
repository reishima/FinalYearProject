import React, { useState, useEffect } from 'react';
import { Navbar, Footer } from '../../components/index.js';
import { DisplayAttendanceAdmin, DisplayAttendanceToClose } from './adminindex.js';
import { useStateContext } from '../../context/AttendanceContext.jsx';
import AdminChecker from '../../utils/adminChecker.js';

const AdminCourses = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [isClosedClassesVisible, setIsClosedClassesVisible] = useState(false);

    const { address, contract, getCourses } = useStateContext;

    const fetchCourses = async () => {
        setIsLoading(true);
        const data = await getCourses();
        setCourses(data);
        setIsLoading(false);
    }

    useEffect(() => {
        if (contract) fetchCourses();
    }, [address, contract]);

    const toggleClosedClasses = () => {
        setIsClosedClassesVisible(!isClosedClassesVisible);
    };

    return (
        <div className="relative sm:-8 p-4 pl-9 bg-[#13131a] min-h-screen flex flex-col">
            <div className="bg-[#13131a] flex-grow">
                <AdminChecker />
                <Navbar />
                <div className="ml-[300px] ">
                    <DisplayAttendanceToClose
                        title="Open Classes"
                        isLoading={isLoading}
                        courses={courses}
                    />
                </div>
                <br />
                <div className="ml-[300px] ">
                    <div className="flex items-center cursor-pointer" onClick={toggleClosedClasses}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-6 w-6 transform ${isClosedClassesVisible ? 'rotate-0 text-white' : 'rotate-180 text-white'}`}
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
                                {isClosedClassesVisible ? 'Collapse Closed Classes' : 'Expand Closed Classes'}
                            </h1>
                        </div>
                    </div>
                    <br/>
                    {isClosedClassesVisible && (
                        <DisplayAttendanceAdmin
                            title="Closed Classes"
                            isLoading={isLoading}
                            courses={courses}
                        />
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default AdminCourses;
