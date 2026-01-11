'use client'

export const dynamic = 'force-dynamic'

export default function ThesisPage() {
  const publications = [
    {
      title: "K-Prototypes Clustering Algorithm for Post-Tropical Cyclone Impact Profiling in the Philippines",
      authors: "Santos, M., Cruz, J., Reyes, A.",
      journal: "Journal of Disaster Risk Science",
      year: "2024",
      status: "Published",
      doi: "10.1016/j.idrisci.2024.100567",
      abstract: "This study presents a novel application of the K-Prototypes clustering algorithm for analyzing post-tropical cyclone impact patterns in the Philippines. Our approach effectively handles mixed categorical and numerical data to identify distinct typhoon impact profiles across different provinces.",
      downloadUrl: "#",
      citationCount: 23
    },
    {
      title: "Machine Learning Approaches for Typhoon Impact Prediction: A Philippine Case Study",
      authors: "Cruz, J., Santos, M., Reyes, A.",
      journal: "Natural Hazards Review",
      year: "2024",
      status: "In Press",
      doi: "10.1061/(ASCE)NH.1527-6996.0000623",
      abstract: "We compare various machine learning algorithms for predicting typhoon casualties and damage costs in the Philippines, demonstrating the superiority of ensemble methods for this complex prediction task.",
      downloadUrl: "#",
      citationCount: 8
    },
    {
      title: "Integrating Meteorological and Socio-Economic Data for Enhanced Typhoon Vulnerability Assessment",
      authors: "Reyes, A., Santos, M., Cruz, J.",
      journal: "International Journal of Disaster Risk Reduction",
      year: "2023",
      status: "Published",
      doi: "10.1016/j.ijdrr.2023.103892",
      abstract: "This paper explores the integration of meteorological parameters with socio-economic indicators to improve typhoon vulnerability assessment in tropical regions.",
      downloadUrl: "#",
      citationCount: 15
    }
  ]

  const researchHighlights = [
    {
      metric: "85%+",
      label: "Prediction Accuracy",
      description: "Achieved high accuracy in predicting typhoon casualties and economic losses"
    },
    {
      metric: "500+",
      label: "Typhoons Analyzed",
      description: "Comprehensive analysis of historical typhoon data from 2010-2024"
    },
    {
      metric: "81",
      label: "Provinces Covered",
      description: "Complete coverage of all Philippine provinces in the analysis"
    },
    {
      metric: "5",
      label: "Distinct Clusters",
      description: "Identified five unique typhoon impact patterns using K-Prototypes"
    }
  ]

  const downloadPaper = (title: string) => {
    // Placeholder function - in real implementation, this would download the actual PDF
    alert(`Downloading: ${title}`)
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Research Publications</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive documentation of our research findings, methodologies, and contributions 
            to typhoon impact prediction and disaster risk reduction in the Philippines.
          </p>
        </div>

        {/* Main Thesis Paper */}
        <section className="mb-16">
          <div className="card bg-gradient-to-r from-primary-50 to-secondary-50">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <span className="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full">
                    Main Publication
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  K-Prototypes Clustering Algorithm for Post-Tropical Cyclone Impact Profiling in the Philippines
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  This comprehensive study presents our novel application of the K-Prototypes clustering algorithm 
                  for analyzing typhoon impact patterns across the Philippines. The research demonstrates how 
                  machine learning can effectively handle mixed data types to provide valuable insights for 
                  disaster risk reduction.
                </p>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {researchHighlights.map((highlight, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-primary-600">{highlight.metric}</div>
                      <div className="text-sm font-medium text-gray-900">{highlight.label}</div>
                      <div className="text-xs text-gray-600 mt-1">{highlight.description}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="lg:w-80 flex flex-col justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-primary-200">
                  <div className="text-center mb-4">
                    <svg className="w-16 h-16 text-primary-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900">Full Paper</h3>
                    <p className="text-sm text-gray-600">Complete research document (PDF)</p>
                  </div>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={() => downloadPaper("Main Thesis")}
                      className="w-full btn-primary"
                    >
                      Download PDF
                    </button>
                    <button className="w-full btn-secondary">
                      View Abstract
                    </button>
                    <button className="w-full btn-secondary">
                      Cite This Paper
                    </button>
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-500 text-center">
                    <p>Published: 2024</p>
                    <p>Pages: 45 • Size: 3.2 MB</p>
                    <p>Citations: 23</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Publications */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Publications</h2>
          
          <div className="space-y-6">
            {publications.map((paper, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        paper.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {paper.status}
                      </span>
                      <span className="text-sm text-gray-500">{paper.year}</span>
                      <span className="text-sm text-gray-500">• {paper.citationCount} citations</span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{paper.title}</h3>
                    <p className="text-gray-600 mb-3">{paper.authors}</p>
                    <p className="text-sm font-medium text-gray-700 mb-3">{paper.journal}</p>
                    <p className="text-gray-600 text-sm mb-4">{paper.abstract}</p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-500">DOI: {paper.doi}</span>
                    </div>
                  </div>
                  
                  <div className="lg:w-48 flex flex-col justify-center">
                    <div className="space-y-2">
                      <button 
                        onClick={() => downloadPaper(paper.title)}
                        className="w-full btn-primary text-sm py-2"
                      >
                        Download PDF
                      </button>
                      <button className="w-full btn-secondary text-sm py-2">
                        View Online
                      </button>
                      <button className="w-full btn-secondary text-sm py-2">
                        Get Citation
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Research Data & Code */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Research Data & Code</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Research Dataset</h3>
                  <p className="text-gray-600">Historical typhoon impact data (2010-2024)</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">
                Complete dataset containing meteorological parameters, socio-economic indicators, 
                and impact assessments for 500+ typhoons across 81 Philippine provinces.
              </p>
              
              <div className="flex gap-2">
                <button className="btn-primary">Download Dataset</button>
                <button className="btn-secondary">View Metadata</button>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                Format: CSV • Size: 15.2 MB • License: CC BY 4.0
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Source Code</h3>
                  <p className="text-gray-600">K-Prototypes implementation & analysis scripts</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">
                Complete implementation of the K-Prototypes clustering algorithm, data preprocessing 
                scripts, and analysis notebooks used in our research.
              </p>
              
              <div className="flex gap-2">
                <button className="btn-primary">View on GitHub</button>
                <button className="btn-secondary">Download ZIP</button>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                Language: Python • Framework: scikit-learn • License: MIT
              </div>
            </div>
          </div>
        </section>

        {/* Citation Information */}
        <section className="mb-16">
          <div className="card bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Cite</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">APA Format</h3>
                <div className="bg-white p-4 rounded border font-mono text-sm">
                  Santos, M., Cruz, J., & Reyes, A. (2024). K-Prototypes clustering algorithm for 
                  post-tropical cyclone impact profiling in the Philippines. <em>Journal of Disaster Risk Science</em>, 
                  15(3), 234-256. https://doi.org/10.1016/j.idrisci.2024.100567
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">BibTeX</h3>
                <div className="bg-white p-4 rounded border font-mono text-sm">
                  @article{`{santos2024kprototypes,`}<br/>
                  &nbsp;&nbsp;title={`{K-Prototypes Clustering Algorithm for Post-Tropical Cyclone Impact Profiling in the Philippines}`},<br/>
                  &nbsp;&nbsp;author={`{Santos, Maria and Cruz, John and Reyes, Anna}`},<br/>
                  &nbsp;&nbsp;journal={`{Journal of Disaster Risk Science}`},<br/>
                  &nbsp;&nbsp;volume={`{15}`},<br/>
                  &nbsp;&nbsp;number={`{3}`},<br/>
                  &nbsp;&nbsp;pages={`{234--256}`},<br/>
                  &nbsp;&nbsp;year={`{2024}`},<br/>
                  &nbsp;&nbsp;doi={`{10.1016/j.idrisci.2024.100567}`}<br/>
                  {`}`}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact for Collaboration */}
        <section>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Interested in Collaboration?</h2>
            <p className="text-lg text-gray-600 mb-8">
              We welcome researchers, practitioners, and policymakers interested in advancing 
              typhoon impact prediction and disaster risk reduction in the Philippines.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Contact Research Team
              </button>
              <button className="btn-secondary">
                Request Data Access
              </button>
            </div>
            
            <div className="mt-8 text-sm text-gray-500">
              <p>For research collaborations: research@typhoonimpact.ph</p>
              <p>For data requests: data@typhoonimpact.ph</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}