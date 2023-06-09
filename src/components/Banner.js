import React from 'react';
import img_banner_1 from '../images/img_banner_1.jpg';
import img_banner_2 from '../images/img_banner_2.jpg';
import img_banner_3 from '../images/img_banner_3.jpg';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Banner.css';

function Banner() {
  return (
    <div className="banner-container">
      <Carousel className="banner-carousel">
        <Carousel.Item>
          <img className="d-block w-100" src={img_banner_1} alt="First slide" />
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={img_banner_2} alt="Second slide" />
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={img_banner_3} alt="Third slide" />
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default Banner;
  