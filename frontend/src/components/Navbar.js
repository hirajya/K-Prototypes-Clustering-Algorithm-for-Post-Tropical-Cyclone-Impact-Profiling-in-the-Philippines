import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.svg';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
      <div className="h-10">
        <img src={logo} alt="Logo" className="h-full" />
      </div>
      <div className="flex gap-8">
        <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</Link>
        <Link to="/thesis" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Thesis Paper</Link>
        <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About Us</Link>
      </div>
    </nav>
  );
};

export default Navbar;