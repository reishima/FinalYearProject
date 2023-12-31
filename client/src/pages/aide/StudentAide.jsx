import React, { useState, useEffect } from 'react';
import { DisplayAides, Navbar, Footer } from '../../components/index.js';
import { useStateContext } from '../../context/AideContext.jsx';
import AuthChecker from '../../utils/authChecker.js';

const StudentAide = () => {
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
        <div className="relative sm:-8 p-4 pl-9 bg-[#13131a] min-h-screen">
            <div className="bg-[#13131a] ">
                <Navbar/>
                <AuthChecker/>
                <DisplayAides 
                    title="Available aides"
                    isLoading = {isLoading}
                    aides = {aides}
                />
            </div>
            <Footer />
        </div>
    )
}

export default StudentAide;