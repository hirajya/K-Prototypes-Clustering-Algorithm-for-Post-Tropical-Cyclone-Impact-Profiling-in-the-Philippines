import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Clustering for Post-Tropical Cyclone Impact Profiling in the Philippines
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              A demonstration system for post-tropical cyclone impact profiling and future damage prediction using 
              machine learning models
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/cluster" 
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-200"
              >
                Clustering Level
              </Link>
              <Link 
                href="/prediction" 
                className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-400 transition-all duration-200 border border-blue-400"
              >
                Future Prediction
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Project Overview Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Project Overview</h2>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                The Philippines is one of the most disaster-prone countries in the world due to its location along the western North Pacific tropical cyclones belt. Each year, multiple tropical cyclones cause widespread flooding, infrastructure damage, displacement, and loss of life. While government agencies generate detailed Situation Reports (SitReps) after every major event, these reports often contain mixed data types, missing values, and delayed updates—making it difficult to quickly identify which areas need urgent assistance.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                This project introduces a <strong className="text-gray-900">data-driven, explainable decision support system</strong> designed to improve disaster response and preparedness for tropical cyclones in the Philippines. By combining official disaster impact data with meteorological information, the system transforms complex post-tropical cyclones reports into clear, actionable insights that support faster and fairer humanitarian decision-making.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-8">
                The platform is built around two core modules:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {/* Impact Profiling Module */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Impact Profiling Module</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  This module analyzes post-disaster Situation Report data using optimized clustering techniques to group affected areas based on similar impact patterns. To ensure transparency and trust, the system applies explainable machine learning methods that convert complex model outputs into human-readable severity tiers and decision rules, helping responders understand why certain areas are prioritized for relief.
                </p>
              </div>

              {/* Future Damage Prediction Module */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Future Damage Prediction Module</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  This module uses weather variables such as wind speed, rainfall, and pressure to estimate potential future casualties and damages. By comparing interpretable baseline models with advanced non-linear methods, the system supports early forecasting and resource pre-positioning before severe impacts occur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Problem & Solution</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Understanding the challenges in disaster response and how we're solving them
            </p>
          </div>
          
          {/* The Problem - Simplified */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 md:p-10 border border-red-100 mb-8">
            <div className="flex items-start mb-6">
              <div className="w-14 h-14 bg-red-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">The Challenge</h3>
                <div className="space-y-4 text-gray-700">
                  <p className="leading-relaxed text-lg">
                    When tropical cycloness hit the Philippines, government agencies create detailed <strong>Situation Reports</strong> to document the damage. However, these reports are difficult to analyze quickly because they contain many different types of information—numbers, descriptions, and ratings—all mixed together.
                  </p>
                  
                  <div className="bg-white rounded-lg p-6 border border-red-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Delayed Response Times
                    </h4>
                    <p className="text-gray-600">
                      Relief organizations struggle to quickly identify which areas need help most urgently. Manual review of reports takes too long, and by the time decisions are made, critical hours or days may have passed.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-6 border border-red-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Confusing Automated Systems
                    </h4>
                    <p className="text-gray-600">
                      When computer systems are used to analyze disaster data, they often work like a "black box"—making recommendations without explaining why. This makes it hard for decision-makers to trust the results or understand which communities truly need help.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-6 border border-red-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                      </svg>
                      Inconsistent Analysis
                    </h4>
                    <p className="text-gray-600">
                      Different analysts might assess the same disaster data differently, leading to inconsistent prioritization. Areas with similar damage levels might receive vastly different levels of support simply due to how the data was interpreted.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* The Solution - Simplified */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 md:p-10 border border-green-100">
            <div className="flex items-start mb-6">
              <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Solution</h3>
                <div className="space-y-4 text-gray-700">
                  <p className="leading-relaxed text-lg">
                    We've built an <strong>intelligent system</strong> that automatically analyzes disaster reports and provides clear, understandable recommendations—helping responders make faster and fairer decisions about where to send help.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-6 border border-green-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Smart Analysis
                      </h4>
                      <p className="text-gray-600">
                        Our system uses <strong>intelligent optimization</strong> to automatically find patterns in disaster data—grouping similar situations together and ensuring consistent, reliable results every time.
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-green-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Clear Explanations
                      </h4>
                      <p className="text-gray-600">
                        Unlike traditional "black box" systems, ours explains <strong>why</strong> each area is prioritized—showing decision-makers the specific factors (like number of affected families or damaged homes) behind each recommendation.
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-green-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Quality Assurance
                      </h4>
                      <p className="text-gray-600">
                        We measure the quality of our analysis using multiple proven methods, ensuring that our severity classifications are accurate and trustworthy for humanitarian operations.
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-green-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                        Future Forecasting
                      </h4>
                      <p className="text-gray-600">
                        The system can <strong>predict potential damage</strong> before a tropical cyclones fully strikes by analyzing weather patterns—helping organizations prepare resources in advance and save more lives.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200 mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">What This System Accomplishes</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Identifies which disaster assessment method works best for Philippine tropical cyclones
                      </li>
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Groups affected areas into clear severity levels (High, Moderate, Low Impact)
                      </li>
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Forecasts casualties and damages to help emergency teams prepare before disasters strike
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">System Features</h2>
            <p className="text-lg text-gray-600">
              Advanced machine learning for tropical cyclones impact profiling
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Clustering Analysis */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Clustering Analysis</h3>
              <p className="text-gray-600 mb-4">
                Classify tropical cyclones impact into Level 1, 2, or 3 based on comprehensive impact metrics 
                including affected populations, casualties, and property damage.
              </p>
              <Link href="/cluster" className="text-blue-600 font-medium hover:text-blue-700">
                Try Clustering →
              </Link>
            </div>
            
            {/* Damage Prediction */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Damage Prediction</h3>
              <p className="text-gray-600 mb-4">
                Predict potential damage metrics based on weather features including wind speed, 
                rainfall, pressure, and storm duration.
              </p>
              <Link href="/prediction" className="text-cyan-600 font-medium hover:text-cyan-700">
                Try Prediction →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MAACLI Insights Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">MAACLI Framework Insights</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Model and Algorithm Agnostic Clustering Interpretability
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Level 1 */}
            <div className="bg-red-50 rounded-xl p-6 border-l-4 border-red-500">
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold text-red-600">Level 1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">High-Impact Tropical Cyclones</h4>
              <p className="text-gray-600 text-sm">
                Severe events with significant casualties, extensive property damage, 
                and large affected populations requiring immediate response.
              </p>
            </div>
            
            {/* Level 2 */}
            <div className="bg-yellow-50 rounded-xl p-6 border-l-4 border-yellow-500">
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold text-yellow-600">Level 2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Moderate-Impact Tropical Cyclones</h4>
              <p className="text-gray-600 text-sm">
                Moderate severity events with noticeable damage concentrated 
                in specific regions requiring coordinated response.
              </p>
            </div>
            
            {/* Level 3 */}
            <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold text-green-600">Level 3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Low-Impact Tropical Cyclones</h4>
              <p className="text-gray-600 text-sm">
                Lower severity events with minimal casualties and limited 
                property damage requiring standard response protocols.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}