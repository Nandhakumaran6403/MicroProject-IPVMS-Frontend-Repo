import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FaPlus, FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Icons for pagination


function AuditLogSpecificStaff() {
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!filteredLogs.length) return <div>No logs found for this user.</div>;

  return (
    <div className="flex min-h-screen ">
      {/* <EmployeeSidebar /> */}

      <div className="flex-1 p-6">
        {/* <EmployeeNavbar /> */}

        <div className="w-full h-screen flex flex-col items-center ">
          <div className="max-w-7xl w-full p-6 bg-white rounded-lg  mt-6">
            <div className="flex justify-between items-center mb-4">
              <Link to="/itparkadminmain" className="flex items-center text-blue-500 hover:underline hover:text-blue-700 transition-colors duration-300">
                <FaArrowLeft className="text-xl mr-2" />
                Go Back
              </Link>
              <Link to="/auditlogadd" className="flex items-center text-green-500 hover:underline hover:text-green-700 transition-colors duration-300">
                <FaPlus className="text-xl mr-2" />
                Add Audit Log
              </Link>
            </div>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">Audit Logs for Employee</h2>
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-3 text-left bg-gray-100">ID</th>
                  <th className="border border-gray-300 p-3 text-left bg-gray-100">Action</th>
                  <th className="border border-gray-300 p-3 text-left bg-gray-100">Date</th>
                  <th className="border border-gray-300 p-3 text-left bg-gray-100">Details</th>
                  <th className="border border-gray-300 p-3 text-left bg-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map((log) => (
                  <tr key={log.logId} className="hover:bg-gray-50 transition-colors duration-300">
                    <td className="border border-gray-300 p-3">{log.logId}</td>
                    <td className="border border-gray-300 p-3">{log.action}</td>
                    <td className="border border-gray-300 p-3">{new Date(log.date).toLocaleString()}</td>
                    <td className="border border-gray-300 p-3">{log.details}</td>
                    <td className="border border-gray-300 p-3">
                      <Link to={`/auditlogedit/${log.logId}`} className="text-blue-500 hover:underline hover:text-blue-700 transition-colors duration-300">
                        Edit
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuditLogSpecificStaff;
