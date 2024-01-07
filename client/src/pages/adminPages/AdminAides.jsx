import React, { useState, useEffect } from 'react';
import { Navbar, Footer } from '../../components/index.js';
import { DisplayAidesAdmin, DisplayAidesToClose } from '../adminPages/adminindex.js';
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
                    <DisplayAidesAdmin
                        title="Aides to Approve"
                        isLoading = {isLoading}
                        aides = {aides}
                    />
                </div>
                <br/>
                <div className="ml-[300px] ">
                    <DisplayAidesToClose
                        title="Available Aides"
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