import { HiMenuAlt4 } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';
import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import logo from '../images/placeholder.png';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const NavbarItem = ({title, classProps}) =>{ {/* This is to set the items in the navbar (next to the login) then we use this to pass at const Navbar*/}
    
    const toPath = `/${title.toLowerCase().replace(/\s+/g, '-')}`;

    return(
        <li className={`mx-4 cursor-pointer ${classProps}`}>
            <Link to={toPath}>{title}</Link> 
        </li>
    ); //all we needed was to add the <link> here 
};

const Navbar = () => {

    const [ toggleMenu, setToggleMenu ] = React.useState(false); {/* for rendering on mobile devices */}
    const [ user, setUser ] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (authUser) => {
            setUser(authUser);
        });
    }, []);

    const handleSignOut = () => {
        const auth = getAuth();
        signOut(auth).then(val => {
            console.log(val, "no one should be signed in rn");
        }).catch((error) => {
            console.error("Error signing out", error);
        });
    };

    return(
        <nav className="w-full flex md:justify-center justify-between items-center p-4">
            <div className="md:flex-[0.5] flex-initial justify-center items-center">
                <Link to='/home'>
                    <img src={logo} alt="logo" className="w-32 cursor-pointer"/>
                </Link>  
            </div>
            <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
                {["Attendance", "Profile", "Student Aide", "History","Library","FAQ"].map((item, index)=> ( //change navbar items
                    <NavbarItem key = {item + index} to={`/${item.toLowerCase()}`} title = {item} />
                ))}
                {user ? (
                <li className ="bg-[#8934eb] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#a834eb]" onClick={handleSignOut}> {/* change login button colour and hover colour */}
                    Sign Out
                </li>
                ) : (
                <li className ="bg-[#8934eb] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#a834eb]"> {/* change login button colour and hover colour */}
                    <Link to="/login"> Login </Link>
                </li>
                )}
            </ul>
            <div className="flex relative"> {/* for side menu on mobile devices */}
                {toggleMenu
                ? <AiOutlineClose fontSize={28} className="text-[#13131a] md:hidden cursor-pointer" onClick={()=> setToggleMenu(false)}/>
                : <HiMenuAlt4 fontSize={28} className="text-white md:hidden cursor-pointer" onClick={()=> setToggleMenu(true)}/> }
                {toggleMenu && (
                    <ul className="z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none flex 
                    flex-col justify-start items-end rounded-empty blue-glassmorhpism text-white animate-slide-in"> {/* mobile side panel */}
                        <li className="text-xl w-full my-2">
                            <AiOutlineClose onClick={() => setToggleMenu(false)}/>
                        </li>
                        {["Attendance", "Profile", "Student Aide", "History","Library","FAQ"].map((item, index)=> ( //change navbar items (mobile version)
                            <NavbarItem key = {item + index} title = {item} to={`/${item.toLowerCase()}`} classProps="my-2 text-lg"/> //and also add to here
                        ))}
                    </ul>
                )}
            </div>
        </nav>
    );
}

export default Navbar;