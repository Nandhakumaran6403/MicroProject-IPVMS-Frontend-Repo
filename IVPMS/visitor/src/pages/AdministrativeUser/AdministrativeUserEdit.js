import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { AiFillCamera } from 'react-icons/ai';

const AdministrativeUserEdit = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [lastLoginDate, setLastLoginDate] = useState('');
  const [profileImageBlob, setProfileImageBlob] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:6789/admin-users/${id}`);
        setUser(response.data);
        setUserName(response.data.userName);
        setEmail(response.data.email);
        setPassword(response.data.password);
        setRole(response.data.role);
        setLastLoginDate(response.data.lastLoginDate);
        if (response.data.profileImageBlob) {
          setImagePreview(`data:image/jpeg;base64,${response.data.profileImageBlob}`);
        }
      } catch (error) {
        console.error('Error fetching user', error);
      }
    };
    fetchUser();
  }, [id]);

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
      await axios.put(`http://localhost:6789/admin-users/${id}`, formData);
      if (user) {
        switch (user.role) {
          case 'admin':
            navigate('/adminmain');
            break;
          case 'itparkadmin':
            navigate('/itparkadminmain');
            break;
          case 'receptionist':
            navigate('/receptionistmain');
            break;
          case 'receptionistoffice':
            navigate('/receptionistofficemain');
            break;
          case 'receptionistroam':
            navigate('/receptionistroammain');
            break;
          default:
            navigate('/');
        }
      }
    } catch (error) {
      console.error('Error updating administrative user', error);
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

  const handleBack = () => {
    if (user) {
      switch (user.role) {
        case 'admin':
          navigate('/adminmain');
          break;
        case 'itparkadmin':
          navigate('/itparkadminmain');
          break;
        case 'receptionist':
          navigate('/receptionistmain');
          break;
        case 'receptionistoffice':
          navigate('/receptionistofficemain');
          break;
        case 'receptionistroam':
          navigate('/receptionistroammain');
          break;
        default:
          navigate('/');
      }
    }
  };

  if (!user) return <div className="text-center mt-4">Loading...</div>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-lg mt-12 relative">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 text-blue-500 hover:text-blue-700 transition-colors duration-300"
      >
        <FaArrowLeft size={24} />
      </button>
      
      <form onSubmit={handleSubmit}>
        {/* Display Profile Image with Tooltip */}
        <div className="mb-6 flex justify-center relative">
          {/* <div className="relative">
            <img
              src={imagePreview || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover cursor-pointer border-2 border-gray-300 shadow-md"
              onClick={() => document.getElementById('profileImageInput').click()}
            />
            <input
              type="file"
              id="profileImageInput"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gray-800 bg-opacity-75 text-white text-xs">
              <AiFillCamera size={20} />
              <span className="ml-2">Choose Image</span>
            </div>
          </div> */}
          <div className="relative">
             <img
              src={imagePreview || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover cursor-pointer"
              onClick={() => document.getElementById('profileImageInput').click()} // Trigger file input click
            />
            <input
              type="file"
              id="profileImageInput"
              onChange={handleImageChange}
              
              className="absolute inset-0 opacity-0 cursor-pointer" // Hide the file input
            />
            <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gray-800 bg-opacity-75 text-white text-xs"  onClick={() => document.getElementById('profileImageInput').click()}>
            <AiFillCamera size={20} />Choose Image
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">User Name</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            readOnly={user.role !== 'admin'}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Role</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            readOnly={user.role !== 'admin'}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Last Login Date</label>
          <input
            type="text"
            value={lastLoginDate}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            readOnly
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
        >
          Update User
        </button>
      </form>
    </div>
  );
};

export default AdministrativeUserEdit;
