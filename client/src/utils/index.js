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

export const epochToDateTime = (epochTime) => {
  if (epochTime === 0) return "N/A";

  // Create a Date object using the epoch time
  const date = new Date(epochTime * 1000); // JavaScript uses milliseconds

  // Format the date and time components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Construct the formatted date and time string
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDateTime;
};

export const checkIfImage = (url, callback) => {
  const img = new Image();
  img.src = url;

  if (img.complete) callback(true);

  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};

// Function to request OTP generation
// Adjusted function to handle an array of emails
export const generateOTP = async (emails) => {
  try {
    const response = await fetch("http://localhost:3001/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emails }), // 'emails' is expected to be an array
    });

    if (response.ok) {
      console.log("OTP sent successfully to all emails");
    } else {
      console.error("Failed to send OTP to some or all emails");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// Function to verify OTP
export const verifyOTP = async (otp) => {
  try {
    const response = await fetch("http://localhost:3001/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ otp }),
    });

    if (response.ok) {
      console.log("OTP verified successfully");
      // Proceed with any follow-up actions after successful verification
    } else {
      console.error("Failed to verify OTP");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export const imageURLs = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj102iDPG6R3exjEUScJOM0WmFWLbAk3l0dQ&usqp=CAU",
  "https://cdn.midjourney.com/1c3b83cc-12ae-4f7a-8891-767c2c93f15b/0_0.webp",
  "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c25vd3xlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1464852045489-bccb7d17fe39?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fHNub3d8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1551582045-6ec9c11d8697?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHNub3d8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1598966835412-6de6f92c243d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RyZWV0fGVufDB8fDB8fHww",
  "https://plus.unsplash.com/premium_photo-1684760975849-81b096c00cc0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3RyZWV0fGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1530109167181-4c8c11f6d317?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHN0cmVldHxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1568715684971-9ac138754ab9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHN0cmVldHxlbnwwfHwwfHx8MA%3D%3D",
];

export const getRandomImageUrl = (urls, instanceId) => {
  const storedImageUrl = localStorage.getItem(`imageUrl_${instanceId}`);
  if (storedImageUrl) {
    return storedImageUrl; // Return the stored URL if found
  } else {
    const randomIndex = Math.floor(Math.random() * urls.length);
    const selectedUrl = urls[randomIndex];
    localStorage.setItem(`imageUrl_${instanceId}`, selectedUrl); // Store the selected URL for future reference
    return selectedUrl;
  }
};
