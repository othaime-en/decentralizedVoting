import React from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import FundCard from "./FundCard";
import { loader } from "../assets";
import { useTheme } from '../context/ThemeContext';

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleNavigate = (campaign) => {
    navigate(`/instance-details/${campaign.title}`, { state: campaign });
  };

  return (
    <div className={`transition-colors duration-300 ${
      isDarkMode ? 'text-white' : 'text-gray-900'
    }`}>
      <h1 className={`font-epilogue font-semibold text-[18px] text-left mb-6 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {title} ({campaigns.length})
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr">
        {isLoading && (
          <div className="col-span-full flex justify-center">
            <img
              src={loader}
              alt="loader"
              className="w-[100px] h-[100px] object-contain"
            />
          </div>
        )}

        {!isLoading && campaigns.length === 0 && (
          <p className={`col-span-full font-epilogue font-semibold text-[14px] leading-[30px] ${
            isDarkMode ? 'text-[#818183]' : 'text-gray-500'
          }`}>
            You have not created any voting instances yet
          </p>
        )}

        {!isLoading &&
          campaigns.length > 0 &&
          campaigns.map((campaign) => (
            <div key={uuidv4()} className="h-full">
              <FundCard
                {...campaign}
                handleClick={() => handleNavigate(campaign)}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
