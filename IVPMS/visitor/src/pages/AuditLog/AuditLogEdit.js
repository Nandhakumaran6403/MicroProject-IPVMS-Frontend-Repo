import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa'; // Font Awesome icons

function AuditLogEdit() {
  const [log, setLog] = useState(null);
  const [action, setAction] = useState('');
  const [details, setDetails] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDateEditable, setIsDateEditable] = useState(true); // State to control button disable
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      const id = sessionStorage.getItem("adminid");

      try {
        const response = await axios.get(`http://localhost:6789/admin-users/${id}`);
        const fetchedUser = response.data;

        if (response.status === 200) {
          setUser(fetchedUser);
        } else {
          throw new Error("User not found");
        }
      } catch (err) {
        setError("Error fetching user details.");
        console.error("Error fetching user details:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchLog = async () => {
      try {
        const response = await axios.get(`http://localhost:6789/audit-logs/${id}`);
        const fetchedLog = response.data;
        setLog(fetchedLog);
        setAction(fetchedLog.action);
        setDetails(fetchedLog.details);

        // Compare fetched date with current date
        const fetchedDate = new Date(fetchedLog.date).toDateString();
        const currentDate = new Date().toDateString();
        setIsDateEditable(fetchedDate === currentDate);
      } catch (error) {
        console.error('Error fetching audit log:', error);
      }
    };

    fetchLog();
    fetchUserDetails();
  }, [id]);

  if (loading) return <div className="text-gray-700">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:6789/audit-logs/${id}`, {
        ...log,
        action,
        details,
        date: new Date().toISOString(), // Update the date to the current date
      });
      console.log('Audit Log Updated:', response.data);
      if (user.role === "admin") {
        navigate("/adminmain");
      } else if (user.role === "itparkadmin") {
        navigate("/itparkadminmain");
      } else {
        navigate("/"); // Fallback navigation
      }
    } catch (error) {
      console.error('Error updating audit log:', error);
    }
  };

  if (!log) return <div className="text-gray-700">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gradient-to-r ">
      {/* <EmployeeSidebar /> */}
      <div className="flex-1 p-6">
        {/* <EmployeeNavbar /> */}
        <div className="w-full h-screen flex items-center justify-center">
          <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg transform transition-all hover:scale-105 duration-300 ease-in-out">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => {
                  if (user.role === "admin") {
                    navigate("/adminmain");
                  } else if (user.role === "itparkadmin") {
                    navigate("/itparkadminmain");
                  } else {
                    navigate("/"); // Fallback navigation
                  }
                }}
                className="bg-blue-300 text-blue-800 px-4 py-2 rounded-lg shadow-md flex items-center space-x-2 hover:bg-blue-400 transition duration-300 ease-in-out"
              >
                <FaArrowLeft className="text-xl" />
                <span className="font-semibold">Go Back</span>
              </button>
              <button
                type="submit"
                form="edit-form"
                className={`bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center space-x-2 ${isDateEditable ? 'hover:bg-blue-700' : 'bg-gray-500 cursor-not-allowed'} transition duration-300 ease-in-out`}
                disabled={!isDateEditable}
              >
                <FaSave className="text-xl" />
                <span className="font-semibold">Update Log</span>
              </button>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Edit Audit Log</h2>
            <form id="edit-form" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">Action</label>
                <input
                  type="text"
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">Details</label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                  rows="4"
                  required
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuditLogEdit;
