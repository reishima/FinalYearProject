import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkIfImage } from '../../utils/index.js';
import { Navbar, CustomButton, Loading, FormField, Footer } from '../../components/index.js';
import  { useStateContext } from '../../context/AttendanceContext.jsx';
import AdminChecker from '../../utils/adminChecker.js';

const CreateAttendance = () => {
    
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { createCourse } = useStateContext();
    const[form, setForm] = useState({
        owner:'',
        courseName:'',
        description:'',
        department:'',
        startTime: '',
        endTime: '',
        date: '',
        image:'',
    });

    const convertToUnixTimestamp = (dateString) => {
        const dateObject = new Date(dateString);
        return dateObject.getTime(); 
    };

    const handleFormFieldChange =(fieldName, e) =>{
        let value = e.target.value;
        if (fieldName === 'date') {
            const unixTimestampDate = convertToUnixTimestamp(value);
            console.log('New Unix Timestamp Deadline:', unixTimestampDate);
            setForm({ ...form, [fieldName]: unixTimestampDate })
        } // Check for the title field and remove forward slashes
        if (fieldName === 'title') {
            value = value.replace(/\//g, ''); // Remove forward slashes
        }
        setForm({...form, [fieldName]: value}) //function that makes the value update for each field accordingly
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        checkIfImage(form.image, async(exists) => {
            if(exists){
                setIsLoading(true);
                await createCourse({...form})
                setIsLoading(false);
                navigate('/attendance');
            } else {
                alert('Provide valid image URL')
                setForm({...form, image: ''});
            }
        })
    }

    const handleStartTimeChange = (e) => {
        const selectedStartTime = parseInt(e.target.value);

        // Ensure end time is at least 1 hour after start time
        const defaultEndTime = Math.min(selectedStartTime + 1, 21);

        setForm({
            ...form,
            startTime: selectedStartTime,
            endTime: defaultEndTime,
        });
    };
      

    return(
        <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-col">
            <div className="bg-[#13131a] flex-grow">
                <AdminChecker/>
                <Navbar/>
                <div className="flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4 blue-glassmorphism ml-[300px] mr-[300px] mx-auto"> 
                    {isLoading && <Loading/>}
                    <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[3a3a43] rounded-[10px]">
                        <h1 className='font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white'> Create Course Attendance </h1>
                    </div>
                    <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
                        <div className="flex flex-wrap flex-col gap-[40px]">
                            <FormField 
                            labelName="Lecturer Name *"
                            placeholder="Dr. John Doe"
                            inputType="text"
                            value={form.owner}
                            handleChange={(e) => handleFormFieldChange('owner', e)}
                            />
                            <FormField 
                            labelName="Course Name *"
                            placeholder="Input Course Name"
                            inputType="text"
                            value={form.courseName}
                            handleChange={(e) => handleFormFieldChange('courseName', e)}
                            />
                            <div className="flex flex-wrap gap-[40px]">
                            <FormField 
                                labelName="Department *" //in this case the image is a url to an image. maybe we can use that to hook up pfps? upload the image to database?
                                placeholder="Place image URL of the course"
                                inputType="text"
                                value={form.department}
                                handleChange={(e) => handleFormFieldChange('department', e)}
                            />
                            </div>
                            <FormField 
                                labelName="Description of Course *"
                                placeholder="Brief description of course"
                                isTextArea
                                value={form.description}
                                handleChange={(e) => handleFormFieldChange('description', e)}
                            />
                            <div className="flex flex-wrap gap-[40px]">
                            <label htmlFor="startTime" className="text-white">
                                Start Time *
                            </label>
                            <select
                                id="startTime"
                                value={form.startTime}
                                onChange={(e) => handleStartTimeChange(e)}
                                className="p-2 border rounded-md"
                            >
                                {[...Array(11).keys()].map((hour) => (
                                <option key={hour} value={hour + 9}>{`${hour + 9}:00 `}</option>
                                ))}
                            </select>
                            </div>

                            <div className="flex flex-wrap gap-[40px]">
                            <label htmlFor="endTime" className="text-white">
                                End Time *
                            </label>
                            <select
                                id="endTime"
                                value={form.endTime}
                                onChange={(e) => handleFormFieldChange('endTime', e)}
                                className="p-2 border rounded-md"
                            >
                                {[...Array(13).keys()].map((hour) => {
                                    const endTimeOption = form.startTime + 1 + hour;
                                    return (
                                        endTimeOption <= 21 && (
                                            <option key={endTimeOption} value={endTimeOption}>
                                                {`${endTimeOption}:00`}
                                            </option>
                                        )
                                    );
                                })}
                            </select>
                            </div>
                            <div className="flex flex-wrap gap-[40px]">
                            <FormField 
                                labelName="Date *"
                                placeholder="Date"
                                inputType="date"
                                value={form.date}
                                handleChange={(e) => handleFormFieldChange('date', e)}
                            />
                            </div>
                            <div className="flex flex-wrap gap-[40px]">
                            <FormField 
                                labelName="Course Image *" 
                                placeholder="Place image URL of the course"
                                inputType="url"
                                value={form.image}
                                handleChange={(e) => handleFormFieldChange('image', e)}
                            />
                            </div>
                            </div>
                            
                        {isLoading? (
                            <Loading />
                        ) : (
                            <CustomButton 
                                btnType="submit"
                                title="Create Course"
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