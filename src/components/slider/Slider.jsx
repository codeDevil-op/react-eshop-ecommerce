import React, { useEffect, useState } from "react";
import "./slider.scss";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { sliderData } from "./slider-data";
const Slider = () => {
  const [currentSlide, setcurrentSlide] = useState(0);
  const [direction,setDirection] = useState('')
  const slideLength = sliderData.length
  
  const autoScroll = true;
  let slideInterval;
  let intervalTime = 5000;

  const nextBg = ()=>{
    setDirection('')
    setcurrentSlide(currentSlide===slideLength-1?0:currentSlide+1)
  }
  const prevBg = ()=>{
    setDirection('prev')
    setcurrentSlide(currentSlide===0?slideLength-1:currentSlide-1)
  }
  useEffect(() => {
    setcurrentSlide(0)
  }, [])

  function auto(){
    slideInterval = setInterval(nextBg,intervalTime)
  }
  
  useEffect(() => {
    if(autoScroll){
      auto()
    }
     return ()=>clearInterval(slideInterval)
  }, [currentSlide,slideInterval,autoScroll,auto])
  
  
  return (
    <>
      <div className="slider">
        <AiOutlineArrowLeft onClick={prevBg} className="arrow previ" />
        <AiOutlineArrowRight onClick={nextBg} className="arrow nexti" />
        {sliderData.map((slide, index) => {
          const { image, heading, desc } = slide;
          return (
            <div
              key={index}
              className={`${index === currentSlide ? "slide current" : `${direction==='prev'?'prev':'slide'}`}
              ${direction==='prev' && index === currentSlide ? 'prev current':''}
              `}
            >
              {index === currentSlide && (
                <>
                  <img src={image} alt="slide" />
                  <div className="content">
                    <h2>{heading}</h2>
                    <p>{desc}</p>
                    <hr />
                    <a href="#products" className="--btn --btn-primary">
                      Shop Now
                    </a>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Slider;
