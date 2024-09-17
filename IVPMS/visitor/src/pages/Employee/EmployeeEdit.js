// src/pages/EmployeeEdit.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EmployeeEdit = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    companyId: '',
    employeeName: '',
    position: '',
    dob: '',
    employeeEmail: '',
    employeePhone: '',
    employeeAddress: '',
    employeeCity: '',
    employeeState: '',
    employeePassword: '',
    availability: '',
    role: '',
    profileImageBlob: null
  });
  const [companies, setCompanies] = useState([]);
  const [currentImage, setCurrentImage] = useState(null); // State for current profile image
  const [imagePreview, setImagePreview] = useState(null); // State for new image preview
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:6789/employees/${id}`);
        setFormData(response.data);
        setCurrentImage(response.data.profileImageBlob);
        // if (response.data.profileImageBlob) {
        //   setCurrentImage(`http://localhost:6789/images/${response.data.profileImageBlob}`);
        // }
      } catch (error) {
        console.error('Error fetching employee:', error);
      }
    };

    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:6789/companies');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchEmployee();
    fetchCompanies();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImageBlob' && files) {
      const file = files[0];
      setFormData(prevState => ({
        ...prevState,
        [name]: file
      }));
      // Create a preview URL for the selected image
      const fileUrl = URL.createObjectURL(file);
      setImagePreview(fileUrl);
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: files ? files[0] : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        formDataToSend.append(key, value);
      }
    });

    try {
      await axios.put(`http://localhost:6789/employees/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/employeeviewall');
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const calculateMaxDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="max-w-md mx-auto bg-white mt-20 p-6 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Edit Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label className="block text-gray-700">Company</label>
          <select
            name="companyId"
            onChange={handleChange}
            value={formData.companyId}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select Company</option>
            {companies.map(company => (
              <option key={company.companyId} value={company.companyId}>
                {company.companyName}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Employee Name</label>
          <input
            type="text"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Position</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
            max={calculateMaxDate()}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="employeeEmail"
            value={formData.employeeEmail}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone</label>
          <input
            type="text"
            name="employeePhone"
            value={formData.employeePhone}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            name="employeeAddress"
            value={formData.employeeAddress}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">City</label>
          <input
            type="text"
            name="employeeCity"
            value={formData.employeeCity}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">State</label>
          <input
            type="text"
            name="employeeState"
            value={formData.employeeState}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="employeePassword"
            value={formData.employeePassword}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Availability</label>
          <input
            type="text"
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Role</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Profile Image</label>
          <div className='flex mr-6 '>
          <input
            type="file"
            name="profileImageBlob"
            onChange={handleChange}
            className="w-full mt-6"
          />
          {currentImage && !imagePreview && (
            <div className="mt-2">
              <img
                      src={`data:image/jpeg;base64,${currentImage}`}
                      alt="Profile"
                      className="w-40 h-32 object-cover rounded-lg"
                    />
              
            </div>
          )}
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Selected"
                className="w-40 h-32 object-cover rounded-lg"
              />
            </div>
          )}</div>
        </div>
        <div className='flex justify-end'>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Update Employee
        </button></div>
      </form>
    </div>
  );
};

export default EmployeeEdit;
