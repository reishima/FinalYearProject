import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading, AideCard } from '../../components/index.js';
import { contractABI, contractAddress } from '../../utils/constants/aideConstant.js';
import { ethers } from 'ethers';
import { v4 as uuidv4 } from "uuid";

const { ethereum } = window;

const DisplayAidesToClose = ({ title }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); 
  const [Aides, setAides] = useState([]); 

  const getAides = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const signer = provider.getSigner();
    const contractWithSigner = contract.connect(signer);
    const Aides = await contractWithSigner.getAides();
    console.log(Aides);
    const parsedAides = Aides.map((Aides, i) => ({
        title: Aides.title,
        description: Aides.description,
        maxRequesters: Aides.maxRequesters,
        deadline: Aides.deadline.toNumber(),
        image: Aides.image,
        pId: i,
    }));
    return parsedAides;
  };

  useEffect(() => {
    getAides()
      .then((parsedAides) => {
        setAides(parsedAides);
        setIsLoading(false); 
      })
      .catch((error) => {
        console.error('Failed to fetch  aides:', error);
        setIsLoading(false); 
      });
  }, []);

  const handleNavigate = (Aides) => {
    navigate(`/admin/admin-aides/c/${Aides.title}`, {state : Aides})
  }
    
  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        {title} ({Aides.length})
      </h1>
  
      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <Loading />
        )}
        {!isLoading && Aides.length === 0 && (
          <p className="font-epilogue dont-semibold text-[14px] leading-[30px] text-[#818183]">
            All aides are available.
          </p>
        )}

        {!isLoading && Aides.length > 0 && Aides.map((Aides) => <AideCard 
          key={uuidv4()}
          {...Aides}
          handleClick = {() => handleNavigate(Aides)}
        />)}
      </div>
    </div>
  );
};

export default DisplayAidesToClose;
