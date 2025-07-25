import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import  hr from '../../Img/Hr.jpg'  
import  hrs from '../../Img/dani.jpg' 
import  hrss from '../../Img/sinan.jpg' 
import  hrsss from '../../Img/danish.jpg' 
import  freak from '../../Img/freak.jpg' 
const PhotographerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const navigate = useNavigate();

  const slides = [
    {
      id: 1,
      image: hrs,
      title: "Person 1"
    },
    {
      id: 2,
      image: hrss,
      title: "Person 2"
    },
    {
      id: 3,
      image: hr,
      title: "Person 3"
    },
    {
      id: 4,
      image: hrsss,
      title: "Person 4"
    },
    {
      id: 5,
      image: freak, 
      title: "Person 5"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentSlide]);

  const getSlideStyle = (index) => {
    const totalSlides = slides.length;
    const centerIndex = Math.floor(totalSlides / 2);
    const offset = index - currentSlide;

    let position = offset;
    if (offset > centerIndex) {
      position = offset - totalSlides;
    } else if (offset < -centerIndex) {
      position = offset + totalSlides;
    }

    const baseStyle = {
      position: 'absolute',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      borderRadius: '50%',
      overflow: 'hidden',
      cursor: 'pointer',
    };

    if (position === 0) {
      return {
        ...baseStyle,
        width: '400px',
        height: '400px',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%) scale(1)',
        zIndex: 40,
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
      };
    }

    const slideWidth = 350;
    const slideHeight = 350;
    const horizontalOffset = position * 220;
    const scale = 0.8 - Math.abs(position) * 0.1;
    const opacity = 1 - Math.abs(position) * 0.2;
    const zIndex = 10 - Math.abs(position);

    return {
      ...baseStyle,
      width: `${slideWidth}px`,
      height: `${slideHeight}px`,
      left: '50%',
      top: '50%',
      transform: `translate(-50%, -50%) translateX(${horizontalOffset}px) scale(${scale})`,
      zIndex: zIndex,
      opacity: opacity,
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    };
  };

  return (
    <div className="w-full mx-auto p-8 bg-black">
      <div className="relative h-100 rounded-3xl overflow-hidden">
  
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              style={getSlideStyle(index)}
              onClick={() => goToSlide(index)}
              className="group"
            >
              <div className="relative w-full h-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                {index !== currentSlide && (
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300" />
                )}
                {index === currentSlide && (
                  <div className="absolute inset-0 ring-4 ring-white/20 rounded-full animate-pulse" />
                )}
              </div>
            </div>
          ))}
        </div>


        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="absolute top-6 right-6 text-white/60 hover:text-white text-sm transition-colors duration-200 z-[60]"
        >
          {isAutoPlaying ? 'Pause' : 'Play'}
        </button>
      </div>


      <div className="flex items-center justify-center mt-8 space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'w-8 h-3 bg-white'
                : 'w-3 h-3 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>


      <div className="text-center mt-6">
        <h3 className="text-2xl font-bold text-white mb-2">
          {slides[currentSlide].title}
        </h3>
      </div>

 <div className="text-center mt-4">
  <button
    id="view-all-photographers"
    onClick={() => {
      const token = localStorage.getItem('token'); 
      if (token) {
        navigate('/photografers');
      } else {
        navigate('/log');
      }
    }}
    className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full text-sm transition-all duration-300 backdrop-blur-md"
  >
    View All Photographers
  </button>
</div>

    </div>
  );
};

export default PhotographerCarousel;
