import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBuilding, FaUser, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';
import { MdFormatListNumbered } from 'react-icons/md';

const CompanyEdit = () => {
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const navigate = useNavigate();

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await axios.get(`http://localhost:6789/companies/${id}`);
                setCompany(response.data);
            } catch (error) {
                console.error('Error fetching company:', error);
            }
        };
        fetchCompany();
    }, [id]);

    const handleChange = (e) => {
        setCompany({ ...company, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:6789/companies/${id}`, company);
            navigate(`/companyview/${id}`);
        } catch (error) {
            console.error('Error updating company:', error);
        }
    };

    const handleBack = () => {
        navigate('/companyviewall');
    };

    if (!company) return <p className="text-center text-gray-600">Loading...</p>;

    return (
        <div className="max-w-lg mx-auto p-6 mt-24 bg-white shadow-lg rounded-lg border border-gray-200 relative">
            <h1 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">Edit Company</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                    <input
                        type="text"
                        name="companyName"
                        value={company.companyName}
                        onChange={handleChange}
                        placeholder="Company Name"
                        className="w-full p-3 pl-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        required
                    />
                    <FaBuilding className="absolute left-3 top-3 text-gray-500" />
                </div>
                <div className="relative">
                    <input
                        type="number"
                        name="companyFloorNo"
                        value={company.companyFloorNo}
                        onChange={handleChange}
                        placeholder="Company Floor Number"
                        className="w-full p-3 pl-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    />
                    <MdFormatListNumbered className="absolute left-3 top-3 text-gray-500" />
                </div>
                <div className="relative">
                    <input
                        type="text"
                        name="companyFounder"
                        value={company.companyFounder}
                        onChange={handleChange}
                        placeholder="Company Founder"
                        className="w-full p-3 pl-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    />
                    <FaUser className="absolute left-3 top-3 text-gray-500" />
                </div>
                <div className="relative">
                    <input
                        type="date"
                        name="companyStartDate"
                        value={company.companyStartDate}
                        onChange={handleChange}
                        max={today}
                        className="w-full p-3 pl-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    />
                    <FaCalendarAlt className="absolute left-3 top-3 text-gray-500" />
                </div>
                <div className='flex justify-end'>
                <button 
                    type="submit" 
                    className="w-60 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95"
                >
                    Update Company
                </button></div>
                <button 
                onClick={handleBack} 
                className="absolute bottom-6  left-6 py-3 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-transform transform hover:scale-105 active:scale-95 flex items-center"
            >
                <FaArrowLeft className="mr-2" /> Back
            </button>
            </form>
           
        </div>
    );
};

export default CompanyEdit;
