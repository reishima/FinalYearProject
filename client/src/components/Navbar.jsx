import { HiMenuAlt4 } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';
import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import logo from '../images/banner.png';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const NavbarItem = ({title, classProps}) =>{ 
    
    const toPath = `/${title.toLowerCase().replace(/\s+/g, '-')}`;

    return(
        <li className={`mx-4 cursor-pointer ${classProps}`}>
            <Link to={toPath}>{title}</Link> 
        </li>
    ); 
};

const Navbar = () => {

    const [ toggleMenu, setToggleMenu ] = React.useState(false); 
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
                {["Attendance", "Profile", "Student Aide", "History","Library","FAQ"].map((item, index)=> (
                    <NavbarItem key = {item + index} to={`/${item.toLowerCase()}`} title = {item} />
                ))}
                {user ? (
                <li className ="bg-[#8934eb] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#a834eb]" onClick={handleSignOut}>
                    Sign Out
                </li>
                ) : (
                <li className ="bg-[#8934eb] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#a834eb]"> 
                    <Link to="/login"> Login </Link>
                </li>
                )}
            </ul>
            <div className="flex relative"> 
                {toggleMenu
                ? <AiOutlineClose fontSize={28} className="text-[#13131a] md:hidden cursor-pointer" onClick={()=> setToggleMenu(false)}/>
                : <HiMenuAlt4 fontSize={28} className="text-white md:hidden cursor-pointer" onClick={()=> setToggleMenu(true)}/> }
                {toggleMenu && (
                    <ul className="z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none flex 
                    flex-col justify-start items-end rounded-empty blue-glassmorhpism text-white animate-slide-in"> 
                        <li className="text-xl w-full my-2">
                            <AiOutlineClose onClick={() => setToggleMenu(false)}/>
                        </li>
                        {["Attendance", "Profile", "Student Aide", "History","Library","FAQ"].map((item, index)=> ( 
                            <NavbarItem key = {item + index} title = {item} to={`/${item.toLowerCase()}`} classProps="my-2 text-lg"/> 
                        ))}
                    </ul>
                )}
            </div>
        </nav>
    );
}

export default Navbar;