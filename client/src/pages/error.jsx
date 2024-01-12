import React from 'react';
import { Navbar, Footer } from '../components/index.js';
import { FaRobot } from 'react-icons/fa6';

const Error = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#13131a] min-h-screen">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center text-white text-bold text-xl">
                <div className="flex items-center justify-center">
                    <FaRobot className="text-[#a834eb]" size={100} />
                </div>
                <div className="mt-4">
                    ERROR 404: The page you requested does not exist!
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Error;
