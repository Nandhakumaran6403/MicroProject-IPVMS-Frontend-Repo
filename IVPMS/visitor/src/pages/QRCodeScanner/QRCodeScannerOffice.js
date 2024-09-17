import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader'; // Ensure you have the latest version
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle } from 'react-icons/fa';
import { AiOutlineLoading } from 'react-icons/ai';

const QRCodeScannerOffice = () => {
  const [scannedData, setScannedData] = useState(null);
  const [visitData, setVisitData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showValidityWarning, setShowValidityWarning] = useState(false);
  const [showNotAvailableWarning, setShowNotAvailableWarning] = useState(false);
  const [showNotAvailableWarningCompany, setShowNotAvailableWarningCompany] = useState(false);
  const [showNotAvailableWarningNot, setShowNotAvailableWarningNot] = useState(false);
  const navigate = useNavigate();
  const companyName = 'Nandha Pvt Ltd';

  // Function to handle QR scan result
  const handleScan = async (result) => {
    if (result?.text) {
      const visitId = result.text; // Assuming result.text is the visitId
      setScannedData(visitId);
      await fetchVisitData(visitId); // Ensure data is fetched before updating modal state
    }
  };

  // Function to handle QR scan error
  const handleError = (error) => {
    console.error("QR Scan Error: ", error);
  };

  // Fetch visit data from the server using visitId
  const fetchVisitData = async (visitId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:6789/visits/${visitId}`);
      setVisitData(response.data);
      setOpenModal(true);
    } catch (error) {
      console.error("Error fetching visit data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle "Visited" action
  const handleVisited = async () => {
    setLoading(true);
    try {
      if (visitData.checkIn !== 'checked-in') {
        setShowNotAvailableWarningNot(true);
        return;
      }

      if (visitData.visitingStatus === 'Visited' || visitData.checkOut) {
        setShowNotAvailableWarning(true);
        return;
      }

      if (visitData.visitorRequest.employee.company.companyName !== 'Nandha Pvt Ltd') {
        setShowNotAvailableWarningCompany(true);
        return;
      }

      const updatedData = { ...visitData, visitingStatus: 'Visited' };
      const response = await axios.put(`http://localhost:6789/visits/${visitData.visitId}`, updatedData);
      setVisitData(response.data);

      const emailSend = response.data;
      const emailRequestData = {
        employeeEmail: emailSend.visitorRequest.employee.employeeEmail,
        visitorName: emailSend.visitorRequest.visitorName,
        visitorEmail: emailSend.visitorRequest.visitorEmail,
        visitorPhone: emailSend.visitorRequest.visitorPhone,
        reason: emailSend.visitorRequest.reason,
      };

      await axios.post("http://localhost:6789/api/sendvisitoffice", emailRequestData);
    } catch (error) {
      console.error("Error updating visit status:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format Date object into a readable string
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleString() : 'N/A';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-green-100">
      <div className="w-full max-w-md p-4 bg-white shadow-lg rounded-lg border border-gray-200">
        <QrReader
          onResult={handleScan} // Ensure this is the correct prop name for your library version
          onError={handleError}
          style={{ width: '100%' }}
        />
      </div>

      {/* Main Visit Details Modal */}
      <Transition appear show={openModal} as={Fragment}>
        <Dialog as="div" open={openModal} onClose={() => setOpenModal(false)}>
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4 mt-16">
            <Dialog.Panel className="max-w-sm mx-auto bg-white rounded-lg p-6 shadow-xl transform transition-all">
              <Dialog.Title className="text-xl font-semibold mb-4 text-gray-800 flex items-center space-x-2">
                <FaCheckCircle className="text-green-500" />
                <span>Visit Details</span>
              </Dialog.Title>
              {loading ? (
                <div className="flex justify-center items-center">
                  <AiOutlineLoading className="animate-spin text-blue-500" size={24} />
                  <span className="ml-2">Loading...</span>
                </div>
              ) : (
                visitData && (
                  <div>
                     {visitData.visitorRequest.visitorImageBlob && (
                <div className="mb-6 flex justify-center">
                    <img
                        src={`data:image/jpeg;base64,${visitData.visitorRequest.visitorImageBlob}`}
                        alt="Visitor"
                        className="w-80 h-auto   rounded-lg shadow-md transition-transform transform hover:scale-105"
                    />
                </div>
            )}
                    <p className="text-gray-600 mb-2"><strong>Visitor Name:</strong> {visitData.visitorRequest.visitorName}</p>
                    <p className="text-gray-600 mb-2"><strong>Visit Type:</strong> {visitData.type}</p>
                    <p className="text-gray-600 mb-2"><strong>Employee Name:</strong> {visitData.visitorRequest.employee.employeeName}</p>
                    {/* <p className="text-gray-600 mb-2"><strong>Check-in:</strong> {visitData.checkIn || 'Not checked in'}</p> */}
                    <p className="text-gray-600 mb-2"><strong>Check-in DateTime:</strong> {formatDate(visitData.checkInDateTime)}</p>
                    {/* <p className="text-gray-600 mb-2"><strong>Check-out:</strong> {visitData.checkOut || 'Not checked out'}</p> */}
                    <p className="text-gray-600 mb-4"><strong>Check-out DateTime:</strong> {formatDate(visitData.checkOutDateTime)}</p>

                    <div className="mt-4 flex space-x-4">
                      {!visitData.visitingStatus && (
                        <button
                          onClick={handleVisited}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Mark as Visited
                        </button>
                      )}
                    </div>
                  </div>
                )
              )}
              <button
                onClick={() => setOpenModal(false)}
                className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      {/* Validity Warning Modal */}
      <Transition appear show={showValidityWarning} as={Fragment}>
        <Dialog as="div" open={showValidityWarning} onClose={() => setShowValidityWarning(false)}>
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="max-w-sm mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-6 shadow-xl transform transition-all">
              <Dialog.Title className="text-xl font-semibold mb-4 text-gray-800 flex items-center space-x-2">
                <FaExclamationCircle className="text-yellow-600" />
                <span>Validity Warning</span>
              </Dialog.Title>
              <p className="text-gray-600">The visiting validity of this visitor has been exceeded.</p>
              <button
                onClick={() => setShowValidityWarning(false)}
                className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Close
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      {/* Not Available Warning Modal */}
      <Transition appear show={showNotAvailableWarning} as={Fragment}>
        <Dialog as="div" open={showNotAvailableWarning} onClose={() => setShowNotAvailableWarning(false)}>
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="max-w-sm mx-auto bg-red-50 border border-red-200 rounded-lg p-6 shadow-xl transform transition-all">
              <Dialog.Title className="text-xl font-semibold mb-4 text-gray-800 flex items-center space-x-2">
                <FaTimesCircle className="text-red-600" />
                <span>Not Available Warning</span>
              </Dialog.Title>
              <p className="text-gray-600">You are not available with this pass as the visit has already been checked out or marked as visited.</p>
              <button
                onClick={() => setShowNotAvailableWarning(false)}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Close
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      {/* Not Allowed Warning Modal (Company) */}
      <Transition appear show={showNotAvailableWarningCompany} as={Fragment}>
        <Dialog as="div" open={showNotAvailableWarningCompany} onClose={() => setShowNotAvailableWarningCompany(false)}>
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="max-w-sm mx-auto bg-red-50 border border-red-200 rounded-lg p-6 shadow-xl transform transition-all">
              <Dialog.Title className="text-xl font-semibold mb-4 text-gray-800 flex items-center space-x-2">
                <FaTimesCircle className="text-red-600" />
                <span>Not Allowed Warning</span>
              </Dialog.Title>
              <p className="text-gray-600">You are not allowed for this company. You only have access for the registered company.</p>
              <button
                onClick={() => setShowNotAvailableWarningCompany(false)}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Close
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      {/* Not Allowed Warning Modal (Not Checked-In) */}
      <Transition appear show={showNotAvailableWarningNot} as={Fragment}>
        <Dialog as="div" open={showNotAvailableWarningNot} onClose={() => setShowNotAvailableWarningNot(false)}>
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="max-w-sm mx-auto bg-red-50 border border-red-200 rounded-lg p-6 shadow-xl transform transition-all">
              <Dialog.Title className="text-xl font-semibold mb-4 text-gray-800 flex items-center space-x-2">
                <FaTimesCircle className="text-red-600" />
                <span>Not Allowed Warning</span>
              </Dialog.Title>
              <p className="text-gray-600">You are not allowed. You have not checked in yet. Please wait a while.</p>
              <button
                onClick={() => setShowNotAvailableWarningNot(false)}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Close
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default QRCodeScannerOffice;
