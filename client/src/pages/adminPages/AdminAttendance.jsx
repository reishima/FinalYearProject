import React, { useState, useEffect } from 'react';
import {  Navbar, Footer } from '../../components/index.js';
import { DisplayAttendanceAdmin, DisplayAttendanceToClose } from './adminindex.js';
import { useStateContext } from '../../context/AttendanceContext.jsx';
import AdminChecker from '../../utils/adminChecker.js';

const AdminCourses = () => {
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
        <div className="relative sm:-8 p-4 pl-9 bg-[#13131a] min-h-screen flex flex-col">
            <div className="bg-[#13131a] flex-grow">
            <AdminChecker/>
                <Navbar/>
                <div className="ml-[300px] ">
                    <DisplayAttendanceToClose
                        title="Open Classes"
                        isLoading = {isLoading}
                        aides = {courses}
                    />
                </div>
                <br/>
                <div className="ml-[300px] ">
                    <DisplayAttendanceAdmin
                        title="Closed Classes"
                        isLoading = {isLoading}
                        courses = {courses}
                    />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default AdminCourses;