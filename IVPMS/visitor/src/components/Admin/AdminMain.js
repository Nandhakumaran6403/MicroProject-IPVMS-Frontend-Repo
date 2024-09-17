import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaHistory } from 'react-icons/fa';
import { RiArrowRightSLine } from 'react-icons/ri';

const AdminMain = () => {
  const navigate = useNavigate(); // Hook for navigation

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner */}
      <header className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6 text-center shadow-lg">
        <h1 className="text-4xl font-bold">Administrative Dashboard</h1>
        <p className="mt-2 text-lg">Manage and oversee all administrative activities</p>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-8 lg:p-12">
        <section className="mb-24 px-24 mt-12">
          <div className="flex justify-center gap-6 mb-8">
            <img
              src="https://kintronics.com/wp-content/uploads/2024/02/Visitor-Managemen-Concept2-1024x619.png"
              alt="Company Overview"
              className="w-full lg:w-1/4 h-auto rounded-lg shadow-lg"
            />
            <img
              src="https://kintronics.com/wp-content/uploads/2020/05/Visitor-Management-blank-1024x516.png"
              alt="Company Overview"
              className="w-full lg:w-1/4 h-auto rounded-lg shadow-lg"
            />
            <img
              src="https://cloudbooking.com/wp-content/uploads/2021/08/visitor-management-image-copy.webp"
              alt="Company Overview"
              className="w-full lg:w-1/4 h-auto rounded-lg shadow-lg"
            />
            <img
              src="https://www.proxyclick.com/hubfs/QR%20code%20mobile%20checkin.jpg"
              alt="Company Overview"
              className="w-full lg:w-1/4 h-auto rounded-lg shadow-lg"
            />
          </div>
        </section>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 px-8 lg:p-16">
            {/* Card 1: Administrative Users */}
            <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 text-blue-500">
                <FaUserPlus className="text-5xl" />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl font-semibold mb-4">Administrative Users</h2>
                <p className="text-gray-600 mb-6">
                  Manage and add new administrative users to the system. Ensure all users have appropriate roles and permissions.
                </p>
                <button
                  onClick={() => handleNavigate('/adminuseradd')}
                  className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 w-full mb-2 flex items-center justify-between transition duration-300"
                >
                  Add Administrative User
                  <RiArrowRightSLine className="text-xl" />
                </button>
                <button
                  onClick={() => handleNavigate('/adminuserviewall')}
                  className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 w-full flex items-center justify-between transition duration-300"
                >
                  View All Administrative Users
                  <RiArrowRightSLine className="text-xl" />
                </button>
              </div>
            </div>

            {/* Card 5: Audit Logs */}
            <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 text-red-500">
                <FaHistory className="text-5xl" />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl font-semibold mb-4">Audit Logs</h2>
                <p className="text-gray-600 mb-6">
                  View detailed logs of system activities and changes. Useful for tracking and auditing purposes.
                </p>
                <button
                  onClick={() => handleNavigate('/auditlogviewall')}
                  className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 w-full flex items-center justify-between transition duration-300"
                >
                  View All Audit Logs
                  <RiArrowRightSLine className="text-xl" />
                </button>
              </div>
            </div>
          </div>

         
        </div>
      </main>

       {/* About Us Section */}
       <div className="bg-gray-200 py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="text-lg mb-6">Our reception management system is designed to streamline the check-in process and manage visitor requests efficiently. We aim to provide a seamless experience for both receptionists and visitors.</p>
          <img src="https://media.istockphoto.com/id/1458164457/photo/businessman-using-laptop-and-smartphone-with-contact-icons-on-virtual-screen-searching-web.jpg?s=612x612&w=0&k=20&c=MGgwv8LPiylmsFqbT2w2lfY2qTpBmnprS9O3oMjkkS8=" alt="About Us" className="mx-auto rounded-lg shadow-lg" />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2024 Your Company Name. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default AdminMain;
