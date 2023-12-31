import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading, AideCard } from '../components/index.js';
import { contractABI, contractAddress } from '../utils/constants/aideConstant.js';
import { ethers } from 'ethers';
import { v4 as uuidv4 } from "uuid";

const { ethereum } = window;

const DisplayAides = ({ title }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // Set initial loading state
  const [aides, setAides] = useState([]); // Initialize aides as an empty array

  useEffect(() => {
    // Fetch aides when the component mounts
    getAides()
      .then((parsedAides) => {
        setAides(parsedAides);
        setIsLoading(false); // Set loading state to false when data is fetched
      })
      .catch((error) => {
        console.error('Failed to fetch aides:', error);
        setIsLoading(false); // Set loading state to false on error
      });
  }, []);

  const getAides = async () => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const provider = new ethers.providers.Web3Provider(ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const signer = provider.getSigner();
    const contractWithSigner = contract.connect(signer);
    const aides = await contractWithSigner.getAides();

    const parsedAides = aides.map((aide, i) => ({
      owner: aide.owner,
      title: aide.title,
      description: aide.description,
      target: ethers.utils.formatEther(aide.target.toString()),
      deadline: aide.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(aide.amountCollected.toString()),
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
            You have not created any campaigns yet.
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
