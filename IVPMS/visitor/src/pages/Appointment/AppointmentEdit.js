import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa'; // Importing an icon for the back button
import { HiOutlineCalendar } from 'react-icons/hi'; // Importing an icon for the date picker

const AppointmentEdit = () => {
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

    const handleChange = (e) => {
        setAppointment({ ...appointment, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:6789/appointments/${id}`, appointment);
            navigate(`/appointmentviewall`);
        } catch (error) {
            console.error('Error updating appointment', error);
        }
    };

    const handleBack = () => {
        navigate(-1); // Navigate back to the previous page
    };

    if (!appointment) return <div>Loading...</div>;

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="container mx-auto p-6 max-w-xl mt-6 bg-white shadow-md rounded-lg">
            <button
                onClick={handleBack}
                className="flex items-center text-blue-500 hover:text-blue-700 mb-4"
            >
                <FaArrowLeft className="mr-2" />
                Back
            </button>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Appointment</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center border-b border-gray-300 pb-2">
                    <HiOutlineCalendar className="text-gray-500 mr-3" />
                    <label className="block text-gray-700 w-full">Date and Time</label>
                    <input
                        type="datetime-local"
                        name="appointmentDateTime"
                        value={appointment.appointmentDateTime}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        min={today}
                        required
                    />
                </div>
                <div className="border-b border-gray-300 pb-2">
                    <label className="block text-gray-700">Visitor Name</label>
                    <input
                        type="text"
                        name="visitorName"
                        value={appointment.visitorName}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        required
                    />
                </div>
                <div className="border-b border-gray-300 pb-2">
                    <label className="block text-gray-700">Visitor Email</label>
                    <input
                        type="email"
                        name="visitorEmail"
                        value={appointment.visitorEmail}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        required
                    />
                </div>
                <div className="border-b border-gray-300 pb-2">
                    <label className="block text-gray-700">Visitor Phone</label>
                    <input
                        type="tel"
                        name="visitorPhone"
                        value={appointment.visitorPhone}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        required
                    />
                </div>
                <div className="border-b border-gray-300 pb-2">
                    <label className="block text-gray-700">Reason</label>
                    <input
                        type="text"
                        name="reason"
                        value={appointment.reason}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Update Appointment
                </button>
            </form>
        </div>
    );
};

export default AppointmentEdit;
