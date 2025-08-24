import React from "react";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Naver.css";
import Homeback from "../Homeback/Homeback";
import Header from "../Header/Header";

export default function Naver(){

      const images = [
    "/naver1.png", 
    "/naver2.jpg",
    "/naver3.png",
    "/naver4.jpg",
    "/naver5.png",
    "/naver6.jpg",
    "/naver7.png",
    "/naver8.png",
    "/naver9.png",
    "/naver10.jpg",
    "/naver11.png",
    "/naver12.png"
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


  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      <Header />
      <Homeback />
      <div className="layout-container flex h-full grow flex-col items-center justify-center py-10">
        <h1 className="text-3xl font-bold mb-4 text-[#111418]">
          네이버 스마트스토어 상품 등록 가이드
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
      </div>
       <footer className="flex justify-center">
              <div className="flex max-w-[960px] flex-1 flex-col">
                <div className="flex flex-col gap-6 px-5 py-10 text-center @container">
                  <p className="text-[#8a7260] text-base font-normal leading-normal">© 2025 Orumi. All rights reserved.</p>
                </div>
              </div>
            </footer>
    </div>
  );

}