import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHome, FaPlus, FaEye, FaUser, FaSignOutAlt, FaCogs } from 'react-icons/fa';
import { RiAdminFill } from 'react-icons/ri';

const AdminNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = sessionStorage.getItem('adminid');
        if (userId === null) {
          navigate('/');
          return;
        }
        const response = await axios.get(`http://localhost:6789/admin-users/${userId}`);
        if (response.status === 200) {
          await axios.patch(`http://localhost:6789/admin-users/lastlogin/${userId}`);
          setProfile(response.data);
        } else {
          throw new Error('User not found');
        }
      } catch (error) {
        console.error('Error fetching profile', error);
      }
    };
    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminid');
    navigate('/');
  };

  const handleProfile = () => {
    navigate(`/adminprofile/${profile?.adminUserId}`);
  };

  const handleAddAudit = () => {
    navigate('/auditlogadd');
  };

  const handleViewMyAudits = () => {
    navigate(`/auditlogspecific/${profile?.adminUserId}`);
  };

  const handleHome = () => {
    navigate('/adminmain');
  };

  const handleActAsItParkAdmin = () => {
    navigate('/itparkadminmain');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 p-4 flex items-center justify-between shadow-lg sticky top-0 z-50">
      <div className="text-white ml-12 text-2xl font-bold flex items-center space-x-2">
        {/* <FaCogs className="text-3xl" /> */}
        <img className='w-10 h-10 rounded-full' src='https://logodix.com/logo/444808.jpg'/>
        andha IT Park
      </div>
      <div className="flex text-center hidden md:flex space-x-6">
        <button
          onClick={handleHome}
          className="text-white text-lg font-semibold flex items-center space-x-2 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
        >
          <FaHome />
          <span>Home</span>
        </button>
        <button
          onClick={handleAddAudit}
          className="text-white text-lg font-semibold flex items-center space-x-2 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
        >
          <FaPlus />
          <span>Add Audit</span>
        </button>
        <button
          onClick={handleViewMyAudits}
          className="text-white text-lg font-semibold flex items-center space-x-2 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
        >
          <FaEye />
          <span>View My Audits</span>
        </button>
        <button
          onClick={handleActAsItParkAdmin}
          className="text-white text-lg font-semibold flex items-center space-x-2 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
        >
          <RiAdminFill />
          <span>Act as ItParkAdmin</span>
        </button>
      </div>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={handleDropdownToggle}
          className="w-12 h-12 mr-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-white"
        >
          <img
            src={profile?.profileImageBlob ? `data:image/jpeg;base64,${profile?.profileImageBlob}` : 'https://via.placeholder.com/150'}
            alt="Profile"
            className="rounded-full object-cover w-full h-full"
          />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform scale-95 origin-top-right">
            <button
              onClick={handleProfile}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left flex items-center space-x-2"
            >
              <FaUser />
              <span>Profile</span>
            </button>
            <button
              onClick={handleLogout}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left flex items-center space-x-2"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
