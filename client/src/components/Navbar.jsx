import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../context";
import { CustomButton } from "./";
import { logo, menu, search, thirdweb } from "../assets";
import { navlinks } from "../constants";
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { connect, address } = useStateContext();
  const { isDarkMode } = useTheme();

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mt-[20px] mb-[35px] gap-6">
      <div className={`lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] rounded-[100px] transition-colors duration-300 ${
        isDarkMode ? 'bg-[#1c1c24]' : 'bg-white border border-gray-200'
      }`}>
        <input
          type="text"
          placeholder="Search for Instances"
          className={`flex w-full font-epilogue font-normal text-[14px] bg-transparent outline-none transition-colors duration-300 ${
            isDarkMode 
              ? 'placeholder:text-[#4b5264] text-white' 
              : 'placeholder:text-gray-500 text-gray-900'
          }`}
        />

        <div className="w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer hover:bg-[#45b87e] transition-colors duration-300">
          <img
            src={search}
            alt="search"
            className="w-[15px] h-[15px] object-contain"
          />
        </div>
      </div>

      <div className="sm:flex hidden flex-row justify-end gap-4">
        <CustomButton
          btnType="button"
          title={address ? "Create an instance" : "Connect"}
          styles={address ? "bg-[#1dc071] hover:bg-[#1ab069] transition-colors duration-300" : "bg-[#8c6dfd] hover:bg-[#7b5df8] transition-colors duration-300"}
          handleClick={() => {
            if (address) navigate("create-instance");
            else connect();
          }}
        />

        <Link to="/profile">
          <div className={`w-[52px] h-[52px] rounded-full flex justify-center items-center cursor-pointer transition-colors duration-300 ${
            isDarkMode ? 'bg-[#2c2f32] hover:bg-[#3a3a43]' : 'bg-gray-100 hover:bg-gray-200'
          }`}>
            <img
              src={thirdweb}
              alt="user"
              className="w-[60%] h-[60%] object-contain"
            />
          </div>
        </Link>
      </div>

      {/* Small screen navigation */}
      <div className="sm:hidden flex justify-between items-center relative">
        <div className={`w-[40px] h-[40px] rounded-[10px] flex justify-center items-center cursor-pointer transition-colors duration-300 ${
          isDarkMode ? 'bg-[#2c2f32] hover:bg-[#3a3a43]' : 'bg-gray-100 hover:bg-gray-200'
        }`}>
          <img
            src={logo}
            alt="user"
            className="w-[60%] h-[60%] object-contain"
          />
        </div>

        <img
          src={menu}
          alt="menu"
          className="w-[34px] h-[34px] object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div
          className={`absolute top-[60px] right-0 left-0 z-10 shadow-secondary py-4 transition-all duration-700 ${
            isDarkMode ? 'bg-[#1c1c24]' : 'bg-white border border-gray-200'
          } ${
            !toggleDrawer ? "-translate-y-[100vh]" : "translate-y-0"
          }`}
        >
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 transition-colors duration-300 ${
                  isActive === link.name && (isDarkMode ? 'bg-[#3a3a43]' : 'bg-gray-100')
                }`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  navigate(link.link);
                }}
              >
                <img
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-[24px] h-[24px] object-contain ${
                    isActive === link.name ? "grayscale-0" : "grayscale"
                  }`}
                />
                <p
                  className={`ml-[20px] font-epilogue font-semibold text-[14px] ${
                    isActive === link.name 
                      ? 'text-[#1dc071]' 
                      : (isDarkMode ? 'text-[#808191]' : 'text-gray-600')
                  }`}
                >
                  {link.name}
                </p>
              </li>
            ))}
          </ul>

          <div className="flex mx-4">
            <CustomButton
              btnType="button"
              title={address ? "Create an instance" : "Connect"}
              styles={address 
                ? "bg-[#1dc071] hover:bg-[#1ab069] transition-colors duration-300" 
                : "bg-[#8c6dfd] hover:bg-[#7b5df8] transition-colors duration-300"
              }
              handleClick={() => {
                if (address) navigate("create-campaign");
                else connect();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
