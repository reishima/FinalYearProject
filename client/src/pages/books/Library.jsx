import React, { useState, useEffect } from 'react';
import { DisplayBooks, Navbar, Footer, DisplayUnavailableBooks } from '../../components/index.js';
import { useStateContext } from '../../context/LibraryContext.jsx';
import AuthChecker from '../../utils/handle.js';

const Library = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const [unavailable, setUnavailable] = useState([]);
    const [isUnavailableBooksVisible, setIsUnavailableBooksVisible] = useState(false);

    const { address, contract, getBooks, getUnavailable } = useStateContext();

    const fetchBooks = async () => {
        setIsLoading(true);
        const data = await getBooks();
        setBooks(data);
        setIsLoading(false);
    };

    const fetchUnavailable = async () => {
        setIsLoading(true);
        const data = await getUnavailable();
        setUnavailable(data);
        setIsLoading(false);
    };

    useEffect(() => {
        if (contract) {
            fetchBooks();
            fetchUnavailable();
        }
    }, [address, contract]);

    const toggleUnavailableBooks = () => {
        setIsUnavailableBooksVisible(!isUnavailableBooksVisible);
    };

    return (
        <div className="relative sm:-8 p-4 pl-9 bg-[#13131a] min-h-screen flex flex-col">
            <div className="bg-[#13131a] flex-grow">
                <Navbar />
                <AuthChecker />
                <div className="ml-[300px]">
                    <DisplayBooks
                        title="Available Books"
                        isLoading={isLoading}
                        books={books}
                        className="ml-[20px]"
                    />
                </div>
                <br />
                <div className="ml-[300px]">
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={toggleUnavailableBooks}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-6 w-6 transform ${
                                isUnavailableBooksVisible ? 'rotate-0 text-white' : 'rotate-180 text-white'
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                        <div className="ml-2">
                            <h1 className="text-white text-lg font-semibold">
                                {isUnavailableBooksVisible
                                    ? 'Collapse Unavailable Books'
                                    : 'Expand Unavailable Books'}
                            </h1>
                        </div>
                    </div>
                    <br/>
                    {isUnavailableBooksVisible && (
                        <DisplayUnavailableBooks
                            title={`Unavailable Books`}
                            isLoading={isLoading}
                            unavailable={unavailable}
                        />
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Library;
