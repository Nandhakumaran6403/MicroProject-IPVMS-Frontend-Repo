import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs'; // For date manipulation

const AppointmentSpecificView = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [activeTab, setActiveTab] = useState('today');
    const { id } = useParams(); // Employee ID from URL params
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get('http://localhost:6789/appointments');
                const allAppointments = response.data;

                // Filter appointments by employee ID
                const employeeAppointments = allAppointments.filter(app => app.employee.employeeId === parseInt(id));
                setAppointments(employeeAppointments);
                filterAppointments(employeeAppointments, activeTab);
            } catch (error) {
                console.error('Error fetching appointments:', error);
                // Handle error, e.g., set an error state to display to users
            }
        };

        fetchAppointments();
    }, [id]);

    useEffect(() => {
        // Ensure appointments are filtered whenever the active tab changes
        filterAppointments(appointments, activeTab);
    }, [appointments, activeTab]);

    const filterAppointments = (appointments, tab) => {
        const today = dayjs().startOf('day');
        const futureAppointments = [];
        const pastAppointments = [];

        appointments.forEach(app => {
            const appointmentDate = dayjs(app.appointmentDateTime);
            if (appointmentDate.isSame(today, 'day')) {
                futureAppointments.push(app);
            } else if (appointmentDate.isBefore(today, 'day')) {
                pastAppointments.push(app);
            }
        });

        const sortAppointments = (appointments) => {
            return appointments.sort((a, b) => dayjs(b.appointmentDateTime) - dayjs(a.appointmentDateTime));
        };

        switch (tab) {
            case 'today':
                setFilteredAppointments(sortAppointments(futureAppointments));
                break;
            case 'past':
                setFilteredAppointments(sortAppointments(pastAppointments));
                break;
            case 'all':
                setFilteredAppointments(sortAppointments(appointments));
                break;
            default:
                setFilteredAppointments(sortAppointments(futureAppointments));
                break;
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        filterAppointments(appointments, tab);
    };

    const handleBack = () => {
        navigate('/employeemain');
    };

    if (appointments.length === 0) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-4 mt-12">
            {/* <h1 className="text-2xl font-bold mb-4">Appointments for {appointments.employee.employeeName}</h1> */}
            <div className="flex justify-end mb-4 ">
                <button
                    onClick={() => handleTabChange('today')}
                    className={`mr-2 px-4 py-2 rounded ${activeTab === 'today' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Today
                </button>
                <button
                    onClick={() => handleTabChange('past')}
                    className={`mr-2 px-4 py-2 rounded ${activeTab === 'past' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Past
                </button>
                <button
                    onClick={() => handleTabChange('all')}
                    className={`px-4 py-2 rounded ${activeTab === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    All
                </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-12">
                {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment) => (
                        <div key={appointment.id} className="bg-white p-6 rounded-lg shadow-md">
                            <p className="text-lg font-semibold mb-2">
                                Date and Time: <span className="font-normal">{dayjs(appointment.appointmentDateTime).format('YYYY-MM-DD HH:mm')}</span>
                            </p>
                            <p className="mb-2"><strong>Visitor Name:</strong> {appointment.visitorName}</p>
                            <p className="mb-2"><strong>Visitor Email ID:</strong> {appointment.visitorEmail}</p>
                            <p className="mb-2"><strong>Visitor Phone:</strong> {appointment.visitorPhone}</p>
                            <p className="mb-2"><strong>Reason:</strong> {appointment.reason}</p>
                            {/* <p className="mb-2"><strong>Employee ID:</strong> {appointment.employee.employeeId}</p> */}
                        </div>
                    ))
                ) : (
                    <p>No appointments found for this tab.</p>
                )}
            </div>
            <div className="mt-4">
                <button onClick={handleBack} className="bg-gray-500 text-white px-4 py-2 rounded-md mt-12">Back</button>
            </div>
        </div>
    );
};

export default AppointmentSpecificView;
