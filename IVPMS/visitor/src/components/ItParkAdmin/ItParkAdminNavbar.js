// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const AdminNavbar = () => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [profile, setProfile] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const userId = sessionStorage.getItem('adminid'); // Retrieve admin ID from sessionStorage
//         const response = await axios.get(`http://localhost:6789/admin-users/${userId}`);
//         if (response.status === 200) {
//             await axios.patch(`http://localhost:6789/admin-users/lastlogin/${userId}`);

// } else {
// throw new Error('User not found');
// }
//         setProfile(response.data);
//       } catch (error) {
//         console.error('Error fetching profile', error);
//       }
//     };
//     fetchProfile();
//   }, []);

//   const handleDropdownToggle = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   const handleLogout = () => {
//     // Add any necessary logout logic here
//     sessionStorage.removeItem('adminid'); // Clear admin ID from sessionStorage
//     navigate('/'); // Navigate to the landing page after logout
//   };

//   const handleProfile = () => {
//     navigate(`/adminprofile/${profile.adminUserId}`); // Navigate to the admin profile page
//   };

//   const handleHome = () => {
//     navigate('/adminmain'); // Navigate to the AdminMain page
//   };

//   return (
//     <nav className="bg-gray-800 p-4 flex items-center justify-between">
//       <div className="text-white text-lg font-bold">
//         IT Park
//       </div>
//       <div className="flex-1 text-center">
//         <button
//           onClick={handleHome}
//           className="text-white text-xl font-semibold"
//         >
//           Home
//         </button>
//       </div>
//       <div className="relative">
//         <button
//           onClick={handleDropdownToggle}
//           className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden"
//         >
//           <img
//             src={profile.profileImageBlob ? `data:image/jpeg;base64,${profile.profileImageBlob}` : 'https://via.placeholder.com/150'}
//             alt="Profile"
//             className=" rounded-full object-cover m-24"
//           />
//         </button>
//         {dropdownOpen && (
//           <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
//             <button
//               onClick={handleProfile}
//               className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
//             >
//               Profile
//             </button>
//             <button
//               onClick={handleLogout}
//               className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
//             >
//               Logout
//             </button>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default AdminNavbar;








// import React, { useEffect, useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const ItParkAdminNavbar = () => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [profile, setProfile] = useState(null);
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const userId = sessionStorage.getItem('adminid'); // Retrieve admin ID from sessionStorage
//         if (userId === null) {
//             navigate('/');
//           }
//         const response = await axios.get(`http://localhost:6789/admin-users/${userId}`);
//         if (response.status === 200) {
//           await axios.patch(`http://localhost:6789/admin-users/lastlogin/${userId}`);
//           setProfile(response.data);
//         } else {
//           throw new Error('User not found');
//         }
//       } catch (error) {
//         console.error('Error fetching profile', error);
//       }
//     };
//     fetchProfile();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleDropdownToggle = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   const handleLogout = () => {
//     // Add any necessary logout logic here
//     sessionStorage.removeItem('adminid'); // Clear admin ID from sessionStorage
//     navigate('/'); // Navigate to the landing page after logout
//   };

//   const handleProfile = () => {
//     navigate(`/adminprofile/${profile?.adminUserId}`); // Navigate to the admin profile page
//   };

//   const handleAddAudit = () => {
//     navigate('/auditlogadd'); // Navigate to the admin profile page
//   };

//   const handleViewMyAudits = () => {
//     navigate(`/auditlogspecific/${profile?.adminUserId}`); // Navigate to the admin profile page
//   };

//   const handleHome = () => {
//     navigate('/adminmain'); // Navigate to the AdminMain page
//   };

//   const handleRequestEmail = () => {
//       const outlookComposeURL = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent('nandhakumaran.hariharan@relevantz.com')}`;
//       window.open(outlookComposeURL);
   
//   };


  
// const handleEmail = () => {
    
//               const outlookInboxURL = `https://outlook.office.com/mail/inbox/${encodeURIComponent('nandhakumaran.hariharan@relevantz.com')}`;
//               window.open(outlookInboxURL);
           
//   };

//   return (
//     <nav className="bg-gray-800 p-4 flex items-center justify-between">
//       <div className="text-white text-lg font-bold">
//         IT Park
//       </div>
//       <div className="flex-1 text-center">
//         <button
//           onClick={handleHome}
//           className="text-white text-xl font-semibold px-6"
//         >
//           Home
//         </button>
//         <button
//           onClick={handleAddAudit}
//           className="text-white text-xl font-semibold px-6"
//         >
//           Add Audit
//         </button>
//         <button
//           onClick={handleEmail}
//           className="text-white text-xl font-semibold mx-2"
//         >
//           Mail
//         </button>
//         <button
//           onClick={handleRequestEmail}
//           className="text-white text-xl font-semibold mx-2"
//         >
//           Request
//         </button>

//         <button
//           onClick={handleViewMyAudits}
//           className="text-white text-xl font-semibold px-6"
//         >
//           View My Audits
//         </button>
//       </div>
//       <div className="relative" ref={dropdownRef}>
//         <button
//           onClick={handleDropdownToggle}
//           className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden"
//         >
//           <img
//             src={profile?.profileImageBlob ? `data:image/jpeg;base64,${profile?.profileImageBlob}` : 'https://via.placeholder.com/150'}
//             alt="Profile"
//             className="rounded-full object-cover w-full h-full"
//           />
//         </button>
//         {dropdownOpen && (
//           <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
//             <button
//               onClick={handleProfile}
//               className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
//             >
//               Profile
//             </button>
//             <button
//               onClick={handleLogout}
//               className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
//             >
//               Logout
//             </button>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default ItParkAdminNavbar;




// import React, { useEffect, useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const ItParkAdminNavbar = () => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [profile, setProfile] = useState(null);
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const userId = sessionStorage.getItem('adminid'); // Retrieve admin ID from sessionStorage
//         if (userId === null) {
//             navigate('/');
//           }
//         const response = await axios.get(`http://localhost:6789/admin-users/${userId}`);
//         if (response.status === 200) {
//           await axios.patch(`http://localhost:6789/admin-users/lastlogin/${userId}`);
//           setProfile(response.data);
//         } else {
//           throw new Error('User not found');
//         }
//       } catch (error) {
//         console.error('Error fetching profile', error);
//       }
//     };
//     fetchProfile();
//   }, [navigate]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleDropdownToggle = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   const handleLogout = () => {
//     // Add any necessary logout logic here
//     sessionStorage.removeItem('adminid'); // Clear admin ID from sessionStorage
//     navigate('/'); // Navigate to the landing page after logout
//   };

//   const handleProfile = () => {
//     navigate(`/adminprofile/${profile?.adminUserId}`); // Navigate to the admin profile page
//   };

//   const handleAddAudit = () => {
//     navigate('/auditlogadd'); // Navigate to the Add Audit page
//   };

//   const handleViewMyAudits = () => {
//     navigate(`/auditlogspecific/${profile?.adminUserId}`); // Navigate to the View My Audits page
//   };

//   const handleHome = () => {
//     navigate('/itparkadminmain'); // Navigate to the AdminMain page
//   };

//   const handleRequestEmail = () => {
//       const outlookComposeURL = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent('nandhakumaran.hariharan@relevantz.com')}`;
//       window.open(outlookComposeURL);
//   };

//   const handleEmail = () => {
//       const outlookInboxURL = `https://outlook.office.com/mail/inbox/${encodeURIComponent('nandhakumaran.hariharan@relevantz.com')}`;
//       window.open(outlookInboxURL);
//   };


// const fetchAndSendVisits = async () => {
//     try {
//       // Fetch all visits from the API
//       const response = await axios.get('http://localhost:6789/visits');
//       const visits = response.data;
  
//       // Get the current date and time
//       const currentDate = new Date().toISOString().split('T')[0];
//       const currentTime = new Date().getHours();
  
//       // Filter and transform visits
//       const filteredVisits = visits
//         .filter(visit => {
//           const visitDate = new Date(visit.checkInDateTime).toISOString().split('T')[0];
//           return visitDate === currentDate && visit.checkOut === null;
//         })
//         .map(visit => ({
//           visitId: visit.visitId,
//           visitorRequest:{
//             requestId: visit.visitorRequest.requestId,
//             visitorName: visit.visitorRequest.visitorName,
//             visitorEmail: visit.visitorRequest.visitorEmail,
//             visitorPhone: visit.visitorRequest.visitorPhone
//           }
//         }));
  
//       // Only send email if current time is 6 PM or later
//       if (currentTime >= 18) { // 18 for 6 PM
//         // Prepare the email content
//         console.log(filteredVisits);
//         const emailContent = JSON.stringify(filteredVisits, null, 2);
//         const content = {
//           to: 'nandhakumaran.hariharan@relevantz.com',
//           subject: 'Visitors who has been not yet Checked Out',
//           body: `List of Visitors who has been not yet Checked Out Even After 6PM:\n\n${emailContent}`
//         };
  
//         // Send the email
//         await axios.post('http://localhost:6789/api/sendemailmorethansix', content);
//       }
//     } catch (error) {
//       console.error('Error fetching or sending visits', error);
//     }
//   };
  
//   const handleMoreThanSix = () => {
//     fetchAndSendVisits();
//   };

// //   useEffect(() => {
// //     fetchAndSendVisits(); // Call the function when component mounts
// //   }, []);

  

//   return (
//     <nav className="bg-gray-800 p-4 flex items-center justify-between">
//       <div className="text-white text-lg font-bold">
//         IT Park
//       </div>
//       <div className="flex-1 text-center">
//         <button
//           onClick={handleHome}
//           className="text-white text-xl font-semibold px-6"
//         >
//           Home
//         </button>
//         <button
//           onClick={handleAddAudit}
//           className="text-white text-xl font-semibold px-6"
//         >
//           Add Audit
//         </button>
//         <button
//           onClick={handleEmail}
//           className="text-white text-xl font-semibold mx-2"
//         >
//           Mail
//         </button>
//         <button
//           onClick={handleRequestEmail}
//           className="text-white text-xl font-semibold mx-2"
//         >
//           Request
//         </button>
//         <button
//           onClick={handleViewMyAudits}
//           className="text-white text-xl font-semibold px-6"
//         >
//           View My Audits
//         </button>
//         <button
//           onClick={handleMoreThanSix}
//           className="text-white text-xl font-semibold px-6"
//         >
//            After 6pm Stay
//         </button>
//       </div>
//       <div className="relative" ref={dropdownRef}>
//         <button
//           onClick={handleDropdownToggle}
//           className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden"
//         >
//           <img
//             src={profile?.profileImageBlob ? `data:image/jpeg;base64,${profile?.profileImageBlob}` : 'https://via.placeholder.com/150'}
//             alt="Profile"
//             className="rounded-full object-cover w-full h-full"
//           />
//         </button>
//         {dropdownOpen && (
//           <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
//             <button
//               onClick={handleProfile}
//               className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
//             >
//               Profile
//             </button>
//             <button
//               onClick={handleLogout}
//               className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
//             >
//               Logout
//             </button>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default ItParkAdminNavbar;





import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHome, FaPlus, FaEnvelope, FaRegEnvelope, FaUser, FaSignOutAlt, FaBell } from 'react-icons/fa';
import { MdMailOutline } from 'react-icons/md';
import { HiOutlineCog } from 'react-icons/hi';

const ItParkAdminNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [emailSend, setEmailSend] = useState(null);
  const [emailNotSend, setEmailNotSend] = useState(null);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = sessionStorage.getItem('adminid');
        if (userId === null) {
          navigate('/');
        }
        const response = await axios.get(`http://localhost:6789/admin-users/${userId}`);
        if (response.status === 200) {
          await axios.patch(`http://localhost:6789/admin-users/lastlogin/${userId}`);
          setProfile(response.data);
          setRole(response.data.role);
        } else {
          throw new Error('User not found');
        }
      } catch (error) {
        console.error('Error fetching profile', error);
      }
    };
    
    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminid');
    navigate('/');
  };

  const handleProfile = () => {
    navigate(`/itparkadminprofile/${profile?.adminUserId}`);
  };

  const handleAddAudit = () => {
    navigate('/auditlogadd');
  };

  const handleViewMyAudits = () => {
    navigate(`/auditlogspecificstaff/${profile?.adminUserId}`);
  };

  const handleHome = async ()  => {
//     const id = sessionStorage.getItem('adminid');    
//     const response = await axios.get(`http://localhost:6789/admin-users/${id}`);
// const role = response.data.role;
    switch (role) {
      case 'receptionist':
        navigate('/receptionistmain');
        break;
      case 'receptionistoffice':
        navigate('/receptionistofficemain');
        break;
      case 'receptionistroam':
        navigate('/receptionistroammain');
        break;
      case 'itparkadmin':
        navigate('/itparkadminmain');
        break;
      case 'admin':
          navigate('/adminmain');
          break;
      default:
        navigate('/');
        break;
    }
  };

  const handleRequestEmail = () => {
    const outlookComposeURL = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent('nandhakumaran.hariharan@relevantz.com')}`;
    window.open(outlookComposeURL);
  };

  const handleEmail = () => {
    const outlookInboxURL = `https://outlook.office.com/mail/inbox/${encodeURIComponent('nandhakumaran.hariharan@relevantz.com')}`;
    window.open(outlookInboxURL);
  };

  const fetchAndSendVisits = async () => {
    try {
      const response = await axios.get('http://localhost:6789/visits');
      const visits = response.data;

      const currentDate = new Date().toISOString().split('T')[0];
      const currentTime = new Date().getHours();

      const filteredVisits = visits
        .filter(visit => {
          const visitDate = new Date(visit.checkInDateTime).toISOString().split('T')[0];
          return visitDate === currentDate && visit.checkOut === null;
        })
        .map(visit => ({
          visitId: visit.visitId,
          visitorRequest: {
            requestId: visit.visitorRequest.requestId,
            visitorName: visit.visitorRequest.visitorName,
            visitorEmail: visit.visitorRequest.visitorEmail,
            visitorPhone: visit.visitorRequest.visitorPhone
          }
        }));

      if (currentTime >= 18) {
        const emailContent = JSON.stringify(filteredVisits, null, 2);
        const content = {
          to: 'nandhakumaran.hariharan@relevantz.com',
          subject: 'Visitors who have not checked out',
          body: `List of Visitors who have not checked out even after 6 PM:\n\n${emailContent}`
        };

        await axios.post('http://localhost:6789/api/sendemailmorethansix', content);
        setEmailSend(true);
      }else{
        setEmailNotSend(true);
      }
    } catch (error) {
      console.error('Error fetching or sending visits', error);
    }
  };

  const handleMoreThanSix = () => {
    fetchAndSendVisits();
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 p-4 flex items-center justify-between shadow-lg sticky top-0 z-50">
      <div className="text-white font-bold ml-12 text-2xl font-bold flex items-center space-x-2">
        {/* <FaBell className="text-yellow-400 animate-pulse" size={24} /> */}
        <img className='w-10 h-10 rounded-full' src='https://logodix.com/logo/444808.jpg'/>
        andha IT Park
      </div>
      <div className="flex text-center gap-4 space-x-4 mr-36">
        <button
          onClick={handleHome}
          className="text-white text-md font-semibold flex items-center space-x-2 hover:text-gray-200 transition transform hover:scale-105 duration-300"
        >
          <FaHome size={20} />
          <span>Home</span>
        </button>
        <button
          onClick={handleAddAudit}
          className="text-white text-md font-semibold flex items-center space-x-2 hover:text-gray-200 transition transform hover:scale-105 duration-300"
        >
          <FaPlus size={20} />
          <span>Add Audit</span>
        </button>
        <button
          onClick={handleEmail}
          className="text-white text-md font-semibold flex items-center space-x-2 hover:text-gray-200 transition transform hover:scale-105 duration-300"
        >
          <MdMailOutline size={20} />
          <span>Mail</span>
        </button>
        <button
          onClick={handleRequestEmail}
          className="text-white text-md font-semibold flex items-center space-x-2 hover:text-gray-200 transition transform hover:scale-105 duration-300"
        >
          <FaRegEnvelope size={20} />
          <span>Request</span>
        </button>
        <button
          onClick={handleViewMyAudits}
          className="text-white text-md font-semibold flex items-center space-x-2 hover:text-gray-200 transition transform hover:scale-105 duration-300"
        >
          <FaUser size={20} />
          <span>View My Audits</span>
        </button>
        <button
          onClick={handleMoreThanSix}
          className="text-white text-md font-semibold flex items-center space-x-2 hover:text-gray-200 transition transform hover:scale-105 duration-300"
        >
           <FaBell className="text-yellow-400 animate-pulse" size={20} />
          <span>After 6 PM Stay</span>
        </button>
      </div>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={handleDropdownToggle}
          className="w-12 h-12 mr-6 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden hover:bg-gray-500 transition duration-300 transform hover:scale-105"
        >
          <img
            src={profile?.profileImageBlob ? `data:image/jpeg;base64,${profile?.profileImageBlob}` : 'https://via.placeholder.com/150'}
            alt="Profile"
            className="rounded-full object-cover w-full h-full transform hover:scale-110 transition duration-300"
          />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-300 transform scale-95 transition duration-300 origin-top-right">
            <button
              onClick={handleProfile}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-300 w-full text-left flex items-center space-x-2"
            >
              <FaUser />
              <span>Profile</span>
            </button>
            <button
              onClick={handleLogout}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-300 w-full text-left flex items-center space-x-2"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>     
 {/* Email Send Modal */}
 {emailSend && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Mail Sended, Go to Mail Page</h2>
            <div className="flex justify-end">
              <button
                onClick={() => setEmailSend(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Not Send Modal */}
      {emailNotSend && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4"> Mail Not Sended. Because the Current Time is Not yet 6PM</h2>
            <div className="flex justify-center">
              <button
                onClick={() => setEmailNotSend(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default ItParkAdminNavbar;
