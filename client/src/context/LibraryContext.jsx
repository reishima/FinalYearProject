import React, { useContext, createContext } from 'react';
import { contractABI, contractAddress } from '../utils/constants/libraryConstant'; 
import { ethers } from 'ethers';
const { ethereum } = window;

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const address = window.ethereum.selectedAddress;
    
    const connect = async () => {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
          console.error('Metamask connection error:', error);
        }
    };

    const publishBook = async (form) => {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const address = window.ethereum.selectedAddress 
      try {
        if (!address) {
          await connect();
        }
    
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        
        const data = await contractWithSigner.createBook(
          form.title, 
          form.description, 
          form.image
        );
        console.log('Contract call success');
      } catch (error) {

        console.error('Contract call failure', error);
      }
    };

    const getBooks = async () => {
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

    const getUnavailable = async() => {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const books = await contractWithSigner.getUnavailable();
      const unavailableBooks = books.map((book, i) => ({
        title: book.title,
        description: book.description,
        submission: book.submission.toNumber(),
        image: book.image,
        pId: i,
      }));
      return unavailableBooks;
    }

    const borrowBook = async(pId) => {
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const data = await contractWithSigner.borrow(pId);

      return data;
    }

    const releaseBook = async(pId) => {
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const data = await contractWithSigner.bookReturned(pId);

      return data;
    }

    const getBorrowers = async (pId) => {
      try {
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        const borrowers = await contractWithSigner.getBorrowers(pId);
        
        if (borrowers) {
          const numberOfBorrowers = borrowers.length;
          const parsedBorrowers = [];
    
          for (let i = 0; i < numberOfBorrowers; i++) {
            parsedBorrowers.push({
              borrower: borrowers[i],
            });
          }
    
          return parsedBorrowers;
        } else {
          return [];
        }
      } catch (error) {
        console.error('Error in getBorrowers:', error);
        return [];
      }
    }

    const getBorrowersForUnavailable = async(pId) => {
      try {
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        const borrowers = await contractWithSigner.getBorrowersForUnavailable(pId);
     
        if (borrowers) {
          const numberOfBorrowers = borrowers.length;
          const parsedBorrowers = [];
    
          for (let i = 0; i < numberOfBorrowers; i++) {
            parsedBorrowers.push({
              borrower: borrowers[i],
            });
          }
    
          return parsedBorrowers;
        } else {
          return [];
        }
      } catch (error) {
        console.error('Error in getBorrowers:', error);
        return [];
      }
    }

    return (
        <StateContext.Provider
          value={{
              address,
              contract,
              connect,
              createBook: publishBook,
              getBooks,
              getUnavailable,
              borrowBook,
              releaseBook,
              getBorrowers,
              getBorrowersForUnavailable,
          }}
        >
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);