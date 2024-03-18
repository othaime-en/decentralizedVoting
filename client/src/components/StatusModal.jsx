import React from "react";
import CustomButton from "./CustomButton"; // Adjust import paths as needed

const StatusModal = ({ isOpen, onClose, title, message, status }) => {
  if (!isOpen) return null;

  // Determine modal background color based on status
  const bgColor =
    status === "error"
      ? "bg-red-600"
      : status === "warning"
      ? "bg-yellow-600"
      : "bg-green-600";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={`rounded-lg p-5 w-full max-w-md ${bgColor} text-white`}>
        <h2 className="text-xl font-bold text-center mb-4">{title}</h2>
        <p className="text-center mb-4">{message}</p>
        <div className="flex justify-center">
          <CustomButton
            btnType="button"
            title="Close"
            styles="bg-white text-black hover:bg-gray-200"
            handleClick={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
