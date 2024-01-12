import logo from '../images/banner.png';

const Footer = () => {
    return(
        <div className='w-full flex md:justify-center justify-between items-center flex-col p-4 bg-[#13131a]'>
            <div className = 'w-full flex sm:flex-row flex-col justify-between items-center my-4'>
                <div className='flex flex-[0.5] justify-center items-center'>
                    <img src = {logo} alt="logo" className="w-32"/>
                </div>
            </div>
            <div className='sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5' />
            <div className ='sm:w[90%] w-full flex justify-between items-center mt-3'>
                <p className = "text-white text-left text-xs md:ml-[100px]"> U2005343 </p>
                <p className = "text-white text-left text-xs md:mr-[100px]"> Final Year Project </p>
            </div>
        </div>
    )
};

export default Footer;