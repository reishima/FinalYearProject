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
        { question: 'Attendance', answer: "Item A\n1. In order to use the attendance system, users must first register for courses. If courses are registered refer item B.\n2. To register for courses users must first select their Department and Level of Study by editing their profile at the Profile page. \n3. Users can head to the profile page by clicking on 'Profile' either at the navbar on top or the bottom footer. Users can also click on 'Profile' from their home dashboard. \n4. Once at the profile page, users should click 'Edit' and select their Department and Level of Study. Once selected, users must press 'Save'. \n 5. Users must then click on 'Course Registration' button which can be found under the 'Edit' button of the profile page. \n 6. Users should refer the list of available courses then click on 'Select Courses' to select their desired courses of the semester. \n 7. Users are provided 8 fields and can select up to 8 courses. Users cannot choose the same course multiple times. \n 8. Once done users should press 'Save'. \n 9. A pop up will appear that says 'Once saved, you cannot undo this action. Once users are satisfied with their selection of courses, users can press Proceed. \n 10. Continue with Item B. \n\nItem B \n1. If users are registered, click on 'Attendance' which can be found on either at the navbar on top or the bottom footer. Users can also click on 'Attendance' from their home dashboard. \n 2. At the Attendance page, users can see a list of Available Classes based on their registered courses which they can take attendance for. Users should refer the week column to attend the class for the week. \n 3. Once users want to take an attendance for a certain class, they should click on the class instance and click 'Attend' at the bottom.\n 4. After accepting the MetaMask pop-up, students will have successfuly attended the class.\n\n Item C \n • Users must have sufficient MetaMask balance for the Sepolia Network in order to conduct activities such as attending classes.\n • Users can find past classes by clicking on 'Expand Past Classes' on the attendance page.\n • In the case that a double MetaMask notification appears for a single activity, users should only accept the notification once and reject the other."},
        { question: 'Student Aide', answer: "Item A\n1. In order to use the student aide system, users should head to the student aide page by clicking on 'Student Aide' either from the navbar on top or the bottom footer. Users can also click on 'Student Aide' from \ntheir home dashboard. \n 2. Once at the student aide page, users can click on a student aide that they are interested in. \n 3. Once they have decided on an aide to request, users can scroll down and click Request Aide. \n 4. A MetaMask popup will appear and users must click accept. \n 5. Users have successfully requested for aide and can expect a reply to their application via email.\n\nItem B \n • Users must have sufficient MetaMask balance for the Sepolia Network in order to conduct activities such as attending classes.\n • Users can find past information on past Aides by clicking on 'Expand Unavailable Aides' on the student aide page. \n • In the case that a double MetaMask notification appears for a single activity, users should only accept the notification once and reject the other." },
        { question: 'Library', answer: "Item A\n1. In order to use the library system, users should head to the library page by clicking on 'Library' either from the navbar on top or the bottom footer. Users can also click on 'Library' from \ntheir home dashboard. \n 2. Once at the library page, users can click on a book under Available Books that they are interested in. \n 3. Once they have decided to borrow a book, users can scroll down and click on Borrow. \n 4. A MetaMask popup will appear and users must click accept. User should then collect the book. \n 5. Users have successfully borrowed the book and the book will become unavailable to others until the user returns the book. \n 6. An admin will mark the book as returned once they have confirmed the receival of the book. The book will then be borrowable again.\n\nItem B \n • Users must have sufficient MetaMask balance for the Sepolia Network in order to conduct activities such as attending classes.\n • Books are not available when they are being borrowed or are being made unavailable by admins, to check unavailable books, users can click on 'Expand Unavailable Books' at the library page \n • In the case that a double MetaMask notification appears for a single activity, users should only accept the notification once and reject the other." },
        { question: 'History', answer: "Item A\n1. In order to view past activity, users should head to the history page by clicking on 'History' either from the navbar on top or the bottom footer. Users can also click on 'History' from \ntheir home dashboard. \n 2. Once at the history page, users will be able to view their past activity on the current chain. The item at the top is the latest activity on the chain. \n 3. Users can click on next to view older activity as only 8 activities will be displayed per page. \n4. Users can click on the activity hash to view more details about the activity on Etherscan. \n\nItem B \n • The activities being displayed are not limited to the system and will also display activity on other systems as long as they are made on the Sepolia network." },
        { question: 'Profile and Registration', answer: "Item A: Editing Profile \n 1.In order to edit their profiles, users must click on 'Profile' which can be found on either at the navbar on top or the bottom footer. Users can also click on 'Profile' from their home dashboard.\n 2. Once at the profile, users can click on 'Edit' \n 3. Users are given fields to input their personal information. \n 4. In order to upload a profile picture, users must click on 'Choose File'. \n 5. Then users must select a proper image file and press 'Upload'. \n 6. In order to key in the users' phone number, users must key in a valid 10 digit phone number in the format of: 0123456789.\n 7. Once users have updated their information users must click on 'Save'.\n\nItem B: Course Registration\n1. To register for courses users must first select their Department and Level of Study by editing their profile at the Profile page. \n3. Users can head to the profile page by clicking on 'Profile' either at the navbar on top or the bottom footer. Users can also click on 'Profile' from their home dashboard. \n4. Once at the profile page, users should click 'Edit' and select their Department and Level of Study. Once selected, users must press 'Save'. \n 5. Users must then click on 'Course Registration' button which can be found under the 'Edit' button of the profile page. \n 6. Users should refer the list of available courses then click on 'Select Courses' to select their desired courses of the semester. \n 7. Users are provided 8 fields and can select up to 8 courses. Users cannot choose the same course multiple times. \n 8. Once done users should press 'Save'. \n 9. A pop up will appear that says 'Once saved, you cannot undo this action. Once users are satisfied with their selection of courses, users can press Proceed.\n\n Item C \n • Users must have sufficient MetaMask balance for the Sepolia Network in order to conduct activities such as attending classes.\n • Users can find past classes by clicking on 'Expand Past Classes' on the attendance page.\n • In the case that a double MetaMask notification appears for a single activity, users should only accept the notification once and reject the other." },
        { question: 'Other questions', answer: "I don't have enough wallet balance to use the system. What should I do? \n • Users can head to a designated wallet faucet such as https://sepoliafaucet.com/ \n • From there, users can input their Blockchain ID / MetaMask Wallet ID and get ETH sent to their accounts.\n\n I don't see anything on the system eventhough I have connected MetaMask wallet correctly. What should I do?\n• Users need to make sure that they are on the same chain as the system.\n • Right now, the system uses the Sepolia test network chain. \n • Users can switch to this chain by clicking on their MetaMask extension and then clicking on the list of networks at the top-left drop down. \n • Users must toggle the 'Show test networks' and then select 'Sepolia'. \n\n For other questions, please email us at u2005343@siswa.um.edu.my" },
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