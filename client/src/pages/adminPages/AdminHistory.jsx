import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import { Navbar, Footer } from '../../components/index.js';
import AdminChecker from '../../utils/adminChecker.js';

const AdminHistoryPage = () => {

    return (
        <div className="min-h-screen flex flex-col bg-[#13131a] min-h-screen">
            <AdminChecker />
            <Navbar />
            <div className="justify-center flex-1 flex items-center">
                <h2 className="text-white text-2xl">Admin History Page</h2>
                {/* Add a link to AttendanceHistory */}
                <Link to="/admin/history/attendance-history" className="text-blue-500 hover:underline">
                    Go to Attendance History
                </Link>
            </div>
            <Footer />
        </div>
    );
};

export default AdminHistoryPage;