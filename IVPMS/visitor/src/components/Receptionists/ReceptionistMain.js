// src/ReceptionistDashboard.js
import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you are using react-router for navigation
import Slider from 'react-slick';
import { FaCalendarAlt, FaUserPlus, FaListAlt, FaCalendarDay, FaQrcode } from 'react-icons/fa';

// Import slick-carousel styles
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ReceptionistMain = () => {
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className=" min-h-screen flex flex-col">
      {/* Carousel Banner */}
      <div className="relative mb-8">
        <Slider {...carouselSettings}>
          <div className="bg-blue-600 text-white p-8 text-center flex flex-col justify-center items-center" style={{ height: '300px' }}>
            <h1 className="text-4xl font-bold">Welcome to the Receptionist Dashboard</h1>
            <p className="text-lg mt-2">Efficient management of appointments and visitor requests.</p>
          </div>
          <div className="bg-green-600 text-white p-8 text-center flex flex-col justify-center items-center" style={{ height: '300px' }}>
            <h1 className="text-4xl font-bold">Streamline Your Workflow</h1>
            <p className="text-lg mt-2">Easy access to all the tools you need.</p>
          </div>
          <div className="bg-indigo-600 text-white p-8 text-center flex flex-col justify-center items-center" style={{ height: '300px' }}>
            <h1 className="text-4xl font-bold">Enhanced Efficiency</h1>
            <p className="text-lg mt-2">Optimize your daily tasks with our dashboard.</p>
          </div>
        </Slider>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center p-12 px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 mb-8">
          {/* View All Appointments Button */}
          <Link to="/appointmentviewtoday" className="bg-blue-500 text-white rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition-transform">
            <div className="p-6 text-center">
              <FaCalendarAlt className="text-5xl mb-2 mx-auto text-white" />
              <h2 className="text-xl font-bold mb-2">View All Today Appointments</h2>
              <p className="text-sm">See and manage all Today scheduled appointments.</p>
            </div>
          </Link>
           {/* View All Visitor Requests Today Button */}
           <Link to="/visitorrequestviewalltoday" className="bg-yellow-500 text-white rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition-transform">
            <div className="p-6 text-center">
              <FaCalendarDay className="text-5xl mb-2 mx-auto text-white" />
              <h2 className="text-xl font-bold mb-2">View All Visitor Requests Today</h2>
              <p className="text-sm">Review and manage all visitor requests for today.</p>
            </div>
          </Link>
         
        
          {/* Add Visitor Request Button */}
          <Link to="/visitorrequestadd" className="bg-green-500 text-white rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition-transform">
            <div className="p-6 text-center">
              <FaUserPlus className="text-5xl mb-2 mx-auto text-white" />
              <h2 className="text-xl font-bold mb-2">Add Visitor Request</h2>
              <p className="text-sm">Submit a new visitor request.</p>
            </div>
          </Link>
          {/* QR Code Scanner Button */}
          <Link to="/qrcodescannerentry" className="bg-yellow-500 text-white rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition-transform">
            <div className="p-6 text-center">
              <FaQrcode className="text-5xl mb-2 mx-auto text-white" />
              <h2 className="text-xl font-bold mb-2">QR Code Scanner for Checkin and Checkout</h2>
              <p className="text-sm">Scan the QR Code for check-in and check-out.</p>
            </div>
          </Link>
        </div>

        {/* Text Content with Images */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col gap-12 md:flex-row items-center bg-white  rounded-lg overflow-hidden mb-12">
            <div className="md:w-1/2">
              <img src="https://w0.peakpx.com/wallpaper/106/207/HD-wallpaper-cloud-gate-millennium-park-chicago-evening-sunset-skyscrapers-landmark-modern-architecture-chicago-cityscape-usa.jpg" alt="Dashboard Overview" className="w-full h-64 object-cover" />
            </div>
            <div className="md:w-1/2 p-6">
              <h2 className="text-2xl font-bold mb-4">Comprehensive Dashboard Overview</h2>
              <p className="text-lg">Our dashboard provides a comprehensive overview of your appointments and visitor requests. It is designed to help you manage and monitor your tasks efficiently with ease.</p>
            </div>
          </div>
          <div className="flex gap-12 flex-col md:flex-row items-center bg-white  rounded-lg overflow-hidden">
            <div className="md:w-1/2 p-6">
              <h2 className="text-2xl font-bold mb-4">Enhanced Security and User Experience</h2>
              <p className="text-lg">We prioritize security and user experience. Our system ensures that all your data is protected and provides a seamless experience for managing visitor requests and appointments.</p>
            </div>
            <div className="md:w-1/2">
              <img src="https://media.istockphoto.com/id/1314761274/photo/server-room-data-center-3d-rendering.jpg?s=612x612&w=0&k=20&c=E8BNNB3xhvCPE50NtBT8csOv2XDPWZkYUw8uLGbWWBc=" alt="Security Features" className="w-full h-64 object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="bg-gray-200 py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="text-lg mb-6">Our reception management system is designed to streamline the check-in process and manage visitor requests efficiently. We aim to provide a seamless experience for both receptionists and visitors.</p>
          <img src="https://media.istockphoto.com/id/1458164457/photo/businessman-using-laptop-and-smartphone-with-contact-icons-on-virtual-screen-searching-web.jpg?s=612x612&w=0&k=20&c=MGgwv8LPiylmsFqbT2w2lfY2qTpBmnprS9O3oMjkkS8=" alt="About Us" className="mx-auto rounded-lg shadow-lg" />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm">&copy; 2024 Nandha It Park. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ReceptionistMain;
