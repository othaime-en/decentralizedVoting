import React from 'react';
import { useTheme } from '../context/ThemeContext';

const StepBox = ({ number, title, description, color }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`flex flex-col p-6 rounded-[20px] ${color} transition-all duration-300`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-[#ffffff20]' : 'bg-[#00000020]'} flex items-center justify-center`}>
          <span className={`font-epilogue font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{number}</span>
        </div>
        <h3 className={`font-epilogue font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{title}</h3>
      </div>
      <p className={`font-epilogue text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
    </div>
  );
};

const StepGuide = () => {
  const { isDarkMode } = useTheme();
  
  const steps = [
    {
      number: '01',
      title: 'Create an instance',
      description: 'Set up your voting instance with candidates and requirements',
      color: isDarkMode ? 'bg-[#8c6dfd]/30' : 'bg-[#8c6dfd]/10'
    },
    {
      number: '02',
      title: 'Invite people to vote',
      description: 'Share the voting instance with eligible voters',
      color: isDarkMode ? 'bg-[#4acd8d]/30' : 'bg-[#4acd8d]/10'
    },
    {
      number: '03',
      title: 'Get results',
      description: 'View and analyze the voting results',
      color: isDarkMode ? 'bg-[#ff7262]/30' : 'bg-[#ff7262]/10'
    }
  ];

  return (
    <div className="w-full mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <StepBox
            key={index}
            number={step.number}
            title={step.title}
            description={step.description}
            color={step.color}
          />
        ))}
      </div>
    </div>
  );
};

export default StepGuide; 