import React , {useState} from 'react';
import Pano from '../components/Pano';
import '../css/Repository.css';
import FileUpload from '../components/FileUpload';

const Repository = () => {
  const [imageUrl, setImageUrl] = useState('');
  // const handleImageUrlUpdate = (newImageUrl) => {
  //   setImageUrl(newImageUrl);
  // };
  return (
    <div className="pano-container">
      <h2>Repository</h2>
      <FileUpload setImageUrl={setImageUrl} />
      <div className="pano-box">
        {/* <FileUpload setImageUrl={handleImageUrlUpdate} />        */}
        {/* <Pano imageUrl={imageUrl} /> */}
        {imageUrl && <Pano imageUrl={imageUrl} />}
      </div>
      
    </div>
  );
};

export default Repository;
