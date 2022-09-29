import React from 'react';
import Dashboard from './features/dashboard/dashboard';
import Login from './features/login/login';

import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;