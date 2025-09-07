import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Layout from './components/Layout/Layout';
import './index.css';
import RegisterGuest from './components/Aut/RegisterGuest';
import LogIn from './components/Aut/LogIn';
import SingelResult from './components/singelResult/SingelResult';
import MyBookingPage from './components/MyBookingPage/MyBookingPage';
import MyVenuePage from './components/MyBookingPage/MyVenuePage';
import { AuthProvider } from './components/Aut/AuthContext';

function App() {
  return (
    <AuthProvider>
    <Router>
       <Layout> 
        <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/register" element={<RegisterGuest />} />
         <Route path="/login" element={<LogIn />} />
         <Route path="/venue/:id" element={<SingelResult />} />
         <Route path="/my-bookings" element={<MyBookingPage />} />
          <Route path="/my-venue" element={<MyVenuePage />} />
         <Route path="/register" element={<RegisterGuest />} />
        </Routes>
       </Layout>
    </Router>
    </AuthProvider>
  );
}

export default App;