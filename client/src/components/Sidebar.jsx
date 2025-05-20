import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logo, sun, moon } from '../assets';
import { navlinks } from '../constants';
import { useTheme } from '../context/ThemeContext';

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick, label, isExpanded }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div 
      className={[
        'flex items-center gap-4 w-full px-3 py-2 rounded-lg transition-all duration-300 ease-in-out',
        isActive && isActive === name ? (isDarkMode ? 'bg-[#2c2f32]' : 'bg-gray-200') : 
          isDarkMode ? 'hover:bg-[#2c2f32]/50' : 'hover:bg-gray-100',
        !disabled && 'cursor-pointer',
        styles
      ].filter(Boolean).join(' ')}
      onClick={handleClick}
    >
      <div className="min-w-[32px] h-[32px] flex items-center justify-center">
        <img 
          src={imgUrl} 
          alt={name}
          className={`w-5 h-5 transition-all duration-300 ${isActive !== name && 'grayscale opacity-60'}`}
        />
      </div>
      {isExpanded && (
        <span 
          className={`whitespace-nowrap text-sm transition-all duration-300 ${
            isActive === name 
              ? (isDarkMode ? 'text-white' : 'text-gray-900')
              : (isDarkMode ? 'text-gray-400' : 'text-gray-600')
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');
  const [isExpanded, setIsExpanded] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div 
      className={`
        relative flex flex-col h-[93vh] transition-all duration-300 ease-in-out
        ${isDarkMode ? 'text-white' : 'text-gray-900'}
      `}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <Link to="/" className="mb-8 px-3">
        <Icon 
          styles={isDarkMode ? '!bg-[#2c2f32] rounded-xl' : '!bg-gray-200 rounded-xl'}
          imgUrl={logo} 
          isExpanded={isExpanded}
          label="Devote"
        />
      </Link>

      <div 
        className={[
          'flex-1 flex flex-col rounded-[20px] py-4 transition-all duration-300 ease-in-out',
          isDarkMode ? 'bg-[#1c1c24]' : 'bg-white shadow-lg',
          isExpanded ? 'w-[200px]' : 'w-[76px]'
        ].join(' ')}
      >
        <div className="flex-1 flex flex-col gap-2 px-3">
          {navlinks.map((link) => (
            <Icon 
              key={link.name}
              {...link}
              isActive={isActive}
              isExpanded={isExpanded}
              label={link.name.charAt(0).toUpperCase() + link.name.slice(1)}
              handleClick={() => {
                if(!link.disabled) {
                  setIsActive(link.name);
                  navigate(link.link);
                }
              }}
            />
          ))}
        </div>

        <div className="px-3 mt-2">
          <Icon 
            styles={isDarkMode ? 'hover:bg-[#2c2f32]/50' : 'hover:bg-gray-100'}
            imgUrl={isDarkMode ? sun : moon}
            name="theme"
            isExpanded={isExpanded}
            label={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            handleClick={toggleTheme}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;