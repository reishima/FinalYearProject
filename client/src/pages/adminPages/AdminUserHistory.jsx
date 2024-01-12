import React, { useState, useEffect } from 'react';
import { Navbar, Footer } from '../../components/index.js';
import AdminChecker from '../../utils/adminChecker.js';
import { database } from '../../utils/FirebaseConfig.js';
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getDoc, doc, collection } from 'firebase/firestore';
import { Loading } from '../../components/index.js';

const apiUrl = 'https://api-sepolia.etherscan.io/api';
const apiKey = 'ZSTZJR9CJEQ1NIGQRX2IQ7WSQIKM7ZBRMP';

const startBlock = 0;
const endBlock = 99999999;
const pageSize = 8;

const commonStyles = 'min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-[#8934eb] text-sm font-light text-white font-semibold';

const AdminUserHistory = () => {
    const [ blockchainId, setblockchainId ] = useState(null);
    const [  transactions, setTransactions ] = useState([]);
    const [currentPage, setCurrentPage ] = useState(1);
    const [ totalPages, setTotalPages ] = useState(1);
    const [ loading, setLoading ] = useState(true);

    const handleBlockchainIdChange = (event) => {
        setblockchainId(event.target.value);
    };

    const handleFetchTransactions = async () => {
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

    useEffect(() => {
        // Reset loading state when a new blockchainId is entered
        setLoading(false);
    }, [blockchainId]);

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
      <AdminChecker />
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center font-semibold">
        <div className="text-white text-center">
                    <p>Enter user Blockchain ID: </p>
                    <br/>
                    <input
                        type="text"
                        className="border-[0.5px] border-[#8934eb] text-white px-2 py-1 rounded min-w-[400px]"
                        placeholder="Enter blockchainId"
                        value={blockchainId}
                        onChange={handleBlockchainIdChange}
                        style = {{ backgroundColor: '#13131a', border: '2px solid black', height: '30px' }}
                    />
                    <br/>
                    <button
                        onClick={handleFetchTransactions}
                        className="bg-[#8934eb] py-2 px-7 rounded-full cursor-pointer hover:bg-[#a834eb] ml-2 mt-5"
                    >
                        Fetch Transactions
                    </button>
          <h2>
            <br/>
            <a
              href={`https://sepolia.etherscan.io/address/${blockchainId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="address-link hover:text-blue-500 hover:underline"  
              title = {blockchainId}
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

export default AdminUserHistory;
