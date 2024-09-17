import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCalendarAlt, FaEnvelope } from 'react-icons/fa'; // Font Awesome icons
import { HiUserGroup } from 'react-icons/hi'; // Heroicons

const EmployeeMain = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = sessionStorage.getItem('employeeid');
        const response = await axios.get(`http://localhost:6789/employees/${userId}`);
        if (response.status === 200) {
          await axios.patch(`http://localhost:6789/employees/lastlogin/${userId}`);
          setUser(response.data);
        } else {
          throw new Error('User not found');
        }
      } catch (error) {
        console.error('Error fetching profile', error);
      }
    };
    fetchUser();
  }, []);

  const handleViewMyAppointments = () => {
    navigate(`/appointmentspecificview/${user.employeeId}`);
  };

  const handleRequestEmail = () => {
    const outlookComposeURL = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent('nandhakumaran.hariharan@relevantz.com')}`;
    window.open(outlookComposeURL);
  };

  const handleAddAppointment = () => {
    navigate('/appointmentadd');
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Banner Section */}
      <header className="bg-blue-700 text-white py-8 text-center shadow-md">
        <h1 className="text-2xl font-extrabold">Employee Dashboard - Welcome, {user ? user.employeeName : 'Employee'}!</h1>
        {/* <h2 className="text-3xl font-bold mt-2">Welcome, {user ? user.employeeName : 'Employee'}!</h2> */}
      </header>

      {/* Main Content Section */}
      <main className="flex-grow p-6">
        {/* <h2 className="text-3xl font-bold mb-6">Welcome, {user ? user.employeeName : 'Employee'}!</h2> */}
        
        {/* Content Section with Images */}
        <section className="mb-24 mt-12">
          <div className="flex justify-center gap-12 mb-8">
            <img src="https://images.pexels.com/photos/3182796/pexels-photo-3182796.jpeg?auto=compress&cs=tinysrgb&h=627&fit=crop&w=1200" alt="Company Overview" className="w-80 rounded-lg shadow-lg" />
            <img src="https://www.shutterstock.com/image-photo/booking-meeting-appointment-on-laptop-260nw-1930285112.jpg" alt="Company Overview" className="w-80 rounded-lg shadow-lg" />
            <img src="https://deltafrontier.com/wp-content/uploads/2022/02/evms-03.png" alt="Company Overview" className="w-80 rounded-lg shadow-lg" />
            <img src="https://www.versionx.in/wp-content/uploads/2019/02/VMS.jpg" alt="Company Overview" className="w-80 rounded-lg shadow-lg" />

          </div>
         
        </section>

        {/* Cards Section */}
        <div className="flex flex-col items-center mt-12">
          <div className="flex space-x-3 mb-6 gap-12">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={handleViewMyAppointments}
                className="w-full flex items-center p-6 text-left"
              >
                <FaCalendarAlt className="text-4xl mr-4 text-green-600" />
                <span className="text-lg font-medium">View My Appointments</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={handleAddAppointment}
                className="w-full flex items-center p-6 text-left"
              >
                <FaCalendarAlt className="text-4xl mr-4 text-teal-600" />
                <span className="text-lg font-medium">Add Future Appointment</span>
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={handleRequestEmail}
              className="w-full flex items-center p-6 text-left"
            >
              <FaEnvelope className="text-4xl mr-4 text-purple-600" />
              <span className="text-lg font-medium">Request Custom Passes</span>
            </button>
          </div>
          </div>

          
        </div>
      </main>

      <div className="bg-gray-200 py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="text-lg mb-6">Our reception management system is designed to streamline the check-in process and manage visitor requests efficiently. We aim to provide a seamless experience for both receptionists and visitors.</p>
          <img src="https://media.istockphoto.com/id/1458164457/photo/businessman-using-laptop-and-smartphone-with-contact-icons-on-virtual-screen-searching-web.jpg?s=612x612&w=0&k=20&c=MGgwv8LPiylmsFqbT2w2lfY2qTpBmnprS9O3oMjkkS8=" alt="About Us" className="mx-auto rounded-lg shadow-lg" />
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-4 text-center mt-auto">
        <p className="text-sm">&copy; 2024 Nandha It Park. All rights reserved.</p>
        <p className="text-sm mt-2 flex items-center justify-center">
          <HiUserGroup className="inline-block text-lg mr-2" />
          1234 Bye Pass Rd, Kamaraj College 100, Virudhunagar, TamilNadu, 12345
        </p>
      </footer>
    </div>
  );
};

export default EmployeeMain;
