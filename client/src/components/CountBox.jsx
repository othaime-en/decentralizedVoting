import React from 'react'
import { useTheme } from '../context/ThemeContext'

const CountBox = ({ title, value }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="flex flex-col items-center w-[150px]">
      <h4 className={`font-epilogue font-bold text-[30px] p-3 w-full text-center truncate rounded-t-[10px] transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-[#1c1c24] text-white' 
          : 'bg-[#8c6dfd] text-white'
      }`}>
        {value}
      </h4>
      <p className={`font-epilogue font-normal text-[16px] px-3 py-2 w-full rounded-b-[10px] text-center transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-[#28282e] text-[#808191]' 
          : 'bg-[#8c6dfd]/10 text-[#8c6dfd]'
      }`}>
        {title}
      </p>
    </div>
  )
}

export default CountBox