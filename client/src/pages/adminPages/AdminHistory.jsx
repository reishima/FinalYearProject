import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Footer } from '../../components/index.js';
import AdminChecker from '../../utils/adminChecker.js';
import {  FaRegHandshake, FaBook, FaChalkboardTeacher } from 'react-icons/fa';  
import { TbClipboardList } from "react-icons/tb";


const AdminHistoryPage = () => {
    const commonStyles = 'min-h-[200px] min-w-[200px] sm:px-0 px-4 sm:min-w-[150px] flex flex-col items-center justify-center border-2 border-[#8934eb] rounded-lg text-lg font-light text-white font-semibold';

    const historyItems = [
        { path: '/admin/history/attendance-history', label: 'Attendance History', icon: TbClipboardList },
        { path: '/admin/history/aide-history', label: 'Aide History', icon: FaRegHandshake },
        { path: '/admin/history/library-history', label: 'Library History', icon: FaBook },
        { path: '/admin/history/user-history', label: 'User History', icon: FaChalkboardTeacher },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#13131a] items-center justify-center mx-auto">
            <AdminChecker />
            <Navbar />
            <div className="flex-1 flex flex-col items-center">
                <h2 className="text-white text-4xl mb-6 mt-[200px]"> History </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {historyItems.map((item, index) => (
                        <Link key={index} to={item.path} className={commonStyles}>
                            <div className="mb-2">
                                {React.createElement(item.icon, { size: 50, className: 'text-white' })}
                            </div>
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AdminHistoryPage;
