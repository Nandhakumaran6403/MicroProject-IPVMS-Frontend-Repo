import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUser, FaEnvelope, FaUserTie, FaCalendarAlt } from 'react-icons/fa';
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai';
import { IoMdCreate } from 'react-icons/io';

const AdminProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [fullScreen, setFullScreen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = sessionStorage.getItem('adminid');
        if (userId === null || userId !== id) {
          navigate('/');
        }
        const response = await axios.get(`http://localhost:6789/admin-users/${id}`);
        setProfile(response.data);
        setImagePreview(response.data.profileImageBlob ? `data:image/jpeg;base64,${response.data.profileImageBlob}` : 'https://via.placeholder.com/150');
      } catch (error) {
        console.error('Error fetching profile', error);
      }
    };
    fetchProfile();
  }, [id, navigate]);

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
    navigate(`/adminuseredit/${id}`);
  };

  const handleImageClick = () => {
    setFullScreen(!fullScreen);
  };

  if (!profile) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="font-[sans-serif] flex items-center justify-center min-h-screen p-4">
      <div className="max-w-4xl w-full bg-white p-6 rounded-lg px-60 relative">
        <div className="mb-6 flex items-center justify-center relative">
          <div className="relative">
            <img
              src={imagePreview || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover cursor-pointer border-4 border-blue-500 shadow-lg transform transition-transform duration-300 hover:scale-105"
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
          <p className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-100 text-gray-700">{profile.userName}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold flex items-center">
            <FaEnvelope className="mr-2 text-blue-500" /> Email
          </label>
          <p className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-100 text-gray-700">{profile.email}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold flex items-center">
            <FaUserTie className="mr-2 text-blue-500" /> Role
          </label>
          <p className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-100 text-gray-700">{profile.role}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-500" /> Last Login Date
          </label>
          <p className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-100 text-gray-700">{profile.lastLoginDate || 'N/A'}</p>
        </div>
        <button
          onClick={handleEdit}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center"
        >
          <IoMdCreate className="mr-2 text-lg" /> Edit Profile
        </button>
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

export default AdminProfile;
