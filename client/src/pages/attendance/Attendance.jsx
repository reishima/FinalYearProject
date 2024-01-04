import React, { useState, useEffect } from 'react';
import { DisplayCourses, Navbar, Footer } from '../../components/index.js';
import { useStateContext } from '../../context/AttendanceContext.jsx';
import AuthChecker from '../../utils/handle.js';

const Attendance = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [courses, setCourses] = useState([]);

    const {address, contract, getCourses} = useStateContext;

    const fetchCourses = async() => {
        setIsLoading(true);
        const data = await getCourses();
        setCourses(data);
        setIsLoading(false);
    }

    useEffect(() => {
        if(contract) fetchCourses();
    }, [address, contract]);

    return(
        <div className="relative sm:-8 p-4 pl-9 bg-[#13131a] min-h-screen">
            <div className="bg-[#13131a]">
            <AuthChecker/>
                <Navbar/>
                <DisplayCourses
                    title="All Courses"
                    isLoading = {isLoading}
                    courses = {courses}
                />
            </div>
            <Footer />
        </div>
    )
}

export default Attendance;