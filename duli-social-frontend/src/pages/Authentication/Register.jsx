import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
    Button, FormControlLabel, Radio, RadioGroup, TextField, 
    IconButton, InputAdornment, Alert, CircularProgress, 
    FormLabel, Box, Typography, useTheme 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { registerUserAction } from '../../Redux/Auth/auth.action';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string().min(6, "Min 6 chars").required("Password required"),
  gender: Yup.string().required("Required")
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.auth);

  const inputStyle = {
    "& .MuiFilledInput-root": {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      borderRadius: '12px',
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
       "&.Mui-focused": { color: '#912f56' }
    }
  };

  const handleSubmit = async (values) => {
    const result = await dispatch(registerUserAction({ data: values }));
    if (result?.payload?.jwt || localStorage.getItem("jwt")) {
      navigate("/");
    }
  };

  return (
    <Box>
      <Formik 
        onSubmit={handleSubmit} 
        validationSchema={validationSchema} 
        initialValues={{ firstName: "", lastName: "", email: "", password: "", gender: "male" }}
      >
        <Form className="space-y-4">
          {error && <Alert severity="error" sx={{ borderRadius: '12px', mb: 2 }}>{error}</Alert>}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Field as={TextField} name='firstName' label="First Name" variant="filled" fullWidth sx={inputStyle} />
              <ErrorMessage name='firstName' component="div" className='text-red-500 text-[10px] mt-1 ml-2 font-bold uppercase' />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Field as={TextField} name='lastName' label="Last Name" variant="filled" fullWidth sx={inputStyle} />
              <ErrorMessage name='lastName' component="div" className='text-red-500 text-[10px] mt-1 ml-2 font-bold uppercase' />
            </Box>
          </Box>

          <Box>
            <Field as={TextField} name='email' label="Email" variant="filled" fullWidth sx={inputStyle} />
            <ErrorMessage name='email' component="div" className='text-red-500 text-[10px] mt-1 ml-2 font-bold uppercase' />
          </Box>
          
          <Box>
            <Field 
                as={TextField} 
                name='password' 
                label="Password" 
                type={showPassword ? "text" : "password"}
                variant="filled" 
                fullWidth 
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
            <ErrorMessage name='password' component="div" className='text-red-500 text-[10px] mt-1 ml-2 font-bold uppercase' />
          </Box>

          <Box sx={{ 
            p: 1.5, 
            border: '1px solid', 
            borderColor: 'divider', 
            borderRadius: '12px',
            bgcolor: 'rgba(255,255,255,0.02)' 
          }}>
            <FormLabel sx={{ fontSize: '0.75rem', ml: 1, color: 'text.secondary', fontWeight: 600 }}>GENDER</FormLabel>
            <Field as={RadioGroup} row name='gender' sx={{ ml: 1 }}>
              <FormControlLabel 
                value="female" 
                control={<Radio size="small" sx={{ color: '#912f56', '&.Mui-checked': { color: '#912f56' } }} />} 
                label={<Typography variant="body2">Female</Typography>} 
              />
              <FormControlLabel 
                value="male" 
                control={<Radio size="small" sx={{ color: '#912f56', '&.Mui-checked': { color: '#912f56' } }} />} 
                label={<Typography variant="body2">Male</Typography>} 
              />
            </Field>
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
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(145, 47, 86, 0.3)',
              "&:hover": { bgcolor: "#7a2646", boxShadow: 'none' } 
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
          </Button>
        </Form>
      </Formik>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 4, gap: 1 }}>
        <Typography variant="body2" color="text.secondary">Already have an account?</Typography>
        <Typography 
          onClick={() => navigate("/login")}
          variant="body2" 
          sx={{ color: '#912f56', fontWeight: 'bold', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
        >
          Sign In
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;