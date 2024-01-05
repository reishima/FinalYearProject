import React, { useState, useEffect } from 'react';
import { DisplayAides, Navbar, Footer, DisplayUnavailableAides } from '../../components/index.js';
import { useStateContext } from '../../context/AideContext.jsx';
import AdminChecker from '../../utils/adminChecker.js';

const AdminAides = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [aides, setAides] = useState([]);

    const {address, contract, getAides} = useStateContext;

    const fetchAides = async() => {
        setIsLoading(true);
        const data = await getAides();
        setAides(data);
        setIsLoading(false);
    }

    useEffect(() => {
        if(contract) fetchAides();
    }, [address, contract]);

    return(
        <div className="relative sm:-8 p-4 pl-9 bg-[#13131a] min-h-screen flex flex-col">
            <div className="bg-[#13131a] flex-grow">
                <Navbar/>
                <AdminChecker/>
                <div className="ml-[300px] ">
                <div className="text-white text-bold"> DISPLAY LIST OF BORROWERS WITH AIDES TO APPROVE/REJECT </div>
                    <DisplayAides 
                        title="Available Aides"
                        isLoading = {isLoading}
                        aides = {aides}
                    />
                </div>
                <br/>
                <div className="ml-[300px] ">
                    <DisplayUnavailableAides 
                        title="Unavailable Aides"
                        isLoading = {isLoading}
                        aides = {aides}
                    />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default AdminAides;