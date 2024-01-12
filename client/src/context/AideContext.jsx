import React, { useContext, createContext } from 'react';
import {contractABI, contractAddress} from '../utils/constants/aideConstant'; 
import {ethers} from 'ethers';
const {ethereum} = window;

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

    const publishAide = async (form) => {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const address = window.ethereum.selectedAddress 
      try {
        if (!address) {
          await connect();
        }
    
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        
        const data = await contractWithSigner.createAide(
          form.title,
          form.description, 
          form.maxRequesters,
          new Date(form.deadline).getTime(),
          form.image
        );
        console.log('Contract call success');

      } catch (error) {
        console.error('Contract call failure', error);
      }
    };

    const getAides = async () => {
      try{
        const provider = new ethers.providers.Web3Provider(ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        const aides = await contractWithSigner.getAides();

        const parsedAides = aides.map((aide, i) => ({
          title: aide.title,
          description: aide.description,
          maxRequesters: aide.maxRequesters,
          deadline: aide.deadline.toNumber(),
          image: aide.image,
          pId: i,
        }));
        return parsedAides;
      } catch (error) {
        console.error("Error in getAides:", error);
      }
    };

    const getFullAides = async () => {
      try{
        const provider = new ethers.providers.Web3Provider(ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        const aides = await contractWithSigner.getFullAides();
        const fullAides = aides.map((aide, i) => ({
          title: aide.title,
          description: aide.description,
          maxRequesters: aide.maxRequesters,
          deadline: aide.deadline.toNumber(),
          image: aide.image,
          pId: i,
        }));
        return fullAides;
      } catch (error) {
        console.error('Error in getFullAides:', error);
      }
    };

    const requestAide = async(pId) => {
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        const data = await contractWithSigner.requestAide(pId);

        return data;
    }

    const getRequesters = async (pId) => {
      try {
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        const requesters = await contractWithSigner.getRequesters(pId);
        
        if (requesters) {
          const numberOfRequesters = requesters.length;
          const parsedRequesters = [];
    
          for (let i = 0; i < numberOfRequesters; i++) {
            parsedRequesters.push({
              requester: requesters[i],
            });
          }
    
          return parsedRequesters;
        } else {
          return [];
        }
      } catch (error) {
        console.error('Error in getRequesters:', error);
        return [];
      }
    }

    const getRequestersCount = async (pId) => {
      try {
          const signer = provider.getSigner();
          const contractWithSigner = contract.connect(signer);
          const requestersCount = await contractWithSigner.getNumberOfRequesters(pId);
          return requestersCount.toNumber();
      } catch (error) {
          console.error('Error in getRequestersCount:', error);
          return 0;
        }
    };

    const getRequestersCountForFull = async (pId) => {
      try {
          const signer = provider.getSigner();
          const contractWithSigner = contract.connect(signer);
          const requestersCount = await contractWithSigner.getNumberOfRequestersforFull(pId);
          return requestersCount.toNumber();
      } catch (error) {
          console.error('Error in getRequestersCount:', error);
          return 0;
        }
    };

    const getRequestersForFull = async (pId) => {
      try {
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        const requesters = await contractWithSigner.getRequestersforFull(pId);
        
        if (requesters) {
          const numberOfRequesters = requesters.length;
          const parsedRequesters = [];
    
          for (let i = 0; i < numberOfRequesters; i++) {
            parsedRequesters.push({
              requester: requesters[i],
            });
          }
    
          return parsedRequesters;
        } else {
          return [];
        }
      } catch (error) {
        console.error('Error in getRequestersforFull:', error);
        return [];
      }
    }

    const getBlockchainIDsForFullAides = async (pId) => {
      try {
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        const requesters = await contractWithSigner.getRequestersforFull(pId);
  
        if (requesters) {
          const blockchainIDs = requesters.map((blockchainID) => blockchainID);
          return blockchainIDs;
        } else {
          return [];
        }
      } catch (error) {
        console.error('Error in getBlockchainIDsForFullAides:', error);
        return [];
      }
    };
    
    const closeAide = async (pId) => {
      try{
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        const data = await contractWithSigner.closeAide(pId);
        return data;
      } catch(error) { 
        console.error("Error closing aide:", error);
      }
    }

    return (
        <StateContext.Provider
        value={{
            address,
            contract,
            connect,
            createAide: publishAide,
            getAides,
            getFullAides,
            requestAide,
            getRequesters,
            getRequestersForFull,
            getRequestersCount,
            getRequestersCountForFull,
            getBlockchainIDsForFullAides,
            closeAide,
        }}
        >
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);