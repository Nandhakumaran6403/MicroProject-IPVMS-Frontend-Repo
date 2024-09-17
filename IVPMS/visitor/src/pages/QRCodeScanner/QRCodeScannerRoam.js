import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader'; // Ensure you have the latest version
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

const QRCodeScannerRoam = () => {
  const [scannedData, setScannedData] = useState(null);
  const [visitData, setVisitData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showValidityWarning, setShowValidityWarning] = useState(false); // New state for validity warning

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
      setShowValidityWarning(true);
    } finally {
      setLoading(false);
    }
  };

  // Format Date object into a readable string
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleString() : 'N/A';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-lg border border-gray-200">
        <QrReader
          onResult={handleScan} // Ensure this is the correct prop name for your library version
          onError={handleError}
          style={{ width: '100%' }}
        />
      </div>

      {/* Main Visit Details Modal */}
      <Transition
        as={Fragment}
        show={openModal}
        enter="transition-transform duration-300"
        enterFrom="transform scale-90 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition-transform duration-300"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-90 opacity-0"
      >
        <Dialog as="div" open={openModal} onClose={() => setOpenModal(false)}>
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4 mt-24">
            <Dialog.Panel className="max-w-md mx-auto bg-white rounded-lg p-6 shadow-lg border border-gray-300">
              <Dialog.Title className="text-2xl font-bold text-blue-600 mb-4 flex items-center">
                <FaCheckCircle className="mr-2 text-green-500" />
                Visit Details
              </Dialog.Title>
              {loading ? (
                <p className="text-center">Loading...</p>
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
                    <p><strong>Visitor Name:</strong> {visitData.visitorRequest.visitorName}</p>
                    <p><strong>Visit Type:</strong> {visitData.type}</p>
                    <p><strong>Employee Name:</strong> {visitData.visitorRequest.employee.employeeName}</p>
                    <p><strong>Check-in:</strong> {visitData.checkIn || 'Not checked in'}</p>
                    <p><strong>Check-in DateTime:</strong> {formatDate(visitData.checkInDateTime)}</p>
                    <p><strong>Check-out:</strong> {visitData.checkOut || 'Not checked out'}</p>
                    <p><strong>Check-out DateTime:</strong> {formatDate(visitData.checkOutDateTime)}</p>
                  </div>
                )
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpenModal(false)}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center"
              >
                <FaTimes className="mr-2" />
                Close
              </motion.button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      {/* Validity Warning Modal */}
      <Transition
        as={Fragment}
        show={showValidityWarning}
        enter="transition-transform duration-300"
        enterFrom="transform scale-90 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition-transform duration-300"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-90 opacity-0"
      >
        <Dialog as="div" open={showValidityWarning} onClose={() => setShowValidityWarning(false)}>
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="max-w-md mx-auto bg-white rounded-lg p-6 shadow-lg border border-gray-300">
              <Dialog.Title className="text-2xl font-bold text-red-600 mb-4 flex items-center">
                <FaExclamationTriangle className="mr-2 text-red-500" />
                Validity Warning
              </Dialog.Title>
              <p className="text-center">The visiting validity of this visitor has been exceeded.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowValidityWarning(false)}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg flex items-center justify-center"
              >
                <FaTimes className="mr-2" />
                Close
              </motion.button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default QRCodeScannerRoam;
