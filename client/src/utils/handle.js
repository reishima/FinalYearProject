import { signOut } from 'firebase/auth';
import { auth } from './FirebaseConfig';

const handleAccountsChanged = async () => {
    const excludedPaths = ['/login', '/sign-up', '/forgot-password', '/sign-out'];
    const currentPath = window.location.pathname;
    if (!excludedPaths.includes(currentPath)) {
      alert('Wallet change detected. Please re-login.');
      await signOut(auth);
    } else {
      alert('Wallet change detected. Please be aware of the security implications.');
    }
  };
  
  export const setupAccountsChangedListener = () => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
  };
  
  export const removeAccountsChangedListener = () => {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
  };
  