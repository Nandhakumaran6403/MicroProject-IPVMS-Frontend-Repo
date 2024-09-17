import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import { useNavigate } from 'react-router-dom';

const VisitorRequestViewAllToday = () => {
    const [visitorRequests, setVisitorRequests] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const passModalRef = useRef(null);
    const [testId, setTestId] = useState('');
    const navigate = useNavigate();
    const [passDetails, setPassDetails] = useState(null);
    const [visitorRequestResponse, setVisitorRequestResponse] = useState(null);

    useEffect(() => {
        const fetchVisitorRequests = async () => {
            try {
                const response = await axios.get('http://localhost:6789/visitorrequests/all');
                const requests = response.data;

                // Get the current date and time (rounded to minutes)
                const now = new Date();
                now.setSeconds(0);
                now.setMilliseconds(0);
                const currentDateTime = now.toISOString().split('T')[0];

                // Filter and sort requests
                const filteredRequests = requests
                    .filter(request => new Date(request.visitorRequestDateTime).toISOString().split('T')[0] === currentDateTime)
                    .sort((a, b) => new Date(b.visitorRequestDateTime) - new Date(a.visitorRequestDateTime));

                setVisitorRequests(filteredRequests);
            } catch (error) {
                console.error('Error fetching visitor requests:', error);
            }
        };

        fetchVisitorRequests();
    }, []);

    function nandha() {
        const qrSession = sessionStorage.getItem('qrvalue');
        console.log(qrSession);
        setTestId(qrSession);
    }

    const handleGeneratePass = async (id) => {
        try {
            const response = await axios.get(`http://localhost:6789/visitorrequests/${id}`);
            const visitorRequest = response.data;
            setVisitorRequestResponse(visitorRequest);

            if (visitorRequest.status === "approved") {
                const currentDateTime = new Date().toISOString();
                const fromDateTime = currentDateTime;
                const toDateTime = new Date();
                toDateTime.setHours(18, 0, 0);
                const toDateTimeString = toDateTime.toISOString();
                const visitData = {
                    visitorRequest: {
                        requestId: id,
                    },
                    fromDateTime,
                    toDateTime: toDateTimeString,
                    type: "General Visit",
                };

                const visitResponse = await axios.post("http://localhost:6789/visits", visitData);
                if (visitResponse) {
                    const visitingId = visitResponse.data.visitId;
                    sessionStorage.setItem('qrvalue', visitingId);
                    nandha();
                }

                // Set pass details to display the pass modal
                setPassDetails({
                    name: visitorRequest.visitorName,
                    type: visitData.type,
                });

            } else {
                console.error("Visitor request not approved");
                alert("Visitor request is not approved. Pass cannot be generated.");
            }
        } catch (error) {
            console.error("Error generating pass:", error);
            alert("Failed to generate pass. Please check the console for details.");
        }
    };

    const handleDownloadPass = async () => {
        if (passModalRef.current) {
            try {
                const canvas = await html2canvas(passModalRef.current);
                const imgData = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = imgData;
                link.download = "visitor-pass.png";
                link.click();
                sessionStorage.removeItem('qrvalue');
                navigate("/receptionistmain");
            } catch (error) {
                console.error("Error generating download:", error);
                alert("Failed to generate pass for download.");
            }
        }
    };

    const handlePassModalClose = () => {
        setPassDetails(null);
    };

    // Filtered visitor requests based on search query
    const filteredRequests = visitorRequests.filter(request =>
        request.visitorName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Today All Visitor Requests</h1>
            
            {/* Search bar */}
            <div className="mb-4 flex justify-end">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 w-64"
                />
            </div>

            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitor Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRequests.map((request) => (
                        <tr key={request.requestId}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.requestId}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.visitorName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.visitorEmail}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.visitorPhone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.status}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {request.visitorImageBlob && (
                                    <img
                                        src={`data:image/jpeg;base64,${request.visitorImageBlob}`}
                                        alt="Visitor"
                                        className="w-16 h-16 object-cover rounded-md"
                                    />
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    onClick={() => navigate(`/visitorrequestview/${request.requestId}`)}
                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                >
                                    View
                                </button>
                                {request.status === "approved" && (
                                    <button
                                        onClick={() => handleGeneratePass(request.requestId)}
                                        className="text-green-600 hover:text-green-900"
                                    >
                                        Generate Pass
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pass Modal */}
            {passDetails && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center p-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
                        <div ref={passModalRef} className="bg-white rounded-lg">
                        <p className="font-bold text-xl text-center p-1">Visitor Pass</p>
                            <div className="flex">
                                <img
                                    src={`data:image/jpeg;base64,${visitorRequestResponse.visitorImageBlob}`}
                                    alt="Pass Image"
                                    className="w-60 h-60 p-6"
                                />
                                <div className="ml-4">
                                    <h2 className="text-xl font-bold p-3">
                                        Name: {passDetails.name}
                                    </h2>
                                    <p className="text-sm font-bold px-3">
                                        Type: {passDetails.type}
                                    </p>
                                    <div className="mt-4">
                                        <QRCodeCanvas value={testId} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between mt-4">
                                <button
                                    onClick={handlePassModalClose}
                                    className="bg-red-500 text-white py-2 px-4 rounded"
                                >
                                    Close
                                </button>
                                <div className="flex">
                                    <button
                                        onClick={handleDownloadPass}
                                        className="bg-green-500 text-white py-2 px-4 rounded"
                                    >
                                        Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
            )}
        </div>
    );
};

export default VisitorRequestViewAllToday;
