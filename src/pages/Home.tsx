import React from 'react';
import Header from '../components/Header';
import Section from '../components/Section';
import TeamTable from '../components/TeamTable';

const Home: React.FC = () => {
  // Team members data
  const teamMembers = [
    { name: 'Bilal Saleem', role: 'CEO', email: 'Bali@example.com' },
    { name: 'Bali', role: 'CTO', email: 'Bilal@example.com' },
    { name: 'Bilal Saleem', role: 'CEO', email: 'Bali@example.com' },
    { name: 'Bali', role: 'CTO', email: 'Bilal@example.com' },
    { name: 'Bali', role: 'CTO', email: 'Bilal@example.com' },
    { name: 'Bilal Saleem', role: 'CEO', email: 'Bali@example.com' },
    { name: 'Bali', role: 'CTO', email: 'Bilal@example.com' },
  ];

  return (
    <div>
      <Header 
        title="Welcome to Our Website" 
        subtitle="Explore Our Services and Resources" 
      />
      
      <div className="container mx-auto px-4 py-6">
        <Section title="About Us">
          <p className="leading-relaxed">
            Our website is dedicated to providing high-quality content and services to our users. 
            We strive to meet your needs and exceed your expectations.
            We believe in transparency, innovation, and commitment to our customers. 
            Explore our website to learn more about what we offer.
            Thank you for visiting our website. We appreciate your support and look forward to serving you better.
          </p>
        </Section>

        <Section title="Top Features">
          <ol className="list-decimal pl-5 space-y-2">
            <li className="p-1 hover:bg-blue-50 rounded transition-colors">Comprehensive Resources</li>
            <li className="p-1 hover:bg-blue-50 rounded transition-colors">User-Friendly Design</li>
            <li className="p-1 hover:bg-blue-50 rounded transition-colors">Reliable Support</li>
          </ol>
        </Section>

        <Section title="Our Services">
          <ul className="list-disc pl-5 space-y-2">
            <li className="p-1 hover:bg-blue-50 rounded transition-colors">Web Design</li>
            <li className="p-1 hover:bg-blue-50 rounded transition-colors">Consulting</li>
            <li className="p-1 hover:bg-blue-50 rounded transition-colors">Product Development</li>
            <li className="p-1 hover:bg-blue-50 rounded transition-colors">Customer Support</li>
          </ul>
        </Section>

        <Section title="Team Members">
          <TeamTable members={teamMembers} />
        </Section>
      </div>
    </div>
  );
};

export default Home;