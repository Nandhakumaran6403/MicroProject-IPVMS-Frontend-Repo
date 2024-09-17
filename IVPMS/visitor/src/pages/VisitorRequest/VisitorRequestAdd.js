import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";

const VisitorRequestAdd = () => {
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
  const [requestResponse, setRequestResponse] = useState(null);
  const [visitorRequestResponse, setVisitorRequestResponse] = useState(null);
  const [visiting, setVisiting] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const [passDetails, setPassDetails] = useState(null);
  const [qrValue, setQrValue] = useState(null);
  const passModalRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [testId, setTestId] = useState(''); // Replace with actual visitId value

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
    if(validate()){
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
      // await handleVisitorRequestOnly();
      handleSubmit(); // Updated to call handleSubmit after visitor request is handled
    } else {
      setNoAppointmentsMessage(
        "No matching appointment found for this visitor."
      );
      setIsNoAppointmentsModalOpen(true);
    }
  }
  };

  const handleSubmit = async () => {
    const formDataToSend = new FormData();
    formDataToSend.set('status',"approved");
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
        //  const visitingId = visitResponse.data.visitId;
        // setTestId(visitingId);
            // if (visitResponse.data && visitResponse.data.visitId) {
            //   setQrValue(visitResponse.data.visitId);
            // }
            if(visitResponse){
        const visitingId = visitResponse.data.visitId;
        sessionStorage.setItem('qrvalue',visitingId);
        nandha();
            }
        // if(visitResponse){
        //     console.log(visitResponse.data);  
        //     setVisiting(visitResponse.data.visitId);
        // }      
        // console.log(visiting);
        // console.log(visitorRequest.visitorImageBlob);
        // Set pass details to display the pass modal
        setPassDetails({
          name: formData.visitorName,
          type: visitData.type,
        //   qrCodeValue: visitingId,
        });

        // console.log(passDetails.qrCodeValue);
        // navigate('/visitorrequestviewall');
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

  const handleVisitorRequestOnly = async () => {
    setIsNoAppointmentsModalOpen(false);
    const formDataToSend = new FormData();

    formDataToSend.set("status","pending");

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
        console.log(visitorRequest);
        setRequestResponse(visitorRequest); // Store the response
        console.log(requestResponse);
        handleNoAppointmentsRequest(visitorRequest);
      } else {
        console.error("No visitorRequestId in the response");
        alert(
          "Failed to add visitor request. Please check the console for details."
        );
      }
    } catch (error) {
      console.error(
        "Error adding visitor request:",
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

  const handleNoAppointmentsRequest = async (visitorRequest) => {
    // setIsNoAppointmentsModalOpen(false);

    try {
      // await handleVisitorRequestOnly();

      if (visitorRequest) {
        const { visitorName, visitorEmail, visitorPhone, reason, employeeId } =
          formData;

        const employee = employees.find((emp) => emp.employeeId === employeeId);
        if (!employee) {
          console.error("Employee not found");
          return;
        }
        const employeeEmail = employee.employeeEmail.toString();

        console.log(visitorRequest);
        const responseId = visitorRequest.requestId;
        console.log(responseId);
        const link = `http://localhost:3000/visitorrequestedit/${responseId}`;

        const emailRequestData = {
          employeeEmail,
          visitorName,
          visitorEmail,
          visitorPhone,
          reason,
          link,
        };

        const emailResponse = await axios.post(
          "http://localhost:6789/api/sendvisitordetails",
          emailRequestData
        );
        console.log("Email Response:", emailResponse);

        navigate("/visitorrequestviewallToday");
      }
    } catch (error) {
      console.error(
        "Error sending visitor details email:",
        error.response ? error.response.data : error.message
      );
      alert(
        "Failed to send visitor details email. Please check the console for details."
      );
    }
  };

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
        navigate("/receptionistmain");
      } catch (error) {
        console.error("Error generating download:", error);
        alert("Failed to generate pass for download.");
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.employeeName) newErrors.employeeName = 'Employee name is required';
    if (!formData.visitorName) newErrors.visitorName = 'Visitor name is required';
    if (!formData.visitorEmail || !/\S+@\S+\.\S+/.test(formData.visitorEmail)) newErrors.visitorEmail = 'Valid email is required';
    if (!formData.visitorPhone || !/^\d{10}$/.test(formData.visitorPhone)) newErrors.visitorPhone = 'Valid phone number is required';
    if (!formData.reason) newErrors.reason = 'Reason is required';
    if (formData.visitorImageBlob && formData.visitorImageBlob.size > 2000000) newErrors.visitorImageBlob = 'Image size should be less than 2MB';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoBack = () =>{
    navigate('/receptionistmain')
  }

 
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-blue-600 text-center">
        Add Visitor Request
      </h1>
      <form
  onSubmit={(e) => {
    e.preventDefault();
    checkAppointmentsAndSubmit();
  }}
  className="space-y-8 p-6 max-w-4xl mx-auto bg-white  rounded-lg"
>
  <div className="relative mb-8">
    <label className="block text-gray-700 font-medium mb-2 flex items-center">
      <i className="fas fa-user-tag mr-2"></i>
      Employee
    </label>
    <input
      type="text"
      name="employeeName"
      value={formData.employeeName}
      onChange={handleChange}
      className={`block pl-4 w-full h-12 border-gray-500 rounded-md shadow-lg focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
        errors.employeeName ? 'border-red-500' : ''
      }`}
      placeholder="Type employee name"
      required
    />
    {errors.employeeName && (
      <p className="text-red-500 text-sm mt-1">{errors.employeeName}</p>
    )}
    {filteredEmployees.length > 0 && (
      <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-10">
        {filteredEmployees.map((employee) => (
          <li
            key={employee.employeeId}
            onClick={() => handleSelectEmployee(employee)}
            className="flex items-center p-2 cursor-pointer hover:bg-gray-100 transition-colors"
            aria-role="option"
            aria-selected={formData.employeeName === employee.employeeName}
          >
            <img
              src={
                `data:image/jpeg;base64,${employee.profileImageBlob}` ||
                "default-image-url.png"
              }
              alt={employee.employeeName}
              onClick={() =>
                handleImageClick(
                  `data:image/jpeg;base64,${employee.profileImageBlob}`
                )
              }
              className="w-10 h-10 rounded-full object-cover mr-2 cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="font-medium">{employee.employeeName}</span>
              <span className="text-gray-500 text-sm">- Company: {employee.company.companyName}</span>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>

  <div className="flex items-center justify-between space-x-4 mb-8">
    <div className="flex flex-col flex-grow space-y-2">
      <label className="font-semibold flex items-center">
        <i className="fas fa-image mr-2"></i>
        Visitor Image
      </label>
      <input
        type="file"
        name="visitorImageBlob"
        accept="image/*"
        onChange={handleChange}
        className={`border border-gray-300 p-2 rounded ${
          errors.visitorImageBlob ? 'border-red-500' : ''
        }`}
      />
      {errors.visitorImageBlob && (
        <p className="text-red-500 text-sm mt-1">{errors.visitorImageBlob}</p>
      )}
    </div>
    <button
      type="button"
      onClick={handleCapture}
      className="flex-shrink-0 bg-blue-500 text-white mt-6 py-2 px-4 rounded flex items-center space-x-2 hover:bg-blue-600 transition-colors"
      aria-label="Capture Image"
    >
      <i className="fas fa-camera"></i>
      <span>Capture Image</span>
    </button>
    {selectedImage && (
      <img
        src={selectedImage}
        alt="Selected"
        className="w-32 h-32 object-cover mt-2 border border-gray-300 rounded-md"
      />
    )}
    {capturedImage && (
      <img
        src={capturedImage}
        alt="Captured"
        className="w-32 h-32 object-cover mt-2 border border-gray-300 rounded-md"
      />
    )}
  </div>

  <div className="space-y-6 mb-8">
    <div>
      <label className="font-semibold flex items-center">
        <i className="fas fa-user mr-2"></i>
        Visitor Name
      </label>
      <input
        type="text"
        name="visitorName"
        value={formData.visitorName}
        onChange={handleChange}
        className={`border border-gray-300 p-2 rounded w-full ${
          errors.visitorName ? 'border-red-500' : ''
        }`}
        required
      />
      {errors.visitorName && (
        <p className="text-red-500 text-sm mt-1">{errors.visitorName}</p>
      )}
    </div>
    <div>
      <label className="font-semibold flex items-center">
        <i className="fas fa-envelope mr-2"></i>
        Visitor Email
      </label>
      <input
        type="email"
        name="visitorEmail"
        value={formData.visitorEmail}
        onChange={handleChange}
        className={`border border-gray-300 p-2 rounded w-full ${
          errors.visitorEmail ? 'border-red-500' : ''
        }`}
        required
      />
      {errors.visitorEmail && (
        <p className="text-red-500 text-sm mt-1">{errors.visitorEmail}</p>
      )}
    </div>
    <div>
      <label className="font-semibold flex items-center">
        <i className="fas fa-phone mr-2"></i>
        Visitor Phone
      </label>
      <input
        type="tel"
        name="visitorPhone"
        value={formData.visitorPhone}
        onChange={handleChange}
        className={`border border-gray-300 p-2 rounded w-full ${
          errors.visitorPhone ? 'border-red-500' : ''
        }`}
        required
      />
      {errors.visitorPhone && (
        <p className="text-red-500 text-sm mt-1">{errors.visitorPhone}</p>
      )}
    </div>
    <div>
      <label className="font-semibold flex items-center">
        <i className="fas fa-sticky-note mr-2"></i>
        Reason
      </label>
      <textarea
        name="reason"
        value={formData.reason}
        onChange={handleChange}
        className={`border border-gray-300 p-2 rounded w-full ${
          errors.reason ? 'border-red-500' : ''
        }`}
        required
      />
      {errors.reason && (
        <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
      )}
    </div>
  </div>

  <div className="flex items-center justify-between space-x-4">
    <button
      type="button"
      onClick={handleGoBack}
      className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors flex items-center space-x-2"
      aria-label="Go Back"
    >
      <i className="fas fa-arrow-left"></i>
      <span>Go Back</span>
    </button>
    <button
      type="submit"
      className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors flex items-center space-x-2"
      aria-label="Submit Request"
    >
      <i className="fas fa-check"></i>
      <span>Submit Request</span>
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
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">{noAppointmentsMessage}</h2>
            <div className="flex justify-between">
              <button
                onClick={() => setIsNoAppointmentsModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Close
              </button>
              <button
                onClick={handleVisitorRequestOnly}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Availability Modal */}
      {isAvailabilityModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex items-center justify-center">
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
              className="w-80 h-80"
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
          <div className="bg-white p-3 rounded-lg shadow-lg max-w-lg ">
            <div ref={passModalRef} className="bg-white rounded-lg  ">
            <p className="font-bold text-xl text-center p-1">Visitor Pass</p>

              <div className="flex">
                <img
                  src={`data:image/jpeg;base64,${visitorRequestResponse.visitorImageBlob}`}
                  alt="Pass Image"
                  className="w-60 h-60 p-7"
                />
                <div className="ml-4 p-4">
                  <h2 className="text-xl font-bold ">
                    Name: {passDetails.name}
                  </h2>
                  <p className="text-sm font-bold mt-2">
                    Type: {passDetails.type}
                  </p>
                  <div className="mt-4 ">
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

export default VisitorRequestAdd;
