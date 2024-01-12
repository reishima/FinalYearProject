import React from 'react'

const BookCard = ({title, author, pages,  image, handleClick}) => {
    return (
        <div className="sm:w-[286px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer" onClick = {handleClick}>
            <img src={image} alt="fund" className='w-full h-[158px] object-cover rounded-[15px]'/>
            <div className="flex flex-col p-4">
                <div className="block">
                    <h3 className="font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate"> {title} </h3>
                    <p className="mt-[5px] text-[12px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate"> </p>
                </div>
                <div className="flex justify-between flex-wrap gap-2">
                    <div className="flex flex-col">
                        <p className="font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[165px] truncate"> Author: {author} </p>
                    </div>
                    <div className="flex flex-col">
                        <h4 className='font-epilogue font-normal text-[14px] text-[#b2b3bd] leading-[22px]'>
                            {pages} pages
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookCard;