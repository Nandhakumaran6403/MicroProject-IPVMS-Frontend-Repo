
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaExclamationCircle } from 'react-icons/fa';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const navigate = useNavigate();

  const isEmailValid = email.includes('@');
  const isPasswordValid = password.length >= 6;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailTouched(true);
    setPasswordTouched(true);

    if (!isFormValid) {
      setError('Please enter a valid email and password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:6789/login', {
        email,
        password
      });

      if (response.data) {
        const userData = response.data;
        setLoading(false);
        switch (userData.role) {
          case 'admin':
            sessionStorage.setItem('adminid', userData.adminUserId); // Store admin ID
            navigate('/adminmain');
            break;
          case 'itparkadmin':
            sessionStorage.setItem('adminid', userData.adminUserId); // Store itparkadmin ID as adminid
            navigate('/itparkadminmain');
            break;
          case 'receptionist':
            sessionStorage.setItem('adminid', userData.adminUserId); // Store receptionists ID as adminid
            navigate('/receptionistmain');
            break;
          case 'employee':
            sessionStorage.setItem('employeeid', userData.employeeId); // Store employee ID
            navigate('/employeemain');
            break;
          case 'receptionistoffice':
            sessionStorage.setItem('adminid', userData.adminUserId); // Store manager ID as employeeid
            navigate('/receptionistofficemain');
            break;
            case 'receptionistroam':
              sessionStorage.setItem('adminid', userData.adminUserId); // Store manager ID as employeeid
              navigate('/receptionistroammain');
              break;
          default:
            setError('Incorrect email ID or password');
            setLoading(false);
            break;
        }
      } else {
        setError('Incorrect email ID or password');
        setLoading(false);
      }
    } catch (error) {
      setError('Login failed: Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="font-[sans-serif] bg-white flex items-center justify-center min-h-screen p-4">
      <div className="max-w-6xl max-md:max-w-lg rounded-md p-6 bg-white">
        <div className="grid md:grid-cols-2 items-center gap-8">
          <div className="max-md:order-1 lg:min-w-[450px]">
          <Link   to="/" >

            <img
              src="https://t4.ftcdn.net/jpg/05/82/64/95/360_F_582649577_ADd2cyo2fu8Jlil2hOKQ1vTUqqNWR8ss.jpg"
              className="lg:w-11/12 w-full object-cover"
              alt="login-image"
            /> 
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="md:max-w-md w-full mx-auto">
            <div className="mb-12">
              <h3 className="text-4xl font-extrabold text-blue-600 px-24 mx-12 text-center">Sign in</h3>
            </div>

            <div className="mb-8 relative flex flex-col">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                className={`w-full text-sm border-b border-gray-300 rounded-lg focus:border-blue-600 px-2 py-3 outline-none ${
                  emailTouched && !isEmailValid ? 'border-red-500' : ''
                }`}
                placeholder="Enter email"
                required
              />
              <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              {emailTouched && !isEmailValid && (
                <p className="text-red-500 text-xs mt-1">Invalid email format.</p>
              )}
            </div>

            <div className="mb-8 relative flex flex-col">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                className={`w-full text-sm border-b rounded-lg border-gray-300 focus:border-blue-600 px-2 py-3 outline-none ${
                  passwordTouched && !isPasswordValid ? 'border-red-500' : ''
                }`}
                placeholder="Enter password"
                required
              />
              <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              {passwordTouched && !isPasswordValid && (
                <p className="text-red-500 text-xs mt-1">Password must be at least 6 characters.</p>
              )}
            </div>

            {error && (
              <p className="text-red-500 text-center mb-4 flex items-center justify-center">
                <FaExclamationCircle className="mr-2" />
                {error}
              </p>
            )}

            <button
              type="submit"
              className={`w-full shadow-xl py-2.5 px-5 text-sm font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Sign in'}
            </button>

            
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
