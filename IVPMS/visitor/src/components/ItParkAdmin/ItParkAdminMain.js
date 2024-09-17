import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBuilding, FaUsers, FaCalendarAlt, FaRegHandshake, FaHome, FaPlus, FaEye } from 'react-icons/fa';

const ItParkAdminMain = () => {
  const navigate = useNavigate(); // Hook for navigation

  const handleViewAllCompany = () => navigate('/companyviewall');
  const handleAddCompany = () => navigate('/companyadd');
  const handleViewAllEmployees = () => navigate('/employeeviewall');
  const handleAddEmployee = () => navigate('/employeeadd');
  const handleViewAllVisits = () => navigate('/visitviewall');
  const handleVisitItParkAdminAdd = () => navigate('/visititparkadminadd');

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Banner Section */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white py-6 px-4 text-center">
        <h1 className="text-4xl font-bold">Welcome to IT Park Admin Dashboard</h1>
        <p className="text-lg mt-2">Manage companies, employees, visits, and more with ease!</p>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex justify-center items-center p-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 p-12 ">
          {/* Card for Companies */}
          <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 ">
            <div className="flex items-center mb-4">
              <FaBuilding className="text-yellow-500 text-4xl mr-4" />
              <h2 className="text-xl font-bold">Company Management</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Manage company profiles, update details, and track performance.
            </p>
            <button
              onClick={handleAddCompany}
              className="w-full bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition duration-300 mb-2 flex items-center"
            >
              <FaPlus className="mr-2" /> Add Company
            </button>
            <button
              onClick={handleViewAllCompany}
              className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-300 flex items-center"
            >
              <FaEye className="mr-2" /> View All Companies
            </button>
          </div>

          {/* Card for Employees */}
          <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <div className="flex items-center mb-4">
              <FaUsers className="text-yellow-500 text-4xl mr-4" />
              <h2 className="text-xl font-bold">Employee Management</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Track employee details, manage roles, and review performance.
            </p>
            <button
              onClick={handleAddEmployee}
              className="w-full bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition duration-300 mb-2 flex items-center"
            >
              <FaPlus className="mr-2" /> Add Employee
            </button>
            <button
              onClick={handleViewAllEmployees}
              className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-300 flex items-center"
            >
              <FaEye className="mr-2" /> View All Employees
            </button>
          </div>

          {/* Card for Visits */}
          <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <div className="flex items-center mb-4">
              <FaCalendarAlt className="text-red-500 text-4xl mr-4" />
              <h2 className="text-xl font-bold">Visit Management</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Oversee scheduled visits, manage bookings, and ensure smooth operations.
            </p>
            <button
              onClick={handleViewAllVisits}
              className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-300 flex items-center"
            >
              <FaEye className="mr-2" /> View All Visits
            </button>
          </div>

          {/* Card for IT Park Admin */}
          <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <div className="flex items-center mb-4">
              <FaRegHandshake className="text-blue-500 text-4xl mr-4" />
              <h2 className="text-xl font-bold">Generate Custom Passes</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Generate Custom Passes for Frequent Visitors
            </p>
            <button
              onClick={handleVisitItParkAdminAdd}
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300 flex items-center"
            >
              <FaPlus className="mr-2" /> Generate Custom Passes
            </button>
          </div>

          {/* Additional Cards */}
          <Link to="/appointmentviewall" className="bg-white p-6 rounded-lg shadow-lg hover:bg-gray-50 transition-transform transform hover:scale-105 flex items-center">
            <FaCalendarAlt className="text-blue-500 text-4xl mr-4" />
            <div>
              <h2 className="text-xl font-bold mb-2">View All Appointments</h2>
              <p className="text-sm text-gray-700">See and manage all scheduled appointments.</p>
            </div>
          </Link>

          <Link to="/visitorrequestviewall" className="bg-white p-6 rounded-lg shadow-lg hover:bg-gray-50 transition-transform transform hover:scale-105 flex items-center">
            <FaHome className="text-yellow-500 text-4xl mr-4" />
            <div>
              <h2 className="text-xl font-bold mb-2">View All Visitor Requests</h2>
              <p className="text-sm text-gray-700">Review and manage all visitor requests.</p>
            </div>
          </Link>

          <Link to="/visitorrequestviewalltoday" className="bg-white p-6 rounded-lg shadow-lg hover:bg-gray-50 transition-transform transform hover:scale-105 flex items-center">
            <FaHome className="text-yellow-500 text-4xl mr-4" />
            <div>
              <h2 className="text-xl font-bold mb-2">View All Visitor Requests Today</h2>
              <p className="text-sm text-gray-700">Review and manage all visitor requests for today.</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="bg-gray-200 py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="text-lg mb-6">Our reception management system is designed to streamline the check-in process and manage visitor requests efficiently. We aim to provide a seamless experience for both receptionists and visitors.</p>
          <img src="https://media.istockphoto.com/id/1458164457/photo/businessman-using-laptop-and-smartphone-with-contact-icons-on-virtual-screen-searching-web.jpg?s=612x612&w=0&k=20&c=MGgwv8LPiylmsFqbT2w2lfY2qTpBmnprS9O3oMjkkS8=" alt="About Us" className="mx-auto rounded-lg shadow-lg" />
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2024 IT Park Admin Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ItParkAdminMain;
