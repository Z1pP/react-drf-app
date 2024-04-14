import React from 'react';
import './Slider.css';
import Carousel from 'react-gallery-carousel';

const PhotoSlider = ({ photos }) => {
  
  const images = photos.map(photo => ({
    src: photo.photo
  }));

  return (
    <Carousel images={images} style={{ height: "100%", width: "100%"}} />  
  );
};

export default PhotoSlider;

