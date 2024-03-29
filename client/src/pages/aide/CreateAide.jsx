import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkIfImage } from '../../utils/index.js';
import { AdminNavbar, CustomButton, Loading, FormField, AdminFooter } from '../../components/index.js';
import   { useStateContext } from '../../context/AideContext.jsx';
import AdminChecker from '../../utils/adminChecker.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage} from '../../utils/FirebaseConfig.js';
import swal from 'sweetalert';

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
    const [ imageUpload, setImageUpload ] = useState('');
    const [ picture, setPicture ] = useState('');

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
            setForm({ ...form, [fieldName]: unixTimestampDeadline })
        } 
        if (fieldName === 'title') {
            value = value.replace(/\//g, '');
        }
        setForm({...form, [fieldName]: value});
    }

    const uploadFile = async (event) => {
        event.preventDefault(); 
        if (!imageUpload) return;
    
        try {
            const imageRef = ref(storage, `pictures/aides/${imageUpload.name}`);
            const snapshot = await uploadBytes(imageRef, imageUpload);
            const url = await getDownloadURL(snapshot.ref);
    
            setForm({
                ...form,
                image: url,
            });
            swal({
                text: 'Image saved succesfully',
              })
        } catch (error) {
            console.error('Error getting download URL:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        checkIfImage(form.image, async(exists) => {
            if(exists){
                setIsLoading(true);
                await createAide({...form})
                setIsLoading(false);
                navigate('/admin/admin-aides');
            } else {
                swal({
                    text: 'Provide valid image URL',
                    closeOnClickOutside: true,
                })
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
                <AdminNavbar/>
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
                            
                            <FormField 
                                labelName="Requester Threshold"
                                placeholder="Enter the maximum number of requesters"
                                inputType="text"
                                value={form.maxRequesters}
                                handleChange={(e) => handleFormFieldChange('maxRequesters', e)}
                            />
                            <FormField
                                labelName="End Date * - Deadline to Request the Aide. The minimum deadline is tomorrow's date."
                                inputType="date"
                                value={form.deadline}
                                handleChange={handleDeadlineChange}
                                min={getTomorrowDate()}
                            />
                            <label className='py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300ox]'>
                                Upload Aide Image *
                                <div className={`text-white font-light text-base flex min-w-[500px] justify-center`} title={picture}>
                                    <p> <span style={{ marginRight: '20px' }}></span>
                                        <input
                                            type="file"
                                            onChange={(event) => {
                                                setImageUpload(event.target.files[0]);
                                            }}
                                        />
                                        <button onClick = {uploadFile} className ="bg-[#8934eb] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#a834eb]"> Upload </button>
                                    </p>
                                </div>
                                </label>
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
            <AdminFooter/>
        </div>
    )
}

export default CreateAide;