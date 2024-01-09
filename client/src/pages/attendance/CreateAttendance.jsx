import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkIfImage } from '../../utils/index.js';
import { Navbar, CustomButton, Loading, FormField, Footer } from '../../components/index.js';
import   { useStateContext } from '../../context/AttendanceContext.jsx';
import AdminChecker from '../../utils/adminChecker.js';

const CreateAttendance = () => {
    
    const navigate = useNavigate();
    const [ isLoading, setIsLoading ] = useState(false);
    const { createCourse } = useStateContext();
    const[ form, setForm ] = useState({
        lecturer: '',
        courseName:'',
        description:'',
        department:'',
        image:'',
    });

    const [ startTime, setStartTime ] = useState('');
    const [ endTime, setEndTime ] = useState('');
    /*
    const convertUnixTimestampToUTC8 = (unixTimestamp) => {
        const dateObject = new Date(unixTimestamp * 1000); // Convert back to milliseconds
        const utc8DateTimeString = dateObject.toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur', hour12: false });
        return utc8DateTimeString;
    };*/

    useEffect(() => {
        console.log('Start time', startTime);
        console.log('End time', endTime);
      }, [startTime, endTime]);

    const convertToUnixTimestamp = (dateTimeString) => {
        const selectedDate = new Date(dateTimeString);
        return Math.floor(selectedDate.getTime() / 1000);
    }

    const handleFormFieldChange =(fieldName, e) =>{
        let value = e.target.value;
        if (fieldName === 'courseName') {
            value = value.replace(/\//g, ''); 
        }
        setForm({...form, [fieldName]: value});
        console.log({...form, [fieldName]: value});
    }

    const handleStartTime = (e) =>{
        let value = e.target.value;
        const unix = convertToUnixTimestamp(value);
        setStartTime(unix);
    }

    const handleEndTime = (e) =>{
        let value = e.target.value;
        const unix = convertToUnixTimestamp(value);
        setEndTime(unix);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        checkIfImage(form.image, async(exists) => {
            if(exists){
                setIsLoading(true);
                await createCourse({...form}, startTime, endTime);
                setIsLoading(false);
                navigate('/attendance');
            } else {
                alert('Provide valid image URL')
                setForm({...form, image: ''});
            }
        })
    }

    return(
        <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-col">
            <div className="bg-[#13131a] flex-grow">
                <AdminChecker/>
                <Navbar/>
                <div className="flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4 blue-glassmorphism ml-[300px] mr-[300px]"> 
                    {isLoading && <Loading/>}
                    <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[3a3a43] rounded-[10px]">
                        <h1 className='font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white'> Create an Attendance </h1>
                    </div>
                    <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
                        <div className="flex flex-wrap flex-col gap-[40px]">
                            <FormField 
                                labelName="Lecturer"
                                placeholder="Provide lecturer's name"
                                inputType="text"
                                value={form.lecturer}
                                handleChange={(e) => handleFormFieldChange('lecturer', e)}
                            />
                            <FormField 
                                labelName="Course Name"
                                placeholder="Provide the title of the Attendance"
                                inputType="text"
                                value={form.courseName}
                                handleChange={(e) => handleFormFieldChange('courseName', e)}
                            />
                            <FormField 
                                labelName="Attendance Description *"
                                placeholder="Provide a description of the Attendance"
                                isTextArea
                                value={form.description}
                                handleChange={(e) => handleFormFieldChange('description', e)}
                            />
                            <FormField 
                                labelName="Department"
                                placeholder="Provide available department"
                                inputType="text"
                                value={form.department}
                                handleChange={(e) => handleFormFieldChange('department', e)}
                            />
                            <div className="flex flex-wrap gap-[40px]">
                            <FormField
                                labelName="Start Time * "
                                placeholder="Start Time"
                                inputType="datetime-local"
                                value={form.startTime} //startTime //endTime is like endDate similar to startTime being date.
                                handleChange={(e) => handleStartTime(e)}
                                //handleChange={handleDeadlineChange}
                                //min={getTomorrowDate()}
                            />
                            <FormField
                                labelName="End Time * "
                                placeholder="End Time"
                                inputType="datetime-local"
                                value={form.endTime} //startTime //endTime is like endDate similar to startTime being date.
                                handleChange={(e) => handleEndTime(e)}
                                //handleChange={handleDeadlineChange}
                                //min={getTomorrowDate()}
                            />
                            </div>
                            <FormField 
                                labelName="Campaign image *" 
                                placeholder="Place image URL for the Attendance"
                                inputType="url"
                                value={form.image}
                                handleChange={(e) => handleFormFieldChange('image', e)}
                            />
                        </div>
                        {isLoading? (
                            <Loading />
                        ) : (
                            <CustomButton 
                                btnType="submit"
                                title="Create Attendance"
                                styles="bg-[#8934eb] cursor-pointer hover:bg-[#a834eb]"
                            />
                        )}
                    </form>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default CreateAttendance;