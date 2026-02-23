"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

// Tropical cyclone images for carousel
const cycloneImages = [
  "/typhoon-vs-hurricane.jpg",
  "/UNIPH2019034.JPG.webp",
  "/Science_typhoon_1229395040.webp",
  "tino-satellite-november-5-2025-4pm.webp",
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Refs for intersection observer
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev + 1) % cycloneImages.length);
      setTimeout(() => setIsAnimating(false), 700);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in-visible");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const goToSlide = (index: number) => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 700);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Carousel Section - Images Only */}
      <section className="relative w-full h-[400px] overflow-hidden">
        {cycloneImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            <img
              src={image}
              alt={`Typhoon image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Dots Navigation */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {cycloneImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75 w-2.5"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Project Overview Section */}
      <section
        ref={(el) => {
          sectionRefs.current[0] = el;
        }}
        className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 fade-in-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Clustering for Post-Tropical Cyclone Impact Profiling in the
              Philippines
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto">
              A smart system that helps understand tropical cyclone damage and
              predict future impacts
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8 animate-fade-in-up animation-delay-200">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                The Philippines faces an average of 20 tropical cyclones each
                year, causing devastating floods, infrastructure damage, and
                loss of lives. After each disaster, government agencies release
                reports with damage assessments—but these reports are often
                difficult to compare and analyze quickly.
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                This system{" "}
                <strong className="text-gray-900">
                  automatically analyzes tropical cyclone damage reports
                </strong>
                , provides clear insights to help responders make faster,
                better decisions about where help is needed most urgently.
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
                  Groups affected areas by severity level (Low, Moderate, High)
                  based on casualties, property damage, and affected
                  populations. This helps identify which communities need
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
                  Estimates potential damage based on weather forecasts like
                  wind speed and rainfall. This allows emergency teams to
                  prepare resources and evacuate communities before a tropical
                  cyclone strikes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section
        ref={(el) => {
          sectionRefs.current[1] = el;
        }}
        className="py-20 bg-white fade-in-section"
      >
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
                After a tropical cyclone hits, government agencies release
                detailed damage reports. However, these reports contain
                overwhelming amounts of information spread across many pages,
                making it hard to quickly identify which areas are worst
                affected. Manual analysis is time-consuming and can delay
                critical aid delivery.
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
                This system instantly processes damage reports and organizes
                affected areas into clear severity categories, helping
                decision-makers prioritize response efforts and allocate
                resources efficiently.
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
                      Analyzes tropical cyclone damage reports automatically
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
                      Predicts potential damage from incoming tropical cyclone
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={(el) => {
          sectionRefs.current[2] = el;
        }}
        className="py-20 bg-gray-50 fade-in-section"
      >
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
                See which areas were hit hardest by categorizing damage into
                Low, Moderate, and High severity levels based on casualties,
                infrastructure damage, and affected populations.
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
                Estimate potential damage before a tropical cyclone arrives
                using weather forecasts. Prepare evacuation plans and position
                relief supplies in advance.
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
      <section
        ref={(el) => {
          sectionRefs.current[3] = el;
        }}
        className="py-20 bg-white fade-in-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Understanding Severity Levels
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Each tropical cyclones impact is classified into one of three
              categories
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
              <h4 className="font-semibold text-gray-900 mb-2">Most Severe</h4>
              <p className="text-gray-600 text-sm">
                Areas with major casualties, widespread property destruction,
                and large displaced populations. These communities need
                immediate emergency response and substantial resources.
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
                Areas with noticeable damage affecting specific communities.
                These locations need coordinated relief efforts and continued
                monitoring.
              </p>
            </div>

            {/* Low Impact */}
            <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500 transform hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-400">
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold text-green-600">
                  Low Impact
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Less Severe</h4>
              <p className="text-gray-600 text-sm">
                Areas with minimal casualties and limited property damage.
                Standard emergency protocols are sufficient for these
                situations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section
        ref={(el) => {
          sectionRefs.current[4] = el;
        }}
        className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 fade-in-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Image Side */}
              <div className="relative h-64 md:h-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 to-transparent z-10"></div>
                <img
                  src="UN0711350.webp"
                  alt="Typhoon impact"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content Side */}
              <div className="p-8 md:p-12">
                <div className="flex items-start mb-6">
                  <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
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
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Important Disclaimer
                    </h2>
                    <p className="text-sm text-amber-600 font-semibold">
                      Please read before using this system
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-gray-700">
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <svg
                        className="w-5 h-5 text-amber-600 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Regional and Geographic Variations
                    </h3>
                    <p className="text-sm leading-relaxed">
                      <strong>
                        Area and region significantly affect tropical cyclone
                        impact.
                      </strong>{" "}
                      Coastal areas, mountainous regions, and urban centers
                      experience different damage patterns. The scope of
                      location—natural structures, population density, and infrastructure—plays a critical role in determining the severity of impacts. Always
                      consider local geographic factors when interpreting results.
                    </p>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <svg
                        className="w-5 h-5 text-blue-600 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Data Coverage Period
                    </h3>
                    <p className="text-sm leading-relaxed">
                      This system is trained on tropical cyclone data from{" "}
                      <strong>2020 to 2024 (inclusive)</strong>, covering
                      post-tropical cyclone impacts across the Philippines
                      during this period. Predictions are most reliable for
                      scenarios similar to those observed within this timeframe.
                    </p>
                  </div>

                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <svg
                        className="w-5 h-5 text-red-600 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Usage Guidelines
                    </h3>
                    <p className="text-sm leading-relaxed">
                      This tool is designed to{" "}
                      <strong>support decision-making, not replace it.</strong>{" "}
                      Always consider local knowledge, real-time conditions, and
                      official government advisories when planning disaster
                      response and resource allocation.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        2020-2024
                      </div>
                      <div className="text-xs text-gray-600">Data Coverage</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-600">
                        Philippines
                      </div>
                      <div className="text-xs text-gray-600">
                        Geographic Scope
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Context Images */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative rounded-xl overflow-hidden shadow-md group">
              <img
                src="/UNIPH2019034.JPG.webp"
                alt="Typhoon damage documentation"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <p className="text-white text-sm font-medium">
                  Documentation of tropical cyclone impacts
                </p>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-md group">
              <img
                src="/typhoon-vs-hurricane.jpg"
                alt="Tropical cyclone patterns"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <p className="text-white text-sm font-medium">
                  Understanding tropical cyclones
                </p>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-md group">
              <img
                src="/Science_typhoon_1229395040.webp"
                alt="Typhoon science and monitoring"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <p className="text-white text-sm font-medium">
                  Science-based monitoring
                </p>
              </div>
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

        /* Fade-in section styles */
        .fade-in-section {
          opacity: 0;
          transform: translateY(50px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .fade-in-section.fade-in-visible {
          opacity: 1;
          transform: translateY(0);
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
