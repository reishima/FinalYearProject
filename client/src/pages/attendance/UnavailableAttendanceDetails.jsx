import React, {useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import user from '../../images/user.png';
import { CustomButton, Loading, Navbar, Footer } from '../../components';
import { useStateContext } from '../../context/AttendanceContext';
import AuthChecker from '../../utils/handle.js';

const UnavailableAttendanceDetails = () => {

    const { state } = useLocation();
    const { contract, address,  getAttendeesForClosed } = useStateContext(); 
    const [ isLoading, setIsLoading ] = useState(false);
    const [ attendees, setAttendees ] = useState([]);

    const fetchAttendees = async () => {
      try{
        const data = await getAttendeesForClosed(state.pId);
        setAttendees(data);
      } catch (error){
        console.error("Error fetching attenedees:", error);
      }
    }

    useEffect(() => {
      if(contract) fetchAttendees();
    }, [contract, address])

    return (
      <div className="relative sm:-8 p-4 pl-9 bg-[#13131a] min-h-screen">
      <div className="bg-[#13131a]">
          <AuthChecker />
          <Navbar />
          {isLoading && <Loading />}
          <div className="w-full flex flex-col mt-10 gap-[30px] max-w-[800px] mx-auto">
              <div className="grid grid-cols-2 gap-5">
                  <div>
                      <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase"> Course Name </h4>
                      <div className="mt-[20px]">
                          <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify"> {state.courseName} </p>
                      </div>
                  </div>
                  <div>
                      <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase"> Course Code </h4>
                      <div className="mt-[20px]">
                          <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify"> {state.courseCode} </p>
                      </div>
                  </div>
                  <div>
                      <h4 className="font-epilogue mt-[30px] font-semibold text-[18px] text-white uppercase"> Lecturer </h4>
                      <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
                          <div className='w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer'>
                              <img src={user} alt="user" className="w-[60%] h-[60%] object-contain" />
                          </div>
                          <h4 className="font-epilogue font-semibold text-[14px] text-white break-all"> {state.lecturer} </h4>
                      </div>
                  </div>
                  <div>
                      <h4 className="font-epilogue mt-[30px] font-semibold text-[18px] text-white uppercase"> Week </h4>
                      <div className="mt-[20px]">
                          <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify"> {state.week} </p>
                      </div>
                  </div>
                  <div>
                      <h4 className="font-epilogue mt-[30px] font-semibold text-[18px] text-white uppercase"> Department </h4>
                      <div className="mt-[20px]">
                          <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify"> {state.department} </p>
                      </div>
                  </div>
                  <div>
                      <h4 className="font-epilogue mt-[30px] font-semibold text-[18px] text-white uppercase"> Level of Study </h4>
                      <div className="mt-[20px]">
                          <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify"> {state.programLevel} </p>
                      </div>
                  </div>
              </div>
              <div className="mt-[30px]">
              <div className=" flex lg:flex-row flex-col gap-5 max-w-[800px] mx-auto">
                    <div className='flex-[2] flex flex-col gap-[40px]'>
                        <div>
                            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase"> Class Description </h4>
                            <div className="mt-[20px]">
                                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{state.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
                  <h4 className="mt-[30px] font-epilogue font-semibold text-[18px] text-white uppercase">Attendees</h4>
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