import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading, BookCard } from '../../components/index.js';
import { contractABI, contractAddress } from '../../utils/constants/libraryConstant.js';
import { ethers } from 'ethers';
import { v4 as uuidv4 } from "uuid";

const { ethereum } = window;

const DisplayUnavailableBooksAdmin = ({ title }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); 
  const [unavailableBooks, setUnavailableBooks] = useState([]); 

  const getUnavailableBooks = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const signer = provider.getSigner();
    const contractWithSigner = contract.connect(signer);
    const unavailableBooks = await contractWithSigner.getUnavailable();

    const parsedUnavailableBooks = unavailableBooks.map((unavailableBooks, i) => ({
      title: unavailableBooks.title,
      description: unavailableBooks.description,
      submission: unavailableBooks.submission.toNumber(),
      image: unavailableBooks.image,
      pId: i,
    }));
    return parsedUnavailableBooks;
  };

  useEffect(() => {
    getUnavailableBooks()
      .then((parsedUnavailableBooks) => {
        setUnavailableBooks(parsedUnavailableBooks);
        setIsLoading(false); 
      })
      .catch((error) => {
        console.error('Failed to fetch unavailable books:', error);
        setIsLoading(false); 
      });
  }, []);

  const handleNavigate = (unavailableBooks) => {
    navigate(`/admin/admin-library/${unavailableBooks.title}`, {state : unavailableBooks})
  }
    
  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        {title} ({unavailableBooks.length})
      </h1>
  
      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <Loading />
        )}
        {!isLoading && unavailableBooks.length === 0 && (
          <p className="font-epilogue dont-semibold text-[14px] leading-[30px] text-[#818183]">
            There are no borrowed books yet.
          </p>
        )}

        {!isLoading && unavailableBooks.length > 0 && unavailableBooks.map((unavailableBooks) => <BookCard 
          key={uuidv4()}
          {...unavailableBooks}
          handleClick = {() => handleNavigate(unavailableBooks)}
        />)}
      </div>
    </div>
  );
};

export default DisplayUnavailableBooksAdmin;
