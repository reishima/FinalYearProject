import React, { useState } from 'react';
import { Navbar, Footer } from '../components/index.js';
import AuthChecker from '../utils/handle.js';

const FAQ = () => {
    const [expandedBox, setExpandedBox] = useState(null);

    const commonStyles = 'rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-2xl min-h-[70px] sm:px-0 px-2 sm:w-[1500px] w-full flex flex-col justify-center items-center border-[0.5px] border-[#8934eb] text-sm font-light text-white font-semibold';

    const handleBoxClick = (index) => {
        setExpandedBox((prev) => (prev === index ? null : index));
    };

    const faqData = [
        { question: 'Attendance', answer: 'Answer 1. Line 1\nAnswer 1. Line 2Answer 1. Line 1\nAnswer 1. Line 2Answer 1. Line 1\nAnswer 1. Line 2Answer 1. Line 1\nAnswer 1. Line 2' },
        { question: 'Student Aide', answer: 'Answer 1. Line 1\nAnswer 1. Line 2Answer 1. Line 1\nAnswer 1. Line 2Answer 1. Line 1\nAnswer 1. Line 2' },
        { question: 'Libray', answer: 'Answer 2' },
        { question: 'History', answer: 'Answer 2' },
        { question: 'Profile and Registration', answer: 'Answer 2' },
        { question: 'Other questions', answer: 'Email us at u2005343@siswa.um.edu.my' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#13131a] min-h-screen">
            <AuthChecker />
            <Navbar />
            <div className="justify-center flex-1 flex flex-col items-center">
                {faqData.map((item, index) => (
                    <div key={index} className={`my-4 ${commonStyles}`}>
                        <div
                            className="cursor-pointer"
                            onClick={() => handleBoxClick(index)}
                        >
                            {item.question}
                        </div>
                        {expandedBox === index && (
                            <div
                                className="text-white mt-2"
                                style={{ whiteSpace: 'pre-line' }}
                                dangerouslySetInnerHTML={{ __html: item.answer }}
                            />
                        )}
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
};

export default FAQ;
