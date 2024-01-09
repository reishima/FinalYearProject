import React from 'react'
import user from '../images/user.png';
//import { convert } from '../utils/index';

const CourseCard = ({lecturer, courseName, description, startTime, endTime, image, handleClick}) => {
    //const remainingTime = convert(endTime);
    //const start = convert(startTime);
    return (
        <div className="sm:w-[286px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer" onClick = {handleClick}>
            <img src={image} alt="fund" className='w-full h-[158px] object-cover rounded-[15px]'/>
            <div className="flex flex-col p-4">
                <div className="block">
                    <h3 className="font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate"> {courseName} </h3>
                    <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate"> {description} </p>
                </div>
                <div className="flex justify-between flex-wrap mt-[15px] gap-2">
                    {/*`                    <div className="flex flex-col">
                    <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate"> Starts At: </p>
                        <h4 className='font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]'>
                            {start}
                        </h4>
                    <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate"> Ends At: </p>
                    <h4 className='font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]'>
                        {remainingTime}
                    </h4>
    </div>*/}
                </div>
                    <div className='flex items-center mt-[20px] gap-[12px]'>
                        <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a]">
                           <img src={user} alt ="user" className="w-1/2 h-1/2 object-contain"></img> 
                        </div>
                        <p className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate">
                            Lecturer: <span className="text-[#b2b3bd]">{lecturer}</span>
                        </p>
                    </div>
            </div>
        </div>
    )
}

export default CourseCard;