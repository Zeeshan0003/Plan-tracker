import React from 'react';
import Header from '../components/Header';
import Section from '../components/Section';

const Privacy: React.FC = () => {
  return (
    <div>
      <Header title="Privacy Policy" subtitle="How we handle your data" />
      
      <div className="container mx-auto px-4 py-6">
        <Section title="Our Privacy Commitment">
          <p className="mb-4">
            At Your Website, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </p>
          <p className="mb-4">
            Please read this Privacy Policy carefully. By accessing and using our website, you acknowledge that you have read, understood, and agree to be bound by all terms of this Privacy Policy.
          </p>
        </Section>

        <Section title="Information We Collect">
          <p className="mb-2">We may collect personal information that you voluntarily provide to us when you:</p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Register on our website</li>
            <li>Subscribe to our newsletter</li>
            <li>Submit a contact form</li>
            <li>Request customer support</li>
          </ul>
          <p>
            The personal information we collect may include your name, email address, telephone number, and any other information you choose to provide.
          </p>
        </Section>

        <Section title="How We Use Your Information">
          <p className="mb-2">We may use the information we collect from you to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Create and manage your account</li>
            <li>Send you emails regarding updates or informative communications</li>
            <li>Respond to your inquiries and provide customer service</li>
            <li>Optimize and improve our website and services</li>
            <li>Protect against unauthorized access to our services</li>
          </ul>
        </Section>

        <Section title="Contact Us">
          <p className="mb-4">
            If you have questions or concerns about this Privacy Policy, please contact us at:
          </p>
          <p className="font-medium">
            Email: privacy@yourwebsite.com<br />
            Phone: +1 (555) 123-4567
          </p>
        </Section>
      </div>
    </div>
  );
};

export default Privacy;