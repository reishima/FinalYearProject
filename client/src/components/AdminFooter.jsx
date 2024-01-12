import logo from '../images/banner.png';
import { Link } from 'react-router-dom';

const AdminFooter = () => {
    return(
        <div className='w-full flex md:justify-center justify-between items-center flex-col p-4 bg-[#13131a]'>
            <div className = 'w-full flex sm:flex-row flex-col justify-between items-center my-4'>
                <div className='flex flex-[0.5] justify-center items-center'>
                    <Link to='/admin'>
                    <img src={logo} alt="logo" className="w-32 cursor-pointer" />
                </Link>
                </div>
                <div className = 'text-white flex flex-1 justify-evenly items-center flex-wrap sm;mt-0 mt-5 w-full'>
                <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
                    <li className={`mx-4 cursor-pointer`}>
                        <Link to="/admin/attendance">Course Management</Link>
                    </li>
                    <li className={`mx-4 cursor-pointer`}>
                        <Link to="/admin/admin-aides">Aide Management</Link>
                    </li>
                    <li className={`mx-4 cursor-pointer`}>
                        <Link to="/admin/history"> History</Link>
                    </li>
                    <li className={`mx-4 cursor-pointer`}>
                        <Link to="/admin/admin-library"> Library Management </Link>
                    </li>
                    <li className={`mx-4 cursor-pointer`}>
                        <Link to="/admin/query-user"> Query Users </Link>
                    </li>
                </ul>
                </div>
            </div>
        <div className='sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5' />
            <div className ='sm:w[90%] w-full flex justify-between items-center mt-3'>
                <p className = "text-white text-left text-xs md:ml-[100px]"> U2005343 </p>
                <p className = "text-white text-right text-xs md:mr-[100px]"> Final Year Project </p>
            </div>
        </div>
    )
};

export default AdminFooter;