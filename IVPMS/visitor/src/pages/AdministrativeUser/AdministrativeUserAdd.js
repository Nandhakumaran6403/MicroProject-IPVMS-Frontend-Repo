import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaTag, FaCamera } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdministrativeUserAdd = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [profileImageBlob, setProfileImageBlob] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // New state for image preview
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('userName', userName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);
    if (profileImageBlob) {
      formData.append('profileImageBlob', profileImageBlob);
    }

    try {
      await axios.post('http://localhost:6789/admin-users', formData);
      navigate('/adminmain');
    } catch (error) {
      console.error('Error adding administrative user', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImageBlob(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-8 px-4">
      <motion.div
        className="w-full max-w-lg bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 p-8 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <FaUser className="mr-2 text-xl" />
          Add Administrative User
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center border border-gray-300 rounded-lg bg-white">
            <FaUser className="text-gray-500 ml-4 text-xl" />
            <input
              type="text"
              placeholder="User Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-3 pl-2 border-none rounded-lg focus:outline-none"
              required
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-lg bg-white">
            <FaEnvelope className="text-gray-500 ml-4 text-xl" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 pl-2 border-none rounded-lg focus:outline-none"
              required
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-lg bg-white">
            <FaLock className="text-gray-500 ml-4 text-xl" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pl-2 border-none rounded-lg focus:outline-none"
              required
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-lg bg-white">
            <FaTag className="text-gray-500 ml-4 text-xl" />
            <input
              type="text"
              placeholder="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 pl-2 border-none rounded-lg focus:outline-none"
              required
            />
          </div>
          <div className="flex flex-col items-center border border-gray-300 rounded-lg bg-white p-4">
            <FaCamera className="text-gray-500 mb-2 text-xl" />
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full p-2 border-none rounded-lg cursor-pointer"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-4 max-w-full h-auto rounded-lg"
              />
            )}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
          >
            Add User
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdministrativeUserAdd;
