import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkIfImage } from '../../utils/index.js';
import { Navbar, CustomButton, Loading, FormField, Footer } from '../../components/index.js';
import   { useStateContext } from '../../context/LibraryContext.jsx';
import AdminChecker from '../../utils/adminChecker.js';

const CreateBook = () => {
    
    const navigate = useNavigate();
    const [ isLoading, setIsLoading ] = useState(false);
    const { createBook } = useStateContext();
    const[ form, setForm ] = useState({
        title: '',
        description: '',
        submission: '',
        image: ''
    });

    const handleFormFieldChange =(fieldName, e) =>{
        setForm({...form, [fieldName]: e.target.value}) //function that makes the value update for each field accordingly
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        checkIfImage(form.image, async(exists) => {
            if(exists){
                setIsLoading(true);
                await createBook({...form})
                setIsLoading(false);
                navigate('/library');
            } else {
                alert('Provide valid image URL')
                setForm({...form, image: ''});
            }
        })
    }

    return(
        <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen">
            <div className="bg-[#13131a]">
                <AdminChecker/>
                <Navbar/>
                <div className="flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4 blue-glassmorphism"> 
                    {isLoading && <Loading/>}
                    <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[3a3a43] rounded-[10px]">
                        <h1 className='font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white'> Create a Book </h1>
                    </div>
                    <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
                        <div className="flex flex-wrap flex-col gap-[40px]">
                            <FormField 
                            labelName="Book Title *"
                            placeholder="Write a title"
                            inputType="text"
                            value={form.title}
                            handleChange={(e) => handleFormFieldChange('title', e)}
                            />
                        
                            <FormField 
                                labelName="Story *"
                                placeholder="Book description"
                                isTextArea
                                value={form.description}
                                handleChange={(e) => handleFormFieldChange('description', e)}
                            />
                            <div className="flex flex-wrap gap-[40px]">
                            <FormField //this is weird
                                labelName="Submission Date *"
                                placeholder="Dubmission Date"
                                inputType="date"
                                value={form.submission}
                                handleChange={(e) => handleFormFieldChange('submission', e)}
                            />
                            </div>
                            <FormField 
                                labelName="Book image *" //in this case the image is a url to an image. maybe we can use that to hook up pfps? upload the image to database?
                                placeholder="Place image URL of your campaign"
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
                                title="Create a book"
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

export default CreateBook;