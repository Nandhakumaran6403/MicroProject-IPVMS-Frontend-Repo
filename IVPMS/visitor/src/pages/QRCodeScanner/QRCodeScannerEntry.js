import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiCheckCircle, HiXCircle, HiClock, HiExclamationCircle } from 'react-icons/hi';
import { FaSpinner } from 'react-icons/fa';

const QRCodeScannerEntry = () => {
  const [scannedData, setScannedData] = useState(null);
  const [visitData, setVisitData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showValidityWarning, setShowValidityWarning] = useState(false);
  const [showValidityWarningStartDate, setShowValidityWarningStartDate] = useState(false);
  const [showValidityWarningTime, setShowValidityWarningTime] = useState(false);
  const navigate = useNavigate();

  const handleScan = async (result) => {
    if (result?.text) {
      const visitId = result.text;
      setScannedData(visitId);
      await fetchVisitData(visitId);
    }
  };

  const handleError = (error) => {
    console.error("QR Scan Error: ", error);
  };

  const fetchVisitData = async (visitId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:6789/visits/${visitId}`);
      const data = response.data;
      const requestId = data.visitorRequest.requestId;
      setVisitData(data);

      const nowDate = new Date().toISOString().split('T')[0];
      const nowTime = new Date().getTime();
      const visitEndDate = new Date(data.toDateTime).toISOString().split('T')[0];
      const visitStartDate = new Date(data.fromDateTime).toISOString().split('T')[0];
      const visitEndDateTime = new Date(data.toDateTime).getTime();
      
      if (nowDate <= visitEndDate) {
        if (data.type === 'General Visit') {
          setOpenModal(true);
        } else if (data.checkIn === 'checked-in' && data.checkOut === null) {
          setOpenModal(true);
        } else {
          const updatedData = { ...data, checkIn: null, checkInDateTime: null, checkOut: null, checkOutDateTime: null, visitorRequest: { requestId: requestId } };
          const res = await axios.put(`http://localhost:6789/visits/${visitId}`, updatedData);
          setVisitData(res.data);
          setOpenModal(true);
        }
      } 
      else if(nowDate > visitEndDate){
        setShowValidityWarning(true);
        return;
      }
      else if (nowTime > visitEndDateTime || 9 < nowTime) {
        setShowValidityWarningTime(true);
        return;
      }

    } catch (error) {
      console.error("Error fetching visit data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const nowDate = new Date().toISOString().split('T')[0];
      const nowTime = new Date().getTime();
      const visitEndDate = new Date(visitData.toDateTime).toISOString().split('T')[0];
      const visitStartDate = new Date(visitData.fromDateTime).toISOString().split('T')[0];
      const visitEndDateTime = new Date(visitData.toDateTime).getTime();

      if (nowDate >= visitStartDate ) {
        if (nowDate > visitEndDate) {
          setShowValidityWarning(true);
          return;
        } 
        else if (nowTime > visitEndDateTime) {
          setShowValidityWarningTime(true);
          return;
        }
      } else {
        setShowValidityWarningStartDate(true);
        return;
      }

      const updatedData = { ...visitData, checkIn: 'checked-in', checkInDateTime: now };
      const response = await axios.put(`http://localhost:6789/visits/${visitData.visitId}`, updatedData);
      setVisitData(response.data);

      const emailSend = response.data;
      const emailRequestData = {
        employeeEmail: emailSend.visitorRequest.employee.employeeEmail,
        visitorName: emailSend.visitorRequest.visitorName,
        visitorEmail: emailSend.visitorRequest.visitorEmail,
        visitorPhone: emailSend.visitorRequest.visitorPhone,
        reason: emailSend.visitorRequest.reason,
        type: emailSend.type,
      };

      const emailResponse = await axios.post(
        emailSend.type === 'General Visit' 
          ? "http://localhost:6789/api/sendvisitremainder" 
          : "http://localhost:6789/api/sendvisitremainderothers",
        emailRequestData
      );

      console.log("Email Response:", emailResponse);
      navigate('/receptionistmain');
    } catch (error) {
      console.error("Error checking in:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const checkInDateTime = new Date(visitData.checkInDateTime);
      const checkOutDateTime = new Date();
      const durationInMinutes = Math.floor((checkOutDateTime - checkInDateTime) / 60000);
      const updatedData = {
        ...visitData,
        checkOut: 'checked-out',
        checkOutDateTime: checkOutDateTime.toISOString(),
        totalVisitingDuration: durationInMinutes
      };

      const response = await axios.put(`http://localhost:6789/visits/${visitData.visitId}`, updatedData);
      setVisitData(response.data);

      const emailSend = response.data;
      const emailRequestData = {
        employeeEmail: emailSend.visitorRequest.employee.employeeEmail,
        visitorName: emailSend.visitorRequest.visitorName,
        visitorEmail: emailSend.visitorRequest.visitorEmail,
        visitorPhone: emailSend.visitorRequest.visitorPhone,
        reason: emailSend.visitorRequest.reason,
        type: emailSend.type,
      };

      const emailResponse = await axios.post(
        "http://localhost:6789/api/sendvisitfarewell",
        emailRequestData
      );

      console.log("Email Response:", emailResponse);
      navigate('/receptionistmain');
    } catch (error) {
      console.error("Error checking out:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleString() : 'N/A';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md p-4 bg-white shadow-lg rounded-lg border border-gray-300">
        <QrReader
          onResult={handleScan}
          onError={handleError}
          style={{ width: '100%' }}
        />
      </div>

      {/* Main Visit Details Modal */}
      <Transition appear show={openModal} as={Fragment}>
        <Dialog as="div" open={openModal} onClose={() => setOpenModal(false)}>
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4 mt-24">
            <Dialog.Panel className="max-w-lg mx-auto bg-white rounded-lg p-6 shadow-lg transform transition-all">
              <Dialog.Title className="text-xl font-semibold mb-4 flex items-center">
                <HiCheckCircle className="w-6 h-6 text-green-500 mr-2" />
                Visit Details
              </Dialog.Title>
              {loading ? (
                <div className="flex justify-center items-center">
                  <FaSpinner className="w-8 h-8 text-blue-500 animate-spin" />
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
                    <p><strong>Visitor Name:</strong> {visitData.visitorRequest.visitorName}</p>
                    <p><strong>Visit Type:</strong> {visitData.type}</p>
                    <p><strong>Employee Name:</strong> {visitData.visitorRequest.employee.employeeName}</p>
                    <p><strong>Check-in:</strong> {visitData.checkIn || 'Not checked in'}</p>
                    <p><strong>Check-in DateTime:</strong> {formatDate(visitData.checkInDateTime)}</p>
                    <p><strong>Check-out:</strong> {visitData.checkOut || 'Not checked out'}</p>
                    <p><strong>Check-out DateTime:</strong> {formatDate(visitData.checkOutDateTime)}</p>

                    <div className="mt-4 flex space-x-4">
                      {!visitData.checkIn ? (
                        <button
                          onClick={handleCheckIn}
                          className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center"
                        >
                         
                         <HiCheckCircle className="w-5 h-5 mr-2" />
                          Check In
                        </button>
                      ) : !visitData.checkOut ? (
                        <button
                          onClick={handleCheckOut}
                          className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center"
                        >
                          <HiXCircle className="w-5 h-5 mr-2" />
                          Check Out
                        </button>
                      ) : (
                        <p className="text-gray-600">Checked out</p>
                      )}
                    </div>
                  </div>
                )
              )}
              <button
                onClick={() => setOpenModal(false)}
                className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
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
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="max-w-md mx-auto bg-white rounded-lg p-6 shadow-lg transform transition-all">
              <Dialog.Title className="text-xl font-semibold mb-4 flex items-center">
                <HiExclamationCircle className="w-6 h-6 text-red-500 mr-2" />
                Validity Warning
              </Dialog.Title>
              <p className="mb-4">The visiting validity of this visitor has been exceeded.</p>
              <button
                onClick={() => setShowValidityWarning(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      {/* Validity Warning Modal Time */}
      <Transition appear show={showValidityWarningTime} as={Fragment}>
        <Dialog as="div" open={showValidityWarningTime} onClose={() => setShowValidityWarningTime(false)}>
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="max-w-md mx-auto bg-white rounded-lg p-6 shadow-lg transform transition-all">
              <Dialog.Title className="text-xl font-semibold mb-4 flex items-center">
                <HiClock className="w-6 h-6 text-yellow-500 mr-2" />
                Validity Warning
              </Dialog.Title>
              <p className="mb-4">You are not allowed Before 9 AM and after 6 PM.</p>
              <p className="mb-4">Please come again tomorrow or contact the in-charge.</p>
              <button
                onClick={() => setShowValidityWarningTime(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      {/* Validity Warning Modal Start Date */}
      <Transition appear show={showValidityWarningStartDate} as={Fragment}>
        <Dialog as="div" open={showValidityWarningStartDate} onClose={() => setShowValidityWarningStartDate(false)}>
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="max-w-md mx-auto bg-white rounded-lg p-6 shadow-lg transform transition-all">
              <Dialog.Title className="text-xl font-semibold mb-4 flex items-center">
                <HiExclamationCircle className="w-6 h-6 text-red-500 mr-2" />
                Validity Warning
              </Dialog.Title>
              <p className="mb-4">You are not allowed before the starting date.</p>
              <p className="mb-4">Please come again tomorrow or contact the in-charge.</p>
              <button
                onClick={() => setShowValidityWarningStartDate(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
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

export default QRCodeScannerEntry;
