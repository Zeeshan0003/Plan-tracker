import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-white via-blue-500 to-black text-black text-center p-4 w-full mt-8">
      <p className="transition-colors duration-300 hover:text-white">
        &copy; {new Date().getFullYear()} Your Website. All rights reserved. | {' '}
        <Link to="/privacy" className="text-black hover:text-white hover:underline">
          Privacy Policy
        </Link>
      </p>
    </footer>
  );
};

export default Footer;