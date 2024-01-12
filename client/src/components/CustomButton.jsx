import React from 'react'

const CustomButton = ({ btnType, title, handleClick, styles }) => {
  return (
      <button
        type={btnType}
        className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] bg-[#8934eb] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#a834eb] ${styles}`}
        onClick={handleClick}
      >
        {title}
      </button>
  )
}
export default CustomButton