import React, { useContext, createContext } from 'react';
import { contractABI, contractAddress } from '../utils/constants/attendanceConstant'; 
import { ethers } from 'ethers';
const { ethereum } = window;

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
  
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    const address = window.ethereum.selectedAddress ; // Get the connected Ethereum address

    const connect = async () => {
        try {
        // Request user's permission to connect Metamask
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
        console.error('Metamask connection error:', error);
        }
    };

    const publishCourse = async(form) => {
      const provider = new ethers.providers.Web3Provider(ethereum);
  
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      const address = window.ethereum.selectedAddress ; 
        try {
            if (!address) {
              await connect();
            }
      
            const signer = provider.getSigner();
            const contractWithSigner = contract.connect(signer);
            const data = await contractWithSigner.createCourse(
              address, 
              form.courseName, 
              form.description,
              new Date(form.deadline).getTime(), 
              form.image
            );
      
            console.log('Contract call success', data);
          } catch (error) {
            console.error('Contract call failure', error);
          }
    } 

    const getCourses = async () => {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const courses= await contractWithSigner.getCourses();
      const parsedCourses = courses.map((course, i) => ({
        owner: course.owner,
        courseName: course.courseName,
        description: course.description,
        deadline: course.deadline.toNumber(),
        image: course.image,
        pId: i,
      }));
      return parsedCourses;
    };

    const attend = async (pId) => {
      try {
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
    
        const options = {
          gasLimit: 30000, 
        };
    
        const data = await contractWithSigner.attendCourse(pId, options);
        return data;
      } catch (error) {
        console.error("Error attending course: ", error);
        throw error;
      }
    };
    

    return (
        <StateContext.Provider
        value={{
            address,
            contract,
            connect,
            createCourse: publishCourse,
            getCourses,
            attend,
        }}
        >
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);