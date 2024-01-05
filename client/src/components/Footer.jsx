import logo from '../images/placeholder.png';
import { Link } from 'react-router-dom';

const NavbarItem = ({title, classProps}) =>{ {/* This is to set the items in the navbar (next to the login) then we use this to pass at const Navbar*/}
    
    const toPath = `/${title.toLowerCase().replace(/\s+/g, '-')}`;

    return(
        <li className={`mx-4 cursor-pointer ${classProps}`}>
            <Link to={toPath}>{title}</Link> 
        </li>
    ); //all we needed was to add the <link> here 
};

const Footer = () => {
    return(
        <div className='w-full flex md:justify-center justify-between items-center flex-col p-4 bg-[#13131a]'>
            <div className = 'w-full flex sm:flex-row flex-col justify-between items-center my-4'>
                <div className='flex flex-[0.5] justify-center items-center'>
                    <img src = {logo} alt="logo" className="w-32"/>
                </div>
                <div className = 'text-white flex flex-1 justify-evenly items-center flex-wrap sm;mt-0 mt-5 w-full'>
                    <ul className="list-none flex">
                        {["Attendance", "Profile", "Student Aide", "History","Library","FAQ"].map((item, index)=> ( //change navbar items
                            <NavbarItem key = {item + index} to={`/${item.toLowerCase()}`} title = {item} />
                        ))}
                    </ul>
                </div>
            </div>
            <div className='sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5' />
            <div className ='sm:w[90%] w-full flex justify-between items-center mt-3'>
                <p className = "text-white text-left text-xs ml-[100px]"> U2005343 </p>
                <p className = "text-white text-right text-xs mr-[100px]"> Final Year Project </p>
            </div>
        </div>
    )
};

export default Footer;