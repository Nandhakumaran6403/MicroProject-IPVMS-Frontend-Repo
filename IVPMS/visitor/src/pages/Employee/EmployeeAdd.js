import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiOutlineMail, AiOutlinePhone, AiOutlineHome, AiOutlineCalendar, AiOutlineUpload } from 'react-icons/ai';
import { FaCity, FaUser, FaKey, FaMapMarkerAlt } from 'react-icons/fa';
import { BiBuildings } from 'react-icons/bi';
import { RiEdit2Line } from 'react-icons/ri';

const EmployeeAdd = () => {
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
  const [dobError, setDobError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:6789/companies');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImageBlob' && files) {
      const file = files[0];
      setFormData(prevState => ({
        ...prevState,
        [name]: file
      }));

      const fileUrl = URL.createObjectURL(file);
      setImagePreview(fileUrl);
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: files ? files[0] : value
      }));
    }

    if (name === 'dob') {
      validateDob(value);
    }
  };

  const validateDob = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      setDobError('Select a valid date of birth. You must be at least 18 years old.');
    } else {
      setDobError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (dobError) {
      return;
    }

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      }
    }

    try {
      await axios.post('http://localhost:6789/employees', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/employeeviewall');
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const calculateMaxDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="max-w-4xl mx-auto  mt-10 p-8 px-24 rounded-lg  transition-transform transform hover:scale-10 duration-300">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center">
        <RiEdit2Line className="text-blue-500 mr-2" /> Add Employee
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5 px-24">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium flex items-center">
            <BiBuildings className="text-blue-500 mr-2" /> Company
          </label>
          <select
            name="companyId"
            onChange={handleChange}
            value={formData.companyId}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-gray-700 text-sm font-medium flex items-center">
            <FaUser className="text-blue-500 mr-2" /> Employee Name
          </label>
          <input
            type="text"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium flex items-center">
            <FaUser className="text-blue-500 mr-2" /> Position
          </label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium flex items-center">
            <AiOutlineCalendar className="text-blue-500 mr-2" /> Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            max={calculateMaxDate()}
          />
          {dobError && <p className="text-red-500 text-sm mt-1">{dobError}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium flex items-center">
            <AiOutlineMail className="text-blue-500 mr-2" /> Email
          </label>
          <input
            type="email"
            name="employeeEmail"
            value={formData.employeeEmail}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium flex items-center">
            <AiOutlinePhone className="text-blue-500 mr-2" /> Phone
          </label>
          <input
            type="text"
            name="employeePhone"
            value={formData.employeePhone}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium flex items-center">
            <AiOutlineHome className="text-blue-500 mr-2" /> Address
          </label>
          <input
            type="text"
            name="employeeAddress"
            value={formData.employeeAddress}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium flex items-center">
            <FaCity className="text-blue-500 mr-2" /> City
          </label>
          <input
            type="text"
            name="employeeCity"
            value={formData.employeeCity}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium flex items-center">
            <FaMapMarkerAlt className="text-blue-500 mr-2" /> State
          </label>
          <input
            type="text"
            name="employeeState"
            value={formData.employeeState}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium flex items-center">
            <FaKey className="text-blue-500 mr-2" /> Password
          </label>
          <input
            type="password"
            name="employeePassword"
            value={formData.employeePassword}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium flex items-center">
            <RiEdit2Line className="text-blue-500 mr-2" /> Availability
          </label>
          <input
            type="text"
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium flex items-center">
            <RiEdit2Line className="text-blue-500 mr-2" /> Role
          </label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4 flex items-center px-2">
          <label className="block text-gray-700 text-sm font-medium flex items-center">
            <AiOutlineUpload className="text-blue-500 mr-2" /> <span className='pr-4'>ProfileImage</span>
          </label>
          <input
            type="file"
            accept='image/*'
            name="profileImageBlob"
            onChange={handleChange}
            className="w-full mt-1 mb-2 text-sm text-gray-700"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Selected"
                className="w-32 h-32 mr-32 object-cover rounded-lg border border-gray-200 shadow-md"
              />
            </div>
          )}
        </div>
        <div className='flex justify-end'>
        <button
          type="submit"
          className={`bg-blue-600 text-white p-3 rounded-md shadow-md transition-transform transform hover:scale-105 duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${dobError ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          disabled={!!dobError}
        >
          Add Employee
        </button></div>
      </form>
    </div>
  );
};

export default EmployeeAdd;
