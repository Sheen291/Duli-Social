import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, IconButton, InputAdornment, Alert, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { loginUserAction, getProfileAction } from '../../Redux/Auth/auth.action';
import { useNavigate } from 'react-router-dom';

const initialValues = { email: "", password: "" };
const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (values) => {
    try {
        const data = await dispatch(loginUserAction(values)); 

        if (data && data.token) {
            console.log("Login OK! Token:", data.token);
            
            dispatch(getProfileAction(data.token));
            navigate("/");
        }
    } catch (error) {
        console.log("Lỗi đăng nhập:", error);
    }
};

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <>
      <Formik onSubmit={handleSubmit} validationSchema={validationSchema} initialValues={initialValues}>
        <Form className="space-y-4">
          
          {error && <Alert severity="error">{error}</Alert>}

          <div className="space-y-4">
            <div>
              <Field 
                as={TextField} 
                name='email' 
                label="Email" 
                variant="outlined" 
                fullWidth 
              />
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
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <ErrorMessage name='password' component="div" className='text-red-500 text-xs mt-1' />
            </div>
          </div>

          <Button 
            type='submit' 
            variant="contained"
            fullWidth 
            disabled={loading}
            sx={{ py: 1.5, bgcolor: "#912f56", "&:hover": { bgcolor: "#7a2646" } }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
          </Button>
        </Form>
      </Formik>

      <div className='flex gap-2 items-center justify-center mt-6 text-sm'>
        <p className="text-gray-600">Don't have an account?</p>
        <Button size="small" sx={{textTransform: 'none'}} onClick={() => navigate("/register")}>
          Register
        </Button>
      </div>
    </>
  );
};

export default Login;