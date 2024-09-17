import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

const CompanyView = () => {
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const navigate = useNavigate();

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

    const handleEdit = () => {
        navigate(`/companyedit/${id}`);
    };

    const handleBack = () => {
        navigate('/companyviewall');
    };

    if (!company) return <p className="text-center text-gray-500">Loading...</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-8 lg:p-12">
            <motion.div 
                className="bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg shadow-lg overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="p-6">
                    <h1 className="text-3xl font-extrabold mb-4">Company Details</h1>
                    <div className="space-y-4">
                        <p className="text-lg">
                            <strong className="font-semibold">Company Name:</strong> {company.companyName}
                        </p>
                        <p className="text-lg">
                            <strong className="font-semibold">Floor Number:</strong> {company.companyFloorNo}
                        </p>
                        <p className="text-lg">
                            <strong className="font-semibold">Founder:</strong> {company.companyFounder}
                        </p>
                        <p className="text-lg">
                            <strong className="font-semibold">Start Date:</strong> {company.companyStartDate}
                        </p>
                    </div>
                    <div className="mt-6 flex justify-between items-center">
                        <motion.button 
                            onClick={handleEdit} 
                            className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition-colors duration-300"
                            whileHover={{ scale: 1.05 }}
                        >
                            <FaEdit className="mr-2" />
                            Edit
                        </motion.button>
                        <motion.button 
                            onClick={handleBack} 
                            className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 transition-colors duration-300"
                            whileHover={{ scale: 1.05 }}
                        >
                            <FaArrowLeft className="mr-2" />
                            Back
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CompanyView;
