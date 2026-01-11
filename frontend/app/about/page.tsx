import Image from 'next/image'

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Dr. Maria Santos",
      role: "Lead Researcher",
      affiliation: "University of the Philippines - Meteorology Department",
      expertise: "Tropical Cyclone Dynamics, Climate Modeling",
      image: "https://via.placeholder.com/150x150/3B82F6/ffffff?text=MS"
    },
    {
      name: "Dr. John Cruz",
      role: "Data Science Specialist",
      affiliation: "Ateneo de Manila University - Computer Science",
      expertise: "Machine Learning, Clustering Algorithms",
      image: "https://via.placeholder.com/150x150/10B981/ffffff?text=JC"
    },
    {
      name: "Prof. Anna Reyes",
      role: "Disaster Risk Reduction Expert",
      affiliation: "De La Salle University - Geography Department",
      expertise: "Disaster Management, Vulnerability Assessment",
      image: "https://via.placeholder.com/150x150/F59E0B/ffffff?text=AR"
    }
  ]

  const collaborations = [
    "Philippine Atmospheric, Geophysical and Astronomical Services Administration (PAGASA)",
    "National Disaster Risk Reduction and Management Council (NDRRMC)",
    "Department of Science and Technology (DOST)",
    "University of the Philippines National Institute of Physics",
    "Ateneo de Manila University School of Science and Engineering"
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Our Research</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advancing typhoon impact prediction through innovative machine learning approaches 
            tailored for the unique meteorological and geographical challenges of the Philippines.
          </p>
        </div>

        {/* Project Overview */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Project Overview</h2>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  The Philippines experiences an average of 20 tropical cyclones annually, making it one of 
                  the most typhoon-prone countries in the world. Our research develops a sophisticated 
                  K-Prototypes clustering algorithm specifically designed to analyze post-tropical cyclone 
                  impact patterns across different provinces.
                </p>
                <p>
                  By combining meteorological data with socio-economic indicators, our system provides 
                  comprehensive insights into typhoon vulnerability and impact prediction, enabling better 
                  disaster preparedness and response strategies.
                </p>
                <p>
                  This research represents a significant advancement in applying machine learning to 
                  disaster risk reduction, particularly in handling mixed categorical and numerical data 
                  that characterizes typhoon impacts.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Achievements</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">85%+ Prediction Accuracy</h4>
                    <p className="text-gray-600">Achieved high accuracy in predicting typhoon casualties and damage costs</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">500+ Typhoons Analyzed</h4>
                    <p className="text-gray-600">Comprehensive analysis of historical typhoon data from 2010-2024</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Novel Clustering Approach</h4>
                    <p className="text-gray-600">First application of K-Prototypes to Philippine typhoon impact profiling</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Research Team */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Research Team</h2>
            <p className="text-lg text-gray-600">
              Interdisciplinary experts in meteorology, computer science, and disaster risk reduction
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="card text-center">
                <Image 
                  src={member.image} 
                  alt={member.name}
                  width={128}
                  height={128}
                  className="rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-gray-600 mb-3">{member.affiliation}</p>
                <p className="text-sm text-gray-500">{member.expertise}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology */}
        <section className="mb-16">
          <div className="card">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Research Methodology</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Collection & Processing</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    Historical typhoon data from PAGASA (2010-2024)
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    Meteorological parameters (wind speed, rainfall, duration)
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    Socio-economic indicators (population, infrastructure)
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    Impact assessments (casualties, damage costs)
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">K-Prototypes Algorithm</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-secondary-500 mr-2">•</span>
                    Handles mixed categorical and numerical data
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary-500 mr-2">•</span>
                    Combines k-means and k-modes clustering
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary-500 mr-2">•</span>
                    Optimized for typhoon impact characteristics
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary-500 mr-2">•</span>
                    Validated using silhouette analysis
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Collaborations */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Institutional Collaborations</h2>
            <p className="text-lg text-gray-600">
              Partnership with leading meteorological and research institutions
            </p>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collaborations.map((org, index) => (
                <div key={index} className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-3 h-3 bg-primary-500 rounded-full mr-4 flex-shrink-0"></div>
                  <span className="text-gray-700 font-medium">{org}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact & Applications */}
        <section className="mb-16">
          <div className="card bg-gradient-to-r from-primary-50 to-secondary-50">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Impact & Applications</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Early Warning Systems</h3>
                <p className="text-gray-600">Improve typhoon impact forecasting for government agencies</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Preparedness</h3>
                <p className="text-gray-600">Enable local communities to better prepare for typhoon impacts</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Policy Development</h3>
                <p className="text-gray-600">Support evidence-based disaster risk reduction policies</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Get Involved</h2>
            <p className="text-lg text-gray-600 mb-8">
              Interested in collaboration or have questions about our research?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Contact Research Team
              </button>
              <button className="btn-secondary">
                View Publications
              </button>
            </div>
            
            <div className="mt-8 text-sm text-gray-500">
              <p>Email: research@typhoonimpact.ph</p>
              <p>Phone: +63 (2) 8920-5301</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}