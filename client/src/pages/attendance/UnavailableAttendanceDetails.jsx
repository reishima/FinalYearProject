import React, {useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import user from '../../images/user.png';
import { CountBox, CustomButton, Loading, Navbar, Footer } from '../../components';
import { useStateContext } from '../../context/AttendanceContext';
//import { daysLeft, convert } from '../../utils';
import AuthChecker from '../../utils/handle.js';

const UnavailableAttendanceDetails = () => {

    const { state } = useLocation();
    const navigate = useNavigate();
    const { contract, address,  getAttendeesForClosed, getLecturer, getAttendeesCountForClosed} = useStateContext(); 
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
        console.log(data)
        setAttendees(data);
        setLecturer(lecturer);
        const attendeeCount = await getAttendeesCountForClosed(state.pId);
        setCurrentAttendeeCount(attendeeCount);
      } finally {
        setIsLoadingAttendees(false);
      }
    }

    useEffect(() => {
      console.log(state);
      if(contract) fetchAttendees();
    }, [contract, address])

    return (
        <div className="relative sm:-8 p-4 pl-9 bg-[#13131a] min-h-screen">
          <div className="bg-[#13131a]">
            <AuthChecker/>
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
            {/*
            <div className="mt-[60px] flex lg:flex-row flex-col gap-5 max-w-[800px] mx-auto">
                <div className='flex-[2] flex flex-col gap-[40px]'>
                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Attendees</h4>
                        <div className="mt-[20px] flex flex-col gap-4">/*}
                           {/*attendees.length > 0 ? attendees.map((item, index) => (
                            <div key={`${item.attendee}-${index}`} className='flex justify-between items-center gap-4'>
                              <p className='font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-all'> {index + 1}. {item.attendee}</p>
                            </div>
                           )) : (
                            <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify"> No attendees yet. </p>
                           )}
                           
                        </div>
                    </div>
                </div>
                           </div>*/}
            <div className='flex-1'>
            <div className='mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px] max-w-[812px] mx-auto'>
                <p className='font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]'>
                  Attend the Class
                </p>
                  <div className='my-[10px] p-2 bg-[#13131a] rounded-[10px]'>
                    <h4 className='font-epilogue font-semibold text-[14px] leading-[22px] text-white'>
                      <CustomButton
                        btnType = "button"
                        title="This is a past class"
                        styles="max-w-[715px] w-full bg-[gray] hover:bg-[gray]"
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

export default UnavailableAttendanceDetails;