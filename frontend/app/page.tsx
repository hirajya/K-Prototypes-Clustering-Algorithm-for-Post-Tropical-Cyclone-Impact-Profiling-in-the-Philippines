import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Clustering for Post-Tropical Cyclone Impact Profiling in the
              Philippines
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              A demonstration system for post-tropical cyclone impact profiling
              and future damage prediction using machine learning models
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/cluster"
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-200"
              >
                Impact Profiling
              </Link>
              <Link
                href="/prediction"
                className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-400 transition-all duration-200 border border-blue-400"
              >
                Future Prediction
              </Link>
              <a
                href="https://github.com/hirajya/Clustering-for-Post-Tropical-Cyclone-Impact-Profiling-in-the-Philippines"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Project Overview Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Project Overview
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                The Philippines is one of the most disaster-prone countries in
                the world due to its location along the western North Pacific
                tropical cyclones belt. Each year, multiple tropical cyclones
                cause widespread flooding, infrastructure damage, displacement,
                and loss of life. While government agencies generate detailed
                Situation Reports (SitReps) after every major event, these
                reports often contain mixed data types, missing values, and
                delayed updates—making it difficult to quickly identify which
                areas need urgent assistance.
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                This project introduces a{" "}
                <strong className="text-gray-900">
                  data-driven, impact profiling framework
                </strong>{" "}
                designed to improve assessment, disaster response, and preparedness for
                tropical cyclones in the Philippines. By combining official
                disaster impact data with meteorological information, the system
                transforms complex post-tropical cyclones reports into clear,
                actionable insights that support faster and fairer humanitarian
                decision-making.
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
                    Impact Profiling Module
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  This module analyzes post-disaster NDRRMC Situation Report and
                  PAGASA weather data using optimized clustering techniques to
                  group affected areas based on similar impact patterns. To
                  ensure transparency and trust, the system applies explainable
                  machine learning methods that convert complex model outputs
                  into human-readable severity tiers, helping
                  stakeholders for post-tropical cyclone assessment.
                </p>
              </div>

              {/* Future Damage Prediction Module */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-100">
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
                    Future Damage Prediction Module
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  This module uses weather variables such as wind speed,
                  rainfall, and pressure to estimate potential future casualties
                  and damages. Trained using PAGASA weather data and output of
                  Situation Reports from NDRMMC. By comparing interpretable
                  baseline models with advanced non-linear methods, the system
                  supports early forecasting and resource pre-positioning before
                  severe impacts occur.
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Problem & Solution
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Making disaster response faster and more effective
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Problem */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100">
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
                When tropical cyclones strike the Philippines, government
                agencies release Situation Reports that summarize casualties,
                damages, and relief operations. These reports contain large
                amounts of mixed information, making them difficult to analyze
                efficiently. As a result, organizations face challenges in
                quickly comparing affected areas and prioritizing recovery
                efforts. Manual analysis takes time and may lead to inconsistent
                assessments across regions.{" "}
              </p>
            </div>

            {/* The Solution */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
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
                We developed a system that automatically analyzes post-disaster
                reports and provides clear, consistent severity assessments to
                support disaster recovery and planning.
              </p>

              <div className="space-y-3">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200 mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                    What This System Accomplishes
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
                      Offers a data-driven framework for tropical cyclones
                      severity impact profiling using machine learning
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
                      Classifies and predicts impact severity clusters (High,
                      Moderate, Low)
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
                      Uses historical cyclone data to estimate potential impacts
                      of future events, supporting preparedness and planning
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
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              System Features
            </h2>
            <p className="text-lg text-gray-600">
              Advanced machine learning for tropical cyclones impact profiling
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Clustering Analysis */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Clustering Analysis
              </h3>
              <p className="text-gray-600 mb-4">
                Classify tropical cyclones impact into Cluster 1, 2, or 3 based on
                comprehensive impact metrics including affected populations,
                casualties, and property damage.
              </p>
              <Link
                href="/cluster"
                className="text-blue-600 font-medium hover:text-blue-700"
              >
                Try Clustering →
              </Link>
            </div>

            {/* Damage Prediction */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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
                Damage Prediction
              </h3>
              <p className="text-gray-600 mb-4">
                Predict potential damage metrics based on weather features
                including wind speed, rainfall, pressure, and storm duration.
              </p>
              <Link
                href="/prediction"
                className="text-cyan-600 font-medium hover:text-cyan-700"
              >
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              MAACLI Framework Insights
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Model and Algorithm Agnostic Clustering Interpretability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Level 3 */}
            <div className="bg-red-50 rounded-xl p-6 border-l-4 border-red-500">
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold text-red-600">Cluster 3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                High-Impact Tropical Cyclones
              </h4>
              <p className="text-gray-600 text-sm">
                Severe events with significant casualties, extensive property
                damage, and large affected populations requiring immediate
                response.
              </p>
            </div>

            {/* Level 2 */}
            <div className="bg-yellow-50 rounded-xl p-6 border-l-4 border-yellow-500">
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold text-yellow-600">
                  Cluster 2
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Moderate-Impact Tropical Cyclones
              </h4>
              <p className="text-gray-600 text-sm">
                Moderate severity events with noticeable damage concentrated in
                specific regions requiring coordinated response.
              </p>
            </div>

            {/* Level 1 */}
            <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold text-green-600">
                  Cluster 1
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Low-Impact Tropical Cyclones
              </h4>
              <p className="text-gray-600 text-sm">
                Lower severity events with minimal casualties and limited
                property damage requiring standard response protocols.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
