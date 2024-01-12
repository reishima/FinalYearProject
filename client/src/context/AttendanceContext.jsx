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
        const data = await contractWithSigner.createCourse(
          form.lecturer,
          form.courseName,
          form.description, 
          form.department,
          form.courseCode,
          form.week,
          form.programLevel,
        );
        console.log('Contract call success');

      } catch (error) {
        console.error('Contract call failure:', error);
      }
    };

    const getCourses = async (department, programLevel) => {
      try{
        const provider = new ethers.providers.Web3Provider(ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        const courses = await contractWithSigner.getCourses(department, programLevel);

        const parsedCourses = courses.map((course, i) => ({
          lecturer: course.lecturer,
          courseName: course.courseName,
          description: course.description,
          department: course.department,
          courseCode: course.courseCode,
          week: course.week,
          programLevel: course.programLevel,
          pId: i,
        }));
        return parsedCourses;
      } catch (error) {
        console.error("Error in getCourses", error);
      }
    };

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

    const getAttendeesForClosed = async (pId) => {
      try {
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        const attendees = await contractWithSigner.getAttendeesForClosed(pId);
        
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
        console.error('Error in getAttendeesForClosed:', error);
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
          const attendeesCount = await contractWithSigner.getNumberOfAttendeesforClosed(pId);
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

    const closeCourse = async (pId) => {
      try{
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        const data = await contractWithSigner.closeAttendance(pId);
        return data;
      } catch(error) { 
        console.error("Error closing aide:", error);
      }
    }
    
    const getBlockchainIDsForClosedClasses = async(pId) => {
      try {
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        const attendees = await contractWithSigner.getAttendeesForClosed(pId);
  
        if (attendees) {
          const blockchainIDs = attendees.map((blockchainID) => blockchainID);
          return blockchainIDs;
        } else {
          return [];
        }
      } catch (error) {
        console.error('Error in getBlockchainIDsForClosedClasses:', error);
        return [];
      }
    }

    return (
        <StateContext.Provider
        value={{
            address,
            contract,
            connect,
            createCourse: publishCourse,
            getCourses,
            getAttendees,
            getAttendeesForClosed,
            attendCourse,
            getAttendeesCount,
            getAttendeesCountForClosed,
            getLecturer,
            closeCourse,
            getBlockchainIDsForClosedClasses,
        }}
        >
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);