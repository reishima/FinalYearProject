import React, { useState, useEffect } from 'react';

import logo from '../images/placeholder.png';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';


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
                    <img src={logo} alt="logo" className="w-32"/>
            </div>
        </nav>
    );
}

export default Navbar;