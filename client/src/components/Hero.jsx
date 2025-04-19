import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-teal-500 to-teal-700 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <div className="pt-10 sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                  <h1>
                    <span className="block text-white font-bold text-4xl tracking-tight sm:text-5xl xl:text-6xl">
                      Swap Skills, Grow Together
                    </span>
                  </h1>
                  <p className="mt-3 text-base text-teal-50 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                    Exchange your expertise for the skills you want to learn.
                    SkillSwap connects you with the perfect learning partners
                    through our smart matching system.
                  </p>
                  <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Link
                        to="/profile"
                        className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-teal-700 bg-white hover:bg-teal-50 transition-colors duration-200"
                      >
                        Create Profile
                      </Link>
                      <Link
                        to="/matches"
                        className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-800 bg-opacity-60 hover:bg-opacity-70 transition-colors duration-200"
                      >
                        Explore Skills <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://images.pexels.com/photos/7516363/pexels-photo-7516363.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="People collaborating"
        />
      </div>
    </div>
  );
};

export default Hero;
