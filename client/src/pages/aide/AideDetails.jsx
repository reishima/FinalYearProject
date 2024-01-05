import React, {useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import user from '../../images/user.png';
import { CountBox, CustomButton, Loading, Navbar, Footer } from '../../components';
import { useStateContext } from '../../context/AideContext';
import { calculateBarPercentage, daysLeft } from '../../utils';
import AuthChecker from '../../utils/handle.js';

const AideDetails = () => {

    const { state } = useLocation();
    const navigate = useNavigate();
    const { requestAide, getRequesters, contract, address } = useStateContext();
    const[isLoading, setIsLoading] = useState(false);
    const[requesters, setRequesters] = useState([]);
    const remainingDays = daysLeft(state.deadline);
    
    const fetchRequesters = async () => {
      const data = await getRequesters(state.pId);
      console.log(data);
      setRequesters(data);
    }

    useEffect(() => {
      if(contract) fetchRequesters();
    }, [contract, address])

    const handleRequest = async () => {
      setIsLoading(true);
      try {
          await requestAide(state.pId);
          setIsLoading(false);
          navigate('/student-aide');
      } catch (error) {
          console.error("Error requesting aide: ", error);
          // Display a user-friendly message here
          if (error.message.includes("Aide has reached the maximum number of requesters")) {
              alert("This Aide has reached the maximum number of requesters.");
          } else {
              alert("Error requesting Aide. Please try again.");
          }
          setIsLoading(false);
      }
  };
  

    return (
        <div className="relative sm:-8 p-4 pl-9 bg-[#13131a] min-h-screen">
          <div className="bg-[#13131a]">
            <AuthChecker/>
            <Navbar />
            {isLoading && <Loading/>}
            <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px] max-w-[800px] mx-auto">
              <div className='flex-1 flex-col'>
                <img src={state.image} alt="campaign" className="w-[640px] h-[410px] object-cover rounded-xl" />
                <div className='relative w-full h-[5px] bg-[#3a3a43] mt-2'>
                  <div className='absolute h-full bg-[#4acd8d]'
                    style={{
                      width: `${calculateBarPercentage(state.maxRequesters, state.amountCollected)}%`,
                      maxWidth: '100%',
                    }}>
                  </div>
                </div>
              </div>
              <div className='flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]'>
                <CountBox title="Days Left" value={remainingDays} />
                <CountBox title={`Raised of ${state.target}`} value={state.amountCollected}/>
                <CountBox title ='Total Backers' value={requesters.length}/>
              </div>
            </div>
            <div className="mt-[60px] flex lg:flex-row flex-col gap-5 ml-[634px]">
                <div className='flex-[2] flex flex-col gap-[40px]'>
                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Creator</h4>
                        <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
                            <div className='w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer'>
                                <img src={user} alt="user" className="w-[60%] h-[60%] object-contain"/>
                            </div>
                            <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">{state.owner}</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-[60px] flex lg:flex-row flex-col gap-5 ml-[634px]">
                <div className='flex-[2] flex flex-col gap-[40px]'>
                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Story</h4>
                        <div className="mt-[20px]">
                            <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{state.description}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-[60px] flex lg:flex-row flex-col gap-5 ml-[634px]">
                <div className='flex-[2] flex flex-col gap-[40px]'>
                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase"> Requesters </h4>
                        <div className="mt-[20px] flex flex-col gap-4">
                           {requesters.length > 0 ? requesters.map((item, index) => (
                            <div key={`${item.requester}-${index}`} className='flex justify-between items-center gap-4'>
                              <p className='font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-all'> {index + 1}. {item.requester}</p>
                            </div>
                           )) : (
                            <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify"> No requesters yet for this aide. </p>
                           )}
                           
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex-1'>
            <div className='mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px] max-w-[812px] ml-[634px]'>
                <p className='font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]'>
                  Request for Aide
                </p>
                  {/*
                  <input 
                    type="number"
                    placeholder="ETH 0.1"
                    step = "0.01"
                    className='w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4d5264] rounded-[10px]'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                           />*/}
                  <div className='mt-[5px]'>
                  <div className='my-[20px] p-4 bg-[#13131a] rounded-[10px]'>
                    <h4 className='font-epilogue font-semibold text-[14px] leading-[22px] text-white'>
                      <CustomButton
                        btnType = "button"
                        title="Request Aide"
                        styles="w-[715px] bg-[#8c6dfd]"
                        handleClick={handleRequest}
                      />
                    </h4>
                </div>
              </div>
            </div>
          </div>
          </div>
          <Footer/>
        </div>
      );
    };

export default AideDetails;