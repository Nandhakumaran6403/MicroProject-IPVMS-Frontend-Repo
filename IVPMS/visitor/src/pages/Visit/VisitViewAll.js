// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';
// import Papa from 'papaparse';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import Modal from 'react-modal';
// import { FaFilePdf, FaFileExcel, FaFileCsv, FaTimes } from 'react-icons/fa';

// const VisitViewAll = () => {
//     const [visits, setVisits] = useState([]);
//     const [filteredVisits, setFilteredVisits] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [modalIsOpen, setModalIsOpen] = useState(false);

//     useEffect(() => {
//         axios.get('http://localhost:6789/visits')
//             .then(response => {
//                 setVisits(response.data);
//                 setFilteredVisits(response.data); // Initialize with all visits
//             })
//             .catch(error => {
//                 console.error('There was an error fetching the visits!', error);
//             });
//     }, []);

//     useEffect(() => {
//         // Filter visits based on search query
//         const filtered = visits.filter(visit => {
//             const query = searchQuery.toLowerCase();
//             return (
//                 (visit.visitorRequest && visit.visitorRequest.visitorName.toLowerCase().includes(query)) ||
//                 (visit.visitorRequest && visit.visitorRequest.employee.employeeName.toLowerCase().includes(query)) ||
//                 (visit.visitorRequest && visit.visitorRequest.employee.company.companyName.toLowerCase().includes(query)) ||
//                 visit.type.toLowerCase().includes(query) ||
//                 (visit.checkInDateTime && new Date(visit.checkInDateTime).toLocaleString().toLowerCase().includes(query)) ||
//                 (visit.checkOutDateTime && new Date(visit.checkOutDateTime).toLocaleString().toLowerCase().includes(query))
//             );
//         });
//         setFilteredVisits(filtered);
//     }, [searchQuery, visits]);

//     const handleDownload = (format) => {
//         // Prepare data with all fields
//         const data = filteredVisits.map(visit => ({
//             ID: visit.visitId,
//             'Visitor Name': visit.visitorRequest ? visit.visitorRequest.visitorName : 'N/A',
//             'Visitor Email': visit.visitorRequest ? visit.visitorRequest.visitorEmail : 'N/A',
//             'Visitor Phone': visit.visitorRequest ? visit.visitorRequest.visitorPhone : 'N/A',
//             'Employee Name': visit.visitorRequest ? visit.visitorRequest.employee.employeeName : 'N/A',
//             'Employee Email': visit.visitorRequest ? visit.visitorRequest.employee.employeeEmail : 'N/A',
//             'Employee Phone': visit.visitorRequest ? visit.visitorRequest.employee.employeePhone : 'N/A',
//             'Company Name': visit.visitorRequest ? visit.visitorRequest.employee.company.companyName : 'N/A',
//             'Check-In DateTime': visit.checkInDateTime ? new Date(visit.checkInDateTime).toLocaleString() : 'N/A',
//             'Check-Out DateTime': visit.checkOutDateTime ? new Date(visit.checkOutDateTime).toLocaleString() : 'N/A',
//             'From DateTime': visit.fromDateTime ? new Date(visit.fromDateTime).toLocaleString() : 'N/A',
//             'To DateTime': visit.toDateTime ? new Date(visit.toDateTime).toLocaleString() : 'N/A',
//             'Check-In': visit.checkIn || 'N/A',
//             'Check-Out': visit.checkOut || 'N/A',
//             'Visiting Status': visit.visitingStatus || 'N/A',
//             'Block Status': visit.blockStatus || 'N/A',
//             Type: visit.type,
//             'Type': visit.visitorRequest.reason || 'N/A',
//             'Total Visiting Duration': visit.totalVisitingDuration,
//         }));
    
//         if (format === 'csv') {
//             const csv = Papa.unparse(data);
//             const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//             saveAs(blob, 'visits.csv');
//         } else if (format === 'excel') {
//             const ws = XLSX.utils.json_to_sheet(data);
//             const wb = XLSX.utils.book_new();
//             XLSX.utils.book_append_sheet(wb, ws, 'Visits');
//             XLSX.writeFile(wb, 'visits.xlsx');
//         } else if (format === 'pdf') {
//             const doc = new jsPDF();
//             doc.autoTable({
//                 head: [['ID', 'Visitor Name', 'Visitor Email', 'Visitor Phone', 'Employee Name', 'Employee Email', 'Employee Phone', 'Type', 'Reason']],
//                 body: data.map(row => [
//                     row.ID,
//                     row['Visitor Name'],
//                     row['Visitor Email'],
//                     row['Visitor Phone'],
//                     row['Employee Name'],
//                     row['Employee Email'],
//                     row['Employee Phone'],
//                     row['Company Name'],
//                     row.Type,
//                     row['Reason'],
//                 ]),
//             });
//             doc.save('visits.pdf');
//         }
    
//         setModalIsOpen(false);
//     };
    

//     const buttonStyles = {
//         backgroundColor: '#1d4ed8', // Tailwind blue-500
//         color: 'white',
//         padding: '8px 16px',
//         borderRadius: '4px',
//         border: 'none',
//         cursor: 'pointer',
//         marginRight: '8px',
//     };

//     const modalStyles = {
//         content: {
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             width: '80%',
//             maxWidth: '500px',
//             background: 'white',
//             padding: '20px',
//             borderRadius: '10px',
//             boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//         },
//         overlay: {
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         },
//     };

//     return (
//         <div className="bg-white-100 min-h-screen p-12">
//             <div className=" mx-auto bg-white rounded-lg p-12">
//                 <div className="flex items-center justify-between mb-4">
//                     <button
//                         style={buttonStyles}
//                         onClick={() => setModalIsOpen(true)}
//                     >
//                         Download Data
//                     </button>
//                     <input
//                         type="text"
//                         placeholder="Search..."
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         className="border border-gray-300 rounded px-4 py-2 w-1/3"
//                     />
//                 </div>
//                 <h1 className="text-2xl font-bold mb-4">All Visits</h1>
//                 <table className="w-full border-collapse">
//                     <thead>
//                         <tr className="bg-white-200">
//                             <th className="border px-4 py-2">ID</th>
//                             <th className="border px-4 py-2">Visitor Name</th>
//                             <th className="border px-4 py-2">Visitor Email</th>
//                             <th className="border px-4 py-2">Visitor Phone</th>
//                             <th className="border px-4 py-2">Employee Name</th>
                            
//                             <th className="border px-4 py-2">Company Name</th>
                           
//                             <th className="border px-4 py-2">Type</th>
//                             <th className="border px-4 py-2">Reason</th>
//                             <th className="border px-4 py-2">Total Visiting Duration</th>
//                             <th className="border px-4 py-2">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredVisits.map(visit => (
//                             <tr key={visit.visitId}>
//                                 <td className="border px-4 py-2">{visit.visitId}</td>
//                                 <td className="border px-4 py-2">{visit.visitorRequest ? visit.visitorRequest.visitorName : 'N/A'}</td>
//                                 <td className="border px-4 py-2">{visit.visitorRequest ? visit.visitorRequest.visitorEmail : 'N/A'}</td>
//                                 <td className="border px-4 py-2">{visit.visitorRequest ? visit.visitorRequest.visitorPhone : 'N/A'}</td>
//                                 <td className="border px-4 py-2">{visit.visitorRequest ? visit.visitorRequest.employee.employeeName : 'N/A'}</td>
                               
//                                 <td className="border px-4 py-2">{visit.visitorRequest ? visit.visitorRequest.employee.company.companyName : 'N/A'}</td>
                               
//                                 <td className="border px-4 py-2">{visit.type}</td>
//                                 <td className="border px-4 py-2">{visit.visitorRequest.reason}</td>
//                                 <td className="border px-4 py-2">{visit.totalVisitingDuration}</td>
//                                 <td className="border px-4 py-2 flex">
//                                     <Link to={`/visitview/${visit.visitId}`} className="bg-blue-500 text-white py-1 px-2 rounded mr-2">View</Link>
//                                     <Link to={`/visitedit/${visit.visitId}`} className="bg-yellow-500 text-white py-1 px-2 rounded mr-2">Edit</Link>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>


// <Modal
//             isOpen={modalIsOpen}
//             onRequestClose={() => setModalIsOpen(false)}
//             contentLabel="Download Options"
//             style={modalStyles}
//             closeTimeoutMS={300} // Match this with your CSS transition
//         >
//             <div className="modal-header flex justify-between items-center mb-4">
//                 <h2 className="text-2xl font-bold">Download Options</h2>
//                 <button
//                     className="text-gray-600 hover:text-gray-900"
//                     onClick={() => setModalIsOpen(false)}
//                     aria-label="Close"
//                 >
//                     <FaTimes size={24} />
//                 </button>
//             </div>
//             <div className="flex flex-col gap-4">
//                 <button
//                     className="flex items-center bg-green-500 text-white py-2 px-4 rounded shadow-md transition-transform transform hover:scale-105"
//                     onClick={() => handleDownload('pdf')}
//                 >
//                     <FaFilePdf size={20} className="mr-2" />
//                     Download as PDF
//                 </button>
//                 <button
//                     className="flex items-center bg-blue-500 text-white py-2 px-4 rounded shadow-md transition-transform transform hover:scale-105"
//                     onClick={() => handleDownload('excel')}
//                 >
//                     <FaFileExcel size={20} className="mr-2" />
//                     Download as Excel
//                 </button>
//                 <button
//                     className="flex items-center bg-gray-500 text-white py-2 px-4 rounded shadow-md transition-transform transform hover:scale-105"
//                     onClick={() => handleDownload('csv')}
//                 >
//                     <FaFileCsv size={20} className="mr-2" />
//                     Download as CSV
//                 </button>
//             </div>
//             <button
//                 className="block w-full mt-4 bg-red-500 text-white py-2 px-4 rounded shadow-md transition-transform transform hover:scale-105"
//                 onClick={() => setModalIsOpen(false)}
//             >
//                 Close
//             </button>
//         </Modal>
//         </div>
//     );
// };

// export default VisitViewAll;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';
// import Papa from 'papaparse';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import Modal from 'react-modal';
// import { FaFilePdf, FaFileExcel, FaFileCsv, FaTimes } from 'react-icons/fa';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const VisitViewAll = () => {
//     const [visits, setVisits] = useState([]);
//     const [filteredVisits, setFilteredVisits] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [modalIsOpen, setModalIsOpen] = useState(false);
//     const [startDate, setStartDate] = useState(null);
//     const [endDate, setEndDate] = useState(null);
//     const [searchDate, setSearchDate] = useState('');

//     useEffect(() => {
//         axios.get('http://localhost:6789/visits')
//             .then(response => {
//                 setVisits(response.data);
//                 setFilteredVisits(response.data); // Initialize with all visits
//             })
//             .catch(error => {
//                 console.error('There was an error fetching the visits!', error);
//             });
//     }, []);

//     useEffect(() => {
//         // Filter visits based on search query and date range
//         const filtered = visits.filter(visit => {
//             const query = searchQuery.toLowerCase();
//             const checkInDate = visit.checkInDateTime ? new Date(visit.checkInDateTime) : null;
//             const checkOutDate = visit.checkOutDateTime ? new Date(visit.checkOutDateTime): null;
//             const searchDateObj = new Date(searchDate);

//             const withinDateRange =
//                 (!startDate || (checkInDate && checkInDate >= startDate)) &&
//                 (!endDate || (checkOutDate && checkOutDate <= endDate));

//             const isDateMatch = searchDate ? checkInDate.toLocaleString() === searchDateObj.toDateString() : true;


//             return withinDateRange && isDateMatch && (
//                 (visit.visitorRequest && visit.visitorRequest.visitorName.toLowerCase().includes(query)) ||
//                 (visit.visitorRequest && visit.visitorRequest.employee.employeeName.toLowerCase().includes(query)) ||
//                 (visit.visitorRequest && visit.visitorRequest.employee.company.companyName.toLowerCase().includes(query)) ||
//                 visit.type.toLowerCase().includes(query) ||
//                 (visit.checkInDateTime && new Date(visit.checkInDateTime).toLocaleString().split('T')[0].toLowerCase().includes(query)) ||
//                 (visit.checkOutDateTime && new Date(visit.checkOutDateTime).toLocaleString().split('T')[0].toLowerCase().includes(query))
//             );
//         });
//         setFilteredVisits(filtered);
//     }, [searchQuery, visits, startDate, endDate]);

//     const handleDownload = (format) => {
//         // Prepare data with all fields
//         const data = filteredVisits.map(visit => ({
//             ID: visit.visitId,
//             'Visitor Name': visit.visitorRequest ? visit.visitorRequest.visitorName : 'N/A',
//             'Visitor Email': visit.visitorRequest ? visit.visitorRequest.visitorEmail : 'N/A',
//             'Visitor Phone': visit.visitorRequest ? visit.visitorRequest.visitorPhone : 'N/A',
//             'Employee Name': visit.visitorRequest ? visit.visitorRequest.employee.employeeName : 'N/A',
//             'Employee Email': visit.visitorRequest ? visit.visitorRequest.employee.employeeEmail : 'N/A',
//             'Employee Phone': visit.visitorRequest ? visit.visitorRequest.employee.employeePhone : 'N/A',
//             'Company Name': visit.visitorRequest ? visit.visitorRequest.employee.company.companyName : 'N/A',
//             'Check-In DateTime': visit.checkInDateTime ? new Date(visit.checkInDateTime).toLocaleString() : 'N/A',
//             'Check-Out DateTime': visit.checkOutDateTime ? new Date(visit.checkOutDateTime).toLocaleString() : 'N/A',
//             'From DateTime': visit.fromDateTime ? new Date(visit.fromDateTime).toLocaleString() : 'N/A',
//             'To DateTime': visit.toDateTime ? new Date(visit.toDateTime).toLocaleString() : 'N/A',
//             'Check-In': visit.checkIn || 'N/A',
//             'Check-Out': visit.checkOut || 'N/A',
//             'Visiting Status': visit.visitingStatus || 'N/A',
//             'Block Status': visit.blockStatus || 'N/A',
//             Type: visit.type,
//             'Reason': visit.visitorRequest.reason || 'N/A',
//             'Total Visiting Duration': visit.totalVisitingDuration,
//         }));
    
//         if (format === 'csv') {
//             const csv = Papa.unparse(data);
//             const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//             saveAs(blob, 'visits.csv');
//         } else if (format === 'excel') {
//             const ws = XLSX.utils.json_to_sheet(data);
//             const wb = XLSX.utils.book_new();
//             XLSX.utils.book_append_sheet(wb, ws, 'Visits');
//             XLSX.writeFile(wb, 'visits.xlsx');
//         } else if (format === 'pdf') {
//             const doc = new jsPDF();
//             doc.autoTable({
//                 head: [['ID', 'Visitor Name', 'Visitor Email', 'Visitor Phone', 'Employee Name', 'Employee Email', 'Employee Phone', 'Type', 'Reason']],
//                 body: data.map(row => [
//                     row.ID,
//                     row['Visitor Name'],
//                     row['Visitor Email'],
//                     row['Visitor Phone'],
//                     row['Employee Name'],
//                     row['Employee Email'],
//                     row['Employee Phone'],
//                     row['Company Name'],
//                     row.Type,
//                     row['Reason'],
//                 ]),
//             });
//             doc.save('visits.pdf');
//         }
    
//         setModalIsOpen(false);
//     };

//     const buttonStyles = {
//         backgroundColor: '#1d4ed8', // Tailwind blue-500
//         color: 'white',
//         padding: '8px 16px',
//         borderRadius: '4px',
//         border: 'none',
//         cursor: 'pointer',
//         marginRight: '8px',
//     };

//     const modalStyles = {
//         content: {
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             width: '80%',
//             maxWidth: '500px',
//             background: 'white',
//             padding: '20px',
//             borderRadius: '10px',
//             boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//         },
//         overlay: {
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         },
//     };

//     return (
//         <div className="bg-white-100 min-h-screen p-12">
//             <div className="mx-auto bg-white rounded-lg p-12">
//                 <div className="flex items-center mb-4">
//                 <button
//                             style={buttonStyles}
//                             onClick={() => setModalIsOpen(true)}
//                         >
//                             Download Data
//                         </button>
//                     <div className="flex ml-80 gap-4">
                        
//                         <input
//                             type="text"
//                             placeholder="Search..."
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             className="border border-gray-300 rounded ml-36  px-4 py-2"
//                         />
//                         <DatePicker
//                             selected={startDate}
//                             onChange={(date) => setStartDate(date)}
//                             placeholderText="Start Date"
//                             dateFormat="MMM d, yyyy"
//                             className="border border-gray-300 rounded px-4 py-2"
//                         />
//                         <DatePicker
//                             selected={endDate}
//                             onChange={(date) => setEndDate(date)}
//                             placeholderText="End Date"
//                             dateFormat="MMM d, yyyy"
//                             className="border border-gray-300 rounded px-4 py-2"
//                         />
//                         <input
//                     type="date"
//                     value={searchDate}
//                     onChange={(e) => setSearchDate(e.target.value)}
//                     className="border px-2 py-1 rounded"
//                 />
//                     </div>
//                 </div>
//                 <h1 className="text-2xl font-bold mb-4">All Visits</h1>
//                 <table className="w-full border-collapse">
//                     <thead>
//                         <tr className="bg-white-200">
//                             <th className="border px-4 py-2">ID</th>
//                             <th className="border px-4 py-2">Visitor Name</th>
//                             <th className="border px-4 py-2">Visitor Email</th>
//                             <th className="border px-4 py-2">Visitor Phone</th>
//                             <th className="border px-4 py-2">Employee Name</th>
//                             <th className="border px-4 py-2">Company Name</th>
//                             <th className="border px-4 py-2">Type</th>
//                             <th className="border px-4 py-2">Reason</th>
//                             <th className="border px-4 py-2">Total Visiting Duration</th>
//                             <th className="border px-4 py-2">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredVisits.map(visit => (
//                             <tr key={visit.visitId}>
//                                 <td className="border px-4 py-2">{visit.visitId}</td>
//                                 <td className="border px-4 py-2">{visit.visitorRequest ? visit.visitorRequest.visitorName : 'N/A'}</td>
//                                 <td className="border px-4 py-2">{visit.visitorRequest ? visit.visitorRequest.visitorEmail : 'N/A'}</td>
//                                 <td className="border px-4 py-2">{visit.visitorRequest ? visit.visitorRequest.visitorPhone : 'N/A'}</td>
//                                 <td className="border px-4 py-2">{visit.visitorRequest ? visit.visitorRequest.employee.employeeName : 'N/A'}</td>
//                                 <td className="border px-4 py-2">{visit.visitorRequest ? visit.visitorRequest.employee.company.companyName : 'N/A'}</td>
//                                 <td className="border px-4 py-2">{visit.type}</td>
//                                 <td className="border px-4 py-2">{visit.visitorRequest ? visit.visitorRequest.reason : 'N/A'}</td>
//                                 <td className="border px-4 py-2">{visit.totalVisitingDuration}</td>
//                                 <td className="border px-4 py-2 flex">
//                                     <Link to={`/visitview/${visit.visitId}`} className="bg-blue-500 text-white py-1 px-2 rounded mr-2">View</Link>
//                                     <Link to={`/visitedit/${visit.visitId}`} className="bg-yellow-500 text-white py-1 px-2 rounded mr-2">Edit</Link>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             <Modal
//                 isOpen={modalIsOpen}
//                 onRequestClose={() => setModalIsOpen(false)}
//                 contentLabel="Download Options"
//                 style={modalStyles}
//                 closeTimeoutMS={300} // Match this with your CSS transition
//             >
//                 <div className="modal-header flex justify-between items-center mb-4">
//                     <h2 className="text-2xl font-bold">Download Options</h2>
//                     <button
//                         className="text-gray-600 hover:text-gray-900"
//                         onClick={() => setModalIsOpen(false)}
//                         aria-label="Close"
//                     >
//                         <FaTimes size={24} />
//                     </button>
//                 </div>
//                 <div className="flex flex-col gap-4">
//                     <button
//                         className="flex items-center bg-green-500 text-white py-2 px-4 rounded shadow-md transition-transform transform hover:scale-105"
//                         onClick={() => handleDownload('pdf')}
//                     >
//                         <FaFilePdf size={20} className="mr-2" />
//                         Download as PDF
//                     </button>
//                     <button
//                         className="flex items-center bg-blue-500 text-white py-2 px-4 rounded shadow-md transition-transform transform hover:scale-105"
//                         onClick={() => handleDownload('excel')}
//                     >
//                         <FaFileExcel size={20} className="mr-2" />
//                         Download as Excel
//                     </button>
//                     <button
//                         className="flex items-center bg-gray-500 text-white py-2 px-4 rounded shadow-md transition-transform transform hover:scale-105"
//                         onClick={() => handleDownload('csv')}
//                     >
//                         <FaFileCsv size={20} className="mr-2" />
//                         Download as CSV
//                     </button>
//                 </div>
//                 <button
//                     className="block w-full mt-4 bg-red-500 text-white py-2 px-4 rounded shadow-md transition-transform transform hover:scale-105"
//                     onClick={() => setModalIsOpen(false)}
//                 >
//                     Close
//                 </button>
//             </Modal>
//         </div>
//     );
// };

// export default VisitViewAll;





// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';
// import Papa from 'papaparse';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import Modal from 'react-modal';
// import { FaFilePdf, FaFileExcel, FaFileCsv, FaTimes } from 'react-icons/fa';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const VisitViewAll = () => {
//     const [visits, setVisits] = useState([]);
//     const [filteredVisits, setFilteredVisits] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [modalIsOpen, setModalIsOpen] = useState(false);
//     const [startDate, setStartDate] = useState(null);
//     const [endDate, setEndDate] = useState(null);
//     const [searchDate, setSearchDate] = useState('');

//     useEffect(() => {
//         axios.get('http://localhost:6789/visits')
//             .then(response => {
//                 setVisits(response.data);
//                 setFilteredVisits(response.data); // Initialize with all visits
//             })
//             .catch(error => {
//                 console.error('There was an error fetching the visits!', error);
//             });
//     }, []);

//     useEffect(() => {
//         // Convert searchDate to Date object if it's not empty
//         const searchDateObj = searchDate ? new Date(searchDate) : null;

//         // Filter visits based on search query and date range
//         const filtered = visits.filter(visit => {
//             const query = searchQuery.toLowerCase();
//             const checkInDate = visit.checkInDateTime ? new Date(visit.checkInDateTime) : null;
//             const checkOutDate = visit.checkOutDateTime ? new Date(visit.checkOutDateTime) : null;

//             const withinDateRange =
//                 (!startDate || (checkInDate && checkInDate >= startDate)) &&
//                 (!endDate || (checkOutDate && checkOutDate <= endDate));

//             const isDateMatch = searchDateObj
//                 ? checkInDate == searchDateObj
//                 : true;

//             return withinDateRange && isDateMatch && (
//                 (visit.visitorRequest && visit.visitorRequest.visitorName.toLowerCase().includes(query)) ||
//                 (visit.visitorRequest && visit.visitorRequest.employee.employeeName.toLowerCase().includes(query)) ||
//                 (visit.visitorRequest && visit.visitorRequest.employee.company.companyName.toLowerCase().includes(query)) ||
//                 visit.type.toLowerCase().includes(query) ||
//                 (visit.checkInDateTime && new Date(visit.checkInDateTime).toLocaleDateString().toLowerCase().includes(query)) ||
//                 (visit.checkOutDateTime && new Date(visit.checkOutDateTime).toLocaleDateString().toLowerCase().includes(query))
//             );
//         });
//         setFilteredVisits(filtered);
//     }, [searchQuery, visits, startDate, endDate, searchDate]);

//     const handleDownload = (format) => {
//         // Prepare data with all fields
//         const data = filteredVisits.map(visit => ({
//             ID: visit.visitId,
//             'Visitor Name': visit.visitorRequest ? visit.visitorRequest.visitorName : 'N/A',
//             'Visitor Email': visit.visitorRequest ? visit.visitorRequest.visitorEmail : 'N/A',
//             'Visitor Phone': visit.visitorRequest ? visit.visitorRequest.visitorPhone : 'N/A',
//             'Employee Name': visit.visitorRequest ? visit.visitorRequest.employee.employeeName : 'N/A',
//             'Employee Email': visit.visitorRequest ? visit.visitorRequest.employee.employeeEmail : 'N/A',
//             'Employee Phone': visit.visitorRequest ? visit.visitorRequest.employee.employeePhone : 'N/A',
//             'Company Name': visit.visitorRequest ? visit.visitorRequest.employee.company.companyName : 'N/A',
//             'Check-In DateTime': visit.checkInDateTime ? new Date(visit.checkInDateTime).toLocaleString() : 'N/A',
//             'Check-Out DateTime': visit.checkOutDateTime ? new Date(visit.checkOutDateTime).toLocaleString() : 'N/A',
//             'From DateTime': visit.fromDateTime ? new Date(visit.fromDateTime).toLocaleString() : 'N/A',
//             'To DateTime': visit.toDateTime ? new Date(visit.toDateTime).toLocaleString() : 'N/A',
//             'Check-In': visit.checkIn || 'N/A',
//             'Check-Out': visit.checkOut || 'N/A',
//             'Visiting Status': visit.visitingStatus || 'N/A',
//             'Block Status': visit.blockStatus || 'N/A',
//             Type: visit.type,
//             'Reason': visit.visitorRequest.reason || 'N/A',
//             'Total Visiting Duration': visit.totalVisitingDuration,
//         }));

//         if (format === 'csv') {
//             const csv = Papa.unparse(data);
//             const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//             saveAs(blob, 'visits.csv');
//         } else if (format === 'excel') {
//             const ws = XLSX.utils.json_to_sheet(data);
//             const wb = XLSX.utils.book_new();
//             XLSX.utils.book_append_sheet(wb, ws, 'Visits');
//             XLSX.writeFile(wb, 'visits.xlsx');
//         } else if (format === 'pdf') {
//             const doc = new jsPDF();
//             doc.autoTable({
//                 head: [['ID', 'Visitor Name', 'Visitor Email', 'Visitor Phone', 'Employee Name', 'Employee Email', 'Employee Phone', 'Type', 'Reason']],
//                 body: data.map(row => [
//                     row.ID,
//                     row['Visitor Name'],
//                     row['Visitor Email'],
//                     row['Visitor Phone'],
//                     row['Employee Name'],
//                     row['Employee Email'],
//                     row['Employee Phone'],
//                     row['Company Name'],
//                     row.Type,
//                     row['Reason'],
//                 ]),
//             });
//             doc.save('visits.pdf');
//         }

//         setModalIsOpen(false);
//     };

//     const buttonStyles = {
//         backgroundColor: '#1d4ed8', // Tailwind blue-500
//         color: 'white',
//         padding: '8px 16px',
//         borderRadius: '4px',
//         border: 'none',
//         cursor: 'pointer',
//         marginRight: '8px',
//     };

//     const modalStyles = {
//         content: {
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             width: '80%',
//             maxWidth: '500px',
//             background: 'white',
//             padding: '20px',
//             borderRadius: '10px',
//             boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//         },
//         overlay: {
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         },
//     };

//     return (
//         <div className="bg-white-100 min-h-screen p-12">
//             <div className="mx-auto bg-white rounded-lg p-12">
//                 <div className="flex items-center mb-4">
//                     <button
//                         style={buttonStyles}
//                         onClick={() => setModalIsOpen(true)}
//                     >
//                         Download Data
//                     </button>
//                     <div className="flex ml-80 gap-4">
//                         <input
//                             type="text"
//                             placeholder="Search..."
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             className="border border-gray-300 rounded ml-36 px-4 py-2"
//                         />
//                         <DatePicker
//                             selected={startDate}
//                             onChange={(date) => setStartDate(date)}
//                             placeholderText="Start Date"
//                             dateFormat="MMM d, yyyy"
//                             className="border border-gray-300 rounded px-4 py-2"
//                         />
//                         <DatePicker
//                             selected={endDate}
//                             onChange={(date) => setEndDate(date)}
//                             placeholderText="End Date"
//                             dateFormat="MMM d, yyyy"
//                             className="border border-gray-300 rounded px-4 py-2"
//                         />
//                         <DatePicker
//                             selected={searchDate}
//                             onChange={(date) => setSearchDate(date)}
//                             placeholderText="Particular Date"
//                             dateFormat="MMM d, yyyy"
//                             className="border border-gray-300 rounded px-4 py-2"
//                         />
//                         {/* <input
//                             type="date"
//                             value={searchDate}
//                             onChange={(e) => setSearchDate(e.target.value)}
//                             className="border px-2 py-1 rounded"
//                         /> */}
//                     </div>
//                 </div>
//                 <h1 className="text-2xl font-bold mb-4">All Visits</h1>
//                 <table className="w-full border-collapse">
//                     <thead>
//                         <tr className="bg-white-200">
//                             <th className="border px-4 py-2">ID</th>
//                             <th className="border px-4 py-2">Visitor Name</th>
//                             <th className="border px-4 py-2">Visitor Email</th>
//                             <th className="border px-4 py-2">Visitor Phone</th>
//                             <th className="border px-4 py-2">Employee Name</th>
//                             <th className="border px-4 py-2">Company Name</th>
//                             <th className="border px-4 py-2">Type</th>
//                             <th className="border px-4 py-2">Reason</th>
//                             <th className="border px-4 py-2">Total Visiting Duration</th>
//                             <th className="border px-4 py-2">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredVisits.map(visit => (
//                             <tr key={visit.visitId}>
//                                 <td className="border px-4 py-2">{visit.visitId}</td>
//                                 <td className="border px-4 py-2">{visit.visitorRequest ? visit.visitorRequest.visitorName : 'N/A'}</td>
//                                 <td className="border px-4 py-2">{visit.visitorRequest ? visit.visitorRequest.visitorEmail : 'N/A'}</td>
//                                 <td className="border px-4 py-2">{visit.visitorRequest ? visit.visitorRequest.visitorPhone : 'N/A'}</td>
//                                 <td className="border px-4 py-2">{visit.visitorRequest ? visit.visitorRequest.employee.employeeName : 'N/A'}</td>
//                                 <td className="border px-4 py-2">{visit.visitorRequest ? visit.visitorRequest.employee.company.companyName : 'N/A'}</td>
//                                 <td className="border px-4 py-2">{visit.type}</td>
//                                 <td className="border px-4 py-2">{visit.visitorRequest ? visit.visitorRequest.reason : 'N/A'}</td>
//                                 <td className="border px-4 py-2">{visit.totalVisitingDuration}</td>
//                                 <td className="border px-4 py-2 flex">
//                                     <Link to={`/visitview/${visit.visitId}`} className="bg-blue-500 text-white py-1 px-2 rounded mr-2">View</Link>
//                                     <Link to={`/visitedit/${visit.visitId}`} className="bg-yellow-500 text-white py-1 px-2 rounded mr-2">Edit</Link>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             <Modal
//                 isOpen={modalIsOpen}
//                 onRequestClose={() => setModalIsOpen(false)}
//                 contentLabel="Download Options"
//                 style={modalStyles}
//                 closeTimeoutMS={300} // Match this with your CSS transition
//             >
//                 <div className="modal-header flex justify-between items-center mb-4">
//                     <h2 className="text-2xl font-bold">Download Options</h2>
//                     <button
//                         className="text-gray-600 hover:text-gray-900"
//                         onClick={() => setModalIsOpen(false)}
//                         aria-label="Close"
//                     >
//                         <FaTimes size={24} />
//                     </button>
//                 </div>
//                 <div className="flex flex-col gap-4">
//                     <button
//                         className="flex items-center bg-green-500 text-white py-2 px-4 rounded shadow-md transition-transform transform hover:scale-105"
//                         onClick={() => handleDownload('pdf')}
//                     >
//                         <FaFilePdf size={20} className="mr-2" />
//                         Download as PDF
//                     </button>
//                     <button
//                         className="flex items-center bg-blue-500 text-white py-2 px-4 rounded shadow-md transition-transform transform hover:scale-105"
//                         onClick={() => handleDownload('excel')}
//                     >
//                         <FaFileExcel size={20} className="mr-2" />
//                         Download as Excel
//                     </button>
//                     <button
//                         className="flex items-center bg-gray-500 text-white py-2 px-4 rounded shadow-md transition-transform transform hover:scale-105"
//                         onClick={() => handleDownload('csv')}
//                     >
//                         <FaFileCsv size={20} className="mr-2" />
//                         Download as CSV
//                     </button>
//                 </div>
//                 <button
//                     className="block w-full mt-4 bg-red-500 text-white py-2 px-4 rounded shadow-md transition-transform transform hover:scale-105"
//                     onClick={() => setModalIsOpen(false)}
//                 >
//                     Close
//                 </button>
//             </Modal>
//         </div>
//     );
// };

// export default VisitViewAll;





import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Modal from 'react-modal';
import { FaFilePdf, FaFileExcel, FaFileCsv, FaTimes } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const VisitViewAll = () => {
    const [visits, setVisits] = useState([]);
    const [filteredVisits, setFilteredVisits] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [searchDate, setSearchDate] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:6789/visits')
            .then(response => {
                setVisits(response.data);
                setFilteredVisits(response.data); // Initialize with all visits
            })
            .catch(error => {
                console.error('There was an error fetching the visits!', error);
            });
    }, []);

    useEffect(() => {
        const filtered = visits.filter(visit => {
            const query = searchQuery.toLowerCase();
            const checkInDate = visit.checkInDateTime ? new Date(visit.checkInDateTime) : null;
            const checkOutDate = visit.checkOutDateTime ? new Date(visit.checkOutDateTime) : null;

            const withinDateRange =
                (!startDate || (checkInDate && checkInDate >= startDate)) &&
                (!endDate || (checkOutDate && checkOutDate <= endDate));

            const isDateMatch = searchDate
                ? checkInDate && checkInDate.toDateString() === searchDate.toDateString()
                : true;

            return withinDateRange && isDateMatch && (
                (visit.visitorRequest && visit.visitorRequest.visitorName.toLowerCase().includes(query)) ||
                (visit.visitorRequest && visit.visitorRequest.employee.employeeName.toLowerCase().includes(query)) ||
                (visit.visitorRequest && visit.visitorRequest.employee.company.companyName.toLowerCase().includes(query)) ||
                visit.type.toLowerCase().includes(query) ||
                (visit.checkInDateTime && new Date(visit.checkInDateTime).toLocaleDateString().toLowerCase().includes(query)) ||
                (visit.checkOutDateTime && new Date(visit.checkOutDateTime).toLocaleDateString().toLowerCase().includes(query))
            );
        });
        setFilteredVisits(filtered);
    }, [searchQuery, visits, startDate, endDate, searchDate]);

    const handleDownload = (format) => {
        const data = filteredVisits.map(visit => ({
            ID: visit.visitId,
            'Visitor Name': visit.visitorRequest ? visit.visitorRequest.visitorName : 'N/A',
            'Visitor Email': visit.visitorRequest ? visit.visitorRequest.visitorEmail : 'N/A',
            'Visitor Phone': visit.visitorRequest ? visit.visitorRequest.visitorPhone : 'N/A',
            'Employee Name': visit.visitorRequest ? visit.visitorRequest.employee.employeeName : 'N/A',
            'Employee Email': visit.visitorRequest ? visit.visitorRequest.employee.employeeEmail : 'N/A',
            'Employee Phone': visit.visitorRequest ? visit.visitorRequest.employee.employeePhone : 'N/A',
            'Company Name': visit.visitorRequest ? visit.visitorRequest.employee.company.companyName : 'N/A',
            'Check-In DateTime': visit.checkInDateTime ? new Date(visit.checkInDateTime).toLocaleString() : 'N/A',
            'Check-Out DateTime': visit.checkOutDateTime ? new Date(visit.checkOutDateTime).toLocaleString() : 'N/A',
            'From DateTime': visit.fromDateTime ? new Date(visit.fromDateTime).toLocaleString() : 'N/A',
            'To DateTime': visit.toDateTime ? new Date(visit.toDateTime).toLocaleString() : 'N/A',
            'Check-In': visit.checkIn || 'N/A',
            'Check-Out': visit.checkOut || 'N/A',
            'Visiting Status': visit.visitingStatus || 'N/A',
            'Block Status': visit.blockStatus || 'N/A',
            Type: visit.type,
            'Reason': visit.visitorRequest.reason || 'N/A',
            'Total Visiting Duration': visit.totalVisitingDuration,
        }));

        if (format === 'csv') {
            const csv = Papa.unparse(data);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            saveAs(blob, 'visits.csv');
        } else if (format === 'excel') {
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Visits');
            XLSX.writeFile(wb, 'visits.xlsx');
        } else if (format === 'pdf') {
            const doc = new jsPDF();
            doc.autoTable({
                head: [['ID', 'Visitor Name', 'Visitor Email', 'Visitor Phone', 'Employee Name', 'Employee Email', 'Employee Phone', 'Company Name', 'Type', 'Reason']],
                body: data.map(row => [
                    row.ID,
                    row['Visitor Name'],
                    row['Visitor Email'],
                    row['Visitor Phone'],
                    row['Employee Name'],
                    row['Employee Email'],
                    row['Employee Phone'],
                    row['Company Name'],
                    row.Type,
                    row['Reason'],
                ]),
            });
            doc.save('visits.pdf');
        }

        setModalIsOpen(false);
    };

    const buttonStyles = {
        backgroundColor: '#1d4ed8', // Tailwind blue-500
        color: 'white',
        padding: '8px 16px',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        marginRight: '8px',
    };

    const modalStyles = {
        content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: '500px',
            background: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
    };

    return (
        <div className="bg-white-100 min-h-screen p-12">
            <div className="mx-auto bg-white rounded-lg p-12">
                <div className="flex items-center justify-end mb-4">
                    <div className='mr-60'>
                    <button
                        style={buttonStyles}
                        onClick={() => setModalIsOpen(true)}
                    >
                        Download Data
                    </button></div>
                    <div className="flex ml-6  gap-4">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border border-gray-300 rounded  px-4 py-2"
                        />
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            placeholderText="Start Date"
                            dateFormat="MMM d, yyyy"
                            className="border border-gray-300 rounded px-4 py-2"
                        />
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            placeholderText="End Date"
                            dateFormat="MMM d, yyyy"
                            className="border border-gray-300 rounded px-4 py-2"
                        />
                        <DatePicker
                            selected={searchDate}
                            onChange={(date) => setSearchDate(date)}
                            placeholderText="Particular Date"
                            dateFormat="MMM d, yyyy"
                            className="border border-gray-300 rounded px-4 py-2"
                        />
                    </div>
                </div>
                <h1 className="text-2xl font-bold mb-4">All Visits</h1>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-white-200">
                            <th className="border px-4 py-2">ID</th>
                            <th className="border px-4 py-2">Visitor Name</th>
                            <th className="border px-4 py-2">Visitor Email</th>
                            <th className="border px-4 py-2">Visitor Phone</th>
                            <th className="border px-4 py-2">Employee Name</th>
                            <th className="border px-4 py-2">Company Name</th>
                            <th className="border px-4 py-2">Type</th>
                            <th className="border px-4 py-2">Reason</th>
                            <th className="border px-4 py-2">Total Visiting Duration</th>
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVisits.map(visit => (
                            <tr key={visit.visitId}>
                                <td className="border px-4 py-2">{visit.visitId}</td>
                                <td className="border px-4 py-2">{visit.visitorRequest ? visit.visitorRequest.visitorName : 'N/A'}</td>
                                <td className="border px-4 py-2">{visit.visitorRequest ? visit.visitorRequest.visitorEmail : 'N/A'}</td>
                                <td className="border px-4 py-2">{visit.visitorRequest ? visit.visitorRequest.visitorPhone : 'N/A'}</td>
                                <td className="border px-4 py-2">{visit.visitorRequest ? visit.visitorRequest.employee.employeeName : 'N/A'}</td>
                                <td className="border px-4 py-2">{visit.visitorRequest ? visit.visitorRequest.employee.company.companyName : 'N/A'}</td>
                                <td className="border px-4 py-2">{visit.type}</td>
                                <td className="border px-4 py-2">{visit.visitorRequest ? visit.visitorRequest.reason : 'N/A'}</td>
                                <td className="border px-4 py-2">{visit.totalVisitingDuration}</td>
                                <td className="border px-4 py-2 flex">
                                    <Link to={`/visitview/${visit.visitId}`} className="bg-blue-500 text-white py-1 px-2 rounded mr-2">View</Link>
                                    <Link to={`/visitedit/${visit.visitId}`} className="bg-yellow-500 text-white py-1 px-2 rounded mr-2">Edit</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Download Options"
                style={modalStyles}
                closeTimeoutMS={300}
            >
                <div className="modal-header flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Download Options</h2>
                    <button
                        className="text-gray-600 hover:text-gray-900"
                        onClick={() => setModalIsOpen(false)}
                        aria-label="Close"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>
                <div className="flex flex-col gap-4">
                    <button
                        className="flex items-center bg-green-500 text-white py-2 px-4 rounded shadow-md transition-transform transform hover:scale-105"
                        onClick={() => handleDownload('pdf')}
                    >
                        <FaFilePdf size={20} className="mr-2" />
                        Download as PDF
                    </button>
                    <button
                        className="flex items-center bg-blue-500 text-white py-2 px-4 rounded shadow-md transition-transform transform hover:scale-105"
                        onClick={() => handleDownload('excel')}
                    >
                        <FaFileExcel size={20} className="mr-2" />
                        Download as Excel
                    </button>
                    <button
                        className="flex items-center bg-gray-500 text-white py-2 px-4 rounded shadow-md transition-transform transform hover:scale-105"
                        onClick={() => handleDownload('csv')}
                    >
                        <FaFileCsv size={20} className="mr-2" />
                        Download as CSV
                    </button>
                </div>
                <button
                    className="block w-full mt-4 bg-red-500 text-white py-2 px-4 rounded shadow-md transition-transform transform hover:scale-105"
                    onClick={() => setModalIsOpen(false)}
                >
                    Close
                </button>
            </Modal>
        </div>
    );
};

export default VisitViewAll;
