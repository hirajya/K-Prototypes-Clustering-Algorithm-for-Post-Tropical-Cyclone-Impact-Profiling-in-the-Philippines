const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Author Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Author Information</h3>
            <p className="text-gray-400 text-sm">
              K-Prototypes Clustering Algorithm for Post-Tropical Cyclone 
              Impact Profiling in the Philippines
            </p>
            <p className="text-gray-400 text-sm mt-2">
              A research project utilizing machine learning for typhoon impact analysis.
            </p>
          </div>
          
          {/* CCIT */}
          <div>
            <h3 className="text-lg font-semibold mb-4">CCIT</h3>
            <p className="text-gray-400 text-sm">
              College of Computing and Information Technologies
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Department of Computer Science
            </p>
          </div>
          
          {/* National University */}
          <div>
            <h3 className="text-lg font-semibold mb-4">National University</h3>
            <p className="text-gray-400 text-sm">
              National University Philippines
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Committed to excellence in education and research.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Typhoon Impact Clustering & Prediction System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer