'use client'
import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  useTheme,
  Card,
  MenuItem,
  Grow,
  Snackbar,
  InputAdornment,
  IconButton,
  useMediaQuery,
  Modal,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Login3 from '@/assets/images/Login3.jpg';
import BusinessIcon from '@mui/icons-material/Business';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';
import axiosInstance from '@/lib/axios';
import CoBrModal from './CoBrModal';

const roles = [
  { label: 'User     ', value: 'user', icon: <PersonIcon /> },
  { label: 'Customer', value: 'customer', icon: <BusinessIcon /> },
  { label: 'Salesman', value: 'salesman', icon: <ShoppingCartIcon /> },
  { label: 'Broker', value: 'broker', icon: <AccountBalanceIcon /> },
];

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [role, setRole] = useState('user');
  const [form, setForm] = useState({ username: '', password: '', mobile: '' });
  const [showPwd, setShowPwd] = useState(false);
  const router = useRouter();
  const [error, setError] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const defaultYearRange = `${currentYear}-${nextYear}`;
  const years = [defaultYearRange];
  const [selectedYear, setSelectedYear] = useState(defaultYearRange);
  const [otpRequests, setOtpRequests] = useState({});

  const buttonStyles = {

    bgcolor: '#39ace2', // Custom blue color

//     bgcolor: '#3f51b5', // Custom blue color

    color: '#fff',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: 500,
    textTransform: 'none',
    '&:hover': {
      bgcolor: '#1a237e', // Darker shade for hover effect
    },
    transition: 'background-color 0.3s ease',
  };
//   useEffect(() => {
//     const isAuthenticated = localStorage.getItem('authenticated');
//     if (isAuthenticated) {
//       router.push('/dashboard', { replace: true });
//     }
//   }, [router]);
useEffect(() => {
  const isAuthenticated = localStorage.getItem('authenticated') === 'true';
  if (isAuthenticated) {
    router.push('/dashboard', { replace: true });
  }
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
        }
      }
    } else if (name === 'otp') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setOtp(numericValue);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRoleSelect = (value) => {
    setRole(value);
    setForm({ username: '', password: '', mobile: '' });
  };

  const canSendOtp = (mobile) => {
    if (!otpRequests[mobile]) return true;
    const lastRequestTime = otpRequests[mobile];
    const fiveMinutes = 5 * 60 * 1000;
    const currentTime = new Date().getTime();
    return (currentTime - lastRequestTime) > fiveMinutes;
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
        FLAG: 'C',
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
        toast.success('OTP sent successfully', { autoClose: 1000 });
      } else {
        setOtpError(true);
        toast.error('Mobile number is not registered', { autoClose: 1000 });
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setOtpError(true);
      toast.error('Error sending OTP. Please try again.', { autoClose: 1000 });
    }
  };

//   const handleGenerateOtp = () => {
//   const staticOtp = '123456';
//   const PARTY_NAME = 'Test User';
//   const PARTY_KEY = 'TEST123';

//   localStorage.setItem('PARTY_NAME', PARTY_NAME);
//   localStorage.setItem('PARTY_KEY', PARTY_KEY);

//   setGeneratedOtp(staticOtp);
//   setOtpSent(true);
//   setOtpError(false);

//   toast.success('Static OTP sent successfully (123456)', { autoClose: 1000 });
// };

  const handleVerifyOtp = () => {
    console.log('Generated OTP:', generatedOtp);
    console.log('Entered OTP:', otp);
    if (otp.trim() === generatedOtp) {
      toast.success('OTP is verified. Login successfully.');
      const currentYear = new Date().getFullYear();
      const lastTwoDigits = currentYear.toString().slice(-2);
      localStorage.setItem('FCYR_KEY', lastTwoDigits);
      localStorage.setItem('authenticated', 'true');
      localStorage.setItem('userRole', role); 
      setShowLogin(false);
      setModalOpen(true);
    } else {
      toast.error('Invalid OTP. Please try again.');
    }
  };

  const handleLogin = async () => {
    try {
      // Step 1: Encrypt the password
      const encryptionResponse = await axiosInstance.post('USERS/Getpwdencryption', {
        USER_PWD: form.password,
      });
      const encryptedPassword = encryptionResponse.data.DATA;
      // Step 2: Authenticate the user
      const loginResponse = await axiosInstance.post('USERS/GetUserLogin', {
        USER_NAME: form.username,
        USER_PWD: encryptedPassword,
      });

      if (loginResponse.data.STATUS === 0) {
        const loginDetails = loginResponse.data.DATA[0];
        const USER_NAME =loginDetails.USER_NAME;
        const currentYear = new Date().getFullYear();
        const lastTwoDigits = currentYear.toString().slice(-2);
        localStorage.setItem('USER_NAME',USER_NAME);
        localStorage.setItem('FCYR_KEY', lastTwoDigits);
        localStorage.setItem('authenticated', 'true');
          localStorage.setItem('userRole', role); 
        setShowLogin(false);
        setModalOpen(true);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(true);
    }
  };

  const handleCloseSnackbar = () => {
    setError(false);
  };

  const handleClickShowPassword = () => {
    setShowPwd(!showPwd);
  };

  const resetToLogin = () => {
    setShowLogin(true);
    setModalOpen(false);
    setForm({ username: '', password: '', mobile: '' });
    setRole('user');
    setOtpSent(false);
    setGeneratedOtp('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #1f1c2c, #928dab)',
        backgroundImage: `url(${Login3.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        alignItems: 'center',
        justifyContent: 'center',
        p: isMobile ? 2 : 0,
        position: 'relative', 
      }}
    >
      <ToastContainer />
      {showLogin ? (
        <Paper
          elevation={12}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            width: { xs: '95%', sm: '95%', md: '95%' },
            maxWidth: '650px',
            height: { xs: 'auto', sm: '60vh', md: 'auto' },
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'transparent',
            backgroundImage: 'none',
            position: 'relative',
            top: 0,
            left: isMobile ? 0 : 126,
            zIndex: 1,
          }}
        >
          {/* Role Selection */}
          <Box
            sx={{
              width: { xs: '100%', sm: '35%' },
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(12px)',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderRight: { xs: 'none', sm: '1px solid rgba(255,255,255,0.1)' },
              gap: { xs: 0, sm: 2.5, md: 2.5 },
            }}
          >
            <Typography variant="h6" color="#000"
              sx={{
                textAlign: 'center',
                mb: 1,
                width: '100%'
              }}>
              {/* Select Role */}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 1.5,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {roles.map((r) => (
                <Card
                  key={r.value}
                  onClick={() => handleRoleSelect(r.value)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    p: 1,
                    gap: 2,
                    cursor: 'pointer',
                    bgcolor: role === r.value ? '#DCDCDC' : 'rgba(255,255,255,0.15)',
                    transition: '0.3s',
                    width: isMobile ? '77%' : '100%',
                    justifyContent: 'flex-start',
                    paddingLeft: '12px',
                    marginRight: isMobile ? '20px' : '0px',
                    '&:hover': {
                      bgcolor: '#DCDCDC',
                    },
                  }}
                >

                  <Avatar sx={{ bgcolor: '#39ace2', width: 32, height: 32, mr: 1 }}>

                  {/* </Avatar><Avatar sx={{ bgcolor: '#3f51b5', width: 32, height: 32, mr: 1 }}> */}

                    {r.icon}
                  </Avatar>
                  <Typography color="#000" fontWeight={500} fontSize="0.9rem" sx={{ userSelect: 'none' }}>
                    {r.label}
                  </Typography>
                </Card>
              ))}
            </Box>
          </Box>

          {/* Login Form */}
          <Grow in timeout={500}>
            <Box
              sx={{
                width: { xs: '85%', sm: '65%' },
                padding: { xs: '0px 24px 24px 24px', sm: '24px 24px 24px 24px', md: '24px 24px 24px 24px' },
                backdropFilter: 'blur(10px)',
                color: '#000',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mt: { xs: 0, sm: 0 },
                mb: '20px',
              }}
            >
              <Box textAlign="center">

                <Avatar sx={{ bgcolor: '#39ace2', width: 48, height: 48, mx: 'auto' }}>

{/*            <Avatar sx={{ bgcolor: '#3f51b5', width: 48, height: 48, mx: 'auto' }}> */}

                  <LockOutlinedIcon fontSize="medium" />
                </Avatar>
                <Typography variant="h5" fontWeight="500" mt={1}>
                  Sign In
                </Typography>
                <Typography variant="body2" sx={{ color: '#000' }}>
                  as {role.toUpperCase()}
                </Typography>
              </Box>

              {/* Login Fields */}
              {['user', 'salesman', 'broker'].includes(role) && (
                <>
                  <TextField
                    label="Username"
                    variant="filled"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    InputProps={{ sx: { color: '#000' } }}
                    InputLabelProps={{ sx: { color: '#000' } }}
                    sx={{ bgcolor: 'rgba(255,255,255,0.07)', borderRadius: 1 }}
                  />
                  <TextField
                    label="Password"
                    type={showPwd ? 'text' : 'password'}
                    variant="filled"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    InputProps={{
                      sx: { color: '#000' },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={showPwd ? "Hide password" : "Show password"}
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPwd ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{ sx: { color: '#000' } }}
                    sx={{ bgcolor: 'rgba(255,255,255,0.07)', borderRadius: 1 }}
                  />
                </>
              )}

              {role === 'customer' && (
                <>
                  <TextField
                    label="Mobile Number"
                    variant="filled"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    InputProps={{ sx: { color: '#000' } }}
                    InputLabelProps={{ sx: { color: '#000' } }}
                    sx={{ bgcolor: 'rgba(255,255,255,0.07)', borderRadius: 1, mb: 0 }}
                  />

                  <Box sx={{ display: { xs: 'block', sm: 'flex' }, alignItems: 'center', gap: 2, mt: 0 }}>
                    {form.mobile.length === 10 && !otpSent && (
                      <Button
                        variant="contained"
                        onClick={handleGenerateOtp}
                        sx={{

                          bgcolor: '#39ace2',

//                           bgcolor: '#3f51b5',

                          color: '#fff',
                          borderRadius: '0.75rem',
                          fontSize: '1rem',
                          fontWeight: 500,
                          textTransform: 'none',
                          width: isMobile ? '100%' : '160px',
                          padding: '8px 16px',
                          '&:hover': {
                            bgcolor: '#1a237e',
                          },
                          transition: 'background-color 0.3s ease',
                        }}
                      >
                        Generate OTP
                      </Button>
                    )}

                    {otpSent && (
                      <>
                        <TextField
                          label="Enter OTP"
                          variant="filled"
                          name="otp"
                          value={otp}
                          onChange={handleChange}
                          size="small"
                          type="tel"
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.07)',
                            borderRadius: 1,
                            width: isMobile ? '100%' : '160px',
                            padding: '8px',
                          }}
                        />

                        <Button
                          variant="contained"
                          onClick={handleVerifyOtp}
                          sx={{
                            bgcolor: '#3f51b5',
                            color: '#fff',
                            fontWeight: 500,
                            borderRadius: '0.75rem',
                            fontSize: '1rem',
                            textTransform: 'none',
                            mt: 0,
                            width: isMobile ? '100%' : '170px',
                            padding: '8px 8px',
                            '&:hover': {
                              bgcolor: '#1a237e',
                            },
                            transition: 'background-color 0.3s ease',
                          }}
                        >
                          Verify OTP & Login
                        </Button>
                      </>
                    )}
                  </Box>
                </>
              )}

              <TextField
                select
                label="Select Year"
                variant="filled"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                fullWidth
                size="small"
                InputProps={{ sx: { color: '#000' } }}
                InputLabelProps={{ sx: { color: '#000' } }}
                sx={{
                  mt: 0,
                  bgcolor: 'rgba(255,255,255,0.07)',
                  borderRadius: 1,
                  '& .MuiSelect-icon': { color: '#000' },
                  mr: { xs: 1.25, sm: 0 },
                  pr: { xs: 1.25, sm: 0 },
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
                  mt: 0.5,
                  justifyContent: 'center',
                  flexDirection: isMobile ? 'column' : 'row',
                }}
              >
                {/* <Button
                  variant="contained"
                  onClick={handleLogin}
                  sx={{
                    bgcolor: '#764ba2',
                    color: '#fff',
                    flex: 1,
                    py: 1,
                    fontWeight: 500,
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: '#1f2937',
                    },
                    transition: 'background-color 0.3s ease',
                  }}
                  fullWidth={isMobile}
                >
                  Login
                </Button> */}
                <Button
                  variant="contained"
                  onClick={handleLogin}
                  sx={{ ...buttonStyles, flex: 1, py: 1 }}
                  fullWidth={isMobile}
                >
                  Login
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setForm({ username: '', password: '', mobile: '' });
                    setRole('user');
                  }}
                  sx={{
                    borderColor: '#6b7280',
                    color: '#6b7280',
                    flex: 1,
                    py: 1,
                    fontWeight: 500,
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#4b5563',
                      color: '#4b5563',
                    },
                    transition: 'border-color 0.3s ease, color 0.3s ease',
                  }}
                  fullWidth={isMobile}
                >
                  Cancel
                </Button>
              </Box>

            </Box>
          </Grow>
        </Paper>
      ) : (
        <CoBrModal open={modalOpen} onClose={resetToLogin} />
      )}

      <Snackbar
        open={error}
        onClose={handleCloseSnackbar}
        message="Invalid username or password"
        autoHideDuration={3000}
      />
      <Snackbar
        open={otpError}
        onClose={() => setOtpError(false)}
        message="Enter a valid mobile number"
        autoHideDuration={3000}
      />
    </Box>
  );
};

export default Login;
