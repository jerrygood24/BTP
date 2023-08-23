import React from 'react';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import LoginPage from './pages/Login';
import SignUp from './pages/Signup';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element = {<Home />} />
        <Route path="/about" element = {<About />} />
        <Route path="/contact" element = {<Contact />} />
        <Route path="/login" element = {<LoginPage />} />
        <Route path="/signup" element = {<SignUp />} />
      </Routes>
    </Router>
  );
};

export default App;