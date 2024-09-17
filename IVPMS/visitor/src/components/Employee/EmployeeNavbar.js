import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHome, FaEnvelope, FaPlus, FaSignOutAlt, FaUser } from 'react-icons/fa';

const EmployeeNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = sessionStorage.getItem('employeeid'); // Retrieve employee ID from sessionStorage
        if (!userId) {
          navigate('/');
          return; // Exit early if no userId
        }
        const response = await axios.get(`http://localhost:6789/employees/${userId}`);
        if (response.status === 200) {
          await axios.patch(`http://localhost:6789/employees/lastlogin/${userId}`);
          setProfile(response.data);
        } else {
          throw new Error('User not found');
        }
      } catch (error) {
        console.error('Error fetching profile', error);
        navigate('/'); // Navigate to home on error
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
    sessionStorage.removeItem('employeeid'); // Clear employee ID from sessionStorage
    navigate('/'); // Navigate to the landing page after logout
  };

  const handleProfile = () => {
    if (profile?.employeeId) {
      navigate(`/employeeprofile/${profile.employeeId}`); // Navigate to the employee profile page
    }
  };

  const handleHome = () => {
    navigate('/employeemain'); // Navigate to the EmployeeMain page
  };

  const handleRequestEmail = () => {
    if (profile?.employeeEmail) {
      const outlookComposeURL = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(profile.employeeEmail)}`;
      window.open(outlookComposeURL);
    } else {
      console.error('Email not found');
    }
  };

  const handleEmail = () => {
    if (profile?.employeeEmail) {
      const outlookInboxURL = `https://outlook.office.com/mail/inbox/${encodeURIComponent(profile.employeeEmail)}`;
      window.open(outlookInboxURL);
    } else {
      console.error('Email not found');
    }
  };

  const handleAddAppointment = () => {
    navigate('/appointmentadd'); // Navigate to the View All Appointments page
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-teal-500 p-4 flex items-center justify-between shadow-md sticky top-0 z-50">
      <div className="text-white ml-12 text-2xl font-bold flex items-center space-x-2">
      <img className='w-10 h-10 rounded-full' src='https://logodix.com/logo/444808.jpg'/>
        andha IT Park
      </div>
      <div className="flex gap-12 text-center mr-60 ml-24">
        <button
          onClick={handleHome}
          className="text-white text-xl font-semibold mx-2 hover:text-yellow-300 transition-colors flex items-center"
        >
          <FaHome className="text-xl" /><span className="text-sm font-bold ml-2">Home</span>
        </button>
        <button
          onClick={handleEmail}
          className="text-white text-xl font-semibold mx-2 hover:text-yellow-300 transition-colors flex items-center"
        >
          <FaEnvelope className="text-xl" /><span className="text-sm font-bold ml-2">Mail</span>
        </button>
        <button
          onClick={handleRequestEmail}
          className="text-white text-xl font-semibold mx-2 hover:text-yellow-300 transition-colors flex items-center"
        >
          <FaPlus className="text-xl" /><span className="text-sm font-bold ml-2">Request Passes</span>
        </button>
        <button
          onClick={handleAddAppointment}
          className="text-white text-xl font-semibold mx-2 hover:text-yellow-300 transition-colors flex items-center"
        >
          <FaPlus className="text-xl" /><span className="text-sm font-bold ml-2">Schedule Appointment</span>
        </button>
      </div>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={handleDropdownToggle}
          className="w-10 h-10 rounded-full bg-gray-700 flex mr-6 items-center justify-center overflow-hidden border-2 border-white transition-transform transform hover:scale-105"
        >
          <img
            src={profile?.profileImageBlob ? `data:image/jpeg;base64,${profile.profileImageBlob}` : 'https://via.placeholder.com/150'}
            alt="Profile"
            className="rounded-full object-cover w-full h-full"
          />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10 transition-transform transform scale-100 origin-top-right">
            <button
              onClick={handleProfile}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left flex items-center space-x-2"
            >
              <FaUser className="text-lg" />
              <span>Profile</span>
            </button>
            <button
              onClick={handleLogout}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left flex items-center space-x-2"
            >
              <FaSignOutAlt className="text-lg" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default EmployeeNavbar;
