import React, { useState } from 'react';
import { NavbarInOut, FooterInOut, Loading } from '../components/index.js';
import { auth } from '../utils/FirebaseConfig.js';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

const ForgotPassword = () => {
    const [ isLoading, setIsLoading] = useState(false);
    const history = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        sendPasswordResetEmail(auth, email).then(data=> {
            swal({
                text: "If the email exists, a recovery message has been sent to your inbox.",
                closeOnClickOutside: true,
              });
        }).catch(err => {
            if(err.code === "auth/missing-email"){
                swal({
                    text: "Please enter your email",
                    closeOnClickOutside: true,
                  });
            }
        });
    }
  
    return (
        <div className="flex flex-col bg-[#13131a] min-h-screen">
                <NavbarInOut/>
                <div className = "flex-1 flex items-center justify-center">
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className = "my-2 w-full rounded-sm p-2 outline-none bg-transparent border-none text-lg white-glassmorphism">
                        <div className ="flex flex-col flex-1 items-center justify-start w-full md:mt-0 mt-10">
                            <div className="p-8 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
                            <h1 className = "text-2xl font-bold text-white font-epilogue"> Reset Password </h1> <br/>
                                <input name="email" placeholder="Email" className='pl-4 input-field w-full rounded'/>
                                <div className="h-[1px] w-full my-2"/>
                                {isLoading? (
                                    <Loading />
                                ) : (
                                    <button className = "text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer hover:bg-[#a834eb] bg-[#8934eb]"> Reset Password </button>
                                )}
                            </div>
                        </div>
                     </div>
                </form>
            </div>
        <FooterInOut/>
    </div>
    );

  };

export default ForgotPassword;