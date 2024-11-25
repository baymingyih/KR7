import React from 'react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">About Kingdom Runners</h1>
      
      <div className="max-w-3xl mx-auto">
        <p className="mb-4">
          Kingdom Runners is a global virtual running community that unites runners from different countries through both running and prayer. Our mission is to inspire and encourage people to pursue physical and spiritual wellness while fostering a sense of global community.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-4">Our Vision</h2>
        <p className="mb-4">
          We envision a world where runners from all walks of life come together to support each other, share their faith, and make a positive impact in their communities and beyond.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-4">What We Offer</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Virtual running events that connect runners globally</li>
          <li>A supportive community for sharing prayer requests and encouragement</li>
          <li>Challenges that combine physical goals with spiritual growth</li>
          <li>Resources for runners to improve their performance and deepen their faith</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-6 mb-4">Join Us</h2>
        <p className="mb-4">
          Whether you're a seasoned marathoner or just starting your running journey, Kingdom Runners welcomes you. Join our community today and experience the joy of running with purpose and praying with passion.
        </p>
      </div>
    </div>
  );
}