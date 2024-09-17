import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

import { FaPlus, FaHome, FaEye, FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Importing icons

function AuditLogSpecific() {
  const { id } = useParams(); // Get the adminUserId from the URL
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:6789/audit-logs/all');
        const allLogs = response.data;

        // Filter logs by user ID
        const userLogs = allLogs.filter(log => log.user && log.user.adminUserId === parseInt(id));

        // Sort filtered logs by logId in descending order
        userLogs.sort((a, b) => b.logId - a.logId);

        setLogs(allLogs); // Store all logs (not necessary for this component, but retained)
        setFilteredLogs(userLogs); // Store sorted and filtered logs
      } catch (error) {
        console.error('Error fetching audit logs:', error);
        setError('Error fetching audit logs.');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [id]);

  // Pagination logic
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;
  if (!filteredLogs.length) return <div className="text-center p-6">No logs found for this user.</div>;

  return (
    <div className="flex min-h-screen">
      {/* <AdminSidebar /> */}

      <div className="flex-1 p-6">
        {/* <AdminNavbar /> */}
        <div className="w-full h-screen flex flex-col items-center">
          <div className="max-w-7xl w-full p-6 bg-white rounded-lg mt-6">
            <h2 className="text-2xl font-bold mb-4 text-teal-800">Audit Logs of Admin</h2>
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-teal-100">
                  <th className="border border-gray-300 p-2">ID</th>
                  <th className="border border-gray-300 p-2">Action</th>
                  <th className="border border-gray-300 p-2">Date</th>
                  <th className="border border-gray-300 p-2">Details</th>
                  <th className="border border-gray-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map((log) => (
                  <tr key={log.logId} className="hover:bg-gray-50 transition-colors duration-300">
                    <td className="border border-gray-300 p-2">{log.logId}</td>
                    <td className="border border-gray-300 p-2">{log.action}</td>
                    <td className="border border-gray-300 p-2">{new Date(log.date).toLocaleString()}</td>
                    <td className="border border-gray-300 p-2">{log.details}</td>
                    <td className="border border-gray-300 p-2 flex space-x-2">
                      <Link to={`/auditlogview/${log.logId}`} className="text-blue-500 hover:text-blue-600 transition duration-300 flex items-center space-x-1">
                        <FaEye className="text-sm" /> <span className="hidden md:inline">View</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-teal-600 text-white py-2 px-4 rounded-lg shadow hover:bg-teal-700 transition duration-300 flex items-center"
              >
                <FaArrowLeft className="text-lg" />
              </button>
              <span className="text-lg font-semibold">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-teal-600 text-white py-2 px-4 rounded-lg shadow hover:bg-teal-700 transition duration-300 flex items-center"
              >
                <FaArrowRight className="text-lg" />
              </button>
            </div>
            <div className="mt-6 flex justify-between">
              <Link
                to="/adminmain"
                className="flex items-center text-blue-500 hover:text-blue-600 transition duration-300"
              >
                <FaHome className="mr-2" /> Go Main
              </Link>
              <Link
                to="/auditlogadd"
                className="flex items-center bg-teal-600 text-white px-4 py-2 rounded-lg shadow hover:bg-teal-700 transition duration-300"
              >
                <FaPlus className="mr-2" /> Add Audit Log
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuditLogSpecific;
