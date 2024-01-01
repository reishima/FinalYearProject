import React, {useContext, useEffect, useState} from 'react';
import { Navbar, Footer } from '../components/index.js'
import { contractABI, contractAddress } from '../utils/constants/aideConstant.js';
import { contractABI as lABI, contractAddress as lAddress} from '../utils/constants/libraryConstant.js';
import { ethers } from 'ethers';
import { TransactionContext } from '../context/TransactionContext';
import { shortenAddress } from '../utils/index.js';
import AuthChecker from '../utils/authChecker.js';

const {ethereum} = window

const TransactionCard = ({addressTo, addressFrom, timestamp, message, keyword, amount, url}) => {
    return (
        <div className = "bg-purple-600 m-4 flex flex-1 2xl:min-w-[450px] 2xl:max-w-[500px] sm:min-w-[270px] sm:max-w-[300px] flex-col p-3 rounded-md hover:shadow-2xl">
            <div className="flex flex-col items-center w-full mt-3">
                <div className='w-full mb-6 p-2'>
                    <a href={`http://127.0.0.1:7545/address/${addressFrom}`} target="_blank" rel="noopener noreferrer">
                        <p className="text-white text-base">
                            From: {shortenAddress(addressFrom)}
                        </p>
                    </a>
                    <a href={`http://127.0.0.1:7545/address/${addressTo}`} target="_blank" rel="noopener noreferrer">
                        <p className="text-white text-base">
                            To: {shortenAddress(addressTo)}
                        </p>
                    </a>
                    <p className="text-white text-base"> Amount: {amount} ETH</p>
                    {message && (
                        <>
                            <br />
                            <p className="text-white text-base"> Message: {message} </p>
                        </>
                    )}

                    <div className="bg-black p-3 px-5 w-max rounded-3xl -mt-5 shadow-2xl">
                        <p className="text-[#37c7da] font-bold">
                            {timestamp}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const AideCard = ({owner, timestamp, description, target}) => {
    return (
        <div className = "bg-purple-600 m-4 flex flex-1 2xl:min-w-[450px] 2xl:max-w-[500px] sm:min-w-[270px] sm:max-w-[300px] flex-col p-3 rounded-md hover:shadow-2xl">
            <div className="flex flex-col items-center w-full mt-3">
                <div className='w-full mb-6 p-2'>
                    <a href={`http://127.0.0.1:7545/address/${owner}`} target="_blank" rel="noopener noreferrer">
                        <p className="text-white text-base">
                            From: {shortenAddress(owner)}
                        </p>
                    </a>
                    <p className="text-white text-base"> Amount: {target} ETH</p>
                    {description && (
                        <>
                            <br />
                            <p className="text-white text-base"> description: {description} </p>
                        </>
                    )}

                    <div className="bg-black p-3 px-5 w-max rounded-3xl -mt-5 shadow-2xl">
                        <p className="text-[#37c7da] font-bold">
                            {timestamp}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const DonateCard = ({donor, amount, timestamp}) => {
    return (
        <div className = "bg-purple-600 m-4 flex flex-1 2xl:min-w-[450px] 2xl:max-w-[500px] sm:min-w-[270px] sm:max-w-[300px] flex-col p-3 rounded-md hover:shadow-2xl">
            <div className="flex flex-col items-center w-full mt-3">
                <div className='w-full mb-6 p-2'>
                    <a href={`http://127.0.0.1:7545/address/${donor}`} target="_blank" rel="noopener noreferrer">
                        <p className="text-white text-base">
                            Fromhe: {shortenAddress(donor)}
                        </p>
                    </a>
                    <p className="text-white text-base"> Amount: {amount} ETH</p>
                    <div className="bg-black p-3 px-5 w-max rounded-3xl -mt-5 shadow-2xl">
                        <p className="text-[#37c7da] font-bold">
                            {timestamp}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const BookCard = ({owner, submission, description, title}) => {
    return (
        <div className = "bg-purple-600 m-4 flex flex-1 2xl:min-w-[450px] 2xl:max-w-[500px] sm:min-w-[270px] sm:max-w-[300px] flex-col p-3 rounded-md hover:shadow-2xl">
            <div className="flex flex-col items-center w-full mt-3">
                <div className='w-full mb-6 p-2'>
                    <a href={`http://127.0.0.1:7545/address/${owner}`} target="_blank" rel="noopener noreferrer">
                        <p className="text-white text-base">
                            Created by: {shortenAddress(owner)}
                        </p>
                    </a>
                    <p className="text-white text-base"> Title: {title} </p>
                    {description && (
                        <>
                            <br />
                            <p className="text-white text-base"> description: {description} </p>
                        </>
                    )}

                    <div className="bg-black p-3 px-5 w-max rounded-3xl -mt-5 shadow-2xl">
                        <p className="text-[#37c7da] font-bold">
                            Due: {submission}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const History = () => {
    const { currentAccount, transactions } = useContext(TransactionContext);
    const [ aides, setAides ] = useState([]); // State to store aides
    const [ donations, setDonations ] = useState([]);
    const [ books, setBooks ] = useState([]);

    useEffect(() => {
        // Fetch aides when the component mounts
        fetchAides();
    }, []);

    useEffect(() => {
        // Fetch aides when the component mounts
        if(aides.length > 0){
            fetchDonations();
        }
    }, [aides]);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchAides = async () => {
        // Fetch aides here, similar to how it's done in DisplayAides.jsx
        const provider = new ethers.providers.Web3Provider(ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        const aidesData = await contractWithSigner.getAides();
        const parsedAides = aidesData.map((aide, i) => ({
        owner: aide.owner,
        title: aide.title,
        description: aide.description,
        target: ethers.utils.formatEther(aide.target.toString()),
        deadline: aide.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(aide.amountCollected.toString()),
        image: aide.image,
        pId: i,
        }));
        setAides(parsedAides);
    };

    const fetchDonations = async () => {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
      
        // Create an array of promises for each aide's donations
        const donationPromises = aides.map(async (aide) => {
          const donators = await contract.getDonators(aide.pId);
          const numberOfDonations = donators[0].length;
          const parsedDonations = [];
      
          for (let i = 0; i < numberOfDonations; i++) {
            const donator = donators[0][i];
            const donationAmount = ethers.utils.formatEther(donators[1][i].toString());
      
            parsedDonations.push({
              donor: donator,
              amount: donationAmount,
            });
          }
      
          return parsedDonations;
        });
      
        try {
          // Wait for all donation promises to resolve
          const donationsData = await Promise.all(donationPromises);
      
          // Flatten the array of donation arrays into a single donations array
          const flattenedDonations = donationsData.flat();
      
          // Set the donations state with the fetched data
          setDonations(flattenedDonations);
          
          console.log('fetched donations', flattenedDonations);
        } catch (error) {
          console.error('Error fetching donations:', error);
          // Handle any errors here
        }
      };     
      /* need to fix this V
      const fetchBooks = async (pId) => {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const contract = new ethers.Contract(lAddress, lABI, provider);
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
    
        try {
            const booksData = await contractWithSigner.getBooks(pId);
    
            const parsedBooks = booksData.map((book, i) => ({
                title: book.title,
                description: book.description,
                submission: book.submission.toNumber(),
                image: book.image,
                pId: i,
            }));
    
            setBooks(parsedBooks);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    }*/
    

    return(
        <div className="min-h-screen flex flex-col bg-[#13131a] min-h-screen">
            <div className="bg-[#13131a]">
                <AuthChecker/>
                <Navbar/>
                    <div className = "flex w-full justify-center items-center 2xl:px-20 bg-[#13131a]">
                        <div className = 'flex flex-col md:p-12 py-12 px-4'>
                            {currentAccount ?(
                                <h3 className = "text-white text-3xl text-center my-2"> Latest Activity </h3>
                            ) : (
                                <h3 className = "text-white text-3xl text-center my-2"> Connect your account to see the latest transactions</h3>
                            )}
                            <div className = " flex flex-wrap justify-center items-center mt-10">
                                {transactions.reverse().map((transaction, i) => (
                                    <TransactionCard key = {i} {...transaction}/>
                                ))}
                            </div>
                            <div className="flex flex-wrap justify-center items-center mt-10">
                                {aides.reverse().map((aide, i) => (
                                    <AideCard key={i} {...aide} /> // Render AideCard for each aide
                                ))}
                            </div>
                            <div className = " flex flex-wrap justify-center items-center mt-10">
                                {donations.reverse().map((donation, i) => (
                                    <DonateCard key={i} {...donation} />
                                ))}
                            </div>
                            <div className = " flex flex-wrap justify-center items-center mt-10">
                                {books.reverse().map((book, i) => (
                                    <BookCard key={i} {...book} />
                                ))}
                            </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default History;