// 'use client'
// import React, { useEffect, useState } from 'react';
// import {
//   Box, Paper, Typography, TextField, Button, Avatar, useTheme, Card, MenuItem, Grow, Snackbar, InputAdornment, IconButton, useMediaQuery,
//   Modal, Fade, Divider, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Grid, Dialog, DialogTitle, DialogContent, DialogActions,
//   CircularProgress,
// } from '@mui/material';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import ErrorIcon from '@mui/icons-material/Error';
// import PersonIcon from '@mui/icons-material/Person';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import BusinessIcon from '@mui/icons-material/Business';
// import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
// import WorkIcon from '@mui/icons-material/Work';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
// import HailIcon from '@mui/icons-material/Hail';
// import { useRouter } from "next/navigation";
// import { toast, ToastContainer } from 'react-toastify';
// import axiosInstance from '@/lib/axios';
// import CoBrModal from './CoBrModal';
// import { useDispatch } from 'react-redux';
// import Image from 'next/image';
// import WhatsAppIcon from '@mui/icons-material/WhatsApp';
// import { buttonStyles } from '../../../public/styles/buttonStyles';
// import { fetchUserParams } from '../../app/redux/store/userParamsSlice';

// const roles = [
//   { label: 'User', value: 'user', icon: <PersonIcon /> },
//   { label: 'Customer', value: 'customer', icon: <BusinessIcon /> },
//   { label: 'Salesman', value: 'salesman', icon: <HailIcon /> },
//   { label: 'Broker', value: 'broker', icon: <AccountBalanceIcon /> },
// ];

// const Login = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const [role, setRole] = useState('user');
//   const [form, setForm] = useState({ username: 'Admin', password: 'Admin', mobile: '', });
//   const [showPwd, setShowPwd] = useState(false);
//   const [showNewPwd, setShowNewPwd] = useState(false);
//   const router = useRouter();
//   const [error, setError] = useState(false);
//   const [generatedOtp, setGeneratedOtp] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState('');
//   const [otpError, setOtpError] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [showLogin, setShowLogin] = useState(true);
//   const currentYear = new Date().getFullYear();
//   const fixedCurrentYear = currentYear - 1;
//   const nextYear = currentYear + 1;
//   const defaultYearRange = `${currentYear}-${nextYear}`;
//   const years = [defaultYearRange];
//   const [selectedYear, setSelectedYear] = useState(defaultYearRange);
//   const [otpRequests, setOtpRequests] = useState({});
//   const [isHovered, setIsHovered] = useState(false);
//   const [colorIndex, setColorIndex] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const colors = ['#3A7BD5', '#FF5733', '#28B463', '#8E44AD', '#F39C12', '#1ce6a9ff'];
//   const [loginMode, setLoginMode] = useState('username');
//   const [mobileValid, setMobileValid] = useState(null);
//   const [mobileChecking, setMobileChecking] = useState(false);
//   const [mobileMessage, setMobileMessage] = useState('');
//   const [empKey, setEmpKey] = useState('');
//   const [isNewUser, setIsNewUser] = useState(false);
//   const [createPwdOpen, setCreatePwdOpen] = useState(false);
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showCreatePwdLink, setShowCreatePwdLink] = useState(false);
//   const [empNameForModal, setEmpNameForModal] = useState('');
//   const [mobilePassword, setMobilePassword] = useState('');
//   const [emailOtp, setEmailOtp] = useState('');
//   const [enteredOtp, setEnteredOtp] = useState(['', '', '', '']);
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [showVerifiedIcon, setShowVerifiedIcon] = useState(false);
//   const [otpErrorMsg, setOtpErrorMsg] = useState('');
//   const [employeeEmailForOtp, setEmployeeEmailForOtp] = useState('');
// const dispatch = useDispatch();

//   useEffect(() => {
//     const checkMobile = async () => {
//       if (form.mobile.length === 10 && role === 'user' && loginMode === 'mobile') {
//         setMobileChecking(true);
//         setMobileMessage('');
//         setShowCreatePwdLink(false);
//         try {
//           const res = await axiosInstance.post('Employee/EmployeeLogin', {
//             MOBILE_NO: form.mobile,
//             EmpPswd: "",
//             FLAG: "",
//             EMP_KEY: ""
//           });
//           if (res.data.STATUS === 0) {
//             setMobileValid('valid');
//             setEmpKey(res.data.DATA[0].EMP_KEY || '');
//             setIsNewUser(res.data.FLAG === 'NewRe');
//             setMobileMessage(res.data.FLAG === 'NewRe' ? 'New user detected' : '');
//           } else {
//             setMobileValid('invalid');
//             setMobileMessage('Mobile not registered');
//             setIsNewUser(false);
//           }
//         } catch (err) {
//           setMobileValid('invalid');
//           setMobileMessage('Server error');
//           setIsNewUser(false);
//         } finally {
//           setMobileChecking(false);
//         }
//       } else if (form.mobile.length < 10 && form.mobile.length > 0) {
//         setMobileValid(null);
//         setMobileMessage('');
//         setShowCreatePwdLink(false);
//       }
//     };
//     const timer = setTimeout(checkMobile, 800);
//     return () => clearTimeout(timer);
//   }, [form.mobile, role, loginMode]);

//   useEffect(() => {
//     if (role === 'user') {
//       setLoginMode('username');
//     } else {
//       setLoginMode('mobile');
//     }
//     setForm({ username: 'Admin', password: 'Admin', mobile: '' });
//     setMobilePassword('');
//     setOtpSent(false);
//     setOtp('');
//     setShowCreatePwdLink(false);
//   }, [role]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     const expireTime = localStorage.getItem('authExpire');
//     const isAuthenticated = localStorage.getItem('authenticated') === 'true';
//     const hasCompanyAndBranch = localStorage.getItem('CO_ID') && localStorage.getItem('COBR_ID');

//     if (!expireTime || Date.now() > Number(expireTime) || !isAuthenticated) {
//       localStorage.removeItem('authenticated');
//       localStorage.removeItem('authExpire');
//     } else if (isAuthenticated && hasCompanyAndBranch) {

//       router.replace('/dashboard');
//     }
//   }, [router]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'mobile') {
//       const numericValue = value.replace(/[^0-9]/g, '');
//       if (numericValue.length <= 10) {
//         setForm((prev) => ({ ...prev, mobile: numericValue }));
//         if (numericValue !== form.mobile) {
//           setOtpSent(false);
//           setOtp('');
//           setShowCreatePwdLink(false);
//         }
//       }
//     } else if (name === 'otp') {
//       const numericValue = value.replace(/[^0-9]/g, '');
//       setOtp(numericValue);
//     } else if (name === 'password' && loginMode === 'mobile' && role === 'user') {
//       setMobilePassword(value);
//     }
//     else {
//       setForm((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleRoleSelect = (value) => {
//     setRole(value);
//   };

//   const canSendOtp = (mobile) => {
//     if (!otpRequests[mobile]) return true;
//     const lastRequestTime = otpRequests[mobile];
//     const fiveMinutes = 5 * 60 * 1000;
//     const currentTime = new Date().getTime();
//     return (currentTime - lastRequestTime) > fiveMinutes;
//   };

//   const getOTPFlag = () => {
//     if (role === "salesman") return "S";
//     if (role === "broker") return "B";
//     return "C";
//   };

//   const handleGenerateOtp = async () => {
//     if (form.mobile.length !== 10) {
//       setOtpError(true);
//       toast.error('Please enter a 10-digit mobile number');
//       return;
//     }
//     if (!canSendOtp(form.mobile)) {
//       const lastRequestTime = otpRequests[form.mobile];
//       const fiveMinutes = 5 * 60 * 1000;
//       const remainingTime = fiveMinutes - (new Date().getTime() - lastRequestTime);
//       const remainingSeconds = Math.ceil(remainingTime / 1000);
//       toast.error(`Please wait ${remainingSeconds} seconds before requesting a new OTP for this number.`);
//       return;
//     }
//     try {
//       const response = await axiosInstance.post('USERS/SendSMSOTP', {
//         SMS_MOBILENO: form.mobile,
//         FLAG: getOTPFlag(),
//       });
//       if (response.data.STATUS === 0) {
//         const otpCode = response.data.DATA.OTP;
//         const partyDetails = response.data.DATA.LOGINDETAIL[0];
//         const PARTY_NAME = partyDetails.PARTY_NAME;
//         const PARTY_KEY = partyDetails.PARTY_KEY;

//         localStorage.setItem('PARTY_NAME', PARTY_NAME);
//         localStorage.setItem('PARTY_KEY', PARTY_KEY);

//         setGeneratedOtp(otpCode);
//         setOtpSent(true);
//         setOtpError(false);
//         setOtpRequests(prev => ({
//           ...prev,
//           [form.mobile]: new Date().getTime()
//         }));
//         toast.success(response.data.MESSAGE || 'OTP sent successfully', { autoClose: 1000 });
//       } else {
//         setOtpError(true);
//         toast.error(response.data.MESSAGE || 'Mobile number is not registered', { autoClose: 1000 });
//       }
//     } catch (error) {
//       setOtpError(true);
//       toast.error('Error sending OTP. Please try again.', { autoClose: 1000 });
//     }
//   };

//  const handleVerifyOtp = async () => {
//     if (!otp || otp.length !== 6) {
//       toast.info("Please enter a valid 6-digit otp.");
//     }
//     if (otp.trim() === generatedOtp) {
//       const currentYear = new Date().getFullYear();
//       const lastTwoDigits = currentYear.toString().slice(-2);
//       localStorage.setItem('FCYR_KEY', lastTwoDigits);
//       localStorage.setItem('authenticated', 'true');
//       localStorage.setItem('userRole', role);
//       // await fetchAndSaveUserParams();
//       await dispatch(fetchUserParams());
//       setShowLogin(false);
//       setModalOpen(true);
//     } else {
//       toast.error('Invalid OTP. Please try again.');
//     }
//   };

//   const openCreatePasswordModal = async () => {
//     try {
//       const res = await axiosInstance.post('Employee/EmployeeLogin', {
//         MOBILE_NO: form.mobile,
//         EmpPswd: "",
//         FLAG: "",
//         EMP_KEY: ""
//       });

//       if (res.data.STATUS !== 0 || !res.data.DATA?.length) {
//         toast.error(res.data.MESSAGE || "Employee not found");
//         return;
//       }

//       const empData = res.data.DATA[0];

//       const employeeName = empData.EMP_NAME?.trim() || 'Employee';
//       const employeeEmail = empData.EMAIL?.trim() || '';

//       setEmpKey(empData.EMP_KEY || '');
//       setEmpNameForModal(employeeName);
//       setEmployeeEmailForOtp(employeeEmail);;

//       if (!employeeEmail) {
//         toast.error("Email not found for this employee. Please contact admin.");
//         return;
//       }

//       // Step 2: Generate OTP from Backend
//       const otpResponse = await axiosInstance.post('Email/OtpGenerate', {});

//       if (otpResponse.data.STATUS !== 0) {
//         toast.error(otpResponse.data.MESSAGE || "Failed to generate OTP");
//         return;
//       }

//       // Extract 4-digit OTP
//       let generatedOtpFromApi = null;
//       const rawData = otpResponse.data.DATA || otpResponse.data.Message || "";

//       const match = String(rawData).match(/(\d{4})/);
//       if (match && match[0]) {
//         generatedOtpFromApi = match[0];
//       } else if (otpResponse.data.OTP) {
//         generatedOtpFromApi = otpResponse.data.OTP;
//       }

//       if (!generatedOtpFromApi) {
//         toast.error("Failed to extract OTP from server");
//         return;
//       }

//       // Step 3: Send Email
//       const mailSent = await sendMailOtp(employeeEmail, generatedOtpFromApi);

//       if (mailSent) {
//         setEmailOtp(generatedOtpFromApi);
//         toast.success(`OTP sent successfully to ${employeeEmail}`);
//       } else {
//         toast.warning("OTP generated but email could not be sent.");
//         setEmailOtp(generatedOtpFromApi);
//       }
//       setCreatePwdOpen(true);
//       setEnteredOtp(['', '', '', '']);
//       setNewPassword('');
//       setConfirmPassword('');
//       setOtpErrorMsg('');
//     } catch (err) {
//       toast.error("Something went wrong. Please try again.");
//     }
//   };

//   // Handle individual OTP input change with auto-focus + verification
//   const handleOtpChange = (e, index) => {
//     const value = e.target.value.replace(/[^0-9]/g, '');
//     if (value.length > 1) return;

//     const newOtp = [...enteredOtp];
//     newOtp[index] = value;
//     setEnteredOtp(newOtp);
//     setOtpErrorMsg('');

//     // Auto focus next input
//     if (value && index < 3) {
//       const nextInput = document.getElementById(`otp-${index + 1}`);
//       nextInput?.focus();
//     }

//     // Check verification only when all 4 digits are entered
//     if (index === 3 && value) {
//       const enteredOtpString = [...newOtp.slice(0, 3), value].join('');

//       if (enteredOtpString.length === 4) {
//         if (enteredOtpString === emailOtp) {
//           setOtpVerified(true);
//           setShowVerifiedIcon(true);
//           setOtpErrorMsg('');
//         } else {
//           setOtpVerified(false);
//           setShowVerifiedIcon(false);
//           setOtpErrorMsg('Invalid OTP');
//         }
//       }
//     }
//   };

//   // Add this function to fetch and save User Parameters
// const fetchAndSaveUserParams = async () => {
//   try {
//     const response = await axiosInstance.post('USERPARAM/RetriveUserParam', {
//       USERPM_ID: 0,
//       USERPM_NAME: "",
//       REMARK: "",
//       FLAG: ""
//     });
    
//     if (response.data.STATUS === 0 && response.data.DATA) {
//       // Save the entire DATA array to localStorage
//       localStorage.setItem('USER_PARAMS', JSON.stringify(response.data.DATA));
      
//       // Also save individual parameters for easy access
//       const userParamsMap = {};
//       response.data.DATA.forEach(param => {
//         userParamsMap[param.USERPM_NAME] = {
//           USERPM_ID: param.USERPM_ID,
//           REMARK: param.REMARK,
//           SECPM_ID: param.SECPM_ID,
//           SECPM_NAME: param.SECPM_NAME,
//           COBR_ID: param.COBR_ID,
//           NAME: param.NAME
//         };
//       });
//       localStorage.setItem('USER_PARAMS_MAP', JSON.stringify(userParamsMap));
      
//       console.log('User parameters saved successfully:', response.data.DATA);
//       return response.data.DATA;
//     } else {
//       console.error('Failed to fetch user parameters:', response.data.MESSAGE);
//       return [];
//     }
//   } catch (err) {
//     console.error('Error fetching user parameters:', err);
//     return [];
//   }
// };

// // Helper function to get user parameter by name
// const getUserParamByName = (paramName) => {
//   try {
//     const paramsMap = JSON.parse(localStorage.getItem('USER_PARAMS_MAP') || '{}');
//     return paramsMap[paramName] || null;
//   } catch (err) {
//     console.error('Error getting user param:', err);
//     return null;
//   }
// };

// // Helper function to get user parameter by ID
// const getUserParamById = (paramId) => {
//   try {
//     const params = JSON.parse(localStorage.getItem('USER_PARAMS') || '[]');
//     return params.find(param => param.USERPM_ID === paramId) || null;
//   } catch (err) {
//     console.error('Error getting user param by ID:', err);
//     return null;
//   }
// };

// // Helper function to get all user parameters
// const getAllUserParams = () => {
//   try {
//     return JSON.parse(localStorage.getItem('USER_PARAMS') || '[]');
//   } catch (err) {
//     console.error('Error getting all user params:', err);
//     return [];
//   }
// };

//   const handleOtpKeyDown = (e, index) => {
//     if (e.key === 'Backspace') {
//       if (enteredOtp[index]) {
//         const newOtp = [...enteredOtp];
//         newOtp[index] = '';
//         setEnteredOtp(newOtp);
//       } else if (index > 0) {
//         const prevInput = document.getElementById(`otp-${index - 1}`);
//         prevInput?.focus();

//         const newOtp = [...enteredOtp];
//         newOtp[index - 1] = '';
//         setEnteredOtp(newOtp);
//       }
//     }
//   };

//   // Create new password
//   const handleCreatePassword = async () => {
//     const enteredOtpString = enteredOtp.join('');

//     if (enteredOtpString.length !== 4) {
//       setOtpErrorMsg('Please enter the 4-digit OTP');
//       toast.error('Please enter the 4-digit OTP');
//       return;
//     }

//     if (enteredOtpString !== emailOtp) {
//       setOtpErrorMsg('Invalid OTP');
//       toast.error('Invalid OTP. Please try again.');
//       return;
//     }

//     // OTP is correct
//     setOtpVerified(true);

//     if (newPassword !== confirmPassword) {
//       toast.error('Passwords do not match');
//       return;
//     }

//     if (newPassword.length < 4) {
//       toast.error('Password must be at least 4 characters');
//       return;
//     }

//     try {
//       const res = await axiosInstance.post('Employee/InsertEmployeeLogin', {
//         MOBILE_NO: form.mobile,
//         EmpPswd: newPassword,
//         FLAG: "",
//         EMP_KEY: empKey
//       });

//       if (res.data.STATUS === 0) {
//         toast.success('Password created successfully! You can now login.');
//         setCreatePwdOpen(false);
//         setNewPassword('');
//         setConfirmPassword('');
//         setEnteredOtp(['', '', '', '']);
//         setShowCreatePwdLink(false);
//         setIsNewUser(false);
//         setOtpVerified(false);
//       } else {
//         toast.error(res.data.MESSAGE || 'Failed to create password');
//       }
//     } catch (err) {
//       toast.error('Error creating password');
//     }
//   };

//   //  Login for User (Employee) with Mobile + Password
//   const handleEmployeeLogin = async () => {
//     if (!mobilePassword) return toast.error('Enter password');
//     try {
//       const encRes = await axiosInstance.post('USERS/Getpwdencryption', {
//         USER_NAME: form.mobile,
//         USER_PWD: mobilePassword
//       });
//       const encryptedPwd = encRes.data.DATA;
//       const loginRes = await axiosInstance.post('Employee/EmployeeLogin', {
//         MOBILE_NO: form.mobile,
//         EmpPswd: encryptedPwd,
//         FLAG: "Auth",
//         EMP_KEY: empKey
//       });
//       if (loginRes.data.STATUS === 0) {
//         const employeeData = loginRes.data.DATA[0];
//         localStorage.setItem('authenticated', 'true');
//         localStorage.setItem('userRole', 'employee');
//         localStorage.setItem('FCYR_KEY', fixedCurrentYear.toString().slice(-2));
//         localStorage.setItem('EMP_KEY', employeeData.EMP_KEY);
//         localStorage.setItem('EMP_NAME', employeeData.EMP_NAME);
//         if (employeeData.EMP_KEY) {
//           localStorage.setItem('EMP_KEY', employeeData.EMP_KEY);
//           // await fetchAndSaveUserParams();
//           await dispatch(fetchUserParams());
//           router.push('/employeepage');
//         }
//         if (employeeData.EMP_NAME) {
//           localStorage.setItem('EMP_NAME', employeeData.EMP_NAME);
//         }
//         localStorage.removeItem('USER_ID');
//         setShowLogin(false);
//         setModalOpen(true);
//       } else {
//         setShowCreatePwdLink(true);
//         toast.error('Invalid Credentials');
//       }
//     } catch (err) {
//       toast.error('Login failed');
//     }
//   };

//   const handleLogin = async () => {
//     if (role !== 'customer') {
//       if (!form.username.trim() || !form.password.trim()) {
//         toast.info("Username and password are required.");
//         return;
//       }
//     }
//     setLoading(true);
//     try {
//       const encryptionResponse = await axiosInstance.post('USERS/Getpwdencryption', {
//         USER_NAME: form.username,
//         USER_PWD: form.password,
//       });
//       const encryptedPassword = encryptionResponse.data.DATA;
//       const loginResponse = await axiosInstance.post('USERS/GetUserLogin', {
//         USER_NAME: form.username,
//         USER_PWD: encryptedPassword,
//       });
//       if (loginResponse.data.STATUS === 0) {
//         const loginDetails = loginResponse.data.DATA[0];
//         const USER_NAME = loginDetails.USER_NAME;
//         const USER_ID = loginDetails.USER_ID;
//         const currentYear = new Date().getFullYear();
//         const fixCurrentYear = currentYear - 1;
//         const lastTwoDigits = fixCurrentYear.toString().slice(-2);
//         localStorage.setItem('USER_NAME', USER_NAME);
//         localStorage.setItem('USER_ID', USER_ID);
//         localStorage.setItem('USER_NAME', USER_NAME);
//         localStorage.setItem('FCYR_KEY', lastTwoDigits);
//         localStorage.setItem('authenticated', 'true');
//         localStorage.setItem('userRole', 'user');
//         localStorage.removeItem('EMP_KEY');
//         localStorage.removeItem('EMP_NAME');

//         //  await fetchAndSaveUserParams();
//            await dispatch(fetchUserParams());
//         setShowLogin(false);
//         setModalOpen(true);
//       } else {
//         toast.error('Invalid Credentials');
//         // setError(true);
//       }
//     } catch (err) {
//       console.log("Error in Login Api ", err)
//       // setError(true);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleCloseSnackbar = () => {
//     setError(false);
//   };
//   const handleClickShowPassword = () => {
//     setShowPwd(!showPwd);
//   };
//   const handleClickShowNewPassword = () => {
//     setShowNewPwd(!showNewPwd);
//   };
//   const resetToLogin = () => {
//     // Clear all localStorage when returning to login
//     localStorage.removeItem('authenticated');
//     localStorage.removeItem('userRole');
//     localStorage.removeItem('CO_ID');
//     localStorage.removeItem('COBR_ID');
//     localStorage.removeItem('PARTY_NAME');
//     localStorage.removeItem('PARTY_KEY');
//     localStorage.removeItem('FCYR_KEY');
//     localStorage.removeItem('USER_NAME');
//     localStorage.removeItem('USER_ID');
//     localStorage.removeItem('EMP_KEY');
//     localStorage.removeItem('EMP_NAME');
//       localStorage.removeItem('USER_PARAMS'); 
//   localStorage.removeItem('USER_PARAMS_MAP');
// dispatch(clearUserParams());
//     setShowLogin(true);
//     setModalOpen(false);
//     setForm({ username: '', password: '', mobile: '' });
//     setRole('user');
//     setOtpSent(false);
//     setGeneratedOtp('');
//     setMobilePassword('');
//   };

//   const sendMailOtp = async (email, otp) => {
//     if (!email || !email.includes('@')) {
//       toast.error("Invalid email address");
//       return false;
//     };

//     if (!otp) {
//       toast.error("OTP is missing");
//       return false;
//     };

//     try {
//       const response = await axiosInstance.post('Email/SendEmail', {
//         TASK_ID: 0,
//         COBR_ID: "02",
//         USER_ID: 1,
//         PARTY_KEY: "",
//         ToEmail: [email],
//         Subject: "Your OTP Code for Password Setup",
//         ImgFolderNm: "",
//         Body: `Dear User,<br><br>
//              Your OTP for creating new password is: <strong>${otp}</strong><br><br>
//              This OTP is valid for 10 minutes.<br>
//              Please do not share this OTP with anyone.<br><br>
//              Regards,<br>Pratham Systech Team`,
//         DocAttachments: []
//       });

//       if (response.data.STATUS === 0) {
//         return true;
//       } else {
//         toast.error(response.data.MESSAGE || "Failed to send email");
//         return false;
//       }
//     } catch (err) {
//       toast.error("Failed to send OTP email. Please try again.");
//       return false;
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         width: '100%',
//         p: isMobile ? 2 : 0,
//         position: 'relative',
//         overflow: 'hidden',
//         background: 'linear-gradient(to bottom, #ffffff 0%, #d0f0fd 30%, #a3ddf8 60%, #5dbbf2 100%)',
//         '&::before': {
//           content: '""',
//           position: 'absolute',
//           top: '-10%',
//           left: '-20%',
//           width: '150%',
//           height: '150%',
//           background: 'radial-gradient(circle at 60% 40%, rgba(26, 141, 229, 0.2) 0%, transparent 70%)',
//           zIndex: 0,
//         },
//         '&::after': {
//           content: '""',
//           position: 'absolute',
//           bottom: 0,
//           left: 0,
//           width: '100%',
//           height: '200px',
//           background: 'linear-gradient(to right, rgba(26, 141, 229, 0.3), rgba(93, 187, 242, 0.4))',
//           borderTopLeftRadius: '100% 40%',
//           borderTopRightRadius: '100% 40%',
//           zIndex: 0,
//         },
//       }}
//     >
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />
//       {showLogin ? (
//         <Fade in={showLogin} timeout={800}>
//           <Paper
//             elevation={24}
//             sx={{
//               display: 'flex',
//               flexDirection: { xs: 'column', sm: 'row' },
//               width: { xs: '95%', sm: '90%', md: '700px' },
//               maxWidth: '850px',
//               height: { xs: 'auto', sm: 'auto', md: '500px' },
//               borderRadius: 4,
//               overflow: 'hidden',
//               bgcolor: 'rgba(255, 255, 255, 1)',
//               backdropFilter: 'blur(10px)',
//               boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
//               position: 'relative',
//               zIndex: 1,
//               border: '1px solid rgba(255, 255, 255, 0.2)',
//             }}
//           >
//             {isMobile ? (
//               <Box sx={{ width: '100%', p: 3 }}>
//                 <Box textAlign="center" sx={{ mb: 1.5 }}>
//                   <Image
//                     src="/images/P_IconLogo.png"
//                     alt="Profile"
//                     width={180}
//                     height={80}
//                   />
//                   <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
//                     {/* <Image
//                       src="/images/pratham.jpeg"
//                       alt="Company Logo"
//                       width={50}
//                       height={50}
//                       style={{ marginRight: '0px' }}
//                     /> */}
//                     <Box sx={{ textAlign: 'left' }}>
//                       <Typography variant="body2" sx={{
//                         color: '#000',
//                         fontWeight: 500,
//                         lineHeight: 1.5,
//                         fontSize: '0.8rem',
//                         marginBottom: '2px'
//                       }}>
//                         The symbol of business integration
//                       </Typography>
//                       <Typography variant="body2" sx={{
//                         color: '#333',
//                         fontWeight: 500,
//                         lineHeight: 1.2,
//                         fontSize: '0.75rem',
//                         marginBottom: '2px'
//                       }}>
//                         Powered By :-
//                       </Typography>
//                       <Typography variant="body1" sx={{
//                         color: colors[colorIndex],
//                         fontWeight: 700,
//                         lineHeight: 1.1,
//                         fontSize: '0.85rem',
//                         marginBottom: '2px',
//                         transition: 'color 0.5s ease'
//                       }}>
//                         PRATHAM SYSTECH INDIA LTD.
//                       </Typography>

//                       <Typography variant="body2" sx={{
//                         color: '#333',
//                         fontWeight: 600,
//                         lineHeight: 1.1,
//                         fontSize: '0.75rem',
//                         display: 'flex',
//                         alignItems: 'center'
//                       }}>
//                         <WhatsAppIcon sx={{
//                           color: '#25D366',
//                           fontSize: '1rem',
//                           marginRight: '4px'
//                         }} />
//                         8779163857
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </Box>
//                 {/* Role Selection */}
//                 <Box sx={{ p: 0, bgcolor: '#ffffff', borderBottom: '1px solid #e0e0e0' }}>
//                   <FormControl component="fieldset" fullWidth>
//                     {/* <FormLabel
//                       component="legend"
//                       sx={{ fontWeight: 'bold', color: '#333' }}
//                     >
//                       Select Your Role:
//                     </FormLabel> */}
//                     <RadioGroup
//                       value={role}
//                       onChange={(e) => handleRoleSelect(e.target.value)}
//                     >
//                       <Grid container spacing={0}>
//                         {roles.map((r) => (
//                           <Grid size={{ xs: 6 }} key={r.value}>
//                             <FormControlLabel
//                               value={r.value}
//                               control={<Radio sx={{ padding: 1 }} />}
//                               label={r.label}
//                               sx={{
//                                 '& .MuiFormControlLabel-label': {
//                                   fontSize: '0.8rem',
//                                   margin: 0,
//                                 },
//                                 // marginBottom: 0.5, 
//                               }}
//                             />
//                           </Grid>
//                         ))}
//                       </Grid>
//                     </RadioGroup>
//                   </FormControl>
//                 </Box>
//                 {/* Form Fields */}
//                 {role === 'user' && (
//                   <>
//                     <Box sx={{
//                       display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center',
//                       bgcolor: '#f5f5f5', p: 0, border: '1px solid #ddd', width: '100%', maxWidth: '300px', margin: '0 auto',
//                       boxShadow: '0 1px 2px rgba(0,0,0,0.1)', display: 'flex', borderRadius: 2,
//                     }}>
//                       <FormControlLabel
//                         control={
//                           <Radio
//                             checked={loginMode === 'username'}
//                             onChange={() => setLoginMode('username')}
//                             value="username"
//                             color="primary"
//                           />
//                         }
//                         label="Username"
//                         sx={{
//                           '& .MuiFormControlLabel-label': {
//                             fontSize: '0.8rem',
//                           },
//                         }}
//                       />
//                       <FormControlLabel
//                         control={
//                           <Radio
//                             checked={loginMode === 'mobile'}
//                             onChange={() => setLoginMode('mobile')}
//                             value="mobile"
//                             color="primary"
//                           />
//                         }
//                         label="Mobile"
//                         sx={{
//                           '& .MuiFormControlLabel-label': {
//                             fontSize: '0.8rem',
//                           },
//                         }}
//                       />
//                     </Box>

//                     {loginMode === 'username' && (
//                       <>
//                         <TextField
//                           label="Username"
//                           variant="outlined"
//                           name="username"
//                           value={form.username}
//                           onChange={(e) => {
//                             const input = e.target.value;
//                             if (/^[a-zA-Z]+$/.test(input) || input === '') {
//                               handleChange(e);
//                             }
//                           }}
//                           fullWidth
//                           size="medium"
//                           className='loginInput'
//                           sx={{
//                             mb: 1, mt: 1,
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: 2,
//                               backgroundColor: '#f9f9f9',
//                             }
//                           }}
//                         />
//                         <TextField
//                           label="Password"
//                           type={showPwd ? 'text' : 'password'}
//                           variant="outlined"
//                           name="password"
//                           value={form.password}
//                           onChange={handleChange}
//                           fullWidth
//                           size="medium"
//                           InputProps={{
//                             endAdornment: (
//                               <InputAdornment position="end">
//                                 <IconButton
//                                   aria-label={showPwd ? "Hide password" : "Show password"}
//                                   onClick={handleClickShowPassword}
//                                   edge="end"
//                                   sx={{ color: '#777' }}
//                                 >
//                                   {showPwd ? <Visibility /> : <VisibilityOff />}
//                                 </IconButton>
//                               </InputAdornment>
//                             ),
//                           }}
//                           sx={{
//                             mb: 1,
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: 2,
//                               backgroundColor: '#f9f9f9',
//                             }
//                           }}
//                         />
//                       </>
//                     )}
//                     {loginMode === 'mobile' && (
//                       <>
//                         <TextField
//                           label="Mobile Number"
//                           variant="outlined"
//                           name="mobile"
//                           value={form.mobile}
//                           onChange={handleChange}
//                           fullWidth
//                           size="medium"
//                           InputProps={{
//                             startAdornment: <PhoneIphoneIcon sx={{ color: '#777' }} />,
//                             endAdornment: (
//                               <InputAdornment position="end">
//                                 {mobileChecking && <CircularProgress size={20} />}
//                                 {form.mobile && mobileValid === 'valid' && <CheckCircleIcon color="success" />}
//                                 {form.mobile && mobileValid === 'invalid' && <ErrorIcon color="error" />}
//                               </InputAdornment>
//                             )
//                           }}
//                           helperText={mobileMessage}
//                           error={mobileValid === 'invalid'}
//                           sx={{
//                             my: 1,
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: 2,
//                               backgroundColor: '#f9f9f9',
//                             },
//                           }}
//                         />
//                         {/* {mobileValid === 'valid' && !isNewUser && ( */}
//                         <TextField
//                           label="Password"
//                           type={showPwd ? 'text' : 'password'}
//                           variant="outlined"
//                           name="password"
//                           value={loginMode === 'mobile' && role === 'user' ? mobilePassword : form.password}
//                           onChange={handleChange}
//                           fullWidth
//                           size="medium"
//                           onKeyDown={(e) => {
//                             if (e.key === 'Enter') {
//                               handleLogin();
//                             }
//                           }}
//                           InputProps={{
//                             endAdornment: (
//                               <InputAdornment position="end">
//                                 <IconButton
//                                   aria-label={showPwd ? "Hide password" : "Show password"}
//                                   onClick={handleClickShowPassword}
//                                   edge="end"
//                                   sx={{ color: '#777' }}
//                                 >
//                                   {showPwd ? <Visibility /> : <VisibilityOff />}
//                                 </IconButton>
//                               </InputAdornment>
//                             ),
//                           }}
//                           sx={{
//                             mb: 1,
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: 2,
//                               backgroundColor: '#f9f9f9',
//                             },
//                           }}
//                         />
//                         {/* )} */}
//                         {showCreatePwdLink && (
//                           <Typography
//                             variant="body2"
//                             color="primary"
//                             sx={{
//                               cursor: 'pointer',
//                               textDecoration: 'underline',
//                               mb: 2,
//                               fontWeight: 500,
//                             }}
//                             onClick={openCreatePasswordModal}
//                           >
//                             Forgot Password?
//                           </Typography>
//                         )}
//                       </>
//                     )}
//                   </>
//                 )}
//                 {/* ===================== */}
//                 {['customer', 'salesman', 'broker'].includes(role) && (
//                   <>
//                     <TextField
//                       label="Mobile Number"
//                       variant="outlined"
//                       name="mobile"
//                       value={form.mobile}
//                       onChange={handleChange}
//                       fullWidth
//                       size="medium"
//                       InputProps={{
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <PhoneIphoneIcon sx={{ color: '#777' }} />
//                           </InputAdornment>
//                         ),
//                       }}
//                       sx={{
//                         mb: 1,
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 2,
//                           backgroundColor: '#f9f9f9',
//                         }
//                       }}
//                     />
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexDirection: isMobile ? 'column' : 'row' }}>
//                       {form.mobile.length === 10 && !otpSent && (
//                         <Button
//                           variant="contained"
//                           onClick={handleGenerateOtp}
//                           fullWidth={isMobile}
//                           sx={{
//                             bgcolor: '#3A7BD5',
//                             color: '#fff',
//                             borderRadius: 2,
//                             fontWeight: 600,
//                             textTransform: 'none',
//                             py: 1,
//                             boxShadow: '0 4px 8px rgba(58, 123, 213, 0.3)',
//                             '&:hover': {
//                               bgcolor: '#2A5DA8',
//                               boxShadow: '0 6px 12px rgba(58, 123, 213, 0.4)',
//                             },
//                             transition: 'all 0.3s ease',
//                           }}
//                         >
//                           Send OTP
//                         </Button>
//                       )}

//                       {otpSent && (
//                         <>
//                           <TextField
//                             label="Enter OTP"
//                             variant="outlined"
//                             name="otp"
//                             value={otp}
//                             onChange={handleChange}
//                             size="medium"
//                             type="tel"
//                             sx={{
//                               flex: 1,
//                               '& .MuiOutlinedInput-root': {
//                                 borderRadius: 2,
//                                 backgroundColor: '#f9f9f9',
//                               }
//                             }}
//                           />
//                           <Button
//                             variant="contained"
//                             onClick={handleVerifyOtp}
//                             sx={{
//                               bgcolor: '#00B761',
//                               color: '#fff',
//                               fontWeight: 600,
//                               borderRadius: 2,
//                               textTransform: 'none',
//                               py: 1,
//                               px: 2,
//                               boxShadow: '0 4px 8px rgba(0, 183, 97, 0.3)',
//                               '&:hover': {
//                                 bgcolor: '#009650',
//                                 boxShadow: '0 6px 12px rgba(0, 183, 97, 0.4)',
//                               },
//                               transition: 'all 0.3s ease',
//                             }}
//                           >
//                             Verify
//                           </Button>
//                         </>
//                       )}
//                     </Box>
//                   </>
//                 )}
//                 <TextField
//                   select
//                   label="Financial Year"
//                   variant="outlined"
//                   value={selectedYear}
//                   onChange={(e) => setSelectedYear(e.target.value)}
//                   fullWidth
//                   size="medium"
//                   sx={{
//                     mb: 1,
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: 2,
//                       backgroundColor: '#f9f9f9',
//                     }
//                   }}
//                 >
//                   {years.map((year) => (
//                     <MenuItem key={year} value={year}>
//                       {year}
//                     </MenuItem>
//                   ))}
//                 </TextField>

//                 <Box
//                   sx={{
//                     display: 'flex',
//                     gap: 2,
//                     justifyContent: 'center',
//                     flexDirection: 'row',
//                   }}
//                 >
//                   <Button
//                     variant="contained"
//                     onClick={() => {
//                       if (role === 'user' && loginMode === 'mobile') {
//                         if (isNewUser) {
//                           toast.info("Please create a password first");
//                         } else if (mobileValid === 'valid') {
//                           handleEmployeeLogin();
//                         }
//                       } else if (['customer', 'salesman', 'broker'].includes(role)) {
//                         if (otpSent && otp.length === 4) handleVerifyOtp();
//                         else toast.info("Please verify OTP");
//                       } else {
//                         handleLogin();
//                       }
//                     }}
//                     disabled={
//                       loading ||
//                       (role === 'user' && loginMode === 'mobile' && mobileValid !== 'valid') ||
//                       (['customer', 'salesman', 'broker'].includes(role) && !otpSent)
//                     }

//                     sx={buttonStyles}
//                     fullWidth
//                   >
//                     {loading ? 'Signing in...' : 'Sign In'}
//                   </Button>
//                   <Button
//                     variant="outlined"
//                     onClick={() => {
//                       setForm({ username: '', password: '', mobile: '' });
//                       setRole('user');
//                       setOtpSent(false);
//                       setMobilePassword('');
//                       setMobileValid('');
//                       setMobileMessage('');
//                     }}
//                     sx={{
//                       borderColor: '#ccc',
//                       color: '#b90909ff',
//                       borderRadius: '12px',
//                       fontSize: '1rem',
//                       fontWeight: 600,
//                       textTransform: 'none',
//                       py: 1,
//                       '&:hover': {
//                         borderColor: '#999',
//                         color: '#a00303ff',
//                       },
//                       transition: 'all 0.3s ease',
//                     }}
//                     fullWidth
//                   >
//                     Clear
//                   </Button>
//                 </Box>
//               </Box>
//             ) : (
//               <>
//                 {/* Desktop View */}
//                 <Box
//                   sx={{
//                     width: { xs: '100%', sm: '40%' },
//                     display: { xs: 'none', sm: 'flex' },
//                     background: 'linear-gradient(135deg, #3A7BD5 0%, #2A5DA8 100%)',
//                     p: 3,
//                     flexDirection: 'column',
//                     justifyContent: 'space-between',
//                     color: 'white',
//                     position: 'relative',
//                     overflow: 'hidden',
//                   }}
//                 >
//                   <Box>
//                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                       <LockOutlinedIcon sx={{ mr: 1, fontSize: 32 }} />
//                       <Typography variant="h5" fontWeight="700">
//                         Secure Login
//                       </Typography>
//                     </Box>
//                     <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
//                       Welcome Back!
//                     </Typography>
//                     <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
//                       Sign in to access your account and manage your business operations efficiently.
//                     </Typography>
//                     <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', my: 1 }} />
//                     <Typography variant="body2" fontWeight="600" sx={{ mb: 1.5 }}>
//                       Select Your Role:
//                     </Typography>
//                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//                       {roles.map((r) => (
//                         <Card
//                           key={r.value}
//                           onClick={() => handleRoleSelect(r.value)}
//                           onMouseEnter={() => setIsHovered(r.value)}
//                           onMouseLeave={() => setIsHovered(false)}
//                           sx={{
//                             display: 'flex',
//                             alignItems: 'center',
//                             p: 1,
//                             cursor: 'pointer',
//                             bgcolor: role === r.value ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255,255,255,0.1)',
//                             border: role === r.value ? '1px solid rgba(255,255,255,0.5)' : '1px solid transparent',
//                             transition: 'all 0.3s ease',
//                             backdropFilter: 'blur(10px)',
//                             '&:hover': {
//                               bgcolor: 'rgba(255,255,255,0.2)',
//                               transform: 'translateX(5px)',
//                             },
//                           }}
//                         >
//                           <Avatar sx={{
//                             bgcolor: 'rgba(255,255,255,0.9)',
//                             width: 32,
//                             height: 32,
//                             mr: 2,
//                             color: '#3A7BD5'
//                           }}>
//                             {r.icon}
//                           </Avatar>
//                           <Typography fontWeight={500} fontSize="0.95rem" sx={{ userSelect: 'none', color: 'white', fontWeight: '700' }}>
//                             {r.label}
//                           </Typography>
//                         </Card>
//                       ))}
//                     </Box>
//                   </Box>
//                   <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 2 }}>
//                     © 2006-{currentYear} prasyst. All rights reserved.
//                   </Typography>
//                   <Typography variant="body2" sx={{
//                     color: '#fff',
//                     lineHeight: 1.2,
//                     fontSize: '0.75rem',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center'
//                   }}>
//                     <WhatsAppIcon sx={{
//                       color: '#25D366',
//                       fontSize: '0.9rem',
//                       marginRight: '4px'
//                     }} />
//                     8779163857
//                   </Typography>
//                 </Box>
//                 <Box
//                   sx={{
//                     width: { xs: '100%', sm: '60%' },
//                     padding: { xs: 3, sm: 4 },
//                     display: 'flex',
//                     flexDirection: 'column',
//                     justifyContent: 'center',
//                   }}
//                 >
//                   <Box textAlign="center" sx={{ mb: 1 }}>
//                     <Image
//                       src="/images/P_IconLogo.png"
//                       alt="Profile"
//                       width={200}
//                       height={100}
//                     />
//                     <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
//                       {/* <Image
//                         src="/images/FavIcon.png"
//                         alt="Company Logo"
//                         width={50}
//                         height={50}
//                         style={{ marginRight: '0px' }}
//                       /> */}
//                       <Box sx={{ textAlign: 'left' }}>
//                         <Typography variant="body2" sx={{
//                           color: '#000',
//                           fontWeight: 500,
//                           lineHeight: 1,
//                           fontSize: '0.82rem',
//                           marginBottom: '2px'
//                         }}>
//                           The symbol of business integration
//                         </Typography>
//                         <Typography variant="body2" sx={{
//                           color: '#333',
//                           fontWeight: 500,
//                           lineHeight: 1.2,
//                           fontSize: '0.75rem',
//                           marginLeft: '-81px'
//                         }}>
//                           Powered By :-
//                         </Typography>
//                         <Typography variant="body1" sx={{
//                           color: colors[colorIndex],
//                           fontWeight: 700,
//                           lineHeight: 1.1,
//                           fontSize: '0.85rem',
//                           marginBottom: '2px',
//                           transition: 'color 0.5s ease',
//                           marginTop: '-10px'
//                         }}>
//                           PRATHAM SYSTECH INDIA LTD.
//                         </Typography>

//                         {/* <Typography variant="body2" sx={{
//                           color: '#333',
//                           fontWeight: 600,
//                           lineHeight: 1.2,
//                           fontSize: '0.75rem',
//                           display: 'flex',
//                           alignItems: 'center'
//                         }}>
//                           <WhatsAppIcon sx={{
//                             color: '#25D366',
//                             fontSize: '1rem',
//                             marginRight: '4px'
//                           }} />
//                           8779163857
//                         </Typography> */}
//                       </Box>
//                     </Box>
//                   </Box>
//                   {role === 'user' && (
//                     <>
//                       <Box sx={{ display: 'flex', gap: 0.1, mb: 0.3 }}>
//                         <FormControlLabel
//                           control={
//                             <Radio
//                               checked={loginMode === 'username'}
//                               onChange={() => setLoginMode('username')}
//                               value="username"
//                               color="primary"
//                             />
//                           }
//                           label="Username"
//                         />
//                         <FormControlLabel
//                           control={
//                             <Radio
//                               checked={loginMode === 'mobile'}
//                               onChange={() => setLoginMode('mobile')}
//                               value="mobile"
//                               color="primary"
//                             />
//                           }
//                           label="Mobile"
//                         />
//                       </Box>
//                       {loginMode === 'username' && (
//                         <>
//                           <TextField
//                             label="Username"
//                             variant="outlined"
//                             name="username"
//                             value={form.username}
//                             onChange={(e) => {
//                               const input = e.target.value;
//                               if (/^[a-zA-Z]+$/.test(input) || input === '') {
//                                 handleChange(e);
//                               }
//                             }}
//                             fullWidth
//                             size="medium"
//                             className="loginInput"
//                             sx={{
//                               mb: 1,
//                               '& .MuiOutlinedInput-root': {
//                                 borderRadius: 2,
//                                 backgroundColor: '#f9f9f9',
//                               },
//                               '& .MuiOutlinedInput-input': {
//                                 padding: '12.5px 14px',
//                               },
//                             }}
//                           />
//                           <TextField
//                             label="Password"
//                             type={showPwd ? 'text' : 'password'}
//                             variant="outlined"
//                             name="password"
//                             value={form.password}
//                             onChange={handleChange}
//                             fullWidth
//                             size="medium"
//                             onKeyDown={(e) => {
//                               if (e.key === 'Enter') {
//                                 handleLogin();
//                               }
//                             }}
//                             InputProps={{
//                               endAdornment: (
//                                 <InputAdornment position="end">
//                                   <IconButton
//                                     aria-label={showPwd ? "Hide password" : "Show password"}
//                                     onClick={handleClickShowPassword}
//                                     edge="end"
//                                     sx={{ color: '#777' }}
//                                   >
//                                     {showPwd ? <Visibility /> : <VisibilityOff />}
//                                   </IconButton>
//                                 </InputAdornment>
//                               ),
//                             }}
//                             sx={{
//                               mb: 1,
//                               '& .MuiOutlinedInput-root': {
//                                 borderRadius: 2,
//                                 backgroundColor: '#f9f9f9',
//                               },
//                               '& .MuiOutlinedInput-input': {
//                                 padding: '12.5px 14px',
//                               },
//                             }}
//                           />
//                         </>
//                       )}
//                       {loginMode === 'mobile' && (
//                         <>
//                           <TextField
//                             label="Mobile Number"
//                             variant="outlined"
//                             name="mobile"
//                             value={form.mobile}
//                             onChange={handleChange}
//                             fullWidth
//                             size="medium"
//                             InputProps={{
//                               startAdornment: <PhoneIphoneIcon sx={{ color: '#777', marginRight: 1 }} />,
//                               endAdornment: (
//                                 <InputAdornment position="end">
//                                   {mobileChecking && <CircularProgress size={20} />}
//                                   {form.mobile && mobileValid === 'valid' && <CheckCircleIcon color="success" />}
//                                   {form.mobile && mobileValid === 'invalid' && <ErrorIcon color="error" />}
//                                 </InputAdornment>
//                               )
//                             }}
//                             helperText={mobileMessage}
//                             error={mobileValid === 'invalid'}
//                             sx={{
//                               mb: 1,
//                               '& .MuiOutlinedInput-input': {
//                                 padding: '12.5px 14px',
//                               },
//                             }}
//                           />
//                           {/* {mobileValid === 'valid' && !isNewUser && ( */}
//                           <TextField
//                             label="Password"
//                             type={showPwd ? 'text' : 'password'}
//                             variant="outlined"
//                             name="password"
//                             value={loginMode === 'mobile' && role === 'user' ? mobilePassword : form.password}
//                             onChange={handleChange}
//                             fullWidth
//                             size="medium"
//                             onKeyDown={(e) => {
//                               if (e.key === 'Enter') {
//                                 handleLogin();
//                               }
//                             }}
//                             InputProps={{
//                               endAdornment: (
//                                 <InputAdornment position="end">
//                                   <IconButton
//                                     aria-label={showPwd ? "Hide password" : "Show password"}
//                                     onClick={handleClickShowPassword}
//                                     edge="end"
//                                     sx={{ color: '#777' }}
//                                   >
//                                     {showPwd ? <Visibility /> : <VisibilityOff />}
//                                   </IconButton>
//                                 </InputAdornment>
//                               ),
//                             }}
//                             sx={{
//                               mb: 1,
//                               '& .MuiOutlinedInput-root': {
//                                 borderRadius: 2,
//                                 backgroundColor: '#f9f9f9',
//                               },
//                               '& .MuiOutlinedInput-input': {
//                                 padding: '12.5px 14px',
//                               },
//                             }}
//                           />
//                           {/* )} */}
//                           {showCreatePwdLink && (
//                             <Typography
//                               variant="body2"
//                               color="primary"
//                               sx={{
//                                 cursor: 'pointer',
//                                 textDecoration: 'underline',
//                                 mb: 1.5, ml: 1,
//                                 fontWeight: 500,
//                               }}
//                               onClick={openCreatePasswordModal}
//                             >
//                               Forgot Password?
//                             </Typography>
//                           )}
//                         </>
//                       )}
//                     </>
//                   )}
//                   {['customer', 'salesman', 'broker'].includes(role) && (
//                     <>
//                       <TextField
//                         label="Mobile Number"
//                         variant="outlined"
//                         name="mobile"
//                         value={form.mobile}
//                         onChange={handleChange}
//                         fullWidth
//                         size="medium"
//                         InputProps={{
//                           startAdornment: (
//                             <InputAdornment position="start">
//                               <PhoneIphoneIcon sx={{ color: '#777' }} />
//                             </InputAdornment>
//                           ),
//                         }}
//                         sx={{
//                           mb: 1,
//                           '& .MuiOutlinedInput-root': {
//                             borderRadius: 2,
//                             backgroundColor: '#f9f9f9',
//                           },
//                           '& .MuiOutlinedInput-input': {
//                             padding: '12.5px 14px',
//                           },
//                         }}
//                       />
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexDirection: isMobile ? 'column' : 'row' }}>
//                         {form.mobile.length === 10 && !otpSent && (
//                           <Button
//                             variant="contained"
//                             onClick={handleGenerateOtp}
//                             fullWidth={isMobile}
//                             sx={{
//                               bgcolor: '#3A7BD5',
//                               color: '#fff',
//                               borderRadius: 2,
//                               fontWeight: 600,
//                               textTransform: 'none',
//                               py: 1,
//                               boxShadow: '0 4px 8px rgba(58, 123, 213, 0.3)',
//                               '&:hover': {
//                                 bgcolor: '#2A5DA8',
//                                 boxShadow: '0 6px 12px rgba(58, 123, 213, 0.4)',
//                               },
//                               transition: 'all 0.3s ease',
//                             }}
//                           >
//                             Send OTP
//                           </Button>
//                         )}
//                         {otpSent && (
//                           <>
//                             <TextField
//                               label="Enter OTP"
//                               variant="outlined"
//                               name="otp"
//                               value={otp}
//                               onChange={handleChange}
//                               size="medium"
//                               type="tel"
//                               sx={{
//                                 flex: 1,
//                                 '& .MuiOutlinedInput-root': {
//                                   borderRadius: 2,
//                                   backgroundColor: '#f9f9f9',
//                                 }
//                               }}
//                             />
//                             <Button
//                               variant="contained"
//                               onClick={handleVerifyOtp}
//                               sx={{
//                                 bgcolor: '#00B761',
//                                 color: '#fff',
//                                 fontWeight: 600,
//                                 borderRadius: 2,
//                                 textTransform: 'none',
//                                 py: 1,
//                                 px: 2,
//                                 boxShadow: '0 4px 8px rgba(0, 183, 97, 0.3)',
//                                 '&:hover': {
//                                   bgcolor: '#009650',
//                                   boxShadow: '0 6px 12px rgba(0, 183, 97, 0.4)',
//                                 },
//                                 transition: 'all 0.3s ease',
//                               }}
//                             >
//                               Verify
//                             </Button>
//                           </>
//                         )}
//                       </Box>
//                     </>
//                   )}
//                   <TextField
//                     select
//                     label="Financial Year"
//                     variant="outlined"
//                     value={selectedYear}
//                     onChange={(e) => setSelectedYear(e.target.value)}
//                     fullWidth
//                     size="medium"
//                     sx={{
//                       mb: 1,
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 2,
//                         backgroundColor: '#f9f9f9',
//                       },
//                       '& .MuiOutlinedInput-input': {
//                         padding: '12.5px 14px',
//                       },
//                     }}
//                   >
//                     {years.map((year) => (
//                       <MenuItem key={year} value={year}>
//                         {year}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                   <Box
//                     sx={{
//                       display: 'flex',
//                       gap: 2,
//                       justifyContent: 'center',
//                       flexDirection: isMobile ? 'column' : 'row',
//                     }}
//                   >
//                     <Button
//                       variant="contained"
//                       onClick={() => {
//                         if (role === 'user' && loginMode === 'mobile') {
//                           if (isNewUser) {
//                             toast.info("Please create a password first");
//                           } else if (mobileValid === 'valid') {
//                             handleEmployeeLogin();
//                           }
//                         } else if (['customer', 'salesman', 'broker'].includes(role)) {
//                           if (otpSent && otp.length === 4) handleVerifyOtp();
//                           else toast.info("Please verify OTP");
//                         } else {
//                           handleLogin();
//                         }
//                       }}
//                       disabled={
//                         loading ||
//                         (role === 'user' && loginMode === 'mobile' && mobileValid !== 'valid') ||
//                         (['customer', 'salesman', 'broker'].includes(role) && !otpSent)
//                       }
//                       sx={buttonStyles}
//                       fullWidth
//                     >
//                       {loading ? 'Signing in...' : 'Sign In'}
//                     </Button>
//                     <Button
//                       variant="outlined"
//                       onClick={() => {
//                         setForm({ username: '', password: '', mobile: '' });
//                         setRole('user');
//                         setOtpSent(false);
//                         setMobilePassword('');
//                         setMobileValid('');
//                         setMobileMessage('');
//                       }}
//                       sx={{
//                         borderColor: '#ccc',
//                         color: '#b90909ff',
//                         borderRadius: '12px',
//                         fontSize: '1rem',
//                         fontWeight: 600,
//                         textTransform: 'none',
//                         py: 1,
//                         '&:hover': {
//                           borderColor: '#999',
//                           color: '#a00303ff',
//                         },
//                         transition: 'all 0.3s ease',
//                       }}
//                       fullWidth
//                     >
//                       Clear
//                     </Button>
//                   </Box>
//                 </Box>
//               </>
//             )}
//           </Paper>
//         </Fade>
//       ) : (
//         <CoBrModal open={modalOpen} onClose={resetToLogin} />
//       )}
//       {/* <Snackbar
//         open={error}
//         onClose={handleCloseSnackbar}
//         message="Invalid username or password"
//         autoHideDuration={3000}
//         sx={{ zIndex: 9999 }}
//       /> */}
//       <Snackbar
//         open={otpError}
//         onClose={() => setOtpError(false)}
//         message="Enter a valid mobile number"
//         autoHideDuration={3000}
//         sx={{ zIndex: 9999 }}
//       />
//       <Dialog
//         open={createPwdOpen}
//         onClose={() => setCreatePwdOpen(false)}
//         maxWidth="xs"
//         fullWidth
//       >
//         <DialogTitle sx={{ textAlign: 'center', fontWeight: 600 }}>
//           New Password for {empNameForModal}
//         </DialogTitle>

//         <DialogContent>

//           <Box sx={{ mb: 2, textAlign: 'center' }}>
//             <Typography variant="subtitle1" sx={{ mb: 1 }}>
//               Enter the 4-digit OTP sent to <strong>{employeeEmailForOtp}</strong>
//             </Typography>

//             <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
//               {[0, 1, 2, 3].map((i) => (
//                 <TextField
//                   key={i}
//                   id={`otp-${i}`}
//                   inputProps={{
//                     maxLength: 1,
//                     style: {
//                       textAlign: 'center',
//                       fontSize: '1.2rem',
//                       padding: '10px',
//                       width: '30px',
//                       height: '30px',
//                     },
//                     placeholder: '0',
//                   }}
//                   variant="outlined"
//                   value={enteredOtp[i] || ''}
//                   onChange={(e) => handleOtpChange(e, i)}
//                   onKeyDown={(e) => handleOtpKeyDown(e, i)}
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: 2,
//                     },
//                   }}
//                 />
//               ))}

//               {showVerifiedIcon && (
//                 <Box >
//                   <CheckCircleIcon
//                     sx={{
//                       color: '#00C853',
//                       fontSize: 32,
//                       mt: 0.5,
//                       animation: 'pop 0.3s ease'
//                     }}
//                   />
//                 </Box>
//               )}

//               {otpErrorMsg && (
//                 <Typography color="error" variant="body2" sx={{ mt: 1 }}>
//                   <ErrorIcon
//                     sx={{
//                       color: 'red',
//                       fontSize: 32,
//                       mt: 0.5,
//                       animation: 'pop 0.3s ease'
//                     }}
//                   />
//                 </Typography>
//               )}
//             </Box>
//           </Box>

//           <TextField
//             autoFocus
//             margin="dense"
//             label="New Password"
//             type={showNewPwd ? 'text' : 'password'}
//             fullWidth
//             variant="outlined"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     aria-label={showNewPwd ? "Hide password" : "Show password"}
//                     onClick={handleClickShowNewPassword}
//                     edge="end"
//                     sx={{ color: '#777' }}
//                   >
//                     {showNewPwd ? <Visibility /> : <VisibilityOff />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//             sx={{ mt: 1 }}
//           />

//           <TextField
//             margin="dense"
//             label="Confirm Password"
//             type={showPwd ? 'text' : 'password'}
//             fullWidth
//             variant="outlined"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     aria-label={showPwd ? "Hide password" : "Show password"}
//                     onClick={handleClickShowPassword}
//                     edge="end"
//                     sx={{ color: '#777' }}
//                   >
//                     {showPwd ? <Visibility /> : <VisibilityOff />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />
//         </DialogContent>

//         <DialogActions>
//           <Button
//             onClick={handleCreatePassword}
//             variant="contained"
//             color="primary"
//             disabled={enteredOtp.join('').length !== 4}
//             sx={{ textTransform: 'none' }}
//           >
//             Create Password
//           </Button>
//           <Button
//             variant='outlined'
//             color='error'
//             onClick={() => setCreatePwdOpen(false)}
//             sx={{ textTransform: 'none' }}
//           >
//             Cancel
//           </Button>
//         </DialogActions>
//       </Dialog>

//     </Box>
//   );
// };
// export default Login;







'use client'
import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Avatar, useTheme, Card, MenuItem, Grow, Snackbar, InputAdornment, IconButton, useMediaQuery,
  Modal, Fade, Divider, Radio,Checkbox , RadioGroup, FormControlLabel, FormControl, FormLabel, Grid, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import WorkIcon from '@mui/icons-material/Work';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import HailIcon from '@mui/icons-material/Hail';
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';
import axiosInstance from '@/lib/axios';
import CoBrModal from './CoBrModal';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { buttonStyles } from '../../../public/styles/buttonStyles';
import { fetchUserParams } from '../../app/redux/store/userParamsSlice';

const roles = [
  { label: 'User', value: 'user', icon: <PersonIcon /> },
  { label: 'Customer', value: 'customer', icon: <BusinessIcon /> },
  { label: 'Salesman', value: 'salesman', icon: <HailIcon /> },
  { label: 'Broker', value: 'broker', icon: <AccountBalanceIcon /> },
];

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [role, setRole] = useState('user');
  const [form, setForm] = useState({ username: 'Admin', password: 'Admin', mobile: '', });
  const [showPwd, setShowPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const router = useRouter();
  const [error, setError] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const currentYear = new Date().getFullYear();
  const fixedCurrentYear = currentYear - 1;
  const nextYear = currentYear + 1;
  const defaultYearRange = `${currentYear}-${nextYear}`;
  const years = [defaultYearRange];
  const [selectedYear, setSelectedYear] = useState(defaultYearRange);
  const [otpRequests, setOtpRequests] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const colors = ['#3A7BD5', '#FF5733', '#28B463', '#8E44AD', '#F39C12', '#1ce6a9ff'];
  const [loginMode, setLoginMode] = useState('username');
  const [mobileValid, setMobileValid] = useState(null);
  const [mobileChecking, setMobileChecking] = useState(false);
  const [mobileMessage, setMobileMessage] = useState('');
  const [empKey, setEmpKey] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [createPwdOpen, setCreatePwdOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCreatePwdLink, setShowCreatePwdLink] = useState(false);
  const [empNameForModal, setEmpNameForModal] = useState('');
  const [mobilePassword, setMobilePassword] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState(['', '', '', '']);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showVerifiedIcon, setShowVerifiedIcon] = useState(false);
  const [otpErrorMsg, setOtpErrorMsg] = useState('');
  const [employeeEmailForOtp, setEmployeeEmailForOtp] = useState('');
const dispatch = useDispatch();

  useEffect(() => {
    const checkMobile = async () => {
      if (form.mobile.length === 10 && role === 'user' && loginMode === 'mobile') {
        setMobileChecking(true);
        setMobileMessage('');
        setShowCreatePwdLink(false);
        try {
          const res = await axiosInstance.post('Employee/EmployeeLogin', {
            MOBILE_NO: form.mobile,
            EmpPswd: "",
            FLAG: "",
            EMP_KEY: ""
          });
          if (res.data.STATUS === 0) {
            setMobileValid('valid');
            setEmpKey(res.data.DATA[0].EMP_KEY || '');
            setIsNewUser(res.data.FLAG === 'NewRe');
            setMobileMessage(res.data.FLAG === 'NewRe' ? 'New user detected' : '');
          } else {
            setMobileValid('invalid');
            setMobileMessage('Mobile not registered');
            setIsNewUser(false);
          }
        } catch (err) {
          setMobileValid('invalid');
          setMobileMessage('Server error');
          setIsNewUser(false);
        } finally {
          setMobileChecking(false);
        }
      } else if (form.mobile.length < 10 && form.mobile.length > 0) {
        setMobileValid(null);
        setMobileMessage('');
        setShowCreatePwdLink(false);
      }
    };
    const timer = setTimeout(checkMobile, 800);
    return () => clearTimeout(timer);
  }, [form.mobile, role, loginMode]);

  useEffect(() => {
    if (role === 'user') {
      setLoginMode('username');
    } else {
      setLoginMode('mobile');
    }
    setForm({ username: 'Admin', password: 'Admin', mobile: '' });
    setMobilePassword('');
    setOtpSent(false);
    setOtp('');
    setShowCreatePwdLink(false);
  }, [role]);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

useEffect(() => {
  const expireTime = localStorage.getItem('authExpire');
  const isAuthenticated = localStorage.getItem('authenticated') === 'true';
  const hasCompanyAndBranch = localStorage.getItem('CO_ID') && localStorage.getItem('COBR_ID');
  const stayLoggedIn = localStorage.getItem('stayLoggedIn') === 'true';

  // Check if session is expired
  if (!expireTime || Date.now() > Number(expireTime) || !isAuthenticated) {
    // Session expired, clear everything
    localStorage.removeItem('authenticated');
    localStorage.removeItem('authExpire');
    localStorage.removeItem('stayLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('CO_ID');
    localStorage.removeItem('COBR_ID');
    localStorage.removeItem('USER_PARAMS');
    localStorage.removeItem('USER_PARAMS_MAP');
  } 
  // If session is valid and user has company/branch, redirect to dashboard
  else if (isAuthenticated && hasCompanyAndBranch) {
    router.replace('/dashboard');
  }
  // If session is valid but no company/branch selected, stay on login to show modal
}, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile') {
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue.length <= 10) {
        setForm((prev) => ({ ...prev, mobile: numericValue }));
        if (numericValue !== form.mobile) {
          setOtpSent(false);
          setOtp('');
          setShowCreatePwdLink(false);
        }
      }
    } else if (name === 'otp') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setOtp(numericValue);
    } else if (name === 'password' && loginMode === 'mobile' && role === 'user') {
      setMobilePassword(value);
    }
    else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRoleSelect = (value) => {
    setRole(value);
  };

  const canSendOtp = (mobile) => {
    if (!otpRequests[mobile]) return true;
    const lastRequestTime = otpRequests[mobile];
    const fiveMinutes = 5 * 60 * 1000;
    const currentTime = new Date().getTime();
    return (currentTime - lastRequestTime) > fiveMinutes;
  };

  const getOTPFlag = () => {
    if (role === "salesman") return "S";
    if (role === "broker") return "B";
    return "C";
  };

  const handleGenerateOtp = async () => {
    if (form.mobile.length !== 10) {
      setOtpError(true);
      toast.error('Please enter a 10-digit mobile number');
      return;
    }
    if (!canSendOtp(form.mobile)) {
      const lastRequestTime = otpRequests[form.mobile];
      const fiveMinutes = 5 * 60 * 1000;
      const remainingTime = fiveMinutes - (new Date().getTime() - lastRequestTime);
      const remainingSeconds = Math.ceil(remainingTime / 1000);
      toast.error(`Please wait ${remainingSeconds} seconds before requesting a new OTP for this number.`);
      return;
    }
    try {
      const response = await axiosInstance.post('USERS/SendSMSOTP', {
        SMS_MOBILENO: form.mobile,
        FLAG: getOTPFlag(),
      });
      if (response.data.STATUS === 0) {
        const otpCode = response.data.DATA.OTP;
        const partyDetails = response.data.DATA.LOGINDETAIL[0];
        const PARTY_NAME = partyDetails.PARTY_NAME;
        const PARTY_KEY = partyDetails.PARTY_KEY;

        localStorage.setItem('PARTY_NAME', PARTY_NAME);
        localStorage.setItem('PARTY_KEY', PARTY_KEY);

        setGeneratedOtp(otpCode);
        setOtpSent(true);
        setOtpError(false);
        setOtpRequests(prev => ({
          ...prev,
          [form.mobile]: new Date().getTime()
        }));
        toast.success(response.data.MESSAGE || 'OTP sent successfully', { autoClose: 1000 });
      } else {
        setOtpError(true);
        toast.error(response.data.MESSAGE || 'Mobile number is not registered', { autoClose: 1000 });
      }
    } catch (error) {
      setOtpError(true);
      toast.error('Error sending OTP. Please try again.', { autoClose: 1000 });
    }
  };

// Helper function to set login expiry
const setLoginExpiry = (stayLoggedIn) => {
  if (stayLoggedIn) {
    // 30 days for "Keep me logged in"
    const expiryDate = Date.now() + 30 * 24 * 60 * 60 * 1000;
    localStorage.setItem('authExpire', expiryDate.toString());
    localStorage.setItem('stayLoggedIn', 'true');
  } else {
    // 24 hours for normal session
    const expiryDate = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem('authExpire', expiryDate.toString());
    localStorage.setItem('stayLoggedIn', 'false');
  }
};

// Modified handleLogin function
const handleLogin = async () => {
  if (role !== 'customer') {
    if (!form.username.trim() || !form.password.trim()) {
      toast.info("Username and password are required.");
      return;
    }
  }
  setLoading(true);
  try {
    const encryptionResponse = await axiosInstance.post('USERS/Getpwdencryption', {
      USER_NAME: form.username,
      USER_PWD: form.password,
    });
    const encryptedPassword = encryptionResponse.data.DATA;
    const loginResponse = await axiosInstance.post('USERS/GetUserLogin', {
      USER_NAME: form.username,
      USER_PWD: encryptedPassword,
    });
    
    if (loginResponse.data.STATUS === 0) {
      const loginDetails = loginResponse.data.DATA[0];
      const USER_NAME = loginDetails.USER_NAME;
      const USER_ID = loginDetails.USER_ID;
      const currentYear = new Date().getFullYear();
      const fixCurrentYear = currentYear - 1;
      const lastTwoDigits = fixCurrentYear.toString().slice(-2);
      
      localStorage.setItem('USER_NAME', USER_NAME);
      localStorage.setItem('USER_ID', USER_ID);
      localStorage.setItem('FCYR_KEY', lastTwoDigits);
      localStorage.setItem('authenticated', 'true');
      localStorage.setItem('userRole', 'user');
      localStorage.removeItem('EMP_KEY');
      localStorage.removeItem('EMP_NAME');
      
      // ✅ Set expiry based on "Stay Logged In"
      setLoginExpiry(stayLoggedIn);
      
      await dispatch(fetchUserParams());
      setShowLogin(false);
      setModalOpen(true);
    } else {
      toast.error('Invalid Credentials');
    }
  } catch (err) {
    console.log("Error in Login Api ", err)
  } finally {
    setLoading(false);
  }
};

// Modified handleEmployeeLogin function
const handleEmployeeLogin = async () => {
  if (!mobilePassword) return toast.error('Enter password');
  try {
    const encRes = await axiosInstance.post('USERS/Getpwdencryption', {
      USER_NAME: form.mobile,
      USER_PWD: mobilePassword
    });
    const encryptedPwd = encRes.data.DATA;
    const loginRes = await axiosInstance.post('Employee/EmployeeLogin', {
      MOBILE_NO: form.mobile,
      EmpPswd: encryptedPwd,
      FLAG: "Auth",
      EMP_KEY: empKey
    });
    
    if (loginRes.data.STATUS === 0) {
      const employeeData = loginRes.data.DATA[0];
      localStorage.setItem('authenticated', 'true');
      localStorage.setItem('userRole', 'employee');
      localStorage.setItem('FCYR_KEY', fixedCurrentYear.toString().slice(-2));
      localStorage.setItem('EMP_KEY', employeeData.EMP_KEY);
      localStorage.setItem('EMP_NAME', employeeData.EMP_NAME);
      localStorage.removeItem('USER_ID');
      
      // ✅ Set expiry based on "Stay Logged In"
      setLoginExpiry(stayLoggedIn);
      
      await dispatch(fetchUserParams());
      router.push('/employeepage');
      setShowLogin(false);
      setModalOpen(true);
    } else {
      setShowCreatePwdLink(true);
      toast.error('Invalid Credentials');
    }
  } catch (err) {
    toast.error('Login failed');
  }
};

// Modified handleVerifyOtp function (for customer/salesman/broker)
const handleVerifyOtp = async () => {
  if (!otp || otp.length !== 6) {
    toast.info("Please enter a valid 6-digit otp.");
  }
  if (otp.trim() === generatedOtp) {
    const currentYear = new Date().getFullYear();
    const lastTwoDigits = currentYear.toString().slice(-2);
    localStorage.setItem('FCYR_KEY', lastTwoDigits);
    localStorage.setItem('authenticated', 'true');
    localStorage.setItem('userRole', role);
    
    // ✅ Set expiry based on "Stay Logged In"
    setLoginExpiry(stayLoggedIn);
    
    await dispatch(fetchUserParams());
    setShowLogin(false);
    setModalOpen(true);
  } else {
    toast.error('Invalid OTP. Please try again.');
  }
};

  const openCreatePasswordModal = async () => {
    try {
      const res = await axiosInstance.post('Employee/EmployeeLogin', {
        MOBILE_NO: form.mobile,
        EmpPswd: "",
        FLAG: "",
        EMP_KEY: ""
      });

      if (res.data.STATUS !== 0 || !res.data.DATA?.length) {
        toast.error(res.data.MESSAGE || "Employee not found");
        return;
      }

      const empData = res.data.DATA[0];

      const employeeName = empData.EMP_NAME?.trim() || 'Employee';
      const employeeEmail = empData.EMAIL?.trim() || '';

      setEmpKey(empData.EMP_KEY || '');
      setEmpNameForModal(employeeName);
      setEmployeeEmailForOtp(employeeEmail);;

      if (!employeeEmail) {
        toast.error("Email not found for this employee. Please contact admin.");
        return;
      }

      // Step 2: Generate OTP from Backend
      const otpResponse = await axiosInstance.post('Email/OtpGenerate', {});

      if (otpResponse.data.STATUS !== 0) {
        toast.error(otpResponse.data.MESSAGE || "Failed to generate OTP");
        return;
      }

      // Extract 4-digit OTP
      let generatedOtpFromApi = null;
      const rawData = otpResponse.data.DATA || otpResponse.data.Message || "";

      const match = String(rawData).match(/(\d{4})/);
      if (match && match[0]) {
        generatedOtpFromApi = match[0];
      } else if (otpResponse.data.OTP) {
        generatedOtpFromApi = otpResponse.data.OTP;
      }

      if (!generatedOtpFromApi) {
        toast.error("Failed to extract OTP from server");
        return;
      }

      // Step 3: Send Email
      const mailSent = await sendMailOtp(employeeEmail, generatedOtpFromApi);

      if (mailSent) {
        setEmailOtp(generatedOtpFromApi);
        toast.success(`OTP sent successfully to ${employeeEmail}`);
      } else {
        toast.warning("OTP generated but email could not be sent.");
        setEmailOtp(generatedOtpFromApi);
      }
      setCreatePwdOpen(true);
      setEnteredOtp(['', '', '', '']);
      setNewPassword('');
      setConfirmPassword('');
      setOtpErrorMsg('');
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Handle individual OTP input change with auto-focus + verification
  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 1) return;

    const newOtp = [...enteredOtp];
    newOtp[index] = value;
    setEnteredOtp(newOtp);
    setOtpErrorMsg('');

    // Auto focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    // Check verification only when all 4 digits are entered
    if (index === 3 && value) {
      const enteredOtpString = [...newOtp.slice(0, 3), value].join('');

      if (enteredOtpString.length === 4) {
        if (enteredOtpString === emailOtp) {
          setOtpVerified(true);
          setShowVerifiedIcon(true);
          setOtpErrorMsg('');
        } else {
          setOtpVerified(false);
          setShowVerifiedIcon(false);
          setOtpErrorMsg('Invalid OTP');
        }
      }
    }
  };

  // Add this function to fetch and save User Parameters
const fetchAndSaveUserParams = async () => {
  try {
    const response = await axiosInstance.post('USERPARAM/RetriveUserParam', {
      USERPM_ID: 0,
      USERPM_NAME: "",
      REMARK: "",
      FLAG: ""
    });
    
    if (response.data.STATUS === 0 && response.data.DATA) {
      // Save the entire DATA array to localStorage
      localStorage.setItem('USER_PARAMS', JSON.stringify(response.data.DATA));
      
      // Also save individual parameters for easy access
      const userParamsMap = {};
      response.data.DATA.forEach(param => {
        userParamsMap[param.USERPM_NAME] = {
          USERPM_ID: param.USERPM_ID,
          REMARK: param.REMARK,
          SECPM_ID: param.SECPM_ID,
          SECPM_NAME: param.SECPM_NAME,
          COBR_ID: param.COBR_ID,
          NAME: param.NAME
        };
      });
      localStorage.setItem('USER_PARAMS_MAP', JSON.stringify(userParamsMap));
      
      console.log('User parameters saved successfully:', response.data.DATA);
      return response.data.DATA;
    } else {
      console.error('Failed to fetch user parameters:', response.data.MESSAGE);
      return [];
    }
  } catch (err) {
    console.error('Error fetching user parameters:', err);
    return [];
  }
};

// Helper function to get user parameter by name
const getUserParamByName = (paramName) => {
  try {
    const paramsMap = JSON.parse(localStorage.getItem('USER_PARAMS_MAP') || '{}');
    return paramsMap[paramName] || null;
  } catch (err) {
    console.error('Error getting user param:', err);
    return null;
  }
};

// Helper function to get user parameter by ID
const getUserParamById = (paramId) => {
  try {
    const params = JSON.parse(localStorage.getItem('USER_PARAMS') || '[]');
    return params.find(param => param.USERPM_ID === paramId) || null;
  } catch (err) {
    console.error('Error getting user param by ID:', err);
    return null;
  }
};

// Helper function to get all user parameters
const getAllUserParams = () => {
  try {
    return JSON.parse(localStorage.getItem('USER_PARAMS') || '[]');
  } catch (err) {
    console.error('Error getting all user params:', err);
    return [];
  }
};

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (enteredOtp[index]) {
        const newOtp = [...enteredOtp];
        newOtp[index] = '';
        setEnteredOtp(newOtp);
      } else if (index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`);
        prevInput?.focus();

        const newOtp = [...enteredOtp];
        newOtp[index - 1] = '';
        setEnteredOtp(newOtp);
      }
    }
  };

  // Create new password
  const handleCreatePassword = async () => {
    const enteredOtpString = enteredOtp.join('');

    if (enteredOtpString.length !== 4) {
      setOtpErrorMsg('Please enter the 4-digit OTP');
      toast.error('Please enter the 4-digit OTP');
      return;
    }

    if (enteredOtpString !== emailOtp) {
      setOtpErrorMsg('Invalid OTP');
      toast.error('Invalid OTP. Please try again.');
      return;
    }

    // OTP is correct
    setOtpVerified(true);

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 4) {
      toast.error('Password must be at least 4 characters');
      return;
    }

    try {
      const res = await axiosInstance.post('Employee/InsertEmployeeLogin', {
        MOBILE_NO: form.mobile,
        EmpPswd: newPassword,
        FLAG: "",
        EMP_KEY: empKey
      });

      if (res.data.STATUS === 0) {
        toast.success('Password created successfully! You can now login.');
        setCreatePwdOpen(false);
        setNewPassword('');
        setConfirmPassword('');
        setEnteredOtp(['', '', '', '']);
        setShowCreatePwdLink(false);
        setIsNewUser(false);
        setOtpVerified(false);
      } else {
        toast.error(res.data.MESSAGE || 'Failed to create password');
      }
    } catch (err) {
      toast.error('Error creating password');
    }
  };

 



  const handleCloseSnackbar = () => {
    setError(false);
  };
  const handleClickShowPassword = () => {
    setShowPwd(!showPwd);
  };
  const handleClickShowNewPassword = () => {
    setShowNewPwd(!showNewPwd);
  };
  const resetToLogin = () => {
    // Clear all localStorage when returning to login
    localStorage.removeItem('authenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('CO_ID');
    localStorage.removeItem('COBR_ID');
    localStorage.removeItem('PARTY_NAME');
    localStorage.removeItem('PARTY_KEY');
    localStorage.removeItem('FCYR_KEY');
    localStorage.removeItem('USER_NAME');
    localStorage.removeItem('USER_ID');
    localStorage.removeItem('EMP_KEY');
    localStorage.removeItem('EMP_NAME');
      localStorage.removeItem('USER_PARAMS'); 
  localStorage.removeItem('USER_PARAMS_MAP');
  localStorage.removeItem('authExpire');     
  localStorage.removeItem('stayLoggedIn'); 
dispatch(clearUserParams());
    setShowLogin(true);
    setModalOpen(false);
    setForm({ username: '', password: '', mobile: '' });
    setRole('user');
    setOtpSent(false);
    setGeneratedOtp('');
    setMobilePassword('');
      setStayLoggedIn(false);  
  };

  const sendMailOtp = async (email, otp) => {
    if (!email || !email.includes('@')) {
      toast.error("Invalid email address");
      return false;
    };

    if (!otp) {
      toast.error("OTP is missing");
      return false;
    };

    try {
      const response = await axiosInstance.post('Email/SendEmail', {
        TASK_ID: 0,
        COBR_ID: "02",
        USER_ID: 1,
        PARTY_KEY: "",
        ToEmail: [email],
        Subject: "Your OTP Code for Password Setup",
        ImgFolderNm: "",
        Body: `Dear User,<br><br>
             Your OTP for creating new password is: <strong>${otp}</strong><br><br>
             This OTP is valid for 10 minutes.<br>
             Please do not share this OTP with anyone.<br><br>
             Regards,<br>Pratham Systech Team`,
        DocAttachments: []
      });

      if (response.data.STATUS === 0) {
        return true;
      } else {
        toast.error(response.data.MESSAGE || "Failed to send email");
        return false;
      }
    } catch (err) {
      toast.error("Failed to send OTP email. Please try again.");
      return false;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        p: isMobile ? 2 : 0,
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, #ffffff 0%, #d0f0fd 30%, #a3ddf8 60%, #5dbbf2 100%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-10%',
          left: '-20%',
          width: '150%',
          height: '150%',
          background: 'radial-gradient(circle at 60% 40%, rgba(26, 141, 229, 0.2) 0%, transparent 70%)',
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '200px',
          background: 'linear-gradient(to right, rgba(26, 141, 229, 0.3), rgba(93, 187, 242, 0.4))',
          borderTopLeftRadius: '100% 40%',
          borderTopRightRadius: '100% 40%',
          zIndex: 0,
        },
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {showLogin ? (
        <Fade in={showLogin} timeout={800}>
          <Paper
            elevation={24}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              width: { xs: '95%', sm: '90%', md: '700px' },
              maxWidth: '850px',
              height: { xs: 'auto', sm: 'auto', md: '500px' },
              borderRadius: 4,
              overflow: 'hidden',
              bgcolor: 'rgba(255, 255, 255, 1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              position: 'relative',
              zIndex: 1,
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {isMobile ? (
              <Box sx={{ width: '100%', p: 3 }}>
                <Box textAlign="center" sx={{ mb: 1.5 }}>
                  <Image
                    src="/images/P_IconLogo.png"
                    alt="Profile"
                    width={180}
                    height={80}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                    {/* <Image
                      src="/images/pratham.jpeg"
                      alt="Company Logo"
                      width={50}
                      height={50}
                      style={{ marginRight: '0px' }}
                    /> */}
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="body2" sx={{
                        color: '#000',
                        fontWeight: 500,
                        lineHeight: 1.5,
                        fontSize: '0.8rem',
                        marginBottom: '2px'
                      }}>
                        The symbol of business integration
                      </Typography>
                      <Typography variant="body2" sx={{
                        color: '#333',
                        fontWeight: 500,
                        lineHeight: 1.2,
                        fontSize: '0.75rem',
                        marginBottom: '2px'
                      }}>
                        Powered By :-
                      </Typography>
                      <Typography variant="body1" sx={{
                        color: colors[colorIndex],
                        fontWeight: 700,
                        lineHeight: 1.1,
                        fontSize: '0.85rem',
                        marginBottom: '2px',
                        transition: 'color 0.5s ease'
                      }}>
                        PRATHAM SYSTECH INDIA LTD.
                      </Typography>

                      <Typography variant="body2" sx={{
                        color: '#333',
                        fontWeight: 600,
                        lineHeight: 1.1,
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <WhatsAppIcon sx={{
                          color: '#25D366',
                          fontSize: '1rem',
                          marginRight: '4px'
                        }} />
                        8779163857
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                {/* Role Selection */}
                <Box sx={{ p: 0, bgcolor: '#ffffff', borderBottom: '1px solid #e0e0e0' }}>
                  <FormControl component="fieldset" fullWidth>
                    {/* <FormLabel
                      component="legend"
                      sx={{ fontWeight: 'bold', color: '#333' }}
                    >
                      Select Your Role:
                    </FormLabel> */}
                    <RadioGroup
                      value={role}
                      onChange={(e) => handleRoleSelect(e.target.value)}
                    >
                      <Grid container spacing={0}>
                        {roles.map((r) => (
                          <Grid size={{ xs: 6 }} key={r.value}>
                            <FormControlLabel
                              value={r.value}
                              control={<Radio sx={{ padding: 1 }} />}
                              label={r.label}
                              sx={{
                                '& .MuiFormControlLabel-label': {
                                  fontSize: '0.8rem',
                                  margin: 0,
                                },
                                // marginBottom: 0.5, 
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </RadioGroup>
                  </FormControl>
                </Box>
                {/* Form Fields */}
                {role === 'user' && (
                  <>
                    <Box sx={{
                      display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center',
                      bgcolor: '#f5f5f5', p: 0, border: '1px solid #ddd', width: '100%', maxWidth: '300px', margin: '0 auto',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)', display: 'flex', borderRadius: 2,
                    }}>
                      <FormControlLabel
                        control={
                          <Radio
                            checked={loginMode === 'username'}
                            onChange={() => setLoginMode('username')}
                            value="username"
                            color="primary"
                          />
                        }
                        label="Username"
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            fontSize: '0.8rem',
                          },
                        }}
                      />
                      <FormControlLabel
                        control={
                          <Radio
                            checked={loginMode === 'mobile'}
                            onChange={() => setLoginMode('mobile')}
                            value="mobile"
                            color="primary"
                          />
                        }
                        label="Mobile"
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            fontSize: '0.8rem',
                          },
                        }}
                      />
                    </Box>

                    {loginMode === 'username' && (
                      <>
                        <TextField
                          label="Username"
                          variant="outlined"
                          name="username"
                          value={form.username}
                          onChange={(e) => {
                            const input = e.target.value;
                            if (/^[a-zA-Z]+$/.test(input) || input === '') {
                              handleChange(e);
                            }
                          }}
                          fullWidth
                          size="medium"
                          className='loginInput'
                          sx={{
                            mb: 1, mt: 1,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: '#f9f9f9',
                            }
                          }}
                        />
                        <TextField
                          label="Password"
                          type={showPwd ? 'text' : 'password'}
                          variant="outlined"
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          fullWidth
                          size="medium"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label={showPwd ? "Hide password" : "Show password"}
                                  onClick={handleClickShowPassword}
                                  edge="end"
                                  sx={{ color: '#777' }}
                                >
                                  {showPwd ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            mb: 1,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: '#f9f9f9',
                            }
                          }}
                        />
                      </>
                    )}
                    {loginMode === 'mobile' && (
                      <>
                        <TextField
                          label="Mobile Number"
                          variant="outlined"
                          name="mobile"
                          value={form.mobile}
                          onChange={handleChange}
                          fullWidth
                          size="medium"
                          InputProps={{
                            startAdornment: <PhoneIphoneIcon sx={{ color: '#777' }} />,
                            endAdornment: (
                              <InputAdornment position="end">
                                {mobileChecking && <CircularProgress size={20} />}
                                {form.mobile && mobileValid === 'valid' && <CheckCircleIcon color="success" />}
                                {form.mobile && mobileValid === 'invalid' && <ErrorIcon color="error" />}
                              </InputAdornment>
                            )
                          }}
                          helperText={mobileMessage}
                          error={mobileValid === 'invalid'}
                          sx={{
                            my: 1,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: '#f9f9f9',
                            },
                          }}
                        />
                        {/* {mobileValid === 'valid' && !isNewUser && ( */}
                        <TextField
                          label="Password"
                          type={showPwd ? 'text' : 'password'}
                          variant="outlined"
                          name="password"
                          value={loginMode === 'mobile' && role === 'user' ? mobilePassword : form.password}
                          onChange={handleChange}
                          fullWidth
                          size="medium"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleLogin();
                            }
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label={showPwd ? "Hide password" : "Show password"}
                                  onClick={handleClickShowPassword}
                                  edge="end"
                                  sx={{ color: '#777' }}
                                >
                                  {showPwd ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            mb: 1,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: '#f9f9f9',
                            },
                          }}
                        />
                        {/* )} */}
                        {showCreatePwdLink && (
                          <Typography
                            variant="body2"
                            color="primary"
                            sx={{
                              cursor: 'pointer',
                              textDecoration: 'underline',
                              mb: 2,
                              fontWeight: 500,
                            }}
                            onClick={openCreatePasswordModal}
                          >
                            Forgot Password?
                          </Typography>
                        )}
                      </>
                    )}
                  </>
                )}
                {/* ===================== */}
                {['customer', 'salesman', 'broker'].includes(role) && (
                  <>
                    <TextField
                      label="Mobile Number"
                      variant="outlined"
                      name="mobile"
                      value={form.mobile}
                      onChange={handleChange}
                      fullWidth
                      size="medium"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIphoneIcon sx={{ color: '#777' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 1,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: '#f9f9f9',
                        }
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexDirection: isMobile ? 'column' : 'row' }}>
                      {form.mobile.length === 10 && !otpSent && (
                        <Button
                          variant="contained"
                          onClick={handleGenerateOtp}
                          fullWidth={isMobile}
                          sx={{
                            bgcolor: '#3A7BD5',
                            color: '#fff',
                            borderRadius: 2,
                            fontWeight: 600,
                            textTransform: 'none',
                            py: 1,
                            boxShadow: '0 4px 8px rgba(58, 123, 213, 0.3)',
                            '&:hover': {
                              bgcolor: '#2A5DA8',
                              boxShadow: '0 6px 12px rgba(58, 123, 213, 0.4)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          Send OTP
                        </Button>
                      )}

                      {otpSent && (
                        <>
                          <TextField
                            label="Enter OTP"
                            variant="outlined"
                            name="otp"
                            value={otp}
                            onChange={handleChange}
                            size="medium"
                            type="tel"
                            sx={{
                              flex: 1,
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: '#f9f9f9',
                              }
                            }}
                          />
                          <Button
                            variant="contained"
                            onClick={handleVerifyOtp}
                            sx={{
                              bgcolor: '#00B761',
                              color: '#fff',
                              fontWeight: 600,
                              borderRadius: 2,
                              textTransform: 'none',
                              py: 1,
                              px: 2,
                              boxShadow: '0 4px 8px rgba(0, 183, 97, 0.3)',
                              '&:hover': {
                                bgcolor: '#009650',
                                boxShadow: '0 6px 12px rgba(0, 183, 97, 0.4)',
                              },
                              transition: 'all 0.3s ease',
                            }}
                          >
                            Verify
                          </Button>
                        </>
                      )}
                    </Box>
                  </>
                )}
                <TextField
                  select
                  label="Financial Year"
                  variant="outlined"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  fullWidth
                  size="medium"
                  sx={{
                    mb: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#f9f9f9',
                    }
                  }}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </TextField>

                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (role === 'user' && loginMode === 'mobile') {
                        if (isNewUser) {
                          toast.info("Please create a password first");
                        } else if (mobileValid === 'valid') {
                          handleEmployeeLogin();
                        }
                      } else if (['customer', 'salesman', 'broker'].includes(role)) {
                        if (otpSent && otp.length === 4) handleVerifyOtp();
                        else toast.info("Please verify OTP");
                      } else {
                        handleLogin();
                      }
                    }}
                    disabled={
                      loading ||
                      (role === 'user' && loginMode === 'mobile' && mobileValid !== 'valid') ||
                      (['customer', 'salesman', 'broker'].includes(role) && !otpSent)
                    }

                    sx={buttonStyles}
                    fullWidth
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setForm({ username: '', password: '', mobile: '' });
                      setRole('user');
                      setOtpSent(false);
                      setMobilePassword('');
                      setMobileValid('');
                      setMobileMessage('');
                    }}
                    sx={{
                      borderColor: '#ccc',
                      color: '#b90909ff',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      py: 1,
                      '&:hover': {
                        borderColor: '#999',
                        color: '#a00303ff',
                      },
                      transition: 'all 0.3s ease',
                    }}
                    fullWidth
                  >
                    Clear
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                {/* Desktop View */}
                <Box
                  sx={{
                    width: { xs: '100%', sm: '40%' },
                    display: { xs: 'none', sm: 'flex' },
                    background: 'linear-gradient(135deg, #3A7BD5 0%, #2A5DA8 100%)',
                    p: 3,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LockOutlinedIcon sx={{ mr: 1, fontSize: 32 }} />
                      <Typography variant="h5" fontWeight="700">
                        Secure Login
                      </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                      Welcome Back!
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Sign in to access your account and manage your business operations efficiently.
                    </Typography>
                    <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', my: 1 }} />
                    <Typography variant="body2" fontWeight="600" sx={{ mb: 1.5 }}>
                      Select Your Role:
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {roles.map((r) => (
                        <Card
                          key={r.value}
                          onClick={() => handleRoleSelect(r.value)}
                          onMouseEnter={() => setIsHovered(r.value)}
                          onMouseLeave={() => setIsHovered(false)}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 1,
                            cursor: 'pointer',
                            bgcolor: role === r.value ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255,255,255,0.1)',
                            border: role === r.value ? '1px solid rgba(255,255,255,0.5)' : '1px solid transparent',
                            transition: 'all 0.3s ease',
                            backdropFilter: 'blur(10px)',
                            '&:hover': {
                              bgcolor: 'rgba(255,255,255,0.2)',
                              transform: 'translateX(5px)',
                            },
                          }}
                        >
                          <Avatar sx={{
                            bgcolor: 'rgba(255,255,255,0.9)',
                            width: 32,
                            height: 32,
                            mr: 2,
                            color: '#3A7BD5'
                          }}>
                            {r.icon}
                          </Avatar>
                          <Typography fontWeight={500} fontSize="0.95rem" sx={{ userSelect: 'none', color: 'white', fontWeight: '700' }}>
                            {r.label}
                          </Typography>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 2 }}>
                    © 2006-{currentYear} prasyst. All rights reserved.
                  </Typography>
                  <Typography variant="body2" sx={{
                    color: '#fff',
                    lineHeight: 1.2,
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <WhatsAppIcon sx={{
                      color: '#25D366',
                      fontSize: '0.9rem',
                      marginRight: '4px'
                    }} />
                    8779163857
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: { xs: '100%', sm: '60%' },
                    padding: { xs: 3, sm: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Box textAlign="center" sx={{ mb: 1 }}>
                    <Image
                      src="/images/P_IconLogo.png"
                      alt="Profile"
                      width={200}
                      height={100}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                      {/* <Image
                        src="/images/FavIcon.png"
                        alt="Company Logo"
                        width={50}
                        height={50}
                        style={{ marginRight: '0px' }}
                      /> */}
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="body2" sx={{
                          color: '#000',
                          fontWeight: 500,
                          lineHeight: 1,
                          fontSize: '0.82rem',
                          marginBottom: '2px'
                        }}>
                          The symbol of business integration
                        </Typography>
                        <Typography variant="body2" sx={{
                          color: '#333',
                          fontWeight: 500,
                          lineHeight: 1.2,
                          fontSize: '0.75rem',
                          marginLeft: '-81px'
                        }}>
                          Powered By :-
                        </Typography>
                        <Typography variant="body1" sx={{
                          color: colors[colorIndex],
                          fontWeight: 700,
                          lineHeight: 1.1,
                          fontSize: '0.85rem',
                          marginBottom: '2px',
                          transition: 'color 0.5s ease',
                          marginTop: '-10px'
                        }}>
                          PRATHAM SYSTECH INDIA LTD.
                        </Typography>

                        {/* <Typography variant="body2" sx={{
                          color: '#333',
                          fontWeight: 600,
                          lineHeight: 1.2,
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <WhatsAppIcon sx={{
                            color: '#25D366',
                            fontSize: '1rem',
                            marginRight: '4px'
                          }} />
                          8779163857
                        </Typography> */}
                      </Box>
                    </Box>
                  </Box>
                  {role === 'user' && (
                    <>
                      <Box sx={{ display: 'flex', gap: 0.1, mb: 0.3 }}>
                        <FormControlLabel
                          control={
                            <Radio
                              checked={loginMode === 'username'}
                              onChange={() => setLoginMode('username')}
                              value="username"
                              color="primary"
                            />
                          }
                          label="Username"
                        />
                        <FormControlLabel
                          control={
                            <Radio
                              checked={loginMode === 'mobile'}
                              onChange={() => setLoginMode('mobile')}
                              value="mobile"
                              color="primary"
                            />
                          }
                          label="Mobile"
                        />
                      </Box>
                      {loginMode === 'username' && (
                        <>
                          <TextField
                            label="Username"
                            variant="outlined"
                            name="username"
                            value={form.username}
                            onChange={(e) => {
                              const input = e.target.value;
                              if (/^[a-zA-Z]+$/.test(input) || input === '') {
                                handleChange(e);
                              }
                            }}
                            fullWidth
                            size="medium"
                            className="loginInput"
                            sx={{
                              mb: 1,
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: '#f9f9f9',
                              },
                              '& .MuiOutlinedInput-input': {
                                padding: '12.5px 14px',
                              },
                            }}
                          />
                          <TextField
                            label="Password"
                            type={showPwd ? 'text' : 'password'}
                            variant="outlined"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            fullWidth
                            size="medium"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleLogin();
                              }
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label={showPwd ? "Hide password" : "Show password"}
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                    sx={{ color: '#777' }}
                                  >
                                    {showPwd ? <Visibility /> : <VisibilityOff />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              mb: 1,
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: '#f9f9f9',
                              },
                              '& .MuiOutlinedInput-input': {
                                padding: '12.5px 14px',
                              },
                            }}
                          />
                        </>
                      )}
                      {loginMode === 'mobile' && (
                        <>
                          <TextField
                            label="Mobile Number"
                            variant="outlined"
                            name="mobile"
                            value={form.mobile}
                            onChange={handleChange}
                            fullWidth
                            size="medium"
                            InputProps={{
                              startAdornment: <PhoneIphoneIcon sx={{ color: '#777', marginRight: 1 }} />,
                              endAdornment: (
                                <InputAdornment position="end">
                                  {mobileChecking && <CircularProgress size={20} />}
                                  {form.mobile && mobileValid === 'valid' && <CheckCircleIcon color="success" />}
                                  {form.mobile && mobileValid === 'invalid' && <ErrorIcon color="error" />}
                                </InputAdornment>
                              )
                            }}
                            helperText={mobileMessage}
                            error={mobileValid === 'invalid'}
                            sx={{
                              mb: 1,
                              '& .MuiOutlinedInput-input': {
                                padding: '12.5px 14px',
                              },
                            }}
                          />
                          {/* {mobileValid === 'valid' && !isNewUser && ( */}
                          <TextField
                            label="Password"
                            type={showPwd ? 'text' : 'password'}
                            variant="outlined"
                            name="password"
                            value={loginMode === 'mobile' && role === 'user' ? mobilePassword : form.password}
                            onChange={handleChange}
                            fullWidth
                            size="medium"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleLogin();
                              }
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label={showPwd ? "Hide password" : "Show password"}
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                    sx={{ color: '#777' }}
                                  >
                                    {showPwd ? <Visibility /> : <VisibilityOff />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              mb: 1,
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: '#f9f9f9',
                              },
                              '& .MuiOutlinedInput-input': {
                                padding: '12.5px 14px',
                              },
                            }}
                          />
                          {/* )} */}
                          {showCreatePwdLink && (
                            <Typography
                              variant="body2"
                              color="primary"
                              sx={{
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                mb: 1.5, ml: 1,
                                fontWeight: 500,
                              }}
                              onClick={openCreatePasswordModal}
                            >
                              Forgot Password?
                            </Typography>
                          )}
                        </>
                      )}
                    </>
                  )}
                  {['customer', 'salesman', 'broker'].includes(role) && (
                    <>
                      <TextField
                        label="Mobile Number"
                        variant="outlined"
                        name="mobile"
                        value={form.mobile}
                        onChange={handleChange}
                        fullWidth
                        size="medium"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIphoneIcon sx={{ color: '#777' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          mb: 1,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: '#f9f9f9',
                          },
                          '& .MuiOutlinedInput-input': {
                            padding: '12.5px 14px',
                          },
                        }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexDirection: isMobile ? 'column' : 'row' }}>
                        {form.mobile.length === 10 && !otpSent && (
                          <Button
                            variant="contained"
                            onClick={handleGenerateOtp}
                            fullWidth={isMobile}
                            sx={{
                              bgcolor: '#3A7BD5',
                              color: '#fff',
                              borderRadius: 2,
                              fontWeight: 600,
                              textTransform: 'none',
                              py: 1,
                              boxShadow: '0 4px 8px rgba(58, 123, 213, 0.3)',
                              '&:hover': {
                                bgcolor: '#2A5DA8',
                                boxShadow: '0 6px 12px rgba(58, 123, 213, 0.4)',
                              },
                              transition: 'all 0.3s ease',
                            }}
                          >
                            Send OTP
                          </Button>
                        )}
                        {otpSent && (
                          <>
                            <TextField
                              label="Enter OTP"
                              variant="outlined"
                              name="otp"
                              value={otp}
                              onChange={handleChange}
                              size="medium"
                              type="tel"
                              sx={{
                                flex: 1,
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  backgroundColor: '#f9f9f9',
                                }
                              }}
                            />
                            <Button
                              variant="contained"
                              onClick={handleVerifyOtp}
                              sx={{
                                bgcolor: '#00B761',
                                color: '#fff',
                                fontWeight: 600,
                                borderRadius: 2,
                                textTransform: 'none',
                                py: 1,
                                px: 2,
                                boxShadow: '0 4px 8px rgba(0, 183, 97, 0.3)',
                                '&:hover': {
                                  bgcolor: '#009650',
                                  boxShadow: '0 6px 12px rgba(0, 183, 97, 0.4)',
                                },
                                transition: 'all 0.3s ease',
                              }}
                            >
                              Verify
                            </Button>
                          </>
                        )}
                      </Box>
                    </>
                  )}
                  <TextField
                    select
                    label="Financial Year"
                    variant="outlined"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    fullWidth
                    size="medium"
                    sx={{
                      mb: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#f9f9f9',
                      },
                      '& .MuiOutlinedInput-input': {
                        padding: '12.5px 14px',
                      },
                    }}
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </TextField>

                  <FormControlLabel
  control={
    <Checkbox
      checked={stayLoggedIn}
      onChange={(e) => setStayLoggedIn(e.target.checked)}
      sx={{
        color: '#3A7BD5',
        '&.Mui-checked': {
          color: '#3A7BD5',
        },
      }}
    />
  }
  label={
    <Typography variant="body2" sx={{ fontWeight: 500 }}>
      Keep me logged in
    </Typography>
  }
  sx={{ mb: 2 }}
/>

                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      justifyContent: 'center',
                      flexDirection: isMobile ? 'column' : 'row',
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (role === 'user' && loginMode === 'mobile') {
                          if (isNewUser) {
                            toast.info("Please create a password first");
                          } else if (mobileValid === 'valid') {
                            handleEmployeeLogin();
                          }
                        } else if (['customer', 'salesman', 'broker'].includes(role)) {
                          if (otpSent && otp.length === 4) handleVerifyOtp();
                          else toast.info("Please verify OTP");
                        } else {
                          handleLogin();
                        }
                      }}
                      disabled={
                        loading ||
                        (role === 'user' && loginMode === 'mobile' && mobileValid !== 'valid') ||
                        (['customer', 'salesman', 'broker'].includes(role) && !otpSent)
                      }
                      sx={buttonStyles}
                      fullWidth
                    >
                      {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setForm({ username: '', password: '', mobile: '' });
                        setRole('user');
                        setOtpSent(false);
                        setMobilePassword('');
                        setMobileValid('');
                        setMobileMessage('');
                      }}
                      sx={{
                        borderColor: '#ccc',
                        color: '#b90909ff',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        py: 1,
                        '&:hover': {
                          borderColor: '#999',
                          color: '#a00303ff',
                        },
                        transition: 'all 0.3s ease',
                      }}
                      fullWidth
                    >
                      Clear
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </Paper>
        </Fade>
      ) : (
        <CoBrModal open={modalOpen} onClose={resetToLogin} />
      )}
      {/* <Snackbar
        open={error}
        onClose={handleCloseSnackbar}
        message="Invalid username or password"
        autoHideDuration={3000}
        sx={{ zIndex: 9999 }}
      /> */}
      <Snackbar
        open={otpError}
        onClose={() => setOtpError(false)}
        message="Enter a valid mobile number"
        autoHideDuration={3000}
        sx={{ zIndex: 9999 }}
      />
      <Dialog
        open={createPwdOpen}
        onClose={() => setCreatePwdOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 600 }}>
          New Password for {empNameForModal}
        </DialogTitle>

        <DialogContent>

          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Enter the 4-digit OTP sent to <strong>{employeeEmailForOtp}</strong>
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
              {[0, 1, 2, 3].map((i) => (
                <TextField
                  key={i}
                  id={`otp-${i}`}
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: 'center',
                      fontSize: '1.2rem',
                      padding: '10px',
                      width: '30px',
                      height: '30px',
                    },
                    placeholder: '0',
                  }}
                  variant="outlined"
                  value={enteredOtp[i] || ''}
                  onChange={(e) => handleOtpChange(e, i)}
                  onKeyDown={(e) => handleOtpKeyDown(e, i)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              ))}

              {showVerifiedIcon && (
                <Box >
                  <CheckCircleIcon
                    sx={{
                      color: '#00C853',
                      fontSize: 32,
                      mt: 0.5,
                      animation: 'pop 0.3s ease'
                    }}
                  />
                </Box>
              )}

              {otpErrorMsg && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  <ErrorIcon
                    sx={{
                      color: 'red',
                      fontSize: 32,
                      mt: 0.5,
                      animation: 'pop 0.3s ease'
                    }}
                  />
                </Typography>
              )}
            </Box>
          </Box>

          <TextField
            autoFocus
            margin="dense"
            label="New Password"
            type={showNewPwd ? 'text' : 'password'}
            fullWidth
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showNewPwd ? "Hide password" : "Show password"}
                    onClick={handleClickShowNewPassword}
                    edge="end"
                    sx={{ color: '#777' }}
                  >
                    {showNewPwd ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mt: 1 }}
          />

          <TextField
            margin="dense"
            label="Confirm Password"
            type={showPwd ? 'text' : 'password'}
            fullWidth
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPwd ? "Hide password" : "Show password"}
                    onClick={handleClickShowPassword}
                    edge="end"
                    sx={{ color: '#777' }}
                  >
                    {showPwd ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCreatePassword}
            variant="contained"
            color="primary"
            disabled={enteredOtp.join('').length !== 4}
            sx={{ textTransform: 'none' }}
          >
            Create Password
          </Button>
          <Button
            variant='outlined'
            color='error'
            onClick={() => setCreatePwdOpen(false)}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};
export default Login;