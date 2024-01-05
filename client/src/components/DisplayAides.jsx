import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading, AideCard } from '../components/index.js';
import { contractABI, contractAddress } from '../utils/constants/aideConstant.js';
import { ethers } from 'ethers';
import { v4 as uuidv4 } from "uuid";

const { ethereum } = window;

const DisplayAides = ({ title }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [aides, setAides] = useState([]); 

  useEffect(() => {
    getAides()
      .then((parsedAides) => {
        setAides(parsedAides);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch aides:', error);
        setIsLoading(false); 
      });
  }, []);

  const getAides = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const signer = provider.getSigner();
    const contractWithSigner = contract.connect(signer);
    const aides = await contractWithSigner.getAides();
    console.log('All Aides:', aides);
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

  const handleNavigate = (aide) => {
    navigate(`/student-aide/${aide.title}`, {state : aide})
  }
    
  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        {title} ({aides.length})
      </h1>
  
      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <Loading />
        )}
        {!isLoading && aides.length === 0 && (
          <p className="font-epilogue dont-semibold text-[14px] leading-[30px] text-[#818183]">
            There are currently no available aides.
          </p>
        )}

        {!isLoading && aides.length > 0 && aides.map((aide) => <AideCard 
          key={uuidv4()}
          {...aide}
          handleClick = {() => handleNavigate(aide)}
        />)}
      </div>
    </div>
  );
};

export default DisplayAides;
