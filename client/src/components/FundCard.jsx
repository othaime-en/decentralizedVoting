import React from "react";
import { Novatrix } from "uvcanvas";
import { useTheme } from "../context/ThemeContext";

import { tagType, thirdweb } from "../assets";
import {
  hoursLeft,
  getStatusColor,
  getRandomImageUrl,
  imageURLs,
} from "../utils";

const FundCard = ({
  owner,
  title,
  description,
  instanceStatus,
  instanceId,
  endTime,
  candidateCount,
  target,
  handleClick,
}) => {
  const { isDarkMode } = useTheme();
  const remainingHours = hoursLeft(endTime);
  const imageUrl = getRandomImageUrl(imageURLs, instanceId);

  return (
    <div
      className={`
        w-full rounded-[15px] cursor-pointer transition-all duration-300
        ${isDarkMode ? 'bg-[#1c1c24] text-white' : 'bg-white text-gray-900'}
        hover:transform hover:scale-[1.02]
      `}
      onClick={handleClick}
    >
      <img
        src={imageUrl}
        alt="vote"
        className="w-full h-[158px] object-cover rounded-t-[15px]"
      />

      <div className="flex flex-col p-4">
        <div className="flex flex-row items-center mb-[18px]">
          <img
            src={tagType}
            alt="tag"
            className="w-[17px] h-[17px] object-contain"
          />
          <p className={`ml-[12px] mt-[2px] font-epilogue font-medium text-[12px] ${
            isDarkMode ? 'text-[#808191]' : 'text-gray-500'
          }`}>
            Education
          </p>
        </div>

        <div className="block">
          <h3 className={`font-epilogue font-semibold text-[16px] text-left leading-[26px] truncate ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {title}
          </h3>
          <p className={`mt-[5px] font-epilogue font-normal text-left leading-[18px] truncate ${
            isDarkMode ? 'text-[#808191]' : 'text-gray-500'
          }`}>
            {description}
          </p>
        </div>

        <div className="flex justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4 className={`font-epilogue font-semibold text-[14px] leading-[22px] ${
              isDarkMode ? 'text-[#b2b3bd]' : 'text-gray-700'
            }`}>
              {candidateCount}
            </h4>
            <p className={`mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] sm:max-w-[120px] truncate ${
              isDarkMode ? 'text-[#808191]' : 'text-gray-500'
            }`}>
              Candidates {target}
            </p>
          </div>
          <div className="flex flex-col">
            <h4
              className="font-epilogue font-semibold text-[14px] leading-[22px]"
              style={{ color: getStatusColor(instanceStatus) }}
            >
              {instanceStatus}
            </h4>
            <p className={`mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] sm:max-w-[120px] truncate ${
              isDarkMode ? 'text-[#808191]' : 'text-gray-500'
            }`}>
              Status
            </p>
          </div>
        </div>

        <div className="flex items-center mt-[20px] gap-[12px]">
          <div className={`w-[30px] h-[30px] rounded-full flex justify-center items-center ${
            isDarkMode ? 'bg-[#13131a]' : 'bg-gray-100'
          }`}>
            <img
              src={thirdweb}
              alt="user"
              className="w-1/2 h-1/2 object-contain"
            />
          </div>
          <p className={`flex-1 font-epilogue font-normal text-[12px] truncate ${
            isDarkMode ? 'text-[#808191]' : 'text-gray-500'
          }`}>
            by <span className={isDarkMode ? 'text-[#b2b3bd]' : 'text-gray-700'}>{owner}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FundCard;
