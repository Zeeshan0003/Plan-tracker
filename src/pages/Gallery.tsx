import React from 'react';
import Header from '../components/Header';
import Section from '../components/Section';

const Gallery: React.FC = () => {
  // Sample gallery images
  const images = [
    { src: 'https://images.pexels.com/photos/270373/pexels-photo-270373.jpeg', alt: 'Coding' },
    { src: 'https://images.pexels.com/photos/735911/pexels-photo-735911.jpeg', alt: 'Workspace' },
    { src: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg', alt: 'Meeting' },
    { src: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg', alt: 'Technology' },
    { src: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg', alt: 'Developer' },
    { src: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg', alt: 'Teamwork' },
  ];

  return (
    <div>
      <Header title="Our Gallery" subtitle="Check out our work and portfolio" />
      
      <div className="container mx-auto px-4 py-6">
        <Section title="Image Collection">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div key={index} className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-64 object-cover border-2 border-gray-200 hover:border-blue-500 transition-transform duration-300 hover:scale-105" 
                />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Our Projects">
          <p className="mb-4">
            Here are some of the projects we've worked on recently. Each represents our commitment to quality and innovation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
              <h3 className="text-xl font-bold mb-2">Web Development</h3>
              <p>Custom websites built with modern technologies and responsive design.</p>
            </div>
            <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
              <h3 className="text-xl font-bold mb-2">Mobile Applications</h3>
              <p>Cross-platform mobile apps for iOS and Android devices.</p>
            </div>
            <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
              <h3 className="text-xl font-bold mb-2">UI/UX Design</h3>
              <p>Intuitive user interfaces and engaging user experiences.</p>
            </div>
            <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
              <h3 className="text-xl font-bold mb-2">Consulting Services</h3>
              <p>Expert advice on technology stack and implementation strategies.</p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default Gallery;