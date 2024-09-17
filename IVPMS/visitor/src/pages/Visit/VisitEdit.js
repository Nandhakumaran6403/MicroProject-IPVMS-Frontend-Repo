import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaTag, FaLock } from 'react-icons/fa'; // Importing icons

const VisitEdit = () => {
    const { visitId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fromDateTime: '',
        toDateTime: '',
        type: '',
        blockStatus: ''
    });

    useEffect(() => {
        axios.get(`http://localhost:6789/visits/${visitId}`)
            .then(response => {
                // Assuming response.data.fromDateTime and response.data.toDateTime are in ISO 8601 format
                setFormData(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the visit!', error);
            });
    }, [visitId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:6789/visits/${visitId}`, formData)
            .then(response => {
                alert('Visit updated successfully');
                navigate(`/visitview/${visitId}`);
            })
            .catch(error => {
                console.error('There was an error updating the visit!', error);
            });
    };

    return (
        <div className="bg-gray-200 min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center">
                    <FaTag className="text-blue-500 mr-2" /> Edit Visit
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center border border-gray-300 rounded-md">
                            <FaCalendarAlt className="text-gray-500 ml-4" />
                            <input
                                type="datetime-local"
                                id="fromDateTime"
                                name="fromDateTime"
                                value={formData.fromDateTime}
                                onChange={handleChange}
                                className="w-full p-3 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="From DateTime"
                            />
                        </div>
                        <div className="flex items-center border border-gray-300 rounded-md">
                            <FaCalendarAlt className="text-gray-500 ml-4" />
                            <input
                                type="datetime-local"
                                id="toDateTime"
                                name="toDateTime"
                                value={formData.toDateTime}
                                onChange={handleChange}
                                className="w-full p-3 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="To DateTime"
                            />
                        </div>
                        <div className="flex items-center border border-gray-300 rounded-md">
                            <FaTag className="text-gray-500 ml-4" />
                            <input
                                type="text"
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full p-3 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Type"
                            />
                        </div>
                        <div className="flex items-center border border-gray-300 rounded-md">
                            <FaLock className="text-gray-500 ml-4" />
                            <input
                                type="text"
                                id="blockStatus"
                                name="blockStatus"
                                value={formData.blockStatus}
                                onChange={handleChange}
                                className="w-full p-3 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Block Status"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 ease-in-out"
                    >
                        Update Visit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VisitEdit;
