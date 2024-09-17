import React, { useState } from 'react';
import axios from 'axios';

const VisitAdd = () => {
    const [formData, setFormData] = useState({
        visitorRequest: '',
        checkInDateTime: '',
        checkOutDateTime: '',
        fromDateTime: '',
        toDateTime: '',
        checkIn: '',
        checkOut: '',
        visitingStatus: '',
        type: '',
        blockStatus: '',
        totalVisitingDuration: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:6789/visits', formData)
            .then(response => {
                alert('Visit added successfully');
                setFormData({
                    visitorRequest: '',
                    checkInDateTime: '',
                    checkOutDateTime: '',
                    fromDateTime: '',
                    toDateTime: '',
                    checkIn: '',
                    checkOut: '',
                    visitingStatus: '',
                    type: '',
                    blockStatus: '',
                    totalVisitingDuration: ''
                });
            })
            .catch(error => {
                console.error('There was an error adding the visit!', error);
            });
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="container mx-auto bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-4">Add Visit</h1>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        {Object.keys(formData).map((key) => (
                            <div key={key} className="mb-4">
                                <label htmlFor={key} className="block text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                                <input
                                    type={key.includes('DateTime') ? 'datetime-local' : 'text'}
                                    id={key}
                                    name={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                        ))}
                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Add Visit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VisitAdd;
