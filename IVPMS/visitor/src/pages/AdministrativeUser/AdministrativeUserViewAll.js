import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUserPlus, FaEye, FaEdit, FaTrash, FaUser } from 'react-icons/fa';

const AdministrativeUserViewAll = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:6789/admin-users/all');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:6789/admin-users/${id}`);
      setUsers(users.filter(user => user.adminUserId !== id));
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const handleAddUser = () => {
    navigate('/adminuseradd');
  };

  const filteredUsers = users.filter(user =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg ">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleAddUser}
          className="bg-green-600 text-white p-3 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition duration-300"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <FaUserPlus className="text-xl" />
          <span>Add User</span>
        </button>
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            style={{ paddingRight: '2.5rem' }}
          />
          <FaSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">All Administrative Users</h2>
      <table className="w-full border-collapse  ">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="border border-gray-300 p-3">Image</th>
            <th className="border border-gray-300 p-3">User Name</th>
            <th className="border border-gray-300 p-3">Email</th>
            <th className="border border-gray-300 p-3">Role</th>
            <th className="border border-gray-300 p-3">Last Login Date</th>
            <th className="border border-gray-300 p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.adminUserId} className="hover:bg-gray-50 transition duration-300">
              <td className="border border-gray-300 p-3 text-center">
                {user.profileImageBlob ? (
                  <img
                    src={`data:image/jpeg;base64,${user.profileImageBlob}`}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover mx-auto"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <FaUser className="text-gray-500 text-xl" />
                  </div>
                )}
              </td>
              <td className="border border-gray-300 p-3">{user.userName}</td>
              <td className="border border-gray-300 p-3">{user.email}</td>
              <td className="border border-gray-300 p-3">{user.role}</td>
              <td className="border border-gray-300 p-3">{user.lastLoginDate}</td>
              <td className="border border-gray-300 p-3 text-center">
                <div className="flex justify-center space-x-2">
                  <Link
                    to={`/adminuserview/${user.adminUserId}`}
                    className="bg-blue-500 text-white p-2 rounded-lg flex items-center space-x-1 hover:bg-blue-600 transition duration-300"
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <FaEye className="text-xl" />
                    <span className="hidden md:inline">View</span>
                  </Link>
                  <Link
                    to={`/adminuseredit/${user.adminUserId}`}
                    className="bg-yellow-500 text-white p-2 rounded-lg flex items-center space-x-1 hover:bg-yellow-600 transition duration-300"
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <FaEdit className="text-xl" />
                    <span className="hidden md:inline">Edit</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(user.adminUserId)}
                    className="bg-red-500 text-white p-2 rounded-lg flex items-center space-x-1 hover:bg-red-600 transition duration-300"
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <FaTrash className="text-xl" />
                    <span className="hidden md:inline">Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdministrativeUserViewAll;
