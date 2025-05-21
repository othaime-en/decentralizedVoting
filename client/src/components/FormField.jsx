import React from 'react'
import { useTheme } from '../context/ThemeContext'

const FormField = ({ labelName, placeholder, inputType, isTextArea, value, handleChange }) => {
  const { isDarkMode } = useTheme();
  
  const inputClasses = `py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] bg-transparent font-epilogue text-[14px] rounded-[10px] sm:min-w-[300px] transition-colors duration-300 ${
    isDarkMode 
      ? 'border-[#3a3a43] text-white placeholder:text-[#4b5264]' 
      : 'border-gray-200 text-gray-900 placeholder:text-gray-500'
  }`;

  return (
    <label className="flex-1 w-full flex flex-col">
      {labelName && (
        <span className={`font-epilogue font-medium text-[14px] leading-[22px] mb-[10px] transition-colors duration-300 ${
          isDarkMode ? 'text-[#808191]' : 'text-gray-600'
        }`}>
          {labelName}
        </span>
      )}
      {isTextArea ? (
        <textarea 
          required
          value={value}
          onChange={handleChange}
          rows={10}
          placeholder={placeholder}
          className={inputClasses}
        />
      ) : (
        <input 
          required
          value={value}
          onChange={handleChange}
          type={inputType}
          step="0.1"
          placeholder={placeholder}
          className={inputClasses}
        />
      )}
    </label>
  )
}

export default FormField