//this index.js is for pages

import React from 'react'; 
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { TransactionProvider } from './context/TransactionContext';
import { StateContextProvider as AideStateProvider} from './context/AideContext';
import { StateContextProvider as AttendanceStateProvider } from './context/AttendanceContext';
import { StateContextProvider as LibraryStateProvider } from './context/LibraryContext.jsx';
import { setupAccountsChangedListener, removeAccountsChangedListener } from './utils/handle.js';
import { FaRobot } from "react-icons/fa6";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { FAQ, History, Attendance, StudentAide, Profile, CreateAide, AideDetails, AttendanceDetails, CreateAttendance, SignIn, SignUp, ForgotPassword, Library, Error, CreateBook, BookDetails } from './pages/index.js';
import Admin from './pages/adminPages/Admin.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "/home",
    element: <App />,
  },
  {
    path: "/faq",
    element: <FAQ />,
  },
  {
    path: "/history",
    element: <History />,
  },
  {
    path: "/attendance",
    element: <Attendance />,
  },
  {
    path: "/student-aide",
    element: <StudentAide />,
  },
  {
    path: "/profile",
    element: <Profile/>,
  },
  {
    path: "/create-aide",
    element: <CreateAide/>,
  },
  {
    path: "/student-aide/:id",
    element: <AideDetails/>,
  },
  {
    path: "/login",
    element: <SignIn/>,
  },
  {
    path: "/attendance/:id",
    element: <AttendanceDetails/>,
  },
  {
    path: "/create-attendance",
    element: <CreateAttendance/>,
  },
  {
    path: "/sign-up",
    element: <SignUp/>,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword/>,
  },
  {
    path: "/library",
    element: <Library/>,
  },
  {
    path:"/admin",
    element: <Admin/>
  },
  {
    path:"*",
    element: <Error/>
  },
  {
    path:"/create-book",
    element: <CreateBook/>
  },
  {
    path: "/library/:id",
    element: <BookDetails/>,
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
if (typeof window.ethereum === 'undefined') {
  root.render(
    <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-col justify-center items-center">
      <div className="bg-[#13131a]">
        <div className="flex w-full justify-center items-center">
          <div className="flex md:flex-row flex-col items-center justify-between md:p-20 py-12 px-4">
            <div className="flex flex-col flex-1 items-center justify-start w-full md:mt-0 mt-10">
              <div className="flex w-full justify-center items-center">
                <div className="flex flex-1 justify-start flex-col md:mr-10">
                  <h1 className="text-3xl sm:text-5xl py-1">
                    <span className="text-white text-gradient">No MetaMask Detected</span> <FaRobot className="inline-block text-[#a834eb]" />
                  </h1>
                  <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
                    Please install MetaMask to use this application.
                    <button
                      type="button"
                      onClick={() => window.open('https://metamask.io', '_blank')}
                      className="flex flex-row justify-center items-center my-5 bg-[#8934eb] p-3 px-5 rounded-full cursor-pointer hover:bg-[#a834eb]"
                    >
                      <p className="text-white text-base font-semibold"> Download Metamask </p>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} else {
  root.render(  
    <React.StrictMode>
      <LibraryStateProvider>
        <AttendanceStateProvider>
          <AideStateProvider>
            <TransactionProvider>
              <RouterProvider router={router} />
            </TransactionProvider>
          </AideStateProvider>
        </AttendanceStateProvider>
      </LibraryStateProvider>
    </React.StrictMode>
)};

setupAccountsChangedListener();

window.addEventListener('beforeunload', () => {
  removeAccountsChangedListener();
});

reportWebVitals();
