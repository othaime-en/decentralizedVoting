export const hoursLeft = (unixTime) => {
  const now = Date.now();
  const targetTime = unixTime * 1000;
  const differenceInMilliseconds = targetTime - now;
  const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);

  if (differenceInHours < 0) return 0;

  return differenceInHours.toFixed(0);
};

// export const calculateBarPercentage = (goal, raisedAmount) => {
//   const percentage = Math.round((raisedAmount * 100) / goal);

//   return percentage;
// };

export const calculateBarPercentage = (startTime, endTime) => {
  // Check if either startTime or endTime is zero
  if (startTime === 0 || endTime === 0) {
    return 0;
  }

  // Get the current timestamp
  const currentTime = Date.now();

  // Calculate elapsed time
  const elapsedTime = currentTime - startTime;

  // Calculate total duration
  const totalDuration = endTime - startTime;

  // Calculate percentage
  const percentage = Math.round((elapsedTime / totalDuration) * 100);

  return percentage;
};

// Function to get color code based on instance status
export const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "#8c6dfd";
    case "Active":
      return "#1dc071";
    case "Ended":
      return "red"; // You can use a specific hex code for red if needed
    default:
      return "#808191"; // Default color or for unknown status
  }
};

export const checkIfImage = (url, callback) => {
  const img = new Image();
  img.src = url;

  if (img.complete) callback(true);

  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};
