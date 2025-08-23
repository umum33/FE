import React from "react";
import "./Coupang.css";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Homeback from "../Homeback/Homeback";
import Header from "../Header/Header";

export default function Couapng(){

      const images = [
    "/qu1.png", 
    "/qu2.jpg",
    "/qu3.png",
    "/qu4.png",
    "/qu5.jpg",
    "/qu6.png",
    "/qu7.png",
    "/qu8.png",
    "/qu9.png",
    "/qu10.png",
    "/qu11.png",
    "/qu12.png"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

//   const handleDotClick = (index) => {
//     setCurrentImageIndex(index);
//   };

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      <Header />
      <Homeback />
      <div className="layout-container flex h-full grow flex-col items-center justify-center py-10">
        <h1 className="text-3xl font-bold mb-4 text-[#111418]">
          쿠팡 상품 등록 가이드
        </h1>
        <p className="text-md text-[#60758a] mb-8">
          슬라이드를 넘기며 순서대로 따라해보세요.
        </p>

        <div className="relative w-full max-w-4xl overflow-hidden rounded-lg shadow-lg">
          <div className="slider-container" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Step ${index + 1}`}
                className="slider-image"
              />
            ))}
          </div>
          <button
            onClick={handlePrev}
            className="slider-button left-button"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={handleNext}
            className="slider-button right-button"
          >
            <ChevronRight />
          </button>
        </div>

        {/* 👇 슬라이드 점(dots) 내비게이션 추가 */}
        {/* <div className="slider-dots-container">
          {images.map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            ></button>
          ))}
        </div> */}
      </div>
    </div>
  );

}
