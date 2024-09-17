import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLockContext } from './LockContext';

import { FaEye, FaEdit, FaLock, FaUnlockAlt, FaTrashAlt, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function AuditLogViewAll() {
  const [logs, setLogs] = useState([]);
  const { lockedStates, setLockedStates } = useLockContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(6);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:6789/audit-logs/all');
        let fetchedLogs = response.data;

        // Sort logs by logId in descending order
        fetchedLogs = fetchedLogs.sort((a, b) => b.logId - a.logId);
        
        setLogs(fetchedLogs);

        // Initialize lock states for each log
        const initialLockedStates = fetchedLogs.reduce((acc, log) => {
          acc[log.logId] = true; // Assume all logs are locked initially
          return acc;
        }, {});
        setLockedStates(initialLockedStates);
      } catch (error) {
        console.error('Error fetching audit logs:', error);
      }
    };
    fetchLogs();
  }, [setLockedStates]);

  // Pagination logic
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(logs.length / logsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:6789/audit-logs/${id}`);
      setLogs(logs.filter(log => log.logId !== id));
      // Remove the lock state for the deleted log
      setLockedStates(prevStates => {
        const newStates = { ...prevStates };
        delete newStates[id];
        return newStates;
      });
    } catch (error) {
      console.error('Error deleting audit log:', error);
    }
  };

  const toggleLock = (id) => {
    setLockedStates(prevStates => ({
      ...prevStates,
      [id]: !prevStates[id], // Toggle the lock state for the specified log
    }));
  };

  return (
    <div className="flex min-h-screen ">
      {/* <AdminSidebar /> */}

      <div className="flex-1 p-6">
        {/* <AdminNavbar /> */}
        <div className="w-full h-screen flex flex-col items-center ">
          <div className="max-w-7xl w-full p-6 bg-white rounded-lg  mt-6">
            <h2 className="text-3xl font-bold mb-6 text-teal-800">All Audit Logs</h2>
            <table className="w-full border-collapse bg-white rounded-lg shadow-md">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="p-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                  <th className="p-3 text-left text-xs font-medium uppercase tracking-wider">User Name</th>
                  <th className="p-3 text-left text-xs font-medium uppercase tracking-wider">User Role</th>
                  <th className="p-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                  <th className="p-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                  <th className="p-3 text-left text-xs font-medium uppercase tracking-wider">Details</th>
                  <th className="p-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map((log) => (
                  <tr key={log.logId} className="hover:bg-gray-50">
                    <td className="p-3 text-sm text-gray-900">{log.logId}</td>
                    <td className="p-3 text-sm text-gray-500">{log.user.userName}</td>
                    <td className="p-3 text-sm text-gray-500">{log.user.role}</td>
                    <td className="p-3 text-sm text-gray-500">{log.action}</td>
                    <td className="p-3 text-sm text-gray-500">{new Date(log.date).toLocaleString()}</td>
                    <td className="p-3 text-sm text-gray-500">{log.details}</td>
                    <td className="p-3 text-sm font-medium flex space-x-2">
                      <Link to={`/auditlogview/${log.logId}`} className="text-blue-500 hover:text-blue-700 flex items-center">
                        <FaEye className="mr-1" /> View
                      </Link>
                      <button
                        onClick={() => toggleLock(log.logId)}
                        className={`px-3 py-1 text-white rounded flex items-center ${lockedStates[log.logId] ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                      >
                        {lockedStates[log.logId] ? <FaUnlockAlt className="mr-1" /> : <FaLock className="mr-1" />}
                        {lockedStates[log.logId] ? 'Unlock Editing' : 'Lock Editing'}
                      </button>
                      {!lockedStates[log.logId] && (
                        <Link to={`/auditlogedit/${log.logId}`} className="text-yellow-500 hover:text-yellow-700 flex items-center">
                          <FaEdit className="mr-1" /> Edit
                        </Link>
                      )}
                      <button
                        onClick={() => handleDelete(log.logId)}
                        className="text-red-500 hover:text-red-700 flex items-center"
                      >
                        <FaTrashAlt className="mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="mt-8 flex justify-center items-center space-x-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300 flex items-center"
              >
                <FaArrowLeft className="text-xl" />
              </button>

              <span className="flex items-center text-lg font-semibold">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300 flex items-center"
              >
                <FaArrowRight className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuditLogViewAll;
