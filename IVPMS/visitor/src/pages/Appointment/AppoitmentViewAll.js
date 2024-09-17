import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AppointmentViewAll = () => {
    const [appointments, setAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [filteredAppointments, setFilteredAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get('http://localhost:6789/appointments');
                const sortedAppointments = response.data.sort((a, b) => new Date(b.appointmentDateTime) - new Date(a.appointmentDateTime));
                setAppointments(sortedAppointments);
                setFilteredAppointments(sortedAppointments);
            } catch (error) {
                console.error('Error fetching appointments', error);
            }
        };

        fetchAppointments();
    }, []);

    useEffect(() => {
        const filtered = appointments.filter(app => {
            const matchesEmployeeOrCompany = app.employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.employee.company.companyName.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesDate = searchDate ? new Date(app.appointmentDateTime).toDateString() === new Date(searchDate).toDateString() : true;

            return matchesEmployeeOrCompany && matchesDate;
        });
        setFilteredAppointments(filtered);
    }, [searchTerm, searchDate, appointments]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:6789/appointments/${id}`);
            setAppointments(prevAppointments => prevAppointments.filter(app => app.appointmentId !== id));
        } catch (error) {
            console.error('Error deleting appointment', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center justify-between mb-4 mt-12">
                <h1 className="text-2xl font-bold">All Appointments</h1>
                <div className="flex space-x-4">
                    <input
                        type="text"
                        placeholder="Search by employee or company name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        className="p-2 border border-gray-300 rounded"
                    />
                </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date and Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitor Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitor Email ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitor Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAppointments.length > 0 ? filteredAppointments.map((appointment) => (
                        <tr key={appointment.appointmentId}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.appointmentDateTime}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.employee.employeeName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.employee.company.companyName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.visitorName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.visitorEmail}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.visitorPhone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.reason}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Link to={`/appointmentview/${appointment.appointmentId}`} className="text-blue-600 hover:text-blue-800 mr-2">View</Link>
                                <Link to={`/appointmentedit/${appointment.appointmentId}`} className="text-yellow-600 hover:text-yellow-800 mr-2">Edit</Link>
                                <button onClick={() => handleDelete(appointment.appointmentId)} className="text-red-600 hover:text-red-800">Delete</button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No appointments found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AppointmentViewAll;
