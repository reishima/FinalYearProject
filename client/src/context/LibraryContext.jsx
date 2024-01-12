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
          form.image,
          form.author,
          form.pages,
        );
        console.log('Contract call success');
      } catch (error) {
        console.error('Contract call failure:', error);
      }
    };

    const getBooks = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        const books = await contractWithSigner.getBooks();
        const parsedBooks = books.map((book, i) => ({
          title: book.title,
          description: book.description,
          image: book.image,
          author: book.author,
          pages: book.pages,
          pId: i,
        }));
        return parsedBooks;
      } catch (error) {
        console.error('Error in getBooks:', error);
      }
    };

    const getUnavailable = async() => {
      try {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        const books = await contractWithSigner.getUnavailable();
        const unavailableBooks = books.map((book, i) => ({
          title: book.title,
          description: book.description,
          image: book.image,
          author: book.author,
          pages: book.pages,
          pId: i,
        }));
        return unavailableBooks;
      } catch (error) {
        console.error('Error in getUnavailable', error);
      }
    }

    const borrowBook = async(pId) => {
      try {
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        const data = await contractWithSigner.borrow(pId);

        return data;
      } catch (error) {
        console.error("Error in borrowBook:", error);
      }
    }

    const releaseBook = async(pId) => {
      try {
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        const data = await contractWithSigner.bookReturned(pId);

        return data;
      } catch (error) {
        console.error("Error in releaseBook:", error);
      }
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