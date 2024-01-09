import React, { useContext, createContext } from 'react';
import {contractABI, contractAddress} from '../utils/constants/attendanceConstant'; 
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

    const publishCourse = async (form) => {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const address = window.ethereum.selectedAddress 
      try {
        if (!address) {
          await connect();
        }
    
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        //console.log("from context lecturer is:", form.lecturer);
        //console.log('From context start time is:', startTime);
        //console.log('From context end time is:', endTime);
        const data = await contractWithSigner.createCourse(
          form.lecturer,
          form.courseName,
          form.description, 
          form.department,
          form.image,
          //startTime,
          //endTime,
        );
        console.log('Contract call success', data);

      } catch (error) {
        console.error('Contract call failure', error);
      }
    };

    const getCourses = async (department) => {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const courses = await contractWithSigner.getCourses(department);

      const parsedCourses = courses.map((course, i) => ({
        lecturer: course.lecturer,
        courseName: course.courseName,
        description: course.description,
        department: course.department,
        //startTime: course.startTime,
        //endTime: course.endTime,
        image: course.image,
        pId: i,
      }));
      return parsedCourses;
    };
/*
    const getBlockTime = async() => {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const blockTime = await contractWithSigner.getBlockTime();
      return blockTime;
    }

    const isClassTime = async(pId) => {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const classTime = await contractWithSigner.getClassTime(pId);
      return classTime;
    }
*/
    const getAttendees = async (pId) => {
      try {
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        const attendees = await contractWithSigner.getAttendees(pId);
        
        if (attendees) {
          const numberOfAttendees = attendees.length;
          const parsedAttendees = [];
    
          for (let i = 0; i < numberOfAttendees; i++) {
            parsedAttendees.push({
              attendee: attendees[i],
            });
          }
    
          return parsedAttendees;
        } else {
          return [];
        }
      } catch (error) {
        console.error('Error in getAttendees:', error);
        return [];
      }
    }

    const attendCourse = async(pId) => {
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const data = await contractWithSigner.attendCourse(pId);

      return data;
    }

    const getAttendeesCount = async (pId) => {
      try {
          const signer = provider.getSigner();
          const contractWithSigner = contract.connect(signer);
          const attendeesCount = await contractWithSigner.getNumberOfAttendees(pId);
          return attendeesCount.toNumber();
      } catch (error) {
          console.error('Error in getAttendeesCount:', error);
        }
    };

    const getAttendeesCountForClosed = async (pId) => {
      try {
          const signer = provider.getSigner();
          const contractWithSigner = contract.connect(signer);
          const attendeesCount = await contractWithSigner.getNumberOfAttendeesForClosed(pId);
          return attendeesCount.toNumber();
      } catch (error) {
          console.error('Error in getAttendeesCountForClosed:', error);
        }
    };

    const getLecturer = async(pId) => {
      try{ 
        const signer = provider.getSigner();
          const contractWithSigner = contract.connect(signer);
          const lecturerName = await contractWithSigner.getLecturer(pId);
          return lecturerName;
      } catch(error){
        console.error('Error in getting lecturer', error);
      }
    }
/*
    const getAides = async () => {
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
    };

    const getFullAides = async () => {
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
          return 1;
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
          return 1;
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
*/

    return (
        <StateContext.Provider
        value={{
            address,
            contract,
            connect,
            createCourse: publishCourse,
            getCourses,
            getAttendees,
            attendCourse,
            getAttendeesCount,
            getAttendeesCountForClosed,
            getLecturer,
        }}
        >
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);