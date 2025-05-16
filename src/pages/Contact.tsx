import React, { useState } from 'react';
import Header from '../components/Header';
import Section from '../components/Section';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to a server
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div>
      <Header title="Contact Us" subtitle="Get in touch with our team" />
      
      <div className="container mx-auto px-4 py-6">
        <Section title="Send us a Message">
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a subject</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Support">Technical Support</option>
                <option value="Partnership">Partnership Opportunity</option>
                <option value="Feedback">Feedback</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
            
            <div className="text-center">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-black text-white font-medium rounded-md hover:from-blue-600 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105"
              >
                Send Message
              </button>
            </div>
          </form>
        </Section>

        <Section title="Our Location">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-2">Office Address</h3>
              <p className="mb-4">123 Business Street<br />Tech City, TC 12345<br />United States</p>
              
              <h3 className="text-xl font-bold mb-2">Contact Information</h3>
              <p className="mb-1">Email: info@yourwebsite.com</p>
              <p className="mb-1">Phone: +1 (555) 123-4567</p>
              <p>Fax: +1 (555) 123-4568</p>
            </div>
            <div className="flex items-center justify-center bg-gray-100 p-4 rounded-lg min-h-[200px]">
              <p className="text-gray-500 italic text-center">
                [Map would be embedded here in a production environment]
              </p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default Contact;