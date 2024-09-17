// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';

// const statusOptions = [
//     { value: 'approved', label: 'Approved', icon: <FaCheckCircle className="text-green-500" /> },
//     { value: 'rejected', label: 'Rejected', icon: <FaTimesCircle className="text-red-500" /> },
//     { value: 'waiting', label: 'Wait', icon: <FaHourglassHalf className="text-yellow-500" /> }
// ];

// const VisitorRequestEdit = () => {
//     const [visitorRequest, setVisitorRequest] = useState({
//         employeeId: '',
//         visitorName: '',
//         visitorEmail: '',
//         visitorPhone: '',
//         status: '',
//         reason: '',
//         visitorRequestDateTime: '',
//         visitorImageBlob: null,
//     });
//     const [employees, setEmployees] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState('');
//     const { id } = useParams();
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchVisitorRequestAndEmployees = async () => {
//             try {
//                 const [visitorResponse, employeeResponse] = await Promise.all([
//                     axios.get(`http://localhost:6789/visitorrequests/${id}`),
//                     axios.get('http://localhost:6789/employees/all'),
//                 ]);

//                 setVisitorRequest(visitorResponse.data);
//                 setEmployees(employeeResponse.data);

//                 const employee = employeeResponse.data.find(emp => emp.employeeId === visitorResponse.data.employee.employeeId);
//                 setSelectedEmployee(employee ? employee.employeeEmail : '');
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }
//         };

//         fetchVisitorRequestAndEmployees();
//     }, [id]);

//     const handleStatusChange = (e) => {
//         setVisitorRequest(prev => ({
//             ...prev,
//             status: e.target.value,
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
// console.log(visitorRequest.status);
//         // Update status in the system
//         const formData = new FormData();
//         formData.append('status', visitorRequest.status);

//         try {
//             const response = await axios.patch(`http://localhost:6789/visitorrequests/statusupdate/${id}`, formData);
//             const updatedRequest = response.data;

//             if (updatedRequest.status === "approved") {
//                 const currentDateTime = new Date(); // Current date and time
//                 const fromDateTime = currentDateTime.toISOString(); // Convert to ISO string

//                 // Set the time of the `toDateTime` to 6 PM
//                 const toDateTime = new Date(currentDateTime);
//                 toDateTime.setHours(18, 0, 0, 0); // Set to 6 PM
//                 const toDateTimeString = toDateTime.toISOString(); // Convert to ISO string

//                 const visitData = {
//                     visitorRequest: {
//                         requestId: updatedRequest.requestId,
//                     },
//                     fromDateTime,
//                     toDateTime: toDateTimeString,
//                     type: 'General Visit',
//                 };

//                 await axios.post('http://localhost:6789/visits', visitData);
//             }

//             // Prepare email data
//             const emailRequestData = {
//                 employeeEmail: updatedRequest.employee.employeeEmail,
//                 visitorName: visitorRequest.visitorName,
//                 visitorEmail: visitorRequest.visitorEmail,
//                 visitorPhone: visitorRequest.visitorPhone,
//                 status: updatedRequest.status,
//             };

//             // Send email with visitor status update
//             await axios.post('http://localhost:6789/api/sendStatusUpdation', emailRequestData);
//             // Navigate to the view page
//             navigate(`/employeemain`);
//         } catch (error) {
//             console.error('Error updating status and sending email:', error);
//         }
//     };

//     return (
//         <div className="max-w-4xl mx-auto mt-6 p-6 bg-gray-50 shadow-md rounded-lg">
//             <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Visitor Request</h1>
//             <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
//                     <label htmlFor="visitorName" className="block text-sm font-medium text-gray-700 w-full md:w-1/3">
//                         Visitor Name
//                     </label>
//                     <div className="w-full md:w-2/3">
//                         <input
//                             type="text"
//                             id="visitorName"
//                             name="visitorName"
//                             value={visitorRequest.visitorName}
//                             disabled
//                             className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500"
//                         />
//                     </div>
//                 </div>
//                 <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
//                     <label htmlFor="visitorEmail" className="block text-sm font-medium text-gray-700 w-full md:w-1/3">
//                         Visitor Email
//                     </label>
//                     <div className="w-full md:w-2/3">
//                         <input
//                             type="email"
//                             id="visitorEmail"
//                             name="visitorEmail"
//                             value={visitorRequest.visitorEmail}
//                             disabled
//                             className="mt-1 block p-2 w-full border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500"
//                         />
//                     </div>
//                 </div>
//                 <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
//                     <label htmlFor="visitorPhone" className="block text-sm font-medium text-gray-700 w-full md:w-1/3">
//                         Visitor Phone
//                     </label>
//                     <div className="w-full md:w-2/3">
//                         <input
//                             type="text"
//                             id="visitorPhone"
//                             name="visitorPhone"
//                             value={visitorRequest.visitorPhone}
//                             disabled
//                             className="mt-1 block p-2 w-full border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500"
//                         />
//                     </div>
//                 </div>
//                 <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
//                     <label htmlFor="status" className="block text-sm font-medium text-gray-700 w-full md:w-1/3">
//                         Status
//                     </label>
//                     <div className="w-full md:w-2/3">
//                         <select
//                             id="status"
//                             name="status"
//                             value={visitorRequest.status}
//                             onChange={handleStatusChange}
//                             className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         >
//                             {statusOptions.map(option => (
//                                 <option key={option.value} value={option.value}>
//                                     {option.icon} {option.label}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>
//                 <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
//                     <label htmlFor="reason" className="block text-sm font-medium text-gray-700 w-full md:w-1/3">
//                         Reason
//                     </label>
//                     <div className="w-full md:w-2/3">
//                         <textarea
//                             id="reason"
//                             name="reason"
//                             value={visitorRequest.reason}
//                             disabled
//                             className="mt-1 p-3 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500"
//                             rows="2"
//                         />
//                     </div>
//                 </div>
//                 <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
//                     <label className="block text-sm font-medium text-gray-700 w-full md:w-1/3">
//                         Visitor Image
//                     </label>
//                     <div className="w-full md:w-2/3">
//                         {visitorRequest.visitorImageBlob && (
//                             <img
//                                 src={`data:image/jpeg;base64,${visitorRequest.visitorImageBlob}`}
//                                 alt="Visitor"
//                                 className="w-32 h-32 object-cover mt-2 rounded-md shadow-md transition-transform transform hover:scale-105"
//                             />
//                         )}
//                     </div>
//                 </div>
//                 <div className='flex justify-end'>
//                     <button
//                         type="submit"
//                         className="bg-blue-600 text-white px-6 py-3 rounded-md shadow-md  hover:bg-blue-700 transition-colors"
//                     >
//                         Save Changes
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default VisitorRequestEdit;




import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';

const statusOptions = [
    { value: 'approved', label: 'Approved', icon: <FaCheckCircle className="text-green-500" /> },
    { value: 'rejected', label: 'Rejected', icon: <FaTimesCircle className="text-red-500" /> },
    { value: 'waiting', label: 'Wait', icon: <FaHourglassHalf className="text-yellow-500" /> }
];

const VisitorRequestEdit = () => {
    
    const [visitorRequest, setVisitorRequest] = useState({
        employeeId: '',
        visitorName: '',
        visitorEmail: '',
        visitorPhone: '',
        status: '',
        reason: '',
        visitorRequestDateTime: '',
        visitorImageBlob: null,
    });
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVisitorRequestAndEmployees = async () => {
            try {
                const [visitorResponse, employeeResponse] = await Promise.all([
                    axios.get(`http://localhost:6789/visitorrequests/${id}`),
                    axios.get('http://localhost:6789/employees/all'),
                ]);

                setVisitorRequest(visitorResponse.data);
                setEmployees(employeeResponse.data);

                // Find the employee associated with the visitor request
                const employee = employeeResponse.data.find(emp => emp.employeeId === visitorResponse.data.employeeId);
                setSelectedEmployee(employee ? employee.employeeEmail : '');
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchVisitorRequestAndEmployees();
    }, [id]);

    const handleStatusChange = (e) => {
        setVisitorRequest(prev => ({
            ...prev,
            status: e.target.value,
        } 
        ));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('status', visitorRequest.status);

        try {
            const response = await axios.patch(`http://localhost:6789/visitorrequests/statusupdate/${id}`, formData);
            const updatedRequest = response.data;

            if (updatedRequest.status === 'approved') {
                const currentDateTime = new Date(); 
                const fromDateTime = currentDateTime.toISOString(); 

                const toDateTime = new Date(currentDateTime);
                toDateTime.setHours(18, 0, 0, 0); 
                const toDateTimeString = toDateTime.toISOString(); 

                const visitData = {
                    visitorRequest: {
                        requestId: updatedRequest.requestId,
                    },
                    fromDateTime,
                    toDateTime: toDateTimeString,
                    type: 'General Visit',
                };

                await axios.post('http://localhost:6789/visits', visitData);
            }

            const emailRequestData = {
                employeeEmail: updatedRequest.employee.employeeEmail,
                visitorName: visitorRequest.visitorName,
                visitorEmail: visitorRequest.visitorEmail,
                visitorPhone: visitorRequest.visitorPhone,
                status: updatedRequest.status,
            };

            console.log(emailRequestData);

            await axios.post('http://localhost:6789/api/sendStatusUpdation', emailRequestData);

            navigate(`/employeemain`);
        } catch (error) {
            console.error('Error updating status and sending email:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-6 p-6 bg-gray-50 shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Visitor Request</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                    <label htmlFor="visitorName" className="block text-sm font-medium text-gray-700 w-full md:w-1/3">
                        Visitor Name
                    </label>
                    <div className="w-full md:w-2/3">
                        <input
                            type="text"
                            id="visitorName"
                            name="visitorName"
                            value={visitorRequest.visitorName}
                            disabled
                            className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500"
                        />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                    <label htmlFor="visitorEmail" className="block text-sm font-medium text-gray-700 w-full md:w-1/3">
                        Visitor Email
                    </label>
                    <div className="w-full md:w-2/3">
                        <input
                            type="email"
                            id="visitorEmail"
                            name="visitorEmail"
                            value={visitorRequest.visitorEmail}
                            disabled
                            className="mt-1 block p-2 w-full border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500"
                        />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                    <label htmlFor="visitorPhone" className="block text-sm font-medium text-gray-700 w-full md:w-1/3">
                        Visitor Phone
                    </label>
                    <div className="w-full md:w-2/3">
                        <input
                            type="text"
                            id="visitorPhone"
                            name="visitorPhone"
                            value={visitorRequest.visitorPhone}
                            disabled
                            className="mt-1 block p-2 w-full border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500"
                        />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 w-full md:w-1/3">
                        Status
                    </label>
                    <div className="w-full md:w-2/3">
                        <select
                            id="status"
                            name="status"
                            value={visitorRequest.status}
                            onChange={handleStatusChange}
                            className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.icon} {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 w-full md:w-1/3">
                        Reason
                    </label>
                    <div className="w-full md:w-2/3">
                        <textarea
                            id="reason"
                            name="reason"
                            value={visitorRequest.reason}
                            disabled
                            className="mt-1 p-3 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500"
                            rows="2"
                        />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                    <label className="block text-sm font-medium text-gray-700 w-full md:w-1/3">
                        Visitor Image
                    </label>
                    <div className="w-full md:w-2/3">
                        {visitorRequest.visitorImageBlob && (
                            <img
                                src={`data:image/jpeg;base64,${visitorRequest.visitorImageBlob}`}
                                alt="Visitor"
                                className="w-32 h-32 object-cover mt-2 rounded-md shadow-md transition-transform transform hover:scale-105"
                            />
                        )}
                    </div>
                </div>
                <div className='flex justify-end'>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VisitorRequestEdit;
