import React, { useState, useEffect } from 'react';
import { Navbar, Footer } from '../../components/index.js';
import { DisplayUnavailableBooksAdmin} from './adminindex.js';
import { useStateContext } from '../../context/LibraryContext.jsx';
import AdminChecker from '../../utils/adminChecker.js';

const AdminLibrary = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [unavailable, setUnavailable] = useState([]);

    const {address, contract, getUnavailable} = useStateContext();


    const fetchUnavailable = async() => {
        setIsLoading(true);
        const data = await getUnavailable();
        setUnavailable(data);
        setIsLoading(false);
    }

    useEffect(() => {
        if(contract) fetchUnavailable();
    }, [address, contract]);

    return(
        <div className="relative sm:-8 p-4 pl-9 bg-[#13131a] min-h-screen">
            <div className="bg-[#13131a]">
                <Navbar/>
                <AdminChecker/>
                <br/>
                <DisplayUnavailableBooksAdmin
                    title="Books to be returned"
                    isLoading = {isLoading}
                    unavailable = {unavailable}
                />
            </div>
            <Footer />
        </div>
    )
}

export default AdminLibrary;