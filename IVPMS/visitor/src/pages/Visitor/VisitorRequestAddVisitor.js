import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";

const VisitorRequestAddVisitor = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    visitorName: "",
    visitorEmail: "",
    visitorPhone: "",
    reason: "",
    visitorImageBlob: null,
    visitorRequestDateTime: "",
  });
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [videoStream, setVideoStream] = useState(null);
  const [modalImageUrl, setModalImageUrl] = useState(null);
  const [isNoAppointmentsModalOpen, setIsNoAppointmentsModalOpen] =
    useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [noAppointmentsMessage, setNoAppointmentsMessage] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [visitorRequestResponse, setVisitorRequestResponse] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const [passDetails, setPassDetails] = useState(null);
  const passModalRef = useRef(null);
  const [testId, setTestId] = useState(''); // Replace with actual visitId value
  const [errors, setErrors] = useState({
    visitorName: '',
    visitorEmail: '',
    visitorPhone: '',
    reason: ''
  });


  function nandha(){
    const qrSession = sessionStorage.getItem('qrvalue');
    console.log(qrSession);
    setTestId(qrSession);
  }


  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:6789/employees/all");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);




  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:6789/appointments");
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          setVideoStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error("Error accessing camera:", error);
        });
    }

    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isModalOpen]);

  useEffect(() => {
    const currentDateTime = new Date().toISOString().slice(0, 16);
    setFormData((prevData) => ({
      ...prevData,
      visitorRequestDateTime: currentDateTime,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "visitorImageBlob" && files.length > 0) {
      const file = files[0];
      setSelectedImage(URL.createObjectURL(file));
      setCapturedImage(null);
      setFormData((prevData) => ({
        ...prevData,
        visitorImageBlob: file,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

      if (name === "employeeName") {
        const filtered = employees.filter((employee) =>
          employee.employeeName.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredEmployees(filtered);
      }
    }
  };

  const handleSelectEmployee = async (employee) => {
    if (employee.availability === "in") {
      setFormData((prevData) => ({
        ...prevData,
        employeeId: employee.employeeId,
        employeeName: employee.employeeName,
      }));
      setFilteredEmployees([]);
    } else {
      setAvailabilityMessage(
        `${employee.employeeName} is not available today.`
      );
      setIsAvailabilityModalOpen(true);
    }
  };

  const handleCapture = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCapturedImage(null);
  };

  const handleImageCapture = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (videoRef.current) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const imageDataUrl = canvas.toDataURL("image/png");
      setCapturedImage(imageDataUrl);
      setSelectedImage(null);
      setFormData((prevData) => ({
        ...prevData,
        visitorImageBlob: dataURLToBlob(imageDataUrl),
      }));
    }
    setIsModalOpen(false);
  };

  const dataURLToBlob = (dataURL) => {
    const [header, data] = dataURL.split(",");
    const mime = header.split(":")[1].split(";")[0];
    const byteString = atob(data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mime });
  };

  const checkAppointmentsAndSubmit = async () => {
    const currentDateTime = new Date().toISOString().split("T")[0];
    const filteredAppointments = appointments.filter((appointment) => {
      const appointmentDateTime = new Date(appointment.appointmentDateTime)
        .toISOString()
        .split("T")[0];
      return appointmentDateTime === currentDateTime;
    });

    const isAppointmentMatching = filteredAppointments.some(
      (appointment) =>
        (appointment.visitorName === formData.visitorName &&
          appointment.visitorEmail === formData.visitorEmail) ||
        (appointment.visitorName === formData.visitorName &&
          appointment.visitorPhone === formData.visitorPhone)
    );

    if (isAppointmentMatching) {
      handleSubmit(); // Updated to call handleSubmit after visitor request is handled
    } else {
      setNoAppointmentsMessage(
        `No matching appointment found for this visitor. 
    If you want the visitor pass, please contact the receptionist 
    or get the appointment from the corresponding person.`
      );
      setIsNoAppointmentsModalOpen(true);
    }
  };

  const handleSubmit = async () => {
    let hasErrors = false;
    let newErrors = {
      visitorName: '',
      visitorEmail: '',
      visitorPhone: '',
      reason: ''
    };

    if (!formData.visitorName.trim()) {
      newErrors.visitorName = 'Visitor Name is required';
      hasErrors = true;
    }
    if (!formData.visitorEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.visitorEmail = 'Invalid email address';
      hasErrors = true;
    }
    if (!formData.visitorPhone.match(/^\d{10}$/)) {
      newErrors.visitorPhone = 'Phone number must be 10 digits';
      hasErrors = true;
    }
    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    // Clear errors if no errors
    setErrors(newErrors);
    const formDataToSend = new FormData();
    // formDataToSend.append(status,"approved");
    formDataToSend.set("status","approved");

    for (const key in formData) {
      if (formData[key] instanceof Blob) {
        formDataToSend.append(key, formData[key], "visitor_image.png");
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }



    try {
      const response = await axios.post(
        "http://localhost:6789/visitorrequests",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const visitorRequest = response.data;

      if (visitorRequest) {
        setVisitorRequestResponse(visitorRequest);
        const currentDateTime = new Date().toISOString();
        const fromDateTime = currentDateTime;
        const toDateTime = new Date();
        toDateTime.setHours(18, 0, 0);
        const toDateTimeString = toDateTime.toISOString();

        const visitData = {
          visitorRequest: {
            requestId: visitorRequest.requestId,
          },
          fromDateTime,
          toDateTime: toDateTimeString,
          type: "General Visit",
        };

        const visitResponse = await axios.post(
          "http://localhost:6789/visits",
          visitData
        );
       
            if(visitResponse){
        const visitingId = visitResponse.data.visitId;
        sessionStorage.setItem('qrvalue',visitingId);
        nandha();
            }
       
        // Set pass details to display the pass modal
        setPassDetails({
          name: formData.visitorName,
          type: visitData.type,
        });

      } else {
        console.error("No visitorRequest in the response");
        alert(
          "Failed to add visitor request. Please check the console for details."
        );
      }
    } catch (error) {
      console.error(
        "Error adding visitor request or visit:",
        error.response ? error.response.data : error.message
      );
      alert(
        "Failed to add visitor request. Please check the console for details."
      );
    }
  };


  const handleImageClick = (imageUrl) => {
    setModalImageUrl(imageUrl);
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setModalImageUrl(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handlePassModalClose = () => {
    setPassDetails(null);
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
        navigate("/qrcodeforvisitor");
      } catch (error) {
        console.error("Error generating download:", error);
        alert("Failed to generate pass for download.");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white mt-24 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-blue-600 text-center">
        Add Visitor Request
      </h1>
      <form
  onSubmit={(e) => {
    e.preventDefault();
    checkAppointmentsAndSubmit();
  }}
  className="space-y-6"
>
  <div className="mb-4 relative">
    <label className="block text-gray-700 font-medium mb-2">Employee</label>
    <input
      type="text"
      name="employeeName"
      value={formData.employeeName}
      onChange={handleChange}
      className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      placeholder="Type employee name"
      required
    />
    {filteredEmployees.length > 0 && (
      <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
        {filteredEmployees.map((employee) => (
          <li
            key={employee.employeeId}
            onClick={() => handleSelectEmployee(employee)}
            className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
          >
            <img
              src={
                `data:image/jpeg;base64,${employee.profileImageBlob}` ||
                "default-image-url.png"
              }
              alt={employee.employeeName}
              className="w-10 h-10 rounded-full object-cover mr-2 cursor-pointer"
              onClick={() =>
                handleImageClick(
                  `data:image/jpeg;base64,${employee.profileImageBlob}`
                )
              }
            />
            <span>{employee.employeeName}</span>
            <span> - Company:</span>
            <span>{employee.company.companyName}</span>
          </li>
        ))}
      </ul>
    )}
  </div>

  <div className="flex flex-col space-y-4 mt-6 p-4 bg-gray-100 rounded-lg shadow-lg">
    <div className="flex items-center space-x-4 mb-4">
      <input
        type="file"
        name="visitorImageBlob"
        accept="image/*"
        onChange={handleChange}
        className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
        placeholder="Upload Visitor Image"
      />
      <button
        type="button"
        onClick={handleCapture}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 ease-in-out"
      >
        <svg
          className="w-5 h-5 inline-block mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M14 10V3H5a2 2 0 00-2 2v12a2 2 0 002 2h9v-7l7 7V10l-7 7V10z"
          ></path>
        </svg>
        Capture Image
      </button>
      <div className="flex-shrink-0">
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Selected"
            className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-md"
          />
        )}
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured"
            className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-md"
          />
        )}
      </div>
    </div>

    <div className="flex space-x-4 mb-4">
      <div className="flex-1">
        <input
          type="text"
          name="visitorName"
          value={formData.visitorName}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out w-full"
          placeholder="Visitor Name"
          required
        />
        {errors.visitorName && (
          <p className="text-red-500 text-sm mt-1">{errors.visitorName}</p>
        )}
      </div>

      <div className="flex-1">
        <input
          type="email"
          name="visitorEmail"
          value={formData.visitorEmail}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out w-full"
          placeholder="Visitor Email"
          required
          pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
          title="Please enter a valid email address"
        />
        {errors.visitorEmail && (
          <p className="text-red-500 text-sm mt-1">{errors.visitorEmail}</p>
        )}
      </div>
    </div>

    <div className="flex space-x-4 mb-4">
      <div className="flex-1">
        <input
          type="tel"
          name="visitorPhone"
          value={formData.visitorPhone}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out w-full"
          placeholder="Visitor Phone"
          required
          pattern="\d{10}"
          title="Phone number must be 10 digits"
        />
        {errors.visitorPhone && (
          <p className="text-red-500 text-sm mt-1">{errors.visitorPhone}</p>
        )}
      </div>

      <div className="flex-1">
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out w-full"
          placeholder="Reason"
          required
        />
        {errors.reason && (
          <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
        )}
      </div>
    </div>
  </div>

  <div className="flex justify-end">
    <button
      type="submit"
      className="bg-green-500 text-white py-2 px-4 rounded"
    >
      Submit Request
    </button>
  </div>
</form>


      {/* Capture Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <video ref={videoRef} autoPlay className="w-full h-64"></video>
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleModalClose}
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                Close
              </button>
              <button
                onClick={handleImageCapture}
                className="bg-green-500 text-white py-2 px-4 rounded"
              >
                Capture
              </button>
            </div>
          </div>
        </div>
      )}

      {/* No Appointments Modal */}
      {isNoAppointmentsModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center ">
          <div className="bg-white p-4 rounded-lg shadow-lg  p-12">
            <h2 className="text-lg font-bold mb-4 w-80">{noAppointmentsMessage}</h2>
            <div className="flex justify-end">
              <button
                onClick={() => setIsNoAppointmentsModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Availability Modal */}
      {isAvailabilityModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">{availabilityMessage}</h2>
            <div className="flex justify-center">
              <button
                onClick={() => setIsAvailabilityModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {modalImageUrl && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div ref={modalRef} className="bg-white p-4 rounded shadow-lg">
            <img
              src={modalImageUrl}
              alt="Modal"
              className="w-60 h-60"
            />
            {/* <button
              onClick={() => setModalImageUrl(null)}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
            >
              Close
            </button> */}
          </div>
        </div>
      )}

      {/* Pass Modal */}
      {passDetails && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center p-6">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg ">
          <p className="text-bold-300 text-center  ">Please Download the Pass</p>
            <div ref={passModalRef} className="bg-white rounded-lg  ">
            <p className="font-bold text-xl text-center p-1">Visitor Pass</p>
              <div className="flex ">
                <img
                  src={`data:image/jpeg;base64,${visitorRequestResponse.visitorImageBlob}`}
                  alt="Pass Image"
                  className="w-60 h-60 p-7"
                />
                <div className="ml-4 p-4">
                  <h2 className="text-xl font-bold">
                    Name: {passDetails.name}
                  </h2>
                  <p className="text-sm font-bold mt-2">
                    Type: {passDetails.type}
                  </p>
                  <div className="mt-4">
                    <QRCodeCanvas  value={testId}/>
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
             
              <button
                onClick={handleDownloadPass}
                className="bg-green-500 text-white py-2 px-4 rounded"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorRequestAddVisitor;

