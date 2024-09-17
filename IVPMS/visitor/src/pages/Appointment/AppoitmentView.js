import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaEnvelope, FaPhoneAlt, FaBuilding, FaEdit, FaArrowLeft } from 'react-icons/fa';

const AppointmentView = () => {
    const [appointment, setAppointment] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const response = await axios.get(`http://localhost:6789/appointments/${id}`);
                setAppointment(response.data);
            } catch (error) {
                console.error('Error fetching appointment', error);
            }
        };

        fetchAppointment();
    }, [id]);

    

    const handleBack = () => {
        navigate('/appointmentviewall');
    };

    if (!appointment) return <div className="text-center text-lg font-semibold">Loading...</div>;

    return (
        <div className="container mx-auto p-4 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6 text-teal-700">View Appointment</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-15">
                <div className="flex items-center mb-4">
                    <FaCalendarAlt className="text-teal-600 mr-3" />
                    <p className="text-lg font-semibold">Reason:</p>
                    <p className="text-lg font-semibold">{appointment.appointmentDateTime}</p>
                </div>
                <div className="flex items-center mb-4">
                    <FaUser className="text-teal-600 mr-3" />
                    <p className="text-lg font-semibold">Reason:</p>
                    <p className="text-lg font-semibold">Employee Name: {appointment.employee.employeeName}</p>
                </div>
                <div className="flex items-center mb-4">
                    <FaEnvelope className="text-teal-600 mr-3" />
                    <p className="text-lg font-semibold">Employee Email:</p>
                    <p className="text-lg"> {appointment.employee.employeeEmail}</p>
                </div>
                <div className="flex items-center mb-4">
                    <FaBuilding className="text-teal-600 mr-3" />
                    <p className="text-lg font-semibold">CompanyName:</p>
                    <p className="text-lg"> {appointment.employee.company.companyName}</p>
                </div>
                <div className="flex items-center mb-4">
                    <FaUser className="text-teal-600 mr-3" />
                    <p className="text-lg font-semibold">Visitor Name:</p>
                    <p className="text-lg font-semibold"> {appointment.visitorName}</p>
                </div>
                <div className="flex items-center mb-4">
                    <FaEnvelope className="text-teal-600 mr-3" />
                    <p className="text-lg font-semibold">Visitor Email:</p>
                    <p className="text-lg"> {appointment.visitorEmail}</p>
                </div>
                <div className="flex items-center mb-4">
                    <FaPhoneAlt className="text-teal-600 mr-3" />
                    <p className="text-lg font-semibold">Visitor Phone:</p>
                    <p className="text-lg"> {appointment.visitorPhone}</p>
                </div>
                <div className="flex items-center mb-4">
                    <p className="text-lg font-semibold">Reason:</p>
                    <p className="text-lg ml-2">{appointment.reason}</p>
                </div>
               
                {/* <div className="mt-6 flex space-x-4">
                   
                    <button 
                        onClick={handleBack} 
                        className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-600 transition duration-300 ease-in-out"
                    >
                        <FaArrowLeft className="inline mr-2" />
                        Back
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default AppointmentView;
