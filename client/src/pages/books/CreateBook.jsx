import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkIfImage } from '../../utils/index.js';
import { Navbar, CustomButton, Loading, FormField, Footer } from '../../components/index.js';
import   { useStateContext } from '../../context/LibraryContext.jsx';
import AdminChecker from '../../utils/adminChecker.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../utils/FirebaseConfig.js';
import swal from 'sweetalert';

const CreateBook = () => {
    
    const navigate = useNavigate();
    const [ isLoading, setIsLoading ] = useState(false);
    const { createBook } = useStateContext();
    const[ form, setForm ] = useState({
        title: '',
        description: '',
        image: '',
        author:'',
        pages:'',
    });
    const [ imageUpload, setImageUpload ] = useState('');
    const [ picture, setPicture ] = useState('');
 
    const handleFormFieldChange =(fieldName, e) =>{
        setForm({...form, [fieldName]: e.target.value}) 
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

    const uploadFile = async (event) => {
        event.preventDefault(); 
        if (!imageUpload) return;
    
        try {
            const imageRef = ref(storage, `pictures/books/${imageUpload.name}`);
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

    return(
        <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-col">
            <div className="bg-[#13131a] flex-grow">
                <AdminChecker/>
                <Navbar/>
                <div className="flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4 blue-glassmorphism ml-[300px] mr-[300px]"> 
                    {isLoading && <Loading/>}
                    <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[3a3a43] rounded-[10px] ">
                        <h1 className='font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white'> Create a Book </h1>
                    </div>
                    <form onSubmit={handleSubmit} className="w-full mt-[6px] mb-[15px] flex flex-col gap-[30px]">
                        <div className="flex flex-wrap flex-col gap-[40px] ">
                            <FormField 
                                labelName="Book Title *"
                                placeholder="Write a title"
                                inputType="text"
                                value={form.title}
                                handleChange={(e) => handleFormFieldChange('title', e)}
                            />
                            <FormField 
                                labelName="Name of Author *"
                                placeholder="Write the Author's name"
                                inputType="text"
                                value={form.author}
                                handleChange={(e) => handleFormFieldChange('author', e)}
                            />
                            <FormField 
                                labelName="Number of Pages *"
                                placeholder="Write the number of pages"
                                inputType="text"
                                value={form.pages}
                                handleChange={(e) => handleFormFieldChange('pages', e)}
                            />
                            <FormField 
                                labelName="Story *"
                                placeholder="Book description"
                                isTextArea
                                value={form.description}
                                handleChange={(e) => handleFormFieldChange('description', e)}
                            />
                            <label className='py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300ox]'>
                                Upload Book Image
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
                            <Loading/>
                        ) : (
                            <CustomButton 
                                btnType="submit"
                                title="Create Book"
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