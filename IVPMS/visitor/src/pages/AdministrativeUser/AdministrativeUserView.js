import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaArrowLeft, FaTrash } from 'react-icons/fa'; // Adding icons
import { motion } from 'framer-motion'; // For animations

const AdministrativeUserView = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:6789/admin-users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user', error);
      }
    };
    fetchUser();
  }, [id]);

  const handleEdit = () => {
    navigate(`/adminuseredit/${id}`);
  };

  const handleBack = () => {
    navigate('/adminuserviewall');
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:6789/admin-users/${id}`);
      navigate('/adminmain');
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  if (!user) return <div className="text-center py-8">Loading...</div>;

  return (
    <motion.div 
      className="max-w-md mx-auto bg-white mt-24 rounded-lg"
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-extrabold mb-12 mt-12 text-gray-800">Administrative User Details</h2>
      <div className="flex flex-col md:flex-row items-center gap-24">
        <div className="md:w-3/3 mb-4 md:mb-0">
          {user.profileImageBlob && (
            <div className="relative">
              <img
                src={`data:image/jpeg;base64,${user.profileImageBlob}`}
                alt="Profile"
                className="w-80 h-60 object-cover rounded-lg shadow-md"
              />
            </div>
          )}
        </div>
        <div className="md:w-2/3">
          <div className="mb-4">
            <strong className="text-gray-600">User Name:</strong> <span className="text-gray-800">{user.userName}</span>
          </div>
          <div className="mb-4">
            <strong className="text-gray-600">Email:</strong> <span className="text-gray-800">{user.email}</span>
          </div>
          <div className="mb-4">
            <strong className="text-gray-600">Role:</strong> <span className="text-gray-800">{user.role}</span>
          </div>
          <div className="mb-4">
            <strong className="text-gray-600">Last Login Date:</strong> <span className="text-gray-800">{user.lastLoginDate}</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center gap-4 mt-12">
        <button
          onClick={handleEdit}
          className="bg-blue-600 text-white p-2 rounded-lg flex items-center hover:bg-blue-700 transition duration-300"
        >
          <FaEdit className="mr-2" /> Edit
        </button>
        
        <button
          onClick={handleBack}
          className="bg-gray-600 text-white p-2 rounded-lg flex items-center hover:bg-gray-700 transition duration-300"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white p-2 rounded-lg flex items-center hover:bg-red-700 transition duration-300"
        >
          <FaTrash className="mr-2" /> Delete
        </button>
      </div>
    </motion.div>
  );
};

export default AdministrativeUserView;
