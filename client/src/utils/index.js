export const daysLeft = (deadline) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set hours to midnight for accurate comparison

  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);

  const difference = deadlineDate.getTime() - today.getTime();
  const remainingDays = Math.floor(difference / (1000 * 3600 * 24));

  // Ensure that the days left is at least 1 on the date itself
  return Math.max(remainingDays, 0);
};

/*
export const convert = (blockTime) => {
  const timestamp = blockTime.toString();
  const date = new Date(timestamp * 1000);

  // Format the time
  const hours = date.getHours();
  const minutes = '0' + date.getMinutes();
  const seconds = '0' + date.getSeconds();
  const formattedTime = hours % 12 + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + ' ' + (hours >= 12 ? 'PM' : 'AM');

  // Format the date
  const month = date.getMonth() + 1; // Months are zero-based
  const day = date.getDate();
  const year = date.getFullYear();

  const formattedDate = day + '/' + month + '/' + year;

  // Combine the time and date
  const result = formattedTime + ' - ' + formattedDate;
  return result;
};*/

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

export const SignData = async (username, accountAddress, web3) => {
  let signedData;

  await web3.eth.personal.sign(
      username,
      accountAddress,
      (err, signature) => {
          if (err) {
              signedData = err;
          } else {
              signedData = web3.eth.accounts.hashMessage(signature);
          }
      }
  );

  return signedData;
}

export const AuthValidation = async (username, accountAddress, password, digiCode, web3, contract) => {

  let userAddress = await contract.methods.getUserAddress().call({ from: accountAddress });

  if (userAddress.toLowerCase() !== accountAddress.toLowerCase()) {
      return false;
  } else {
      let signedData = await SignData(username, accountAddress, web3);
      let passwordDigiCodeHash = await web3.eth.accounts.hashMessage(password + digiCode);

      let hash = await web3.eth.accounts.hashMessage(signedData + passwordDigiCodeHash);

      // get hash from the contract
      let hashFromContract = await contract.methods.getSignatureHash().call({ from: accountAddress });

      if (hash === hashFromContract) {
          return true;
      } else {
          return false;
      }
  }
}

export const AuthenticationHash = async (username, accountAddress, password, digiCode, web3) => {
  let signedMessage = await SignData(username, accountAddress, web3);
  let passwordDigiCodeHash = await web3.eth.accounts.hashMessage(password + digiCode);

  return await web3.eth.accounts.hashMessage(signedMessage + passwordDigiCodeHash);
}

export default AuthenticationHash;
