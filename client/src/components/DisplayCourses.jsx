import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading, BookCard } from '../components/index.js';
import { contractABI, contractAddress } from '../utils/constants/libraryConstant.js';
import { ethers } from 'ethers';
import { v4 as uuidv4 } from "uuid";

const { ethereum } = window;

const DisplayBooks = ({ title }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // Set initial loading state
  const [books, setBooks] = useState([]); // Initialize books as an empty array

  const getBooks = async () => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const provider = new ethers.providers.Web3Provider(ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const signer = provider.getSigner();
    const contractWithSigner = contract.connect(signer);
    const books = await contractWithSigner.getBooks();

    const parsedBooks = books.map((book, i) => ({
      title: book.title,
      description: book.description,
      submission: book.submission.toNumber(),
      image: book.image,
      pId: i,
    }));
    return parsedBooks;
  };

  useEffect(() => {
    // Fetch books when the component mounts
    getBooks()
      .then((parsedBooks) => {
        setBooks(parsedBooks);
        setIsLoading(false); // Set loading state to false when data is fetched
      })
      .catch((error) => {
        console.error('Failed to fetch books:', error);
        setIsLoading(false); // Set loading state to false on error
      });
  }, []);

  const handleNavigate = (book) => {
    navigate(`/library/${book.title}`, {state : book})
  }
    
  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        {title} ({books.length})
      </h1>
  
      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <Loading />
        )}
        {!isLoading && books.length === 0 && (
          <p className="font-epilogue dont-semibold text-[14px] leading-[30px] text-[#818183]">
            You have not created any books yet.
          </p>
        )}

        {!isLoading && books.length > 0 && books.map((book) => <BookCard 
          key={uuidv4()}
          {...book}
          handleClick = {() => handleNavigate(book)}
        />)}
      </div>
    </div>
  );
};

export default DisplayBooks;
