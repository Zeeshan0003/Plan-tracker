import React from 'react';

interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="bg-gradient-to-t from-white to-blue-500 text-center text-black text-xl w-full px-4 py-10">
      <h1 className="text-4xl font-bold mb-12">{title}</h1>
      <h3 className="text-2xl">{subtitle}</h3>
    </header>
  );
};

export default Header;