import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useLockContext } from './LockContext'; // Adjust the path if needed


function AuditLogView() {
  const [log, setLog] = useState(null);
  const { id } = useParams();
  const { lockedStates } = useLockContext();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      const id = sessionStorage.getItem("adminid");

      try {
        // Fetch user details
        const response = await axios.get(
          `http://localhost:6789/admin-users/${id}`
        );
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
        setLog(response.data);
      } catch (error) {
        setError("Error fetching audit log.");
        console.error("Error fetching audit log:", error);
      }
    };

    fetchUserDetails();
    fetchLog();
  }, [id]);

  // Check if current date matches the log date (ignoring time)
  const isSameDate = () => {
    if (log) {
      const logDate = new Date(log.date);
      const currentDate = new Date();
      return (
        logDate.getFullYear() === currentDate.getFullYear() &&
        logDate.getMonth() === currentDate.getMonth() &&
        logDate.getDate() === currentDate.getDate()
      );
    }
    return false;
  };

  const handleEditClick = (e) => {
    if (!isSameDate() && lockedStates[log.logId]) {
      e.preventDefault();
      setModalMessage('This log is currently locked for editing.');
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (!log) return <div>Loading...</div>;

  // Determine if the log is locked
  const isLocked = !isSameDate() && lockedStates[log.logId];
  const canEdit = !isLocked; // Edit access is based on lock state and date check

  return (
    <div className="flex bg-gray-100">

      <div className="flex-1 p-6">
        <div className="w-full h-screen flex items-center justify-center bg-gray-100">
          <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">View Audit Log</h2>
            <div className="mb-4">
              <strong>User Name:</strong>
              <p>{log.user.userName}</p>
            </div>
            <div className="mb-4">
              <strong>User Role:</strong>
              <p>{log.user.role}</p>
            </div>
            <div className="mb-4">
              <strong>Action:</strong>
              <p>{log.action}</p>
            </div>
            <div className="mb-4">
              <strong>Date:</strong>
              <p>{new Date(log.date).toLocaleString()}</p>
            </div>
            <div className="mb-4">
              <strong>Details:</strong>
              <p>{log.details}</p>
            </div>
            <Link
              to={`/auditlogedit/${log.logId}`}
              className={`text-yellow-500 hover:underline ${!canEdit ? 'cursor-not-allowed opacity-50' : ''}`}
              onClick={handleEditClick}
            >
              Edit
            </Link>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
            <h2 className="text-lg font-semibold text-red-600">Notification</h2>
            <p className="text-sm text-gray-700 mt-2">{modalMessage}</p>
            <button
              onClick={handleCloseModal}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuditLogView;

