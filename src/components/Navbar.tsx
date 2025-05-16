import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-black to-blue-500 w-full flex justify-center items-center p-2">
      <div className="font-bold">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `bg-gradient-to-t from-white to-black text-white text-center py-2 px-5 no-underline text-xl
             rounded-lg mx-2 inline-block hover:bg-gradient-to-t hover:from-white hover:to-blue-500
             hover:text-black hover:py-[18px] transition-all duration-300 ease-in-out
             ${isActive ? 'from-gray-200 to-blue-500 text-black font-bold' : ''}`
          }
        >
          Home
        </NavLink>
        <NavLink 
          to="/gallery"
          className={({ isActive }) => 
            `bg-gradient-to-t from-white to-black text-white text-center py-2 px-5 no-underline text-xl
             rounded-lg mx-2 inline-block hover:bg-gradient-to-t hover:from-white hover:to-blue-500
             hover:text-black hover:py-[18px] transition-all duration-300 ease-in-out
             ${isActive ? 'from-gray-200 to-blue-500 text-black font-bold' : ''}`
          }
        >
          Gallery
        </NavLink>
        <NavLink 
          to="/contact"
          className={({ isActive }) => 
            `bg-gradient-to-t from-white to-black text-white text-center py-2 px-5 no-underline text-xl
             rounded-lg mx-2 inline-block hover:bg-gradient-to-t hover:from-white hover:to-blue-500
             hover:text-black hover:py-[18px] transition-all duration-300 ease-in-out
             ${isActive ? 'from-gray-200 to-blue-500 text-black font-bold' : ''}`
          }
        >
          Contact Us
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;