export const daysLeft = (deadline) => {
  const difference = new Date(deadline).getTime() - Date.now();
  const remainingDays = difference / (1000 * 3600 * 24);
  
  return remainingDays.toFixed(0);
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
