import React, {useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import user from '../../images/user.png';
import { CountBox, CustomButton, Loading, Navbar, Footer } from '../../components/index.js';
import { useStateContext } from '../../context/AttendanceContext.jsx';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { database } from '../../utils/FirebaseConfig.js';
//import { daysLeft, convert } from '../../utils';
import AdminChecker from '../../utils/adminChecker.js';

const AdminPastAttendanceDetails = () => {

    const { state } = useLocation();
    const navigate = useNavigate();
    const { contract, address, getAttendeesForClosed, getAttendeesCountForClosed, getLecturer, getBlockchainIDsForClosedClasses } = useStateContext(); 
    const [ isLoading, setIsLoading ] = useState(false);
    const [ lecturer, setLecturer ] = useState('');
    //const[amount, setAmount]= useState('');
    const [ attendees, setAttendees ] = useState([]);
    const [ currentAttendeeCount, setCurrentAttendeeCount ] = useState([]);
    //const remainingTime = convert(state.endTime);
    const [ isLoadingAttendees, setIsLoadingAttendees ] = useState(true);
    

    const fetchAttendees = async () => {
      setIsLoadingAttendees(true);
      try{
        const lecturer = await getLecturer(state.pId);
        const data = await getAttendeesForClosed(state.pId);
        setAttendees(data);
        setLecturer(lecturer);
        const attendeeCount = await getAttendeesCountForClosed(state.pId);
        setCurrentAttendeeCount(attendeeCount);
      } finally {
        setIsLoadingAttendees(false);
      }
    }

    useEffect(() => {
      if(contract) fetchAttendees();
    }, [contract, address])

    const getBlockchainIDsToCopy = async () => {
      try {
        const blockchainIDs = await getBlockchainIDsForClosedClasses(state.pId);
        return blockchainIDs;
      } catch (error) {
        console.error('Error getting blockchain IDs for full aides:', error);
        return [];
      }
    }

    const handleGrabEmails = async () => {
      try {
        const blockchainIDsToCopy= await getBlockchainIDsToCopy();
        console.log('Blockchain IDs to approve:', blockchainIDsToCopy);
    
        const usersCollection = collection(database, 'users');
        const emailsToCopy = [];
    
        for (const blockchainID of blockchainIDsToCopy) {
          const q = query(usersCollection, where('blockchainId', '==', blockchainID));
          const querySnapshot = await getDocs(q);
    
          querySnapshot.forEach((doc) => {
            const email = doc.data().email;
            emailsToCopy.push(email);
          });
        }
    
        console.log('Attendee Emails:', emailsToCopy);
    
        const emailsTextArea = document.createElement('textarea');
        emailsTextArea.value = emailsToCopy.join(', ');
        emailsTextArea.setAttribute('readonly', '');
        emailsTextArea.style.position = 'absolute';
        emailsTextArea.style.left = '-9999px';
    
        document.body.appendChild(emailsTextArea);
        emailsTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(emailsTextArea);
        //const emailLink = `mailto:${emailsToApprove.join(',')}?subject=Your%20Subject&body=Your%20Body%20Text`;
        //window.open(emailLink, '_blank');
        //To mailto, admin will need to go to their browsers handler. such as chrome://settings/handlers
        //then user will need to remove mail.google.com from Not allowed to handle protocols
        //then go to gmail.com and click on the handler at the url and allow
        alert('Emails copied to clipboard!');
      } catch (error) {
        console.error('Error copying emails:', error);
      }
    };

    return (
        <div className="relative sm:-8 p-4 pl-9 bg-[#13131a] min-h-screen">
          <div className="bg-[#13131a]">
            <AdminChecker/>
            <Navbar />
            {isLoading && <Loading/>}
            <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px] max-w-[800px] mx-auto">
              <div className='flex md:w-[150px] w-full flex-wrap justify-between '>
                <CountBox title ='Attendees' value={isLoadingAttendees ? <Loading/> : currentAttendeeCount}/>
              </div>
            </div>
            <div className="mt-[60px] flex lg:flex-row flex-col gap-5 max-w-[800px] mx-auto">
                <div className='flex-[2] flex flex-col gap-[40px]'>
                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase"> Lecturer </h4>
                        <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
                            <div className='w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer'>
                                <img src={user} alt="user" className="w-[60%] h-[60%] object-contain"/>
                            </div>
                            <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">{lecturer}</h4> 
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-[60px] flex lg:flex-row flex-col gap-5 max-w-[800px] mx-auto">
                <div className='flex-[2] flex flex-col gap-[40px]'>
                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase"> Class description </h4>
                        <div className="mt-[20px]">
                            <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify"> {state.description} </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-[60px] flex lg:flex-row flex-col gap-5 max-w-[800px] mx-auto">
                <div className='flex-[2] flex flex-col gap-[40px]'>
                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Attendees</h4>
                        <div className="mt-[20px] flex flex-col gap-4">
                           {attendees.length > 0 ? attendees.map((item, index) => (
                            <div key={`${item.attendee}-${index}`} className='flex justify-between items-center gap-4'>
                              <p className='font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-all'> {index + 1}. {item.attendee}</p>
                            </div>
                           )) : (
                            <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify"> No attendees yet. </p>
                           )}
                           
                        </div>
                    </div>
                </div>
                           </div>
            <div className='flex-1'>
            <div className='mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px] max-w-[812px] mx-auto'>
                <p className='font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]'>
                  Copy User Email
                </p>
                  <div className='my-[10px] p-2 bg-[#13131a] rounded-[10px]'>
                    <h4 className='font-epilogue font-semibold text-[14px] leading-[22px] text-white'>
                      <CustomButton
                        btnType = "button"
                        title="This class is already closed"
                        styles="w-full max-w-[715px] bg-[#8c6dfd]"
                        handleClick={handleGrabEmails}
                      />
                    </h4>
                </div>
              </div>
            </div>
          </div>
          <Footer/>
        </div>
      );
    };

export default AdminPastAttendanceDetails;