import React, { ReactNode } from 'react';

interface SectionProps {
  title: string;
  children: ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <section className="p-6 mx-4 my-6 border border-gray-300 rounded-lg bg-gray-50 shadow-md hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">{title}</h2>
      <div className="text-gray-700">{children}</div>
    </section>
  );
};

export default Section;