import React, { useState } from 'react';
import { Navbar, Footer } from '../components/index.js';
import AuthChecker from '../utils/handle.js';

const FAQ = () => {
    const [expandedBox, setExpandedBox] = useState(null);

    const commonStyles = 'rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-2xl min-h-[70px] sm:px-0 px-2 sm:w-[1500px] w-full flex flex-col justify-center items-center border-[0.5px] border-[#8934eb] text-sm font-light text-white font-semibold';

    const questionStyles = (index) => `cursor-pointer ${expandedBox === index ? 'mt-5' : ''}`;

    const expandedStyles = 'text-white mt-2 mb-5';

    const handleBoxClick = (index) => {
        setExpandedBox((prev) => (prev === index ? null : index));
    };

    const faqData = [
        { question: 'Attendance', answer: "Item A\n1. In order to use the attendance system, users must first register for courses. If courses are registered refer item B.\n2. To register for courses users must first select their Department and Level of Study by editing their profile at the Profile page. \n3. Users can head to the profile page by clicking on 'Profile' either at the navbar on top or the bottom footer. Users can also click on 'Profile' from their home dashboard. \n4. Once at the profile page, users should click 'Edit' and select their Department and Level of Study. Once selected, users must press 'Save'. \n 5. Users must then click on 'Course Registration' button which can be found under the 'Edit' button of the profile page. \n 6. Users should refer the list of available courses then click on 'Select Courses' to select their desired courses of the semester. \n 7. Users are provided 8 fields and can select up to 8 courses. Users cannot choose the same course multiple times. \n 8. Once done users should press 'Save'. \n 9. A pop up will appear that says 'Once saved, you cannot undo this action. Once users are satisfied with their selection of courses, users can press Proceed. \n 10. Continue with Item B. \n\nItem B \n1. If users are registered, click on 'Attendance' which can be found on either at the navbar on top or the bottom footer. Users can also click on 'Attendance' from their home dashboard. \n 2. At the Attendance page, users can see a list of Available Classes based on their registered courses which they can take attendance for. Users should refer the week column to attend the class for the week. \n 3. Once users want to take an attendance for a certain class, they should click on the class instance and click 'Attend' at the bottom.\n 4. After accepting the MetaMask pop-up, students will have successfuly attended the class.\n\n Item C \n Students must have sufficient MetaMask balance for the Sepolia Network in order to conduct activities such as attending classes.\n Students can find past classes by clicking on 'Expand Past Classes' on the attendance page."},
        { question: 'Student Aide', answer: 'Answer 1. Line 1\nAnswer 1. Line 2Answer 1. Line 1\nAnswer 1. Line 2Answer 1. Line 1\nAnswer 1. Line 2' },
        { question: 'Library', answer: 'Answer 2' },
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
                            className={questionStyles(index)}
                            onClick={() => handleBoxClick(index)}
                        >
                            {item.question}
                        </div>
                        {expandedBox === index && (
                            <div
                                className={expandedStyles}
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