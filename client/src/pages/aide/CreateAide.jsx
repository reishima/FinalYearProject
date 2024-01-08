import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkIfImage } from '../../utils/index.js';
import { Navbar, CustomButton, Loading, FormField, Footer } from '../../components/index.js';
import   { useStateContext } from '../../context/AideContext.jsx';
import AdminChecker from '../../utils/adminChecker.js';

const CreateAide = () => {
    
    const navigate = useNavigate();
    const [ isLoading, setIsLoading ] = useState(false);
    const { createAide } = useStateContext();
    const[ form, setForm ] = useState({
        title: '',
        description: '',
        maxRequesters: '',
        deadline: '',
        image: ''
    });

    const convertToUnixTimestamp = (dateString) => {
        const dateObject = new Date(dateString);
        return dateObject.getTime(); 
    };

    const handleFormFieldChange =(fieldName, e) =>{
        let value = e.target.value;
        if (fieldName === 'maxRequesters') {
            value = value.replace(/\D/g, ''); 
        }
        if (fieldName === 'deadline') {
            const unixTimestampDeadline = convertToUnixTimestamp(value);
            console.log('New Unix Timestamp Deadline:', unixTimestampDeadline);
            setForm({ ...form, [fieldName]: unixTimestampDeadline })
        } // Check for the title field and remove forward slashes
        if (fieldName === 'title') {
            value = value.replace(/\//g, ''); // Remove forward slashes
        }
        setForm({...form, [fieldName]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        checkIfImage(form.image, async(exists) => {
            if(exists){
                setIsLoading(true);
                await createAide({...form})
                console.log('Current time:',)
                setIsLoading(false);
                navigate('/student-aide');
            } else {
                alert('Provide valid image URL')
                setForm({...form, image: ''});
            }
        })
    }
    
    const getTomorrowDate = () => {          
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const year = tomorrow.getFullYear();
        const month = `${tomorrow.getMonth() + 1}`.padStart(2, '0');
        const day = `${tomorrow.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
    
      const handleDeadlineChange = (e) => {
        const selectedDate = e.target.value;
        if (selectedDate < getTomorrowDate()) {
          setForm({ ...form, deadline: getTomorrowDate() });
        } else {
          setForm({ ...form, deadline: selectedDate });
        }
      };

    return(
        <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-col">
            <div className="bg-[#13131a] flex-grow">
                <AdminChecker/>
                <Navbar/>
                <div className="flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4 blue-glassmorphism ml-[300px] mr-[300px]"> 
                    {isLoading && <Loading/>}
                    <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[3a3a43] rounded-[10px]">
                        <h1 className='font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white'> Create an Aide </h1>
                    </div>
                    <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
                        <div className="flex flex-wrap flex-col gap-[40px]">
                            <FormField 
                            labelName="Aide Title *"
                            placeholder="Provide the title of the Aide"
                            inputType="text"
                            value={form.title}
                            handleChange={(e) => handleFormFieldChange('title', e)}
                            />
                            <FormField 
                                labelName="Aide Description *"
                                placeholder="Provide a description of the Aide"
                                isTextArea
                                value={form.description}
                                handleChange={(e) => handleFormFieldChange('description', e)}
                            />
                            <div className="flex flex-wrap gap-[40px]">
                            <FormField 
                                labelName="Requester Threshold"
                                placeholder="Enter the maximum number of requesters"
                                inputType="text"
                                value={form.maxRequesters}
                                handleChange={(e) => handleFormFieldChange('maxRequesters', e)}
                            />
                            <FormField
                                labelName="End Date * - Deadline to Request the Aide. The minimum deadline is tomorrow's date."
                                placeholder="Deadline to Request the Aide. The minimum deadline is tomorrow's date."
                                inputType="date"
                                value={form.deadline}
                                handleChange={(e) => handleFormFieldChange('deadline', e)}
                                //handleChange={handleDeadlineChange}
                                //min={getTomorrowDate()}
                            />
                            </div>
                            <FormField 
                                labelName="Campaign image *" 
                                placeholder="Place image URL for the Aide"
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
                                title="Create Aide"
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

export default CreateAide;