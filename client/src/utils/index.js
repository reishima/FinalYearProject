export const daysLeft = (deadline) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);

  const difference = deadlineDate.getTime() - today.getTime();
  const remainingDays = Math.floor(difference / (1000 * 3600 * 24));

  return Math.max(remainingDays, 0);
};

export const calculateBarPercentage = (goal, raisedAmount) => {
  const percentage = Math.round((raisedAmount * 100) / goal);
  
  return percentage;
};
  
export const checkIfImage = (url, callback) => {
  const img = new Image();
  img.src = url;
  
  if (img.complete) callback(true);
  
  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};

export const shortenAddress = (address) => `${address.slice(0, 5)}...${address.slice(address.length - 4)}`

