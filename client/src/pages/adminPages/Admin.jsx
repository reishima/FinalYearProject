import React from 'react';
import { Navbar, Footer } from '../../components/index.js'
import AdminChecker from '../../utils/adminChecker.js';

const Admin = () => {
    return(
        <div className="min-h-screen flex flex-col bg-[#13131a] min-h-screen">
            <AdminChecker/>
             <Navbar/>
            <div className="justify-center flex-1 flex items-center text-white text-bold">
                <div> This is an admin page </div>
            </div>
            <Footer />
        </div>
    )
}

export default Admin;