import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Layout from './components/Layout/Layout';
import './index.css';
import RegisterGuest from './components/Aut/RegisterGuest';
import LogIn from './components/Aut/LogIn';

function App() {
  return (
    <Router>
       <Layout> 
        <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/register" element={<RegisterGuest />} />
         <Route path="/login" element={<LogIn />} />
        </Routes>
       </Layout>
    </Router>
  );
}

export default App;