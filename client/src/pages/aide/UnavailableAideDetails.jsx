import React, {useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CountBox, CustomButton, Loading, Navbar, Footer } from '../../components';
import { useStateContext } from '../../context/AideContext';
import { calculateBarPercentage, daysLeft } from '../../utils';
import AuthChecker from '../../utils/handle.js';

const AideDetails = () => {

    const { state } = useLocation();
    const { getRequestersForFull, contract, address, getRequestersCountForFull } = useStateContext();
    const[isLoading, setIsLoading] = useState(false);
    const[requesters, setRequesters] = useState([]);
    const [currentRequesterAmount, setCurrentRequesterAmount] = useState([]);
    const remainingDays = daysLeft(state.deadline);
    const [isLoadingRequesters, setIsLoadingRequesters] = useState(true);

    const fetchRequesters = async () => {
      setIsLoadingRequesters(true);
      try {
        const data = await getRequestersForFull(state.pId);
        setRequesters(data);
        const requesterCount = await getRequestersCountForFull(state.pId);
        setCurrentRequesterAmount(requesterCount);
      } finally {
        setIsLoadingRequesters(false);
      }
    };

    useEffect(() => {
      if(contract) fetchRequesters();
    }, [contract, address])  

    const formatDeadline = (deadline) => {
      const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
      return new Date(deadline).toLocaleDateString('en-GB', options);
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
                    width: `${calculateBarPercentage(state.maxRequesters, currentRequesterAmount)}%`,
                    maxWidth: '100%',
                  }}>
                </div>
              </div>
            </div>
            <div className='flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]'>
              <CountBox title="Days Left" value={remainingDays} />
              <CountBox title={`Requests of ${state.maxRequesters}`} value={isLoadingRequesters ? <Loading/>: currentRequesterAmount}/>
              <CountBox title ='Total Requests' value={requesters.length}/>
            </div>
          </div>
          <div className="mt-[30px] flex lg:flex-row flex-col gap-5 max-w-[800px] mx-auto">
              <div className='flex-[2] flex flex-col gap-[40px]'>
                  <div>
                      <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase"> Aide Title </h4>
                      <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
                          <h4 className="font-epilogue font-normal text-[14px] text-white break-all">{state.title}</h4>
                      </div>
                  </div>
              </div>
          </div>
          <div className="mt-[30px] flex lg:flex-row flex-col gap-5 max-w-[800px] mx-auto">
              <div className='flex-[2] flex flex-col gap-[40px]'>
                  <div>
                      <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase"> Aide Deadline</h4>
                      <div className="mt-[20px]">
                          <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{formatDeadline(state.deadline)} 12:00AM</p>
                      </div>
                  </div>
              </div>
          </div>
          <div className="mt-[30px] flex lg:flex-row flex-col gap-5 max-w-[800px] mx-auto">
              <div className='flex-[2] flex flex-col gap-[40px]'>
                  <div>
                      <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase"> Aide Description </h4>
                      <div className="mt-[20px]">
                          <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{state.description}</p>
                      </div>
                  </div>
              </div>
          </div>
          <div className="mt-[30px] flex lg:flex-row flex-col gap-5 max-w-[800px] mx-auto">
              <div className='flex-[2] flex flex-col gap-[40px]'>
                  <div>
                      <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase"> Maximum Requesters </h4>
                      <div className="mt-[20px]">
                          <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify"> {state.maxRequesters.toNumber()} </p>
                      </div>
                  </div>
              </div>
          </div>
            <div className='flex-1'>
            <div className='mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px] max-w-[812px] mx-auto'>
                <p className='font-epilogue font-semibold font-medium text-[20px] leading-[30px] text-center text-[#808191]'>
                  This Aide is closed
                </p>
                  <div className='mt-[5px]'>
                  <div className='my-[20px] p-4 bg-[#13131a] rounded-[10px]'>
                    <h4 className='font-epilogue font-semibold text-[14px] leading-[22px] text-white'>
                      <CustomButton
                        btnType = "button"
                        title="This aide is no longer available."
                        styles="max-w-[715px] w-full bg-[gray] hover:bg-[gray]"
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