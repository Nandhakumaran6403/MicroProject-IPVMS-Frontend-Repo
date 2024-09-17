// src/pages/VisitorRequestView.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faCalendar, faFileImage, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const VisitorRequestView = () => {
    const [visitorRequest, setVisitorRequest] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVisitorRequest = async () => {
            try {
                const response = await axios.get(`http://localhost:6789/visitorrequests/${id}`);
                setVisitorRequest(response.data);
            } catch (error) {
                console.error('Error fetching visitor request:', error);
            }
        };

        fetchVisitorRequest();
    }, [id]);

    const handleBack = () => {
        navigate('/visitorrequestviewall');
    };

    if (!visitorRequest) return <p className="text-center mt-4">Loading...</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-extrabold mb-6 text-blue-600">Visitor Request Details</h1>
            
            {/* Image Section */}
            {visitorRequest.visitorImageBlob && (
                <div className="mb-6 flex justify-center">
                    <img
                        src={`data:image/jpeg;base64,${visitorRequest.visitorImageBlob}`}
                        alt="Visitor"
                        className="w-80 h-auto   rounded-lg shadow-md transition-transform transform hover:scale-105"
                    />
                </div>
            )}
            
            {/* Details Section */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faUser} className="text-blue-500" />
                    <p><strong>Employee Name:</strong> {visitorRequest.employee.employeeName}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faEnvelope} className="text-blue-500" />
                    <p><strong>Employee Email:</strong> {visitorRequest.employee.employeeEmail}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faUser} className="text-green-500" />
                    <p><strong>Visitor Name:</strong> {visitorRequest.visitorName}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faEnvelope} className="text-green-500" />
                    <p><strong>Visitor Email:</strong> {visitorRequest.visitorEmail}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faPhone} className="text-green-500" />
                    <p><strong>Visitor Phone:</strong> {visitorRequest.visitorPhone}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faCalendar} className="text-yellow-500" />
                    <p><strong>Status:</strong> {visitorRequest.status}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faFileImage} className="text-yellow-500" />
                    <p><strong>Reason:</strong> {visitorRequest.reason}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faCalendar} className="text-gray-500" />
                    <p><strong>Visitor Request DateTime:</strong> {new Date(visitorRequest.visitorRequestDateTime).toLocaleString()}</p>
                </div>
            </div>

            {/* Back Button */}
            {/* <div className="flex justify-center mt-8">
                <button
                    onClick={handleBack}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Back
                </button>
            </div> */}
        </div>
    );
};

export default VisitorRequestView;
