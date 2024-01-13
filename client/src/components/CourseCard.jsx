import React from 'react'
import user from '../images/user.png';

const CourseCard = ({lecturer, courseName, programLevel, week, courseCode, handleClick}) => {
    return (
        <div className="sm:w-[286px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer" onClick = {handleClick}>
            <div className="flex flex-col p-4">
                <div className="block">
                    <h3 className="font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate"> {courseName} </h3>
                    <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate"> 
                        <span className="text-[#b2b3bd]">{courseCode}</span> <span className="text-[#808191]"> | </span> {programLevel} 
                    </p>
                </div>
                <div className="flex justify-between flex-wrap gap-2">
                    <div className='flex items-center mt-[10px] gap-[12px]'>
                        <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a]">
                           <img src={user} alt ="user" className="w-1/2 h-1/2 object-contain"></img> 
                        </div>
                            <p className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate max-w-[140px]">
                                <span className="text-[#b2b3bd]">{lecturer}</span>
                            </p>
                        <div className="flex flex-col">
                            <h4 className='font-epilogue font-normal text-[14px] text-[#b2b3bd] leading-[22px]'>
                                Week: {week}
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default CourseCard;