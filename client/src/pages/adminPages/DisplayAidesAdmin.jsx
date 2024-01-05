import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading, AideCard } from '../../components/index.js';
import { contractABI, contractAddress } from '../../utils/constants/aideConstant.js';
import { ethers } from 'ethers';
import { v4 as uuidv4 } from "uuid";

const { ethereum } = window;

const DisplayAidesAdmin = ({ title }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); 
  const [fullAides, setFullAides] = useState([]); 

  const getFullAides = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const signer = provider.getSigner();
    const contractWithSigner = contract.connect(signer);
    const fullAides = await contractWithSigner.getFullAides();
    console.log(fullAides);
    const parsedfullAides = fullAides.map((fullAides, i) => ({
        title: fullAides.title,
        description: fullAides.description,
        maxRequesters: fullAides.maxRequesters,
        deadline: fullAides.deadline.toNumber(),
        image: fullAides.image,
        pId: i,
    }));
    return parsedfullAides;
  };

  useEffect(() => {
    getFullAides()
      .then((parsedfullAides) => {
        setFullAides(parsedfullAides);
        setIsLoading(false); 
      })
      .catch((error) => {
        console.error('Failed to fetch full aides:', error);
        setIsLoading(false); 
      });
  }, []);

  const handleNavigate = (fullAides) => {
    navigate(`/admin/admin-aides/${fullAides.title}`, {state : fullAides})
  }
    
  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        {title} ({fullAides.length})
      </h1>
  
      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <Loading />
        )}
        {!isLoading && fullAides.length === 0 && (
          <p className="font-epilogue dont-semibold text-[14px] leading-[30px] text-[#818183]">
            All aides are available.
          </p>
        )}

        {!isLoading && fullAides.length > 0 && fullAides.map((fullAides) => <AideCard 
          key={uuidv4()}
          {...fullAides}
          handleClick = {() => handleNavigate(fullAides)}
        />)}
      </div>
    </div>
  );
};

export default DisplayAidesAdmin;
