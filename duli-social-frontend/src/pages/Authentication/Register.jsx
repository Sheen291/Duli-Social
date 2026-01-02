import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, FormControlLabel, Radio, RadioGroup, TextField, IconButton, InputAdornment, Alert, CircularProgress, FormLabel } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { registerUserAction } from '../../Redux/Auth/auth.action';
import { useNavigate } from 'react-router-dom';

const initialValues = { firstName: "", lastName: "", email: "", password: "", gender: "male" }; // Default gender tránh lỗi
const validationSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  gender: Yup.string().required("Gender is required")
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (values) => {
    const result = await dispatch(registerUserAction({ data: values }));
    if (result?.payload?.jwt || localStorage.getItem("jwt")) {
      navigate("/");
    }
  };

  return (
    <>
      <Formik onSubmit={handleSubmit} validationSchema={validationSchema} initialValues={initialValues}>
        <Form className="space-y-4">
          
          {error && <Alert severity="error">{error}</Alert>}

          <div className="space-y-4">
            <div className='flex gap-4'>
               <div className='w-1/2'>
                  <Field as={TextField} name='firstName' label="First Name" variant="outlined" fullWidth />
                  <ErrorMessage name='firstName' component="div" className='text-red-500 text-xs mt-1' />
               </div>
               <div className='w-1/2'>
                  <Field as={TextField} name='lastName' label="Last Name" variant="outlined" fullWidth />
                  <ErrorMessage name='lastName' component="div" className='text-red-500 text-xs mt-1' />
               </div>
            </div>

            <div>
              <Field as={TextField} name='email' label="Email" type="email" variant="outlined" fullWidth />
              <ErrorMessage name='email' component="div" className='text-red-500 text-xs mt-1' />
            </div>

            <div>
              <Field 
                as={TextField} 
                name='password' 
                label="Password" 
                type={showPassword ? "text" : "password"}
                variant="outlined" 
                fullWidth 
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <ErrorMessage name='password' component="div" className='text-red-500 text-xs mt-1' />
            </div>

            <div>
              <FormLabel component="legend" className='text-sm mb-1'>Gender</FormLabel>
              <Field as={RadioGroup} row aria-label='gender' name='gender'>
                <FormControlLabel value="female" control={<Radio size="small" />} label="Female" />
                <FormControlLabel value="male" control={<Radio size="small" />} label="Male" />
                <FormControlLabel value="other" control={<Radio size="small" />} label="Other" />
              </Field>
              <ErrorMessage name="gender" component="div" className='text-red-500 text-xs' />
            </div>
          </div>

          <Button 
            type='submit' 
            variant="contained"
            fullWidth 
            disabled={loading}
            sx={{ py: 1.5, bgcolor: "#912f56", "&:hover": { bgcolor: "#7a2646" } }}
          >
             {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
          </Button>
        </Form>
      </Formik>

      <div className='flex gap-2 items-center justify-center mt-6 text-sm'>
        <p className="text-gray-600">Already have an account?</p>
        <Button size="small" sx={{textTransform: 'none'}} onClick={() => navigate("/login")}>
          Login
        </Button>
      </div>
    </>
  );
};

export default Register;