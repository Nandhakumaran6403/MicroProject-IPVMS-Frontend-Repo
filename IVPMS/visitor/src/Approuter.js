import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdministrativeUserAdd from './pages/AdministrativeUser/AdministrativeUserAdd';
import AdministrativeUserEdit from './pages/AdministrativeUser/AdministrativeUserEdit';
import AdministrativeUserView from './pages/AdministrativeUser/AdministrativeUserView';
import AdministrativeUserViewAll from './pages/AdministrativeUser/AdministrativeUserViewAll';
import NotFound from './components/NotFound';
import LoginForm from './components/Login';
import AdminMain from './components/Admin/AdminMain';
import LandingPage from './components/LandingPage';
import AdminProfile from './components/Admin/AdminProfile';
import AdminNavbar from './components/Admin/AdminNavbar';
import EmployeeMain from './components/Employee/EmployeeMain';
import CompanyViewAll from './pages/Company/CompanyViewAll';
import CompanyAdd from './pages/Company/CompanyAdd';
import CompanyEdit from './pages/Company/CompanyEdit';
import CompanyView from './pages/Company/CompanyView';
import EmployeeAdd from './pages/Employee/EmployeeAdd';
import EmployeeView from './pages/Employee/EmployeeView';
import EmployeeViewAll from './pages/Employee/EmployeeViewAll';
import EmployeeProfile from './components/Employee/EmployeeProfile';
import EmployeeNavbar from './components/Employee/EmployeeNavbar';
import EmployeeEdit from './pages/Employee/EmployeeEdit';
import AppointmentView from './pages/Appointment/AppoitmentView';
import AppointmentSpecificView from './pages/Appointment/AppoitmentSpecificView';
import AppointmentEdit from './pages/Appointment/AppointmentEdit';
import AppointmentViewAll from './pages/Appointment/AppoitmentViewAll';
import AppointmentAdd from './pages/Appointment/AppointmentAdd';
import VisitorRequestEdit from './pages/VisitorRequest/VisitorRequestEdit';
import VisitorRequestView from './pages/VisitorRequest/VisitorRequestView';
import VisitorRequestViewAll from './pages/VisitorRequest/VisitorRequestViewAll';
import VisitorRequestAdd from './pages/VisitorRequest/VisitorRequestAdd';
import ReceptionistNavbar from './components/Receptionists/ReceptionistNavbar';
import ReceptionistMain from './components/Receptionists/ReceptionistMain';
import ReceptionistProfile from './components/Receptionists/ReceptionistProfile';
import QRCodeScannerEntry from './pages/QRCodeScanner/QRCodeScannerEntry';
import VisitAdd from './pages/Visit/VisitAdd';
import VisitEdit from './pages/Visit/VisitEdit';
import VisitView from './pages/Visit/VisitView';
import VisitViewAll from './pages/Visit/VisitViewAll';
import QRCodeScannerRoam from './pages/QRCodeScanner/QRCodeScannerRoam';
import QRCodeScannerOffice from './pages/QRCodeScanner/QRCodeScannerOffice';
import QRCodeForVisitor from './pages/Visitor/QRCodeForVisitor';
import VisitorRequestAddVisitor from './pages/Visitor/VisitorRequestAddVisitor';
import VisitorRequestViewAllToday from './pages/VisitorRequest/VisitorRequestViewAllToday';
import VisitItParkAdminAdd from './pages/Visit/VisitItParkAdminAdd';
import { LockProvider } from "./pages/AuditLog/LockContext";
import AuditLogAdd from './pages/AuditLog/AuditLogAdd';
import AuditLogEdit from './pages/AuditLog/AuditLogEdit';
import AuditLogView from './pages/AuditLog/AuditLogView';
import AuditLogSpecific from './pages/AuditLog/AuditLogSpecific';
import AuditLogSpecificStaff from './pages/AuditLog/AuditLogSpecificStaff';
import AuditLogViewAll from './pages/AuditLog/AuditLogViewAll';
import ReceptionistRoam from './components/Receptionists/ReceptionistRoam';
import ItParkAdminMain from './components/ItParkAdmin/ItParkAdminMain';
import ItParkAdminNavbar from './components/ItParkAdmin/ItParkAdminNavbar';
import ItParkAdminProfile from './components/ItParkAdmin/ItParkAdminProfile';
import ReceptionistOffice from './components/Receptionists/ReceptionistOffice';
import AppointmentViewToday from './pages/Appointment/AppointmentViewToday';

function Approuter() {
  return (
    <LockProvider>
    <Router>
        <Routes>

        <Route path="/" element={<LandingPage/>} />
        <Route path="*" element={<NotFound/>} />

        <Route path="/login" element={<LoginForm/>} />


        <Route path="/adminmain" element={<><AdminNavbar/><AdminMain/></>} />
        <Route path="/adminprofile/:id" element={<><AdminNavbar/><AdminProfile/></>} />

        <Route path="/itparkadminmain" element={<><ItParkAdminNavbar/><ItParkAdminMain/></>} />
        <Route path="/itparkadminprofile/:id" element={<><ItParkAdminNavbar/><ItParkAdminProfile/></>} />

        <Route path="/receptionistmain" element={<><ReceptionistNavbar/><ReceptionistMain/></>} />
        <Route path="/receptionistofficemain" element={<><ReceptionistNavbar/><ReceptionistOffice/></>} />
        <Route path="/receptionistroammain" element={<><ReceptionistNavbar/><ReceptionistRoam/></>} />
        <Route path="/receptionistprofile/:id" element={<><ReceptionistNavbar/><ReceptionistProfile/></>} />


        <Route path="/employeemain" element={<><EmployeeNavbar/><EmployeeMain/></>} />
        <Route path="/employeeprofile/:id" element={<><EmployeeNavbar/><EmployeeProfile/></>} />


        <Route path="/employeeadd" element={<><ItParkAdminNavbar/><EmployeeAdd/></>} />
        <Route path="/employeeview/:id" element={<><ItParkAdminNavbar/><EmployeeView/></>} />
        <Route path="/employeeedit/:id" element={<><ItParkAdminNavbar/><EmployeeEdit/></>} />
        <Route path="/employeeviewall" element={<><ItParkAdminNavbar/><EmployeeViewAll/></>} />




          <Route path="/adminuseradd" element={<><AdminNavbar/><AdministrativeUserAdd/></>} />
          <Route path="/adminuseredit/:id" element={<><AdministrativeUserEdit/></>} />
          <Route path="/adminuserview/:id" element={<><AdminNavbar/><AdministrativeUserView/></>} />
          <Route path="/adminuserviewall" element={<><AdminNavbar/><AdministrativeUserViewAll/></>} />

          <Route path="/companyviewall" element={<><ItParkAdminNavbar/><CompanyViewAll /></>} />
                <Route path="/companyadd" element={<><ItParkAdminNavbar/><CompanyAdd /></>} />
                <Route path="/companyedit/:id" element={<><ItParkAdminNavbar/><CompanyEdit /></>} />
                <Route path="/companyview/:id" element={<><ItParkAdminNavbar/><CompanyView /></>} />


          <Route path="/appointmentadd" element={<><EmployeeNavbar/><AppointmentAdd/></>} />
          <Route path="/appointmentspecificview/:id" element={<><EmployeeNavbar/><AppointmentSpecificView/></>} />
          <Route path="/appointmentview/:id" element={<><ReceptionistNavbar/><AppointmentView/></>} />
          <Route path="/appointmentedit/:id" element={<><ItParkAdminNavbar/><AppointmentEdit/></>} />
          <Route path="/appointmentviewall" element={<><ItParkAdminNavbar/><AppointmentViewAll/></>} />
          <Route path="/appointmentviewtoday" element={<><ReceptionistNavbar/><AppointmentViewToday/></>} />


          <Route path="/visitorrequestadd" element={<><ReceptionistNavbar/><VisitorRequestAdd /></>} />
          <Route path="/visitorrequestedit/:id" element={<VisitorRequestEdit />} />
          <Route path="/visitorrequestview/:id" element={<><ReceptionistNavbar/><VisitorRequestView /></>} />
          <Route path="/visitorrequestviewall" element={<><ItParkAdminNavbar/><VisitorRequestViewAll /></>} />
          <Route path="/visitorrequestviewalltoday" element={<><ReceptionistNavbar/><VisitorRequestViewAllToday /></>} />

          <Route path="/visitadd" element={<><ItParkAdminNavbar/><VisitAdd /></>} />
          <Route path="/visitedit/:visitId" element={<><ItParkAdminNavbar/><VisitEdit /></>} />
          <Route path="/visitview/:visitId" element={<><ItParkAdminNavbar/><VisitView /></>} />
          <Route path="/visitviewall" element={<><ItParkAdminNavbar/><VisitViewAll /></>} />

          <Route path="/qrcodescannerentry" element={<><ReceptionistNavbar/><QRCodeScannerEntry /></>} />
          <Route path="/qrcodescanneroffice" element={<><ReceptionistNavbar/><QRCodeScannerOffice /></>} />
          <Route path="/qrcodescannerroam" element={<><ReceptionistNavbar/><QRCodeScannerRoam /></>} />

          <Route path="/qrcodeforvisitor" element={<QRCodeForVisitor />} />
          <Route path="/qrcodeforvisitor/visitorrequestaddvisitor" element={<VisitorRequestAddVisitor />} />

          <Route path="/visititparkadminadd" element={<><ItParkAdminNavbar/><VisitItParkAdminAdd /></>} />


          <Route path="/auditlogadd" element={<><AuditLogAdd /></>} />
        <Route path="/auditlogedit/:id" element={<AuditLogEdit />} />
        <Route path="/auditlogview/:id" element={<><AdminNavbar/><AuditLogView /></>} />
        <Route path="/auditlogspecific/:id" element={<><AdminNavbar/><AuditLogSpecific /></>} />
        <Route path="/auditlogspecificstaff/:id" element={<><ItParkAdminNavbar/><AuditLogSpecificStaff /></>} />
        <Route path="/auditlogviewall" element={<><AdminNavbar/><AuditLogViewAll /></>} />

          </Routes>
    </Router>
    </LockProvider>
  );
}

export default Approuter;
