import React from 'react'
import { daysLeft } from '../utils/index';

const AideCard = ({ title, description, maxRequesters, deadline, image, handleClick}) => {
    const remainingDays = daysLeft(deadline);
    const maxRequestersString = maxRequesters.toString();
    return (
        <div className="sm:w-[286px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer" onClick = {handleClick}>
                <img src={image} alt="fund" className='w-full h-[158px] object-cover rounded-[15px]'/>
            <div className="flex flex-col p-4">
                <div className="block">
                    <h3 className="font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate"> {title} </h3>
                    <p className="mt-[5px] text-[12px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate"> {description} </p>
                </div>
                <div className="flex justify-between flex-wrap mt-[15px] gap-2">
                    <div className="flex flex-col">
                        <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate"> Maximum Requests: {maxRequestersString}</p>
                    </div>
                    <div className="flex flex-col">
                        <h4 className='font-epilogue font-normal text-[14px] text-[#b2b3bd] leading-[22px]'>
                            {remainingDays} days left
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AideCard;