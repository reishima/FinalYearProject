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
);

setupAccountsChangedListener();

window.addEventListener('beforeunload', () => {
  removeAccountsChangedListener();
});

reportWebVitals();
