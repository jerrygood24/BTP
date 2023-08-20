import React from 'react';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element = {<Home />} />
        <Route path="/about" element = {<About />} />
        <Route path="/contact" element = {<Contact />} />
      </Routes>
    </Router>
  );
};

export default App;