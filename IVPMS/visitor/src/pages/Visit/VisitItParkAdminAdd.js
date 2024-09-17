import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";

const VisitItParkAdminAdd = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    visitorName: "",
    visitorEmail: "",
    visitorPhone: "",
    reason: "",
    visitorImageBlob: null,
    visitorRequestDateTime: "",
    type: "", // New field
    fromDateTime: "", // New field
    toDateTime: "", // New field
  });
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [videoStream, setVideoStream] = useState(null);
  const [modalImageUrl, setModalImageUrl] = useState(null);
  const [isNoAppointmentsModalOpen, setIsNoAppointmentsModalOpen] = useState(false);
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
  const [testId, setTestId] = useState(''); // Replace with actual visitId value
  const [minDateTime, setMinDateTime] = useState('');

  function nandha(){
    const qrSession = sessionStorage.getItem('qrvalue');
    console.log(qrSession);
    setTestId(qrSession);
  }

  useEffect(() => {
     // Set the minimum date and time to the current date and time
     const now = new Date();
     const minDateTime = now.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
     setMinDateTime(minDateTime);
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


  const handleSelectEmployee = async (employee) => {
    // if (employee.availability === "in") {
      setFormData((prevData) => ({
        ...prevData,
        employeeId: employee.employeeId,
        employeeName: employee.employeeName,
      }));
      setFilteredEmployees([]);
    // } else {
    //   setAvailabilityMessage(`${employee.employeeName} is not available today.`);
    //   setIsAvailabilityModalOpen(true);
    // }
  };

  const handleSubmit = async () => {
    const formDataToSend = new FormData();
    formDataToSend.set("status", "approved");

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
        // const currentDateTime = new Date().toISOString();
        const fromDateTime = formData.fromDateTime;
        
        const toDateTime = new Date(formData.toDateTime);
        toDateTime.setHours(18, 0, 0);
        const toDateTimeString = toDateTime.toISOString();
        const visitData = {
          visitorRequest: {
            requestId: visitorRequest.requestId,
          },
          fromDateTime,
          toDateTime:toDateTimeString,
          type: formData.type,
        };

        const visitResponse = await axios.post(
          "http://localhost:6789/visits",
          visitData
        );

        if (visitResponse) {
          const visitingId = visitResponse.data.visitId;
          sessionStorage.setItem('qrvalue', visitingId);
          nandha();
        }

        setPassDetails({
          name: formData.visitorName,
          type: formData.type,
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

  const handlePassModalClose = () => {
    setPassDetails(null);
  };

  const handleDownloadPass = async () => {
    if (passModalRef.current) {
      const canvas = await html2canvas(passModalRef.current);
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "visitor_pass.png";
      link.click();
      navigate('/itparkadminmain')
    }
  };

  return (
    <div className="container mx-auto p-24">
      {/* Form for adding visitor request */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-6"
      >
        {/* Existing fields */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 font-medium mb-2">
            Employee (Or) Incharge
          </label>
          <input
            type="text"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            className="block w-full p-4 border-gray-300 rounded-md shadow-lg focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
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
                  <span>{employee.employeeName}</span><span> - Company:</span><span>{employee.company.companyName}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col space-y-4">
          <label className="font-semibold">Visitor Name</label>
          <input
            type="text"
            name="visitorName"
            value={formData.visitorName}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
            required
          />
          <label className="font-semibold">Visitor Email</label>
          <input
            type="email"
            name="visitorEmail"
            value={formData.visitorEmail}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
            required
          />
          <label className="font-semibold">Visitor Phone</label>
          <input
            type="tel"
            name="visitorPhone"
            value={formData.visitorPhone}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
            required
          />
          <label className="font-semibold">Reason</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
            required
          />

        {/* <div className="flex flex-col space-y-4"> */}
          <label className="font-semibold">Type</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
            required
          />

          <label className="font-semibold">From DateTime</label>
          <input
            type="datetime-local"
            name="fromDateTime"
            value={formData.fromDateTime}
            min={minDateTime}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
            required
          />

          <label className="font-semibold">To DateTime</label>
          <input
            type="datetime-local"
            name="toDateTime"
            value={formData.toDateTime}
            min={minDateTime}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
            required
          />
        </div>

<div className="flex gap-6">
        <input
            type="file"
            name="visitorImageBlob"
            accept="image/*"
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
          />
{selectedImage && (
            <img
              src={selectedImage}
              alt="Selected"
              className="w-32 h-32 ml-24 object-cover mt-2"
            />
          )}</div>
          <div className="flex justify-end">
        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded"
        >
          Submit Request
        </button></div>
      </form>

      {/* Pass Modal */}
      {passDetails && (
        <div className="modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-6">
           <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg ">
          <p className="text-bold-300 text-center  ">Please Download the Pass</p>
            <div ref={passModalRef} className="bg-white rounded-lg  ">
            <p className="font-bold text-xl text-center  ">Visitor Pass</p>
              <div className="flex">
                <img
                  src={`data:image/jpeg;base64,${visitorRequestResponse.visitorImageBlob}`}
                  alt="Pass Image"
                  className="w-60 h-60 p-6"
                />
                <div className="ml-4 ">
                  <h2 className="text-xl font-bold p-3">
                    Name: {passDetails.name}
                  </h2>
                  <p className="text-sm font-bold px-3">
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

export default VisitItParkAdminAdd;
