import React from 'react';
import { Navbar, Footer } from '../components/index.js'

const Error = () => {
    return(
        <div className="min-h-screen flex flex-col bg-[#13131a] min-h-screen">
             <Navbar/>
            <div className="justify-center flex-1 flex items-center text-white text-bold">
                <div> That page does not exist! </div>
            </div>
            <Footer />
        </div>
    )
}

export default Error;