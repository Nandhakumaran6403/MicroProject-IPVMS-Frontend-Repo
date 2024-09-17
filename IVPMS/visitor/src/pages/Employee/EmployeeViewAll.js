// src/pages/EmployeeViewAll.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSearch, FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';

const EmployeeViewAll = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:6789/employees/all');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:6789/employees/${id}`);
      setEmployees(employees.filter(employee => employee.employeeId !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredEmployees = employees.filter(employee => {
    const { employeeName, company, position, availability } = employee;
    return (
      employeeName.toLowerCase().includes(searchQuery) ||
      company.companyName.toLowerCase().includes(searchQuery) ||
      position.toLowerCase().includes(searchQuery) ||
      availability.toLowerCase().includes(searchQuery)
    );
  });

  return (
    <div className=" mx-auto p-6 mt-12">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 lg:mb-0 px-6">All Employees</h2>
        <div className="relative w-full lg:w-1/3 mr-12">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4  py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>
      <div className="relative bg-white p-6 rounded-lg ">
        <div className="flex">
          {/* Main Table */}
          <div className="flex-grow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map(employee => (
                  <tr key={employee.employeeId} className="hover:bg-gray-50 transition-colors duration-300">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{employee.employeeId}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{employee.employeeName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{employee.position}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{employee.company.companyName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{employee.employeeEmail}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{employee.employeePhone}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{employee.availability}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(employee.lastLoginDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {employee.profileImageBlob && (
                        <img
                          src={`data:image/jpeg;base64,${employee.profileImageBlob}`}
                          alt="Profile"
                          className="w-12 h-12 object-cover rounded-full"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 flex gap-3">
                  
                  <Link
                    to={`/employeeview/${employee.employeeId}`}
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center"
                    aria-label="View Employee"
                  >
                    <FaEye />
                  </Link>
                  <Link
                    to={`/employeeedit/${employee.employeeId}`}
                    className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition duration-300 flex items-center justify-center"
                    aria-label="Edit Employee"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    onClick={() => handleDelete(employee.employeeId)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300 flex items-center justify-center"
                    aria-label="Delete Employee"
                  >
                    <FaTrashAlt />
                  </button>
               
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Actions Column */}
          {/* <div className="w-48 flex-none bg-gray-50 border-l border-gray-200">
            <div className="sticky top-0 bg-gray-50 p-4">
              <h3 className="text-xs ml-6 px-6 py-2 font-medium text-gray-500 uppercase tracking-wider">Actions</h3>
            </div>
            <div className="p-4">
              {filteredEmployees.map(employee => (
                <div key={employee.employeeId} className="flex space-x-2 mb-2 px-6 py-5">
                  <Link
                    to={`/employeeview/${employee.employeeId}`}
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center"
                    aria-label="View Employee"
                  >
                    <FaEye />
                  </Link>
                  <Link
                    to={`/employeeedit/${employee.employeeId}`}
                    className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition duration-300 flex items-center justify-center"
                    aria-label="Edit Employee"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    onClick={() => handleDelete(employee.employeeId)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300 flex items-center justify-center"
                    aria-label="Delete Employee"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default EmployeeViewAll;
