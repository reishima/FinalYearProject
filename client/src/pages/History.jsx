import React, { useState, useEffect } from 'react';
import { Navbar, Footer } from '../components/index.js';
import AuthChecker from '../utils/handle.js';
import { database } from '../utils/FirebaseConfig.js';
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getDoc, doc, collection } from 'firebase/firestore';
import { Loading } from '../components/index.js';

const apiUrl = 'https://api-sepolia.etherscan.io/api';
const apiKey = 'ZSTZJR9CJEQ1NIGQRX2IQ7WSQIKM7ZBRMP';

const startBlock = 0;
const endBlock = 99999999;
const pageSize = 8;

const commonStyles = 'min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-[#8934eb] text-sm font-light text-white font-semibold';

const History = () => {
    const [ blockchainId, setblockchainId ] = useState(null);
    const [  transactions, setTransactions ] = useState([]);
    const [currentPage, setCurrentPage ] = useState(1);
    const [ totalPages, setTotalPages ] = useState(1);
    const [ user, setUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser){
                setUser(authUser);
                const usersCollection = collection(database, 'users');
                const userDoc = doc(usersCollection, authUser.uid);
                const userDocSnapshot = await getDoc(userDoc);
                if(userDocSnapshot.exists()) {
                    setblockchainId(userDocSnapshot.data().blockchainId);
                }
            } else {
                setUser(null);
                setblockchainId(null);
            }
        });

        const fetchAllTransactions = async () => {
            setLoading(true);
        const requestUrl = `${apiUrl}?module=account&action=txlist&address=${blockchainId}&startblock=${startBlock}&endblock=${endBlock}&sort=asc&apikey=${apiKey}`;

        try {
            const response = await fetch(requestUrl);
            const data = await response.json();

            if (data.status === '1') {
            setTransactions(data.result);
            setTotalPages(Math.ceil(data.result.length / pageSize));
            } else {
            console.error('Error fetching data:', data.message);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
        };

        fetchAllTransactions();
    }, [blockchainId, startBlock, endBlock]);

  const getCurrentPageTransactions = () => {
    const reversedTransactions = transactions.slice().reverse();
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return reversedTransactions.slice(startIndex, endIndex);
  };

  const renderTransaction = (tx, index) => {
    const isLastTransaction = index === getCurrentPageTransactions().length - 1;
    const isFirstTransaction = index === 0;
  
    const transactionStyles = `${commonStyles} ${
      isFirstTransaction ? 'rounded-tr-2xl rounded-tl-2xl' : ''
    } ${isLastTransaction ? 'rounded-br-2xl rounded-bl-2xl' : ''}`;
  
    return (
      <li key={index} className={transactionStyles}>
        {" "}
        <a
          href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-500 hover:underline min-w-[900px]"
        >
          {tx.hash}
        </a>
      </li>
    );
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#13131a]">
      <AuthChecker />
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center font-semibold">
        <div className="text-white text-center">
          <h2>
            <a
              href={`https://sepolia.etherscan.io/address/${blockchainId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="address-link hover:text-blue-500 hover:underline"
            >
                User History 
            </a>
          </h2>
          <br />
          {loading ? (
                        <Loading /> // Render the Loading component when data is being fetched
                    ) : (
                        <ul>
                            {getCurrentPageTransactions().map((tx, index) => renderTransaction(tx, index))}
                        </ul>
                    )}
                    <div className="mt-4">
                        <div className="flex justify-center items-center space-x-4">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="bg-[#8934eb] py-2 px-7 rounded-full cursor-pointer hover:bg-[#a834eb] min-w-[20px] justify-center"
                            >
                                Prev
                            </button>
                            <span className="text-white"> Page {currentPage} of {totalPages} </span>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="bg-[#8934eb] py-2 px-7 rounded-full cursor-pointer hover:bg-[#a834eb] min-w-[20px] justify-center"
                            >
                                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default History;
