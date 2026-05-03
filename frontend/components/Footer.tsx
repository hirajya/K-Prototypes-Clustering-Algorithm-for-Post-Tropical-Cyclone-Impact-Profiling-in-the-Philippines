const Footer = () => {
  const authors = [
    {
      name: "Cailing, Michaela Angela",
      linkedin: "https://www.linkedin.com/in/michaela-angela-e-cailing-a503332a2/",
      github: "https://github.com/ellaangela"
    },
    {
      name: "De Luna, Mark Rhey Anthony",
      linkedin: "https://www.linkedin.com/in/mark-rhey-anthony-de-luna-0893b6298/",
      github: "https://github.com/RheyMartt"
    },
    {
      name: "Estrada, Rodney Lei",
      linkedin: "https://www.linkedin.com/in/rodneyleiestrada/",
      github: "https://github.com/hirajya"
    },
    {
      name: "Racho, Charles Angelo",
      linkedin: "https://www.linkedin.com/in/rachocr/",
      github: "https://github.com/rachocr"
    },
    {
      name: "Tamayo, Danyssa",
      linkedin: "#",
      github: "https://github.com/tamayodb"
    }
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Project Information */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">About the Project</h3>
            <p className="text-gray-400 text-sm mb-4">
            Clustering for Post-Tropical Cyclone Impact Profiling in the Philippines
            </p>
            <p className="text-gray-400 text-sm mb-4">
              A research project utilizing machine learning for tropical cyclone impact profiling 
              and future damage prediction.
            </p>
          </div>
          
          {/* CCIT */}
          <div>
            <h3 className="text-lg font-semibold mb-4">CCIT</h3>
            <p className="text-gray-400 text-sm">
              College of Computing and Information Technologies
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

        {/* Authors Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <h3 className="text-lg font-semibold mb-6 text-center">Research Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {authors.map((author, index) => (
              <div key={index} className="text-center">
                <p className="text-gray-300 text-sm font-medium mb-2">{author.name}</p>
                <div className="flex justify-center gap-3">
                  <a
                    href={author.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                    aria-label={`${author.name}'s LinkedIn`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a
                    href={author.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                    aria-label={`${author.name}'s GitHub`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Clustering for Post-Tropical Cyclone Impact Profiling in the Philippines. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer