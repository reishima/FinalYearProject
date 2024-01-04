import React, {useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CountBox, CustomButton, Loading, Navbar, Footer } from '../../components';
import { useStateContext } from '../../context/LibraryContext.jsx';
import AuthChecker from '../../utils/handle.js';

const BookDetails = () => {

    const { state } = useLocation();
    const navigate = useNavigate();
    const {borrowBook, getBorrowers, contract, address} = useStateContext();
    const[isLoading, setIsLoading] = useState(false);
    const[borrowers, setBorrowers] = useState([]);
  
    const fetchBorrowers = async () => {
      const data = await getBorrowers(state.pId);
      setBorrowers(data);
    }

    useEffect(() => {
      if(contract) fetchBorrowers();
    }, [contract, address])

    const handleBorrow = async () => {
      setIsLoading(true);
      try {
        await borrowBook(state.pId);

        setIsLoading(false);
      } catch (error) {
        console.error("Error borrowing: ", error);
      } finally {
        navigate('/library');
        setIsLoading(false);
      }
    }

    return (
        <div className="relative sm:-8 p-4 pl-9 bg-[#13131a] min-h-screen">
          <div className="bg-[#13131a]">
            <AuthChecker/>
            <Navbar />
            {isLoading && <Loading/>}
            <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px] max-w-[800px] mx-auto">
              <div className='flex-1 flex-col'>
                <img src={state.image} alt="campaign" className="w-[640px] h-[410px] object-cover rounded-xl" />
                <div className='relative w-[full] h-[5px] bg-[#3a3a43] mt-2'>
                  <div className='absolute h-full bg-[#4acd8d]'>
                  </div>
                </div>
              </div>
              <div className='flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]'>
                <CountBox title ='Total Borrowers' value={borrowers.length}/>
              </div>
            </div>
            <div className="mt-[60px] flex lg:flex-row flex-col gap-5 ml-[634px]">
                <div className='flex-[2] flex flex-col gap-[40px]'>
                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Book Title </h4>
                        <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
                            <h4 className="font-epilogue font-semibold text-[14px] text-white break-all ">{state.title}</h4>
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
            <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
                <div className='flex-[2] flex flex-col gap-[40px]'>
                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase ml-[634px]">Borrowers</h4>
                        <div className="mt-[20px] flex flex-col gap-4 ml-[634px]">
                           {borrowers.length > 0 ? borrowers.map((item, index) => (
                            <div key={`${item.borrower}-${index}`} className='flex justify-between items-center gap-4'>
                              <p className='font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-all'> {index + 1}. {item.borrower}</p>
                            </div>
                           )) : (
                            <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify"> No borrowers yet. Be the first one! </p>
                           )}
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex-1'>
              <div className='mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px] max-w-[812px] ml-[634px]'>
                <p className='font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]'>
                  Borrow this book
                </p>
                <div className='mt-[5px]'>
                  <div className='my-[20px] p-4 bg-[#13131a] rounded-[10px]'>
                    <h4 className='font-epilogue font-semibold text-[14px] leading-[22px] text-white'>
                      <CustomButton
                        btnType = "button"
                        title="Borrow Book"
                        styles="w-[715px] bg-[#8c6dfd]"
                        handleClick={handleBorrow}
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

export default BookDetails;