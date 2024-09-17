// src/pages/EmployeeView.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaArrowLeft, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';

const EmployeeView = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:6789/employees/${id}`);
        setEmployee(response.data);
      } catch (error) {
        console.error('Error fetching employee:', error);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleEdit = () => {
    navigate(`/employeeedit/${id}`);
  };

  const handleBack = () => {
    navigate('/employeeviewall');
  };

  if (!employee) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="container mx-auto p-6  px-60 ">
      <h2 className="text-3xl font-extrabold mb-4 text-gray-800">Employee Details</h2>
      <motion.div
        className="bg-white p-6 px-24 rounded-lg shadow-lg transform transition-transform hover:scale-105"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 mb-6 ">
          {employee.profileImageBlob && (
            <img
              src={`data:image/jpeg;base64,${employee.profileImageBlob}`}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border-4 border-gray-200 shadow-md"
            />
          )}
          <div className="text-center md:text-left">
            <p className="text-2xl font-semibold text-gray-900">{employee.employeeName}</p>
            <p className="text-gray-600 text-lg flex items-center justify-center md:justify-start">
              <FaUser className="mr-2" />
              {employee.position}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          {/* <p className="flex items-center text-gray-700"><FaCalendarAlt className="mr-2" /><strong>ID:</strong> {employee.employeeId}</p> */}
          <p className="flex items-center text-gray-700"><FaCalendarAlt className="mr-2" /><strong>Date of Birth:</strong> {new Date(employee.dob).toLocaleDateString()}</p>
          <p className="flex items-center text-gray-700"><FaEnvelope className="mr-2" /><strong>Email:</strong> {employee.employeeEmail}</p>
          <p className="flex items-center text-gray-700"><FaPhoneAlt className="mr-2" /><strong>Phone:</strong> {employee.employeePhone}</p>
          <p className="flex items-center text-gray-700"><FaMapMarkerAlt className="mr-2" /><strong>Address:</strong> {employee.employeeAddress}</p>
          <p className="flex items-center text-gray-700"><FaMapMarkerAlt className="mr-2" /><strong>City:</strong> {employee.employeeCity}</p>
          <p className="flex items-center text-gray-700"><FaMapMarkerAlt className="mr-2" /><strong>State:</strong> {employee.employeeState}</p>
          <p className="flex items-center text-gray-700"><FaUser className="mr-2" /><strong>Role:</strong> {employee.role}</p>
          <p className="flex items-center text-gray-700"><FaCalendarAlt className="mr-2" /><strong>Availability:</strong> {employee.availability}</p>
          <p className="flex items-center text-gray-700"><FaCalendarAlt className="mr-2" /><strong>Last Login Date:</strong> {new Date(employee.lastLoginDate).toLocaleDateString()}</p>
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          <motion.button
            onClick={handleEdit}
            className="bg-yellow-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-yellow-600 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <FaEdit className="inline-block mr-2" />
            Edit
          </motion.button>
          <motion.button
            onClick={handleBack}
            className="bg-gray-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <FaArrowLeft className="inline-block mr-2" />
            Back
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default EmployeeView;
