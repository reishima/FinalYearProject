import React, { useContext, createContext } from 'react';
import {contractABI, contractAddress} from '../utils/constants/aideConstant'; 
import {ethers} from 'ethers';
const {ethereum} = window;

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
  
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    const address = window.ethereum.selectedAddress // Get the connected Ethereum address

    const connect = async () => {
        try {
        // Request user's permission to connect Metamask
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
        console.error('Metamask connection error:', error);
        }
    };

    const publishAide = async (form) => {
      const provider = new ethers.providers.Web3Provider(ethereum);
  
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      const address = window.ethereum.selectedAddress // Get the connected Ethereum address
      try {
        // Connect Metamask if not already connected
        if (!address) {
          await connect();
        }
    
        // Create a signer using the connected Ethereum address
        const signer = provider.getSigner();
        // Create a contract instance with the signer
        const contractWithSigner = contract.connect(signer);
        
        const data = await contractWithSigner.createAide(
          address, // owner
          form.title, // title
          form.description, // description
          form.target,
          new Date(form.deadline).getTime(), // deadline
          form.image
        );
    
        console.log('Contract call success', data);
      } catch (error) {
        console.error('Contract call failure', error);
      }
    };
    

    const getAides = async () => {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const aides = await contractWithSigner.getAides();
      const parsedAides = aides.map((aide, i) => ({
        owner: aide.owner,
        title: aide.title,
        description: aide.description,
        target: ethers.utils.formatEther(aide.target.toString()),
        deadline: aide.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(aide.amountCollected.toString()),
        image: aide.image,
        pId: i,
      }));
      return parsedAides;
    };

    const donate = async(pId, amount) => {
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const data = await contractWithSigner.sendAide(pId, {value: ethers.utils.parseEther(amount)});

      return data;
    }

    const getDonations = async(pId) => {
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const donations = await contractWithSigner.getDonators(pId);
      const numberOfDonations = donations[0].length;

      const parsedDonations = [];

      for( let i = 0; i < numberOfDonations; i++ ){
        parsedDonations.push({
          donator: donations[0][i],
          donation: ethers.utils.formatEther(donations[1][i].toString())
        })
      }

      return parsedDonations;
    }

    return (
        <StateContext.Provider
        value={{
            address,
            contract,
            connect,
            createAide: publishAide,
            getAides,
            //getUserAides,
            donate,
            getDonations,
        }}
        >
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);