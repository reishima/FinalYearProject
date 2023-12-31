import React,  { useContext }  from 'react';
import { Footer, Navbar, Loading } from '../../components/index.js';
import { IoPersonSharp } from 'react-icons/io5';
import logo from '../images/shield.png';
import { TransactionContext } from '../../context/TransactionContext.jsx'; //For form input
import { shortenAddress } from '../utils/shortenAddress';

const Input = ({placeholder, name, type, value, handleChange}) => (
    <input 
        placeholder = {placeholder}
        type = {type}
        step = "0.0001"
        value = {value}
        onChange = {(e) => handleChange(e, name)}
        className = "my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
    />
);
//For form input

const Attendance = () => {

    const { connectWallet, currentAccount, formData, sendTransaction, handleChange, isLoading } = useContext(TransactionContext); //For form input

    const handleSubmit = (e) =>{ //For form input
        const { addressTo, amount, message, keyword } = formData;

        e.preventDefault();

        if(!addressTo || !amount || !message || !keyword) return;

        sendTransaction();
    } 

    return(
        <div className="relative sm:-8 p-4 pl-9 bg-[#13131a] min-h-screen">
            <div className="bg-[#13131a]">
                <Navbar/>
            <div className ="flex flex-col flex-1 items-center justify-start w-full md:mt-0 mt-10">
                    {/*<div className="p-3 justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card white-glassmorphism">
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
                                <p className="text-white font-semibold text-sm">
                                    Name
                                </p>
                            </div>
                        </div>
                    </div> remove the card*/ } 
                    {/* This is the Form section*/}
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
            <Footer />
        </div>
    )
}

export default Attendance;