import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminNavbar, CustomButton, Loading, FormField, AdminFooter } from '../../components/index.js';
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
        courseCode:'',
        week:'',
        programLevel:'',
    });

    const departmentOptions = ['Artificial Intelligence', 'Computer System and Network', 'Information Systems', 'Software Engineering', 'Multimedia Computing', 'Data Science','All'];
    const programOptions = ['Bachelor', 'Master', 'PhD'];

    const handleFormFieldChange =(fieldName, e) =>{
        let value = e.target.value;
        if (fieldName === 'courseName') {
            value = value.replace(/\//g, ''); 
        }
        setForm(prevForm => ({ ...prevForm, [fieldName]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            setIsLoading(true);
                await createCourse({...form});
                setIsLoading(false);
                navigate('/attendance')
        } catch( error) {
            console.error();
        }
    }

    return(
        <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-col">
            <div className="bg-[#13131a] flex-grow">
                <AdminChecker/>
                <AdminNavbar/>
                <div className="flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4 blue-glassmorphism ml-[300px] mr-[300px]"> 
                    {isLoading && <Loading/>}
                    <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[3a3a43] rounded-[10px]">
                        <h1 className='font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white'> Create an Attendance </h1>
                    </div>
                    <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
                        <div className="flex flex-wrap flex-col gap-[40px]">
                            <FormField 
                                labelName="Course Name *"
                                placeholder="Provide the title of the Attendance"
                                inputType="text"
                                value={form.courseName}
                                handleChange={(e) => handleFormFieldChange('courseName', e)}
                            />
                            <FormField 
                                labelName="Course Code *"
                                placeholder="Provide the title of the Attendance"
                                inputType="text"
                                value={form.courseCode}
                                handleChange={(e) => handleFormFieldChange('courseCode', e)}
                            />
                            <FormField 
                                labelName="Week *"
                                placeholder="Provide the week of the Attendance"
                                inputType="text"
                                value={form.week}
                                handleChange={(e) => handleFormFieldChange('week', e)}
                            />
                            <FormField 
                                labelName="Lecturer *"
                                placeholder="Provide lecturer's name"
                                inputType="text"
                                value={form.lecturer}
                                handleChange={(e) => handleFormFieldChange('lecturer', e)}
                            />
                            <FormField 
                                labelName="Attendance Description *"
                                placeholder="Provide a description of the Attendance"
                                isTextArea
                                value={form.description}
                                handleChange={(e) => handleFormFieldChange('description', e)}
                            />
                            <label className="font-epilogue font-medium text-[16px] text-white" htmlFor="department"> Department * </label>
                            <select
                                id="department"
                                className="w-[300px] p-[4px] rounded-[5px] bg-[#1b1f34] text-white border-2 border-[#3a3a43] h-[30px]"
                                value={form.department}
                                onChange={(e) => setForm({ ...form, department: e.target.value })}
                            >
                                <option value="" disabled>
                                    Select Department
                                </option>
                                {departmentOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        <label className="font-epilogue font-medium text-[16px] text-white" htmlFor="programLevel"> Program Level * </label>
                            <select
                                id="programLevel"
                                className="w-[300px] p-[4px] rounded-[5px] bg-[#1b1f34] text-white border-2 border-[#3a3a43] h-[30px]"
                                value={form.programLevel}
                                onChange={(e) => setForm({ ...form, programLevel: e.target.value })}
                            >
                                <option value="" disabled>
                                    Select Program Level
                                </option>
                                {programOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
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
            <AdminFooter/>
        </div>
    )
}

export default CreateAttendance;