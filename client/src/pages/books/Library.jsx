import React, { useState, useEffect } from 'react';
import { DisplayBooks, Navbar, Footer, DisplayUnavailableBooks } from '../../components/index.js';
import { useStateContext } from '../../context/LibraryContext.jsx';
import AuthChecker from '../../utils/handle.js';

const Library = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const [unavailable, setUnavailable] = useState([]);

    const {address, contract, getBooks, getUnavailable} = useStateContext();

    const fetchBooks = async() => {
        setIsLoading(true);
        const data = await getBooks();
        setBooks(data);
        setIsLoading(false);
    }

    const fetchUnavailable = async() => {
        setIsLoading(true);
        const data = await getUnavailable();
        setUnavailable(data);
        setIsLoading(false);
    }

    useEffect(() => {
        if(contract) fetchBooks();
        if(contract) fetchUnavailable();
    }, [address, contract]);

    return(
        <div className="relative sm:-8 p-4 pl-9 bg-[#13131a] min-h-screen">
            <div className="bg-[#13131a]">
                <Navbar/>
                <AuthChecker/>
                <DisplayBooks
                    title="Available books"
                    isLoading = {isLoading}
                    books = {books}
                />
                <br/>
                <DisplayUnavailableBooks
                    title="Unavailable"
                    isLoading = {isLoading}
                    unavailable = {unavailable}
                />
            </div>
            <Footer />
        </div>
    )
}

export default Library;