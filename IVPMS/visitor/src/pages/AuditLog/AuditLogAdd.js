import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { motion } from "framer-motion"; 

function AuditLogAdd() {
  const [action, setAction] = useState("");
  const [details, setDetails] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

    fetchUserDetails();
  }, []);

  if (loading) return <div className="text-gray-600">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:6789/audit-logs", {
        user: { adminUserId: user.adminUserId },
        action,
        date: new Date().toISOString(),
        details,
      });
      console.log("Audit Log Created:", response.data);

      if (user.role === "admin") {
        navigate("/adminmain");
      } else if (user.role === "itparkadmin") {
        navigate("/itparkadminmain");
      } else {
        navigate("/"); // Fallback navigation
      }
    } catch (error) {
      console.error("Error creating audit log:", error);
    }
  };

  const handleGoBack = () => {
    if (user.role === "admin") {
      navigate("/adminmain");
    } else if (user.role === "itparkadmin") {
      navigate("/itparkadminmain");
    } else {
      navigate("/"); // Fallback navigation
    }
  };

  return (
    <div className="flex  min-h-screen">
      <div className="flex-1 p-6">
        <div className="w-full h-screen flex items-center justify-center ">
          <motion.div
            className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-teal-800 flex items-center">
              <FaSave className="text-teal-600 mr-2" /> Add Audit Log
            </h2>
            <form onSubmit={handleSubmit}>
              <motion.div
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-gray-700 text-sm font-medium mb-2">User Details</label>
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200">

                <img
                  src={`data:image/jpeg;base64,${user.profileImageBlob}`}
                  alt="Pass Image"
                  className="w-24 h-24 rounded-full object-cover cursor-pointer"
                />
                  <p><strong>Username:</strong> {user.userName.toUpperCase()}</p>
                  <p><strong>Email ID:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {user.role.toUpperCase()}</p>
                  <p><strong>Last Login Date:</strong> {new Date(user.lastLoginDate).toLocaleDateString()}</p>
                </div>
              </motion.div>
              <motion.div
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <label className="block text-gray-700 text-sm font-medium mb-2">Action</label>
                <input
                  type="text"
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
                  required
                />
              </motion.div>
              <motion.div
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <label className="block text-gray-700 text-sm font-medium mb-2">Details</label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
                  rows="4"
                  required
                />
              </motion.div>
              <div className="flex justify-between items-center mt-8">
                <motion.button
                  type="button"
                  onClick={handleGoBack}
                  className="flex items-center bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaArrowLeft className="mr-2" /> Go Back
                </motion.button>
                <motion.button
                  type="submit"
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-teal-700 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add Log
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AuditLogAdd;
