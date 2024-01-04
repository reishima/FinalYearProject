import React from 'react';
import { Navbar, Footer } from '../components/index.js'
import AuthChecker from '../utils/handle.js';

const FAQ = () => {
    return(
        <div className="min-h-screen flex flex-col bg-[#13131a] min-h-screen">
            <AuthChecker/>
             <Navbar/>
            <div className="justify-center flex-1 flex items-center">
                <div className="text-white"> FAQ </div>
            </div>
            <Footer />
        </div>
    )
}

export default FAQ;