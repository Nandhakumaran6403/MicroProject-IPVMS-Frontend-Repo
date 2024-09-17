import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiUser, FiCalendar, FiPlusCircle } from 'react-icons/fi';

const CompanyAdd = () => {
    const [company, setCompany] = useState({
        companyName: '',
        companyFloorNo: '',
        companyFounder: '',
        companyStartDate: '',
    });
    const navigate = useNavigate();

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    const handleChange = (e) => {
        setCompany({ ...company, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:6789/companies', company);
            navigate('/companyviewall');
        } catch (error) {
            console.error('Error adding company:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 rounded-lg shadow-lg mt-10">
            <h1 className="text-3xl font-bold text-white mb-6 flex items-center">
                <FiPlusCircle className="mr-3 text-4xl" />
                Add New Company
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                    <FiHome className="absolute top-3 left-3 text-gray-500" />
                    <input
                        type="text"
                        name="companyName"
                        value={company.companyName}
                        onChange={handleChange}
                        placeholder="Company Name"
                        className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition-transform duration-300 transform hover:scale-105"
                        required
                    />
                </div>
                <div className="relative">
                    <FiHome className="absolute top-3 left-3 text-gray-500" />
                    <input
                        type="number"
                        name="companyFloorNo"
                        value={company.companyFloorNo}
                        onChange={handleChange}
                        placeholder="Company Floor Number"
                        className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition-transform duration-300 transform hover:scale-105"
                    />
                </div>
                <div className="relative">
                    <FiUser className="absolute top-3 left-3 text-gray-500" />
                    <input
                        type="text"
                        name="companyFounder"
                        value={company.companyFounder}
                        onChange={handleChange}
                        placeholder="Company Founder"
                        className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition-transform duration-300 transform hover:scale-105"
                    />
                </div>
                <div className="relative">
                    <FiCalendar className="absolute top-3 left-3 text-gray-500" />
                    <input
                        type="date"
                        name="companyStartDate"
                        value={company.companyStartDate}
                        onChange={handleChange}
                        max={today}
                        className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition-transform duration-300 transform hover:scale-105"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
                >
                    <span className="flex items-center justify-center">
                        <FiPlusCircle className="mr-2" />
                        Add Company
                    </span>
                </button>
            </form>
        </div>
    );
};

export default CompanyAdd;
