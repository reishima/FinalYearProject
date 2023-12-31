import React, { useContext, useState, useEffect } from 'react';
import { IoPersonSharp } from 'react-icons/io5';
import logo from '../images/shield.png';
import { TransactionContext } from '../context/TransactionContext'; //For form input
import { shortenAddress } from '../utils/index.js';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AuthChecker from '../utils/authChecker.js';

const commonStyles = 'min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-[#8934eb] text-sm font-light text-white font-semibold';
//for grid styling

/*
const Input = ({placeholder, name, type, value, handleChange}) => (
    <input 
        placeholder = {placeholder}
        type = {type}
        step = "0.0001"
        value = {value}
        onChange = {(e) => handleChange(e, name)}
        className = "my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
    />
);*/
//For form input

const Welcome = () => {
    const { connectWallet, currentAccount, formData, sendTransaction, handleChange, isLoading } = useContext(TransactionContext); //For form input

    const [ user, setUser ] = useState(null);

    /*const handleSubmit = (e) =>{ //For form input
        const { addressTo, amount, message, keyword } = formData;

        e.preventDefault();

        if(!addressTo || !amount || !message || !keyword) return;

        sendTransaction();
    } */

    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if (authUser){
                setUser(authUser);
            } else {
                setUser(null);
            }
        });

        return () => {
            unsubscribe();
        }
    }, []);

    return(
        <div className="flex w-full justify-center items-center">
            <AuthChecker/>
            <div className="flex md:flex-row flex-col items=start justify-between md:p-20 py-12 px-4">
                <div className="flex flex-1 justify-start flex-col md:mr-10">
                    <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1"> 
                        Your own personal identity 
                    </h1>
                    <p className = "text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base"> {/* for some reason adding a break tag <br/> makes the grids weird */}
                        Identify Yourself
                    </p>
                    {/*!currentAccount &&(
                    <button
                        type="button"
                        onClick={connectWallet}
                        className="flex flex-row justify-center items-center my-5 bg-[#8934eb] p-3 rounded-full cursor-pointer hover:bg-[#a834eb]"
                        >
                            <p className="text-white text-base font-semibold">Connect Wallet</p>
                    </button>
                    )*/}
                    <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
                        <div className={`rounded-tl-2xl ${commonStyles}`}>
                            Reliability
                        </div>
                        <div className={commonStyles}> Security </div>
                        <div className={`rounded-tr-2xl ${commonStyles}`}>
                            Blockchain
                        </div>
                        <div className={`rounded-bl-2xl ${commonStyles}`}>
                            Web 3.0
                        </div>
                        <div className={commonStyles}> Simplicity </div>
                        <div className={`rounded-br-2xl ${commonStyles}`}>
                            Decentralized ID
                        </div>
                    </div>
                </div>
                
                <div className ="flex flex-col flex-1 items-center justify-start w-full md:mt-0 mt-10">
                    <div className="p-3 justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card white-glassmorphism">
                        <div className="flex justify-between flex-col w-full h-full">
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-10 flex justify-center items-center my-1 mx-0.5">
                                    <img src={logo} alt="logo" className="w-32"/>
                                </div>
                                <div className="mt-3.5 ml-2 flex">
                                    <IoPersonSharp fontSize={95} color="#fff"/>
                                </div>
                                </div>
                            <div>
                                <p className="text-white font-light text-sm flex -mt-4">
                                    {shortenAddress(currentAccount)}
                                </p>
                                <div className="text-white font-semibold text-sm">
                                    {user ? (
                                        <>
                                            Email: {user.email}
                                        </>
                                    ) : (
                                        <p className='text-white'> No user is signed in! </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* This is the Form section*/}
                    {/* remove this line to uncomment form
                    <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
                        <Input placeholder="Address To" name="addressTo" type="text" handleChange={handleChange} />
                        <Input placeholder="Amount (ETH)" name="amount" type="number" handleChange={handleChange} />
                        <Input placeholder = "Message" name="message" type="text" handleChange = {handleChange}/>
                        <Input placeholder = "Keyword" name="keyword" type="text" handleChange = {handleChange}/>

                        <div className="h-[1px] w-full bg-gray-400 my-2"/>
                        {isLoading? (
                            <Loading />
                        ) : (
                            <button
                                type ="button"
                                onClick = {handleSubmit}
                                className = "text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer"
                            >
                                Send Now
                            </button>
                        )}
                    </div>
                    
                    {/* This is the end of the Form section*/}
                    
                </div>
            </div>
        </div>
    )
}

export default Welcome;