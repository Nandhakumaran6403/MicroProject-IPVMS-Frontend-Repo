import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';

const CompanyViewAll = () => {
    const [companies, setCompanies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:6789/companies/${id}`);
            setCompanies(companies.filter(company => company.companyId !== id));
        } catch (error) {
            console.error('Error deleting company:', error);
        }
    };

    const filteredCompanies = companies.filter(company =>
        company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-12 bg-gray-100 min-h-screen ">
            <div className="flex justify-between items-center mb-6 ">
                <h1 className="text-3xl font-bold text-gray-800">All Companies</h1>
                <input
                    type="text"
                    placeholder="Search by company name..."
                    className="p-2 border mr-12 border-gray-300 rounded-md shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-12">
                {filteredCompanies.map(company => (
                    <motion.div
                        key={company.companyId}
                        className="bg-white p-6 border border-gray-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out"
                        whileHover={{ scale: 1.03 }}
                    >
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">{company.companyName}</h2>
                        <p className="text-gray-600"><strong>Floor Number:</strong> {company.companyFloorNo}</p>
                        <p className="text-gray-600"><strong>Founder:</strong> {company.companyFounder}</p>
                        <p className="text-gray-600"><strong>Start Date:</strong> {company.companyStartDate}</p>
                        <div className="mt-4 flex justify-between items-center">
                            <Link
                                to={`/companyview/${company.companyId}`}
                                className="flex items-center text-blue-500 hover:text-blue-600 transition-colors duration-300"
                            >
                                <FaEye className="mr-2" />
                                View
                            </Link>
                            <Link
                                to={`/companyedit/${company.companyId}`}
                                className="flex items-center text-yellow-500 hover:text-yellow-600 transition-colors duration-300"
                            >
                                <FaEdit className="mr-2" />
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(company.companyId)}
                                className="flex items-center text-red-500 hover:text-red-600 transition-colors duration-300"
                            >
                                <FaTrash className="mr-2" />
                                Delete
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default CompanyViewAll;
