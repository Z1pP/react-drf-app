import React from 'react';
import Carousel from 'react-gallery-carousel';
import 'react-gallery-carousel/dist/index.css';

const PhotoSlider = ({ photos }) => {
  
  const images = photos.map(photo => ({
    src: photo.photo
  }));

  return (
    <div className='carousel-container'>
    <Carousel
      style={{width: '80%'}}
      className='framed-carousel'
      images={images}
    />
  </div>
  );
};

export default PhotoSlider;

