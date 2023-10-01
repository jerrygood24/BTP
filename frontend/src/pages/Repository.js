import React from 'react';
import Pano from '../components/Pano';
import '../css/Repository.css';

const Repository = () => {
  return (
    <div className="pano-container">
      <h2>Repository</h2>
      <div className="pano-box">
        <Pano />
      </div>
    </div>
  );
};

export default Repository;
