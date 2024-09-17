import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEdit, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai';

const EmployeeProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [fullScreen, setFullScreen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:6789/employees/${id}`);
        setProfile(response.data);
        setImagePreview(response.data.profileImageBlob ? `data:image/jpeg;base64,${response.data.profileImageBlob}` : 'https://via.placeholder.com/150');
      } catch (error) {
        console.error('Error fetching profile', error);
      }
    };
    fetchProfile();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setFullScreen(false);
      }
    };

    if (fullScreen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [fullScreen]);

  const handleEdit = () => {
    navigate(`/employeeedit/${id}`);
  };

  const handleImageClick = () => {
    setFullScreen(!fullScreen);
  };

  if (!profile) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="font-[sans-serif]  flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full bg-white p-6 rounded-lg  relative">
        <div className="mb-6 flex justify-center relative">
          <div className="relative">
            <img
              src={imagePreview || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover cursor-pointer border-4 border-blue-500 shadow-md transform transition-transform duration-300 hover:scale-105"
              onClick={handleImageClick}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gray-800 bg-opacity-75 text-white text-xs rounded-full cursor-pointer"
              onClick={handleImageClick}
            >
              {fullScreen ? <AiOutlineFullscreenExit className="text-2xl" /> : <AiOutlineFullscreen className="text-2xl" />}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold flex items-center">
            <FaUser className="mr-2 text-blue-500" /> Name
          </label>
          <p className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-100 text-gray-700">{profile.employeeName}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold flex items-center">
            <FaUser className="mr-2 text-blue-500" /> Position
          </label>
          <p className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-100 text-gray-700">{profile.position}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold flex items-center">
            <FaEnvelope className="mr-2 text-blue-500" /> Email
          </label>
          <p className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-100 text-gray-700">{profile.employeeEmail}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold flex items-center">
            <FaPhone className="mr-2 text-blue-500" /> Phone
          </label>
          <p className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-100 text-gray-700">{profile.employeePhone}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold flex items-center">
            <FaMapMarkerAlt className="mr-2 text-blue-500" /> Address
          </label>
          <p className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-100 text-gray-700">
            {profile.employeeAddress}, {profile.employeeCity}, {profile.employeeState}
          </p>
        </div>
      </div>

      {/* Full-screen Modal */}
      {fullScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div ref={modalRef} className="relative bg-white p-4 rounded-lg shadow-lg">
            <img
              src={imagePreview || 'https://via.placeholder.com/150'}
              alt="Profile Fullscreen"
              className="w-80 h-80 object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeProfile;
