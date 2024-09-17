// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import { FaEdit, FaArrowLeft } from 'react-icons/fa';
// import { motion } from 'framer-motion';
// import classNames from 'classnames';

// // Utility function to calculate distance between two coordinates
// const getDistance = (lat1, lng1, lat2, lng2) => {
//     const toRad = (value) => (value * Math.PI) / 180;
//     const earthRadiusKm = 6371;
//     const dLat = toRad(lat2 - lat1);
//     const dLng = toRad(lng2 - lng1);
//     const a = Math.sin(dLat / 2) ** 2 +
//         Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
//         Math.sin(dLng / 2) ** 2;
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return earthRadiusKm * c;
// };

// // Function to generate a random offset
// const getRandomOffset = (maxOffset) => {
//     return (Math.random() - 0.5) * 2 * maxOffset;
// };

// const VisitView = () => {
//     const [visit, setVisit] = useState(null);
//     const [itParkCenter, setItParkCenter] = useState(null);
//     const { visitId } = useParams();
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchCurrentLocation = () => {
//             if (navigator.geolocation) {
//                 navigator.geolocation.getCurrentPosition(
//                     (position) => {
//                         const { latitude, longitude } = position.coords;
//                         setItParkCenter({ lat: latitude, lng: longitude });
//                     },
//                     (error) => {
//                         console.error('Error fetching location:', error);
//                         setItParkCenter({ lat: 12.9716, lng: 77.5946 }); // Default location
//                     }
//                 );
//             } else {
//                 setItParkCenter({ lat: 12.9716, lng: 77.5946 }); // Default location
//             }
//         };

//         fetchCurrentLocation();

//         const fetchVisit = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:6789/visits/${visitId}`);
//                 setVisit(response.data);
//             } catch (error) {
//                 console.error('Error fetching visit:', error);
//             }
//         };

//         fetchVisit();
//     }, [visitId]);

//     const handleEdit = () => {
//         navigate(`/visitedit/${visitId}`);
//     };

//     const handleBack = () => {
//         navigate('/visitviewall');
//     };

//     if (!itParkCenter || !visit) return <p>Loading...</p>;

//     const maxOffset = 0.003;
//     const visitorLocation = {
//         lat: visit.visitorLatitude ?? itParkCenter.lat + getRandomOffset(maxOffset),
//         lng: visit.visitorLongitude ?? itParkCenter.lng + getRandomOffset(maxOffset),
//     };

//     const rangeKm = 5;
//     const distance = getDistance(itParkCenter.lat, itParkCenter.lng, visitorLocation.lat, visitorLocation.lng);
//     const isWithinRange = distance <= rangeKm;

//     return (
//         <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg ">
//             <h1 className="text-3xl font-bold mb-6 text-blue-600">Visit Details</h1>

           

//             <div className="mb-6 space-y-4 p-12">
//                 {/* <p><strong>Visit ID:</strong> {visit.visitId}</p> */}
//                 <p><strong>Request ID:</strong> { visit.visitorRequest ? visit.visitorRequest.visitorName : 'N/A'}</p>
//                 <p><strong>Request ID:</strong> {visit.visitorRequest ? visit.visitorRequest.visitorEmail : 'N/A'}</p>
//                 <p><strong>Request ID:</strong> {visit.visitorRequest ? visit.visitorRequest.visitorPhone : 'N/A'}</p>
//                 <p><strong>Request ID:</strong> { visit.visitorRequest ? visit.visitorRequest.employee.employeeName : 'N/A'}</p>
//                 <p><strong>Request ID:</strong> {visit.visitorRequest ? visit.visitorRequest.employee.employeeEmail : 'N/A'}</p>
//                 <p><strong>Request ID:</strong> {visit.visitorRequest ? visit.visitorRequest.employee.employeePhone : 'N/A'}</p>
//                 <p><strong>Check-In DateTime:</strong> {visit.checkInDateTime ? new Date(visit.checkInDateTime).toLocaleString() : 'N/A'}</p>
//                 <p><strong>Check-Out DateTime:</strong> {visit.checkOutDateTime ? new Date(visit.checkOutDateTime).toLocaleString() : 'N/A'}</p>
//                 <p><strong>From DateTime:</strong> {new Date(visit.fromDateTime).toLocaleString()}</p>
//                 <p><strong>To DateTime:</strong> {new Date(visit.toDateTime).toLocaleString()}</p>
//                 <p><strong>Check-In:</strong> {visit.checkIn}</p>
//                 <p><strong>Check-Out:</strong> {visit.checkOut}</p>
//                 <p><strong>Visiting Status:</strong> {visit.visitingStatus}</p>
//                 <p><strong>Type:</strong> {visit.type}</p>
//                 <p><strong>Block Status:</strong> {visit.blockStatus}</p>
//                 <p><strong>Total Visiting Duration:</strong> {visit.totalVisitingDuration} seconds</p>
//             </div>

//             <motion.div
//                 className="mb-6 h-80"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 1 }}
//             >
//                 <MapContainer center={itParkCenter} zoom={14} style={{ height: '100%', width: '100%' }}>
//                     <TileLayer
//                         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                         attribution='&copy; <Link to="https://www.openstreetmap.org/copyright">OpenStreetMap</Link> contributors'
//                     />
//                     <Marker
//                         position={itParkCenter}
//                         icon={L.icon({ iconUrl: '/path-to-it-park-icon.png', iconSize: [40, 40] })}
//                     >
//                         <Popup><strong>IT Park Center</strong></Popup>
//                     </Marker>
//                     {isWithinRange && (
//                         <Marker
//                             position={visitorLocation}
//                             icon={L.icon({ iconUrl: '/path-to-visitor-icon.png', iconSize: [40, 40] })}
//                         >
//                             <Popup><strong>{visit.visitorRequest.visitorName}</strong></Popup>
//                         </Marker>
//                     )}
//                     <Circle center={itParkCenter} radius={500} color="blue" fillColor="blue" fillOpacity={0.2} />
//                 </MapContainer>
//             </motion.div>

//             <div className="flex space-x-4">
//                 <motion.button
//                     onClick={handleEdit}
//                     className="bg-yellow-500 text-white px-6 py-3 rounded-md shadow-md flex items-center space-x-2 transition-transform transform hover:scale-105"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                 >
//                     <FaEdit />
//                     <span>Edit</span>
//                 </motion.button>
//                 <motion.button
//                     onClick={handleBack}
//                     className="bg-gray-500 text-white px-6 py-3 rounded-md shadow-md flex items-center space-x-2 transition-transform transform hover:scale-105"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                 >
//                     <FaArrowLeft />
//                     <span>Back</span>
//                 </motion.button>
//             </div>
//         </div>
//     );
// };

// export default VisitView;





import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaEdit, FaArrowLeft, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Modal from 'react-modal';
import classNames from 'classnames';

// Utility function to calculate distance between two coordinates
const getDistance = (lat1, lng1, lat2, lng2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const earthRadiusKm = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
};

// Function to generate a random offset
const getRandomOffset = (maxOffset) => {
    return (Math.random() - 0.5) * 2 * maxOffset;
};

// Modal custom styles
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: '50%',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        height: '60%',
    },
};

const VisitView = () => {
    const [visit, setVisit] = useState(null);
    const [itParkCenter, setItParkCenter] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isMapVisible, setIsMapVisible] = useState(false);
    const { visitId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCurrentLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setItParkCenter({ lat: latitude, lng: longitude });
                    },
                    (error) => {
                        console.error('Error fetching location:', error);
                        setItParkCenter({ lat: 12.9716, lng: 77.5946 }); // Default location
                    }
                );
            } else {
                setItParkCenter({ lat: 12.9716, lng: 77.5946 }); // Default location
            }
        };

        fetchCurrentLocation();

        const fetchVisit = async () => {
            try {
                const response = await axios.get(`http://localhost:6789/visits/${visitId}`);
                setVisit(response.data);
            } catch (error) {
                console.error('Error fetching visit:', error);
            }
        };

        fetchVisit();
    }, [visitId]);

    const handleEdit = () => {
        navigate(`/visitedit/${visitId}`);
    };

    const handleBack = () => {
        navigate('/visitviewall');
    };

    const openModal = () => {
        setIsMapVisible(true);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setIsMapVisible(false);
    };

    if (!itParkCenter || !visit) return <p>Loading...</p>;

    const maxOffset = 0.003;
    const visitorLocation = {
        lat: visit.visitorLatitude ?? itParkCenter.lat + getRandomOffset(maxOffset),
        lng: visit.visitorLongitude ?? itParkCenter.lng + getRandomOffset(maxOffset),
    };

    const rangeKm = 5;
    const distance = getDistance(itParkCenter.lat, itParkCenter.lng, visitorLocation.lat, visitorLocation.lng);
    const isWithinRange = distance <= rangeKm;
    const isVisitorInside = visit.checkIn && !visit.checkOut;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-blue-600">Visit Details</h1>

            <div className="mb-6 space-y-4 p-12">
                <p><strong>Request ID:</strong> { visit.visitorRequest ? visit.visitorRequest.visitorName : 'N/A'}</p>
                <p><strong>Email:</strong> {visit.visitorRequest ? visit.visitorRequest.visitorEmail : 'N/A'}</p>
                <p><strong>Phone:</strong> {visit.visitorRequest ? visit.visitorRequest.visitorPhone : 'N/A'}</p>
                <p><strong>Employee Name:</strong> {visit.visitorRequest ? visit.visitorRequest.employee.employeeName : 'N/A'}</p>
                <p><strong>Employee Email:</strong> {visit.visitorRequest ? visit.visitorRequest.employee.employeeEmail : 'N/A'}</p>
                <p><strong>Employee Phone:</strong> {visit.visitorRequest ? visit.visitorRequest.employee.employeePhone : 'N/A'}</p>
                <p><strong>Check-In DateTime:</strong> {visit.checkInDateTime ? new Date(visit.checkInDateTime).toLocaleString() : 'N/A'}</p>
                <p><strong>Check-Out DateTime:</strong> {visit.checkOutDateTime ? new Date(visit.checkOutDateTime).toLocaleString() : 'N/A'}</p>
                <p><strong>From DateTime:</strong> {new Date(visit.fromDateTime).toLocaleString()}</p>
                <p><strong>To DateTime:</strong> {new Date(visit.toDateTime).toLocaleString()}</p>
                <p><strong>Check-In:</strong> {visit.checkIn ? visit.checkIn : 'N/A'}</p>
                <p><strong>Check-Out:</strong> {visit.checkOut ? visit.checkOut : 'N/A'}</p>
                <p><strong>Visiting Status:</strong> {visit.visitingStatus ? visit.visitingStatus : 'N/A'}</p>
                <p><strong>Type:</strong> {visit.type}</p>
                <p><strong>Block Status:</strong> {visit.blockStatus ? visit.blockStatus : 'N/A'}</p>
                <p><strong>Total Visiting Duration:</strong> {visit.totalVisitingDuration} seconds</p>
            </div>

            <div className="flex space-x-4">
                <motion.button
                    onClick={handleEdit}
                    className="bg-yellow-500 text-white px-6 py-3 rounded-md shadow-md flex items-center space-x-2 transition-transform transform hover:scale-105"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FaEdit />
                    <span>Edit</span>
                </motion.button>
                <motion.button
                    onClick={handleBack}
                    className="bg-gray-500 text-white px-6 py-3 rounded-md shadow-md flex items-center space-x-2 transition-transform transform hover:scale-105"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FaArrowLeft />
                    <span>Back</span>
                </motion.button>
                <motion.button
                    onClick={openModal}
                    className={classNames("bg-blue-500 text-white px-6 py-3 rounded-md shadow-md flex items-center space-x-2 transition-transform transform hover:scale-105", {
                        'opacity-50 cursor-not-allowed': !isVisitorInside
                    })}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!isVisitorInside}
                >
                    <FaMapMarkerAlt />
                    <span>Locate</span>
                </motion.button>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Visitor Location"
            >
                {isVisitorInside ? (
                    <MapContainer center={itParkCenter} zoom={14} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker
                            position={itParkCenter}
                            icon={L.icon({ iconUrl: '/path-to-it-park-icon.png', iconSize: [40,40] })}
                            >
                                <Popup><strong>IT Park Center</strong></Popup>
                            </Marker>
                            {isWithinRange && (
                                <Marker
                                    position={visitorLocation}
                                    icon={L.icon({ iconUrl: '/path-to-visitor-icon.png', iconSize: [40, 40] })}
                                >
                                    <Popup><strong>{visit.visitorRequest.visitorName}</strong></Popup>
                                </Marker>
                            )}
                            <Circle center={itParkCenter} radius={500} color="blue" fillColor="blue" fillOpacity={0.2} />
                        </MapContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full w-full">
                            <p>The Visitor is not inside the IT Park. So we can't share the location of the visitor.</p>
                        </div>
                    )}
                    {/* <button
                        onClick={closeModal}
                        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md"
                    >
                        Close
                    </button> */}
                </Modal>
             </div>  
        );
    };
    
    export default VisitView;
    