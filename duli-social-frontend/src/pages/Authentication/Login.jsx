import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, IconButton, InputAdornment, Alert, CircularProgress, Box, Typography, useTheme } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { loginUserAction, getProfileAction } from '../../Redux/Auth/auth.action';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.auth);

  const inputStyle = {
    "& .MuiFilledInput-root": {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      borderRadius: '8px',
      transition: 'all 0.2s',
      border: '1px solid transparent',
      "&:before, &:after": { display: 'none' }, 
      "&:hover": {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
      },
      "&.Mui-focused": {
        backgroundColor: theme.palette.mode === 'dark' ? 'black' : 'white',
        borderColor: '#912f56',
        boxShadow: '0 0 0 2px rgba(145, 47, 86, 0.2)',
      }
    },
    "& .MuiInputLabel-root": {
       color: 'text.secondary',
       "&.Mui-focused": { color: '#912f56' }
    }
  };

  const handleSubmit = async (values) => {
    const data = await dispatch(loginUserAction(values)); 
    if (data && data.token) {
        dispatch(getProfileAction(data.token));
        navigate("/");
    }
  };

  return (
    <Box>
      <Formik onSubmit={handleSubmit} validationSchema={validationSchema} initialValues={{ email: "", password: "" }}>
        <Form className="space-y-6">
          {error && <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box>
                <Field 
                as={TextField} 
                name='email' 
                label="Email Address" 
                fullWidth 
                variant="filled" 
                sx={inputStyle}
                />
                <ErrorMessage name='email' component="div" className='text-red-500 text-[10px] mt-1 ml-2 uppercase font-bold' />
            </Box>

            <Box>
                <Field 
                as={TextField} 
                name='password' 
                label="Password" 
                type={showPassword ? "text" : "password"}
                fullWidth 
                variant="filled"
                sx={inputStyle}
                InputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'text.secondary' }}>
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                    </InputAdornment>
                    )
                }}
                />
                <ErrorMessage name='password' component="div" className='text-red-500 text-[10px] mt-1 ml-2 uppercase font-bold' />
            </Box>
          </Box>

          <Button 
            type='submit' 
            variant="contained"
            fullWidth 
            disabled={loading}
            sx={{ 
              py: 1.5, 
              bgcolor: "#912f56", 
              borderRadius: '12px',
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(145, 47, 86, 0.3)',
              "&:hover": { bgcolor: "#7a2646", boxShadow: 'none' } 
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
          </Button>
        </Form>
      </Formik>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 4, gap: 1 }}>
        <Typography variant="body2" color="text.secondary">Don't have an account?</Typography>
        <Typography 
          onClick={() => navigate("/register")}
          variant="body2" 
          sx={{ color: '#912f56', fontWeight: 'bold', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
        >
          Register now
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;