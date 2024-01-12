import React, {useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CountBox, CustomButton, Loading, AdminNavbar, AdminFooter } from '../../components';
import { useStateContext } from '../../context/LibraryContext.jsx';
import AdminChecker from '../../utils/adminChecker.js';

const AdminBookDetails = () => {

    const { state } = useLocation();
    const navigate = useNavigate();
    const { releaseBook, getBorrowersForUnavailable, contract, address} = useStateContext();
    const[isLoading, setIsLoading] = useState(false);
    const[borrowers, setBorrowers] = useState([]);
    const[isLoadingBorrowers, setIsLoadingBorrowers] = useState([]);
  
    const fetchBorrowers = async () => {
      setIsLoadingBorrowers(true);
      try{ 
        const data = await getBorrowersForUnavailable(state.pId);
        setBorrowers(data);
      } finally {
        setIsLoadingBorrowers(false);
      }
    }

    useEffect(() => {
      if(contract) fetchBorrowers();
    }, [contract, address])

    const handleReturn = async () => {
      setIsLoading(true);
      try {
        await releaseBook(state.pId);

        setIsLoading(false);
      } catch (error) {
        console.error("Error returning Book: ", error);
      } finally {
        navigate('/admin/admin-library');
        setIsLoading(false);
      }
    }

    return (
        <div className="relative sm:-8 p-4 pl-9 bg-[#13131a] min-h-screen">
          <div className="bg-[#13131a]">
            <AdminChecker/>
            <AdminNavbar />
            {isLoading && <Loading/>}
            <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px] max-w-[800px] mx-auto">
              <div className='flex-1 flex-col'>
                <img src={state.image} alt="campaign" className="w-[640px] h-[410px] object-cover rounded-xl" />
                <div className='relative w-full h-[5px] bg-[#3a3a43] mt-2'>
                  <div className='absolute h-full bg-[#4acd8d]'>
                  </div>
                </div>
              </div>
              <div className='flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]'>
                <CountBox title ='Total Borrowers' value={isLoadingBorrowers ? <Loading/>: borrowers.length}/>
              </div>
            </div>
            <div className="mt-[30px] flex lg:flex-row flex-col gap-5 max-w-[800px] mx-auto">
                <div className='flex-[2] flex flex-col gap-[40px]'>
                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase"> Book Title </h4>
                        <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
                            <h4 className="font-epilogue font-normal text-[14px] text-white break-all">{state.title}</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-[30px] flex lg:flex-row flex-col gap-5 max-w-[800px] mx-auto">
                <div className='flex-[2] flex flex-col gap-[40px]'>
                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase"> Author </h4>
                        <div className="mt-[20px]">
                            <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{state.author}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-[30px] flex lg:flex-row flex-col gap-5 max-w-[800px] mx-auto">
                <div className='flex-[2] flex flex-col gap-[40px]'>
                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase"> Number of Pages </h4>
                        <div className="mt-[20px]">
                            <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{state.pages}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-[30px] flex lg:flex-row flex-col gap-5 max-w-[800px] mx-auto">
                <div className='flex-[2] flex flex-col gap-[40px]'>
                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase"> Book Description </h4>
                        <div className="mt-[20px]">
                            <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{state.description}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-[30px] flex lg:flex-row flex-col gap-5 max-w-[800px] mx-auto">
                <div className='flex-[2] flex flex-col gap-[40px]'>
                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase max-w-[800px] mx-auto]"> Borrowers </h4>
                        <div className="mt-[20px] flex flex-col gap-4 max-w-[800px] mx-auto">
                           {borrowers.length > 0 ? borrowers.map((item, index) => (
                            <div key={`${item.borrower}-${index}`} className='flex justify-between items-center gap-4'>
                              <p className='font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-all'> {index + 1}. {item.borrower}</p>
                            </div>
                           )) : (
                            <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify"> This book has no recorded borrowers. </p>
                           )}
                           
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex-1'>
              <div className='mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px] max-w-[812px] mx-auto'>
                <p className='font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]'>
                  Mark Book as Returned
                </p>
                <div className='mt-[5px]'>
                  <div className='my-[20px] p-4 bg-[#13131a] rounded-[10px]'>
                    <h4 className='font-epilogue font-semibold text-[14px] leading-[22px] text-white'>
                      <CustomButton
                        btnType = "button"
                        title="Book Returned"
                        styles="w-[715px] bg-[#8c6dfd]"
                        handleClick={handleReturn}
                      />
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <AdminFooter/>
        </div>
      );
    };

export default AdminBookDetails;