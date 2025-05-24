import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logo, sun, moon } from '../assets';
import { navlinks } from '../constants';
import { useTheme } from '../context/ThemeContext';

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick, label, isExpanded, link }) => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  
  const handleIconClick = (e) => {
    if (disabled) return;
    if (link) {
      navigate(link);
    } else if (handleClick) {
      handleClick(e);
    }
  };
  
  const content = (
    <div 
      className={[
        'flex items-center gap-4 w-full px-3 py-2 rounded-lg transition-all duration-300 ease-in-out',
        isActive ? (isDarkMode ? 'bg-[#2c2f32]' : 'bg-gray-200') : 
          isDarkMode ? 'hover:bg-[#2c2f32]/50' : 'hover:bg-gray-100',
        !disabled && 'cursor-pointer',
        styles
      ].filter(Boolean).join(' ')}
      onClick={handleIconClick}
    >
      <div className="min-w-[32px] h-[32px] flex items-center justify-center">
        <img 
          src={imgUrl} 
          alt={name}
          className={`w-5 h-5 transition-all duration-300 ${!isActive && 'grayscale opacity-60'}`}
        />
      </div>
      {isExpanded && (
        <span 
          className={`whitespace-nowrap text-sm transition-all duration-300 ${
            isActive 
              ? (isDarkMode ? 'text-white' : 'text-gray-900')
              : (isDarkMode ? 'text-gray-400' : 'text-gray-600')
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
  
  return content;
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = window.location.pathname;
  const [isExpanded, setIsExpanded] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  
  // Get the current active route based on the URL
  const getActiveRoute = (path) => {
    const currentPath = location.split('/').pop();
    if (path === '/app/home' && (currentPath === 'home' || currentPath === '')) return true;
    if (path.endsWith(currentPath)) return true;
    return false;
  };

  return (
    <div 
      className={`
        relative flex flex-col h-[93vh] transition-all duration-300 ease-in-out
        ${isDarkMode ? 'text-white' : 'text-gray-900'}
      `}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="mb-8 px-3">
        <Link to="/" className="flex items-center gap-2">
          <div className={`${isDarkMode ? '!bg-[#2c2f32]' : '!bg-gray-200'} rounded-xl p-2`}>
            <img 
              src={logo} 
              alt="Devote Logo" 
              className="w-8 h-8"
              style={{ filter: 'hue-rotate(90deg) saturate(2)' }}
            />
          </div>
          {isExpanded && (
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#8c6dfd] to-[#4caf50]">
              Devote
            </span>
          )}
        </Link>
      </div>

      <div 
        className={[
          'flex-1 flex flex-col rounded-[20px] py-4 transition-all duration-300 ease-in-out',
          isDarkMode ? 'bg-[#1c1c24]' : 'bg-white shadow-lg',
          isExpanded ? 'w-[200px]' : 'w-[76px]'
        ].join(' ')}
      >
        <div className="flex-1 flex flex-col gap-2 px-3">
          {navlinks.map((link) => (
            <div key={link.name} className="w-full">
              <Icon 
                name={link.name}
                imgUrl={link.imgUrl}
                isActive={getActiveRoute(link.link)}
                isExpanded={isExpanded}
                label={link.name.charAt(0).toUpperCase() + link.name.slice(1)}
                link={link.link}
                disabled={link.disabled}
              />
            </div>
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