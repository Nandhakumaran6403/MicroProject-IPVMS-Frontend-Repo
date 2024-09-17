import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaQrcode } from 'react-icons/fa'; 
import 'animate.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleQr = () => {
    navigate('/qrcodeforvisitor');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between shadow-lg sticky top-0 z-50">
        <div className="text-white font-bold ml-12 text-2xl font-bold flex items-center space-x-2">
        <img className='w-10 h-10 rounded-full' src='https://logodix.com/logo/444808.jpg'/>
        andha IT Park
        </div>
        <div className="flex space-x-4">
         
          <button
            onClick={handleQr}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105 flex items-center space-x-2"
          >
            <FaQrcode className="text-lg" />
            <span className="hidden md:inline">SCAN For Register</span>
          </button>
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105 flex items-center space-x-2"
          >
            <FaUser className="text-lg" />
            <span className="hidden md:inline">Login</span>
          </button>
        </div>
      </nav>

      {/* Main Banner Section */}
      <section className="relative h-[400px] bg-gradient-to-r from-blue-500 to-blue-700 text-white flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-70">
          <img
            src="https://img.freepik.com/premium-vector/abstract-business-professional-background-banner-design-multipurpose_1340-16915.jpg"
            alt="Main Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-6xl font-extrabold leading-tight animate__animated animate__fadeIn">Welcome to Nandha IT Park</h1>
          <p className="mt-4 text-2xl animate__animated animate__fadeIn animate__delay-1s">Innovating the Future of Technology</p>
        </div>
      </section>

      {/* Additional Banners Section */}
      <section className="py-8 px-4">
        <div className="flex px-12 gap-12  space-x-4 overflow-x-auto">
          {['Online Registration', 'CheckIn And CheckOut', 'Notification Facilities','Tracking Facilities'].map((offer, index) => (
            <div key={index} className="flex-shrink-0 w-72  h-48 bg-blue-300 text-white flex items-center justify-center rounded-lg shadow-lg hover:bg-blue-400 transition-colors duration-300">
              <h2 className="text-xl font-bold">{offer}</h2>
            </div>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-8 px-4 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">About Us</h2>
          <p className="text-lg leading-relaxed">
            Nandha IT Park is dedicated to fostering innovation and technology excellence. We provide a dynamic and collaborative environment for tech enthusiasts and professionals. Join us to explore groundbreaking solutions and drive the future of technology.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 text-center shadow-lg">
        <p>&copy; {new Date().getFullYear()} Nandha IT Park. All rights reserved.</p>
      </footer>
    </div>
  );
};

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <img src={src} alt={`Carousel ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700"
        aria-label="Previous Slide"
      >
        &lt;
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700"
        aria-label="Next Slide"
      >
        &gt;
      </button>
    </div>
  );
};

export default LandingPage;
