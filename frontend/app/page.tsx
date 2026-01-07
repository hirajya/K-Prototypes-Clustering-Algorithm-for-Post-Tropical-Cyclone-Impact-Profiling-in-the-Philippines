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

      {/* Problem & Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Problem & Solution</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Addressing the challenges of typhoon impact assessment in the Philippines
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Problem */}
            <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">The Problem</h3>
              <p className="text-gray-600">
                The Philippines experiences an average of 20 typhoons annually, causing significant 
                damage to lives and property. Traditional impact assessment methods are slow, 
                reactive, and lack the ability to categorize events by severity for resource allocation.
              </p>
            </div>
            
            {/* Solution */}
            <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Solution</h3>
              <p className="text-gray-600">
                Using KMeans clustering with the MAACLI framework, we classify typhoon impacts into 
                three severity levels (1, 2, 3). This enables rapid categorization, better resource 
                allocation, and improved disaster response planning.
              </p>
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
              Advanced machine learning for typhoon impact analysis
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
                Classify typhoon impact into Level 1, 2, or 3 based on comprehensive impact metrics 
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
              <h4 className="font-semibold text-gray-900 mb-2">High-Impact Typhoons</h4>
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
              <h4 className="font-semibold text-gray-900 mb-2">Moderate-Impact Typhoons</h4>
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
              <h4 className="font-semibold text-gray-900 mb-2">Low-Impact Typhoons</h4>
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