import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaRegListAlt, FaArrowLeft } from 'react-icons/fa';
import classNames from 'classnames';

const AppointmentAdd = () => {
    const [appointment, setAppointment] = useState({
        appointmentDateTime: '',
        visitorName: '',
        visitorEmail: '',
        visitorPhone: '',
        reason: '',
        employee: { employeeId: '' }
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [minDateTime, setMinDateTime] = useState('');

    useEffect(() => {
        // Set the minimum date and time to the current date and time
        const now = new Date();
        const minDateTime = now.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
        setMinDateTime(minDateTime);

        // Set employee ID if it exists
        const employeeId = sessionStorage.getItem('employeeid');
        if (employeeId) {
            setAppointment(prevState => ({
                ...prevState,
                employee: { employeeId }
            }));
        }
    }, []);

    const handleChange = (e) => {
        setAppointment({ ...appointment, [e.target.name]: e.target.value });
    };

    const validate = () => {
        let tempErrors = {};
        if (!appointment.appointmentDateTime) tempErrors.appointmentDateTime = 'Date and Time is required.';
        if (!appointment.visitorName) tempErrors.visitorName = 'Name is required.';
        if (!appointment.visitorEmail || !/\S+@\S+\.\S+/.test(appointment.visitorEmail)) tempErrors.visitorEmail = 'Valid email is required.';
        if (!appointment.visitorPhone || !/^\d{10}$/.test(appointment.visitorPhone)) tempErrors.visitorPhone = 'Valid phone number is required.';
        if (!appointment.reason) tempErrors.reason = 'Reason is required.';
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                await axios.post('http://localhost:6789/appointments', appointment);
                await axios.post('http://localhost:6789/appointmenttwilio', appointment);
                navigate('/employeemain');
            } catch (error) {
                console.error('Error creating appointment', error);
            }
        }
    };

    return (
        <div className="container mx-auto p-12  px-60">
            <div className="flex items-center mb-4">
                <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-800 transition-colors">
                    <FaArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-3xl font-extrabold text-gray-900 ml-4">Add Appointment</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md rounded-lg p-6 px-24">
                <div className="relative">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Appointment Date and Time</label>
                    <input
                        type="datetime-local"
                        name="appointmentDateTime"
                        value={appointment.appointmentDateTime}
                        onChange={handleChange}
                        min={minDateTime}
                        className={classNames(
                            "block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500",
                            { 'border-red-500': errors.appointmentDateTime }
                        )}
                    />
                    {errors.appointmentDateTime && <p className="text-red-500 text-xs mt-1">{errors.appointmentDateTime}</p>}
                </div>

                <div className="relative">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Visitor Name</label>
                    <div className="flex items-center border rounded-md shadow-sm">
                        <FaUser className="ml-3 text-gray-500" />
                        <input
                            type="text"
                            name="visitorName"
                            value={appointment.visitorName}
                            onChange={handleChange}
                            className={classNames(
                                "block w-full border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500",
                                { 'border-red-500': errors.visitorName }
                            )}
                        />
                    </div>
                    {errors.visitorName && <p className="text-red-500 text-xs mt-1">{errors.visitorName}</p>}
                </div>

                <div className="relative">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Visitor Email</label>
                    <div className="flex items-center border rounded-md shadow-sm">
                        <FaEnvelope className="ml-3 text-gray-500" />
                        <input
                            type="email"
                            name="visitorEmail"
                            value={appointment.visitorEmail}
                            onChange={handleChange}
                            className={classNames(
                                "block w-full border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500",
                                { 'border-red-500': errors.visitorEmail }
                            )}
                        />
                    </div>
                    {errors.visitorEmail && <p className="text-red-500 text-xs mt-1">{errors.visitorEmail}</p>}
                </div>

                <div className="relative">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Visitor Phone</label>
                    <div className="flex items-center border rounded-md shadow-sm">
                        <FaPhone className="ml-3 text-gray-500" />
                        <input
                            type="text"
                            name="visitorPhone"
                            value={appointment.visitorPhone}
                            onChange={handleChange}
                            className={classNames(
                                "block w-full border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500",
                                { 'border-red-500': errors.visitorPhone }
                            )}
                        />
                    </div>
                    {errors.visitorPhone && <p className="text-red-500 text-xs mt-1">{errors.visitorPhone}</p>}
                </div>

                <div className="relative">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Reason</label>
                    <div className="flex items-center border rounded-md shadow-sm">
                        <FaRegListAlt className="ml-3 text-gray-500" />
                        <input
                            type="text"
                            name="reason"
                            value={appointment.reason}
                            onChange={handleChange}
                            className={classNames(
                                "block w-full border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500",
                                { 'border-red-500': errors.reason }
                            )}
                        />
                    </div>
                    {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors transform hover:scale-105"
                >
                    Add Appointment
                </button>
            </form>
        </div>
    );
};

export default AppointmentAdd;
