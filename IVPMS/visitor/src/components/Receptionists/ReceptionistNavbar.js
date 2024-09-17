import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHome, FaCalendarAlt, FaIdBadge, FaQrcode, FaDoorOpen, FaSitemap, FaUser } from 'react-icons/fa'; // Importing icons

const ReceptionistNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null); // Added role state
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = sessionStorage.getItem('adminid'); // Retrieve receptionist ID from sessionStorage
        if (userId === null) {
          navigate('/');
          return;
        }
        const response = await axios.get(`http://localhost:6789/admin-users/${userId}`);
        if (response.status === 200) {
          await axios.patch(`http://localhost:6789/admin-users/lastlogin/${userId}`);
          setProfile(response.data);
          setRole(response.data.role); // Set role from profile data
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
    sessionStorage.removeItem('adminid'); // Clear receptionist ID from sessionStorage
    navigate('/'); // Navigate to the landing page after logout
  };

  const handleProfile = () => {
    navigate(`/receptionistprofile/${profile?.adminUserId}`); // Navigate to the receptionist profile page
  };

  const handleHome = () => {
    switch (role) {
      case 'receptionist':
        navigate('/receptionistmain');
        break;
      case 'receptionistoffice':
        navigate('/receptionistofficemain');
        break;
      case 'receptionistroam':
        navigate('/receptionistroammain');
        break;
      case 'itparkadmin':
        navigate('/itparkadminmain');
        break;
      case 'admin':
          navigate('/adminmain');
          break;
      default:
        navigate('/');
        break;
    }
  };

  

  const handleEntryScan = () => {
    navigate('/qrcodescannerentry'); // Navigate to the Appointments page
  };

  const handleAppointments = () => {
    navigate('/appointmentviewtoday'); // Navigate to the Appointments page
  };

  const handleRegisterForPass = () => {
    navigate('/visitorrequestadd'); // Navigate to the Register For Pass page
  };

  const handleOfficeScan = () => {
    navigate('/qrcodescanneroffice'); // Navigate to the QR Code Scanner Office page
  };

  const handleRoamScan = () => {
    navigate('/qrcodescannerroam'); // Navigate to the QR Code Scanner Roam page
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-500 p-4 flex items-center justify-between shadow-lg sticky top-0 z-50">
      <div className="text-white font-bold ml-12 text-2xl font-bold flex items-center space-x-24 ">
      <img className='w-10 h-10 rounded-full' src='https://logodix.com/logo/444808.jpg'/>
        andha IT Park
      </div>
      <div className="flex-1 text-center flex flex-wrap mr-60 justify-center gap-4">
        <button
          onClick={handleHome}
          className="text-white text-md font-semibold flex items-center gap-2 hover:bg-blue-800 transition-colors duration-300 px-4 py-2 rounded-md"
        >
          <FaHome /> Home
        </button>
     
        {role === 'receptionist' && (
          <>
          <button
          onClick={handleAppointments}
          className="text-white text-md font-semibold flex items-center gap-2 hover:bg-blue-800 transition-colors duration-300 px-4 py-2 rounded-md"
        >
          <FaCalendarAlt /> Appointments
        </button>
            <button
              onClick={handleRegisterForPass}
              className="text-white text-md font-semibold flex items-center gap-2 hover:bg-blue-800 transition-colors duration-300 px-4 py-2 rounded-md"
            >
              <FaIdBadge /> Register For Pass
            </button>
           
            
        <button
              onClick={handleEntryScan}
              className="text-white text-md font-semibold flex items-center gap-2 hover:bg-blue-800 transition-colors duration-300 px-4 py-2 rounded-md"
            >
              <FaQrcode /> Scan
            </button>
          </>
        )}
        {role === 'receptionistoffice' && (
          <>
          
           <button
           onClick={handleAppointments}
           className="text-white text-md font-semibold flex items-center gap-2 hover:bg-blue-800 transition-colors duration-300 px-4 py-2 rounded-md"
         >
           <FaCalendarAlt /> Appointments
         </button>
         <button
            onClick={handleOfficeScan}
            className="text-white text-md font-semibold flex items-center gap-2 hover:bg-blue-800 transition-colors duration-300 px-4 py-2 rounded-md"
          >
            <FaSitemap /> Office Scan
          </button>
         </>
        )}
        {role === 'receptionistroam' && (
          <button
            onClick={handleRoamScan}
            className="text-white text-md font-semibold flex items-center gap-2 hover:bg-blue-800 transition-colors duration-300 px-4 py-2 rounded-md"
          >
            <FaDoorOpen /> Roam Scan
          </button>
        )}
      </div>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={handleDropdownToggle}
          className="w-10 h-10 rounded-full bg-gray-600 mr-6 flex items-center justify-center overflow-hidden border-2 border-white transition-transform transform hover:scale-105"
        >
          <img
            src={profile?.profileImageBlob ? `data:image/jpeg;base64,${profile?.profileImageBlob}` : 'https://via.placeholder.com/150'}
            alt="Profile"
            className="rounded-full object-cover w-full h-full"
          />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 animate__animated animate__fadeIn">
            <button
              onClick={handleProfile}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left transition-colors duration-200"
            >
              <FaUser className="inline mr-2" /> Profile
            </button>
            <button
              onClick={handleLogout}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left transition-colors duration-200"
            >
              <FaUser className="inline mr-2" /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ReceptionistNavbar;
