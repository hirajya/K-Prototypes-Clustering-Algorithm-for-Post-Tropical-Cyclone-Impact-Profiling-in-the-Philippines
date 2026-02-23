"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// Tropical cyclone data for carousel
const cyclones = [
  {
    name: "Typhoon Yolanda (Haiyan)",
    year: "2013",
    image: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800",
    description: "One of the strongest tropical cyclones ever recorded",
  },
  {
    name: "Typhoon Rolly (Goni)",
    year: "2020",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
    description: "Super typhoon with devastating winds and rainfall",
  },
  {
    name: "Typhoon Odette (Rai)",
    year: "2021",
    image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800",
    description: "Caused widespread destruction across Visayas and Mindanao",
  },
  {
    name: "Typhoon Ulysses (Vamco)",
    year: "2020",
    image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800",
    description: "Triggered severe flooding in Metro Manila and surrounding areas",
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev + 1) % cyclones.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev - 1 + cyclones.length) % cyclones.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const goToSlide = (index: number) => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Carousel Section */}
      <section className="relative w-full h-[600px] overflow-hidden">
        {cyclones.map((cyclone, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${cyclone.image})` }}
            >
              <div className="w-full h-full bg-gradient-to-t from-black/90 via-black/60 to-black/30 flex items-center justify-center">
                <div className="text-center px-8 max-w-4xl">
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-fade-in-up">
                    {cyclone.name}
                  </h1>
                  <p className="text-2xl md:text-3xl text-blue-200 mb-3 animate-fade-in-up animation-delay-200">
                    {cyclone.year}
                  </p>
                  <p className="text-xl md:text-2xl text-gray-200 animate-fade-in-up animation-delay-400">
                    {cyclone.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 group z-10"
          aria-label="Previous slide"
        >
          <svg
            className="w-7 h-7 text-white group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 group z-10"
          aria-label="Next slide"
        >
          <svg
            className="w-7 h-7 text-white group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Dots Navigation */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {cyclones.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white w-10"
                  : "bg-white/50 hover:bg-white/75 w-3"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Project Overview Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Clustering for Post-Tropical Cyclone Impact Profiling in the Philippines
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto">
              A smart system that helps understand typhoon damage and predict future impacts
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8 animate-fade-in-up animation-delay-200">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                The Philippines faces an average of 20 typhoons each year, causing devastating floods, 
                infrastructure damage, and loss of lives. After each disaster, government agencies release 
                reports with damage assessments—but these reports are often difficult to compare and analyze quickly.
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                This system <strong className="text-gray-900">automatically analyzes typhoon damage reports</strong> 
                and provides clear insights to help responders make faster, better decisions about where help is 
                needed most urgently.
              </p>

              <p className="text-gray-700 leading-relaxed mb-8">
                The system has two main features:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {/* Impact Profiling Module */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Damage Assessment
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Groups affected areas by severity level (Low, Moderate, High) based on casualties, 
                  property damage, and affected populations. This helps identify which communities need 
                  immediate attention.
                </p>
              </div>

              {/* Future Damage Prediction Module */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-100 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Future Impact Prediction
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Estimates potential damage based on weather forecasts like wind speed and rainfall. 
                  This allows emergency teams to prepare resources and evacuate communities before a 
                  typhoon strikes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why This Matters
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Faster response saves lives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Problem */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100 animate-fade-in-left">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-red-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  The Challenge
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                After a typhoon hits, government agencies release detailed damage reports. However, 
                these reports contain overwhelming amounts of information spread across many pages, 
                making it hard to quickly identify which areas are worst affected. Manual analysis is 
                time-consuming and can delay critical aid delivery.
              </p>
            </div>

            {/* The Solution */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100 animate-fade-in-right">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Our Solution
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                This system instantly processes damage reports and organizes affected areas into 
                clear severity categories, helping decision-makers prioritize response efforts and 
                allocate resources efficiently.
              </p>

              <div className="space-y-3">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200 mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                    What This System Does
                  </h4>
                  <ul className="space-y-2 text-gray-600 text-xs">
                    <li className="flex items-start">
                      <svg
                        className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Analyzes typhoon damage reports automatically
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Groups areas into High, Moderate, or Low impact severity
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Predicts potential damage from incoming typhoons
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Two powerful tools for disaster response
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Clustering Analysis */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Impact Assessment
              </h3>
              <p className="text-gray-600 mb-4">
                See which areas were hit hardest by categorizing damage into Low, Moderate, 
                and High severity levels based on casualties, infrastructure damage, and affected 
                populations.
              </p>
              <Link
                href="/cluster"
                className="text-blue-600 font-medium hover:text-blue-700 inline-flex items-center group"
              >
                Try Assessment Tool
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            {/* Damage Prediction */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up animation-delay-200">
              <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-cyan-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Damage Forecasting
              </h3>
              <p className="text-gray-600 mb-4">
                Estimate potential damage before a typhoon arrives using weather forecasts. 
                Prepare evacuation plans and position relief supplies in advance.
              </p>
              <Link
                href="/prediction"
                className="text-cyan-600 font-medium hover:text-cyan-700 inline-flex items-center group"
              >
                Try Prediction Tool
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Severity Levels Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Understanding Severity Levels
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Each typhoon impact is classified into one of three categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* High Impact */}
            <div className="bg-red-50 rounded-xl p-6 border-l-4 border-red-500 transform hover:scale-105 transition-all duration-300 animate-fade-in-up">
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold text-red-600">
                  High Impact
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Most Severe
              </h4>
              <p className="text-gray-600 text-sm">
                Areas with major casualties, widespread property destruction, and large displaced 
                populations. These communities need immediate emergency response and substantial 
                resources.
              </p>
            </div>

            {/* Moderate Impact */}
            <div className="bg-yellow-50 rounded-xl p-6 border-l-4 border-yellow-500 transform hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-200">
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold text-yellow-600">
                  Moderate Impact
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Moderate Severity
              </h4>
              <p className="text-gray-600 text-sm">
                Areas with noticeable damage affecting specific communities. These locations need 
                coordinated relief efforts and continued monitoring.
              </p>
            </div>

            {/* Low Impact */}
            <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500 transform hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-400">
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold text-green-600">
                  Low Impact
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Less Severe
              </h4>
              <p className="text-gray-600 text-sm">
                Areas with minimal casualties and limited property damage. Standard emergency 
                protocols are sufficient for these situations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-fade-in-left {
          animation: fade-in-left 0.8s ease-out forwards;
        }

        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
