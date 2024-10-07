"use client";
import { SlideText } from "../SlideText";

const Hero = () => {
 
  return (
    <div className="max-w-[1600px] mx-0 my-auto px-0 py-0 w-[100%]">
      <div className="w-full flex justify-center items-center mt-10 md:mt-20 py-20">
        <div className="w-full max-w-[1170px] flex  flex-col item-start justify-start pt-20 px-2 md:px-0">
          <div className="text-4xl md:text-[55px] font-bold text-secondary-color text-center font-secondary tracking-wider">

            <div className="py-px md:py-7">Buy the Latest Devices from</div>
            <div className="text-primary-color">
              <span className="text-secondary-color">top Brands like&nbsp;</span>
              <SlideText />
            </div>
          </div>
          <div className="text-lg md:text-2xl font-medium  text-[#201515] leading-[25px] md:leading-[30px] font-primary text-center mt-10 md:mt-12 px-4 md:px-0">
            Discover the Latest Mobile Deals at Your Fingertips{" "}
            <br className="hidden md:block" /> Shop the Best Smartphones and Enjoy Seamless Shopping!
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
