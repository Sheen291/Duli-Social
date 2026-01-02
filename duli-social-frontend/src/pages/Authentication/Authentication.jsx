import React from 'react';
import { Card, Grid, Typography } from '@mui/material';
import Login from './Login';
import Register from './Register';
import { Route, Routes } from 'react-router-dom';

const Authentication = () => {
  return (
    <div className='h-screen w-full overflow-hidden'>
      <Grid container className='h-full'>
        <Grid size={{md: 7}} sx={{ display: { xs: 'none', md: 'block' } }} className='h-full'>
          <img 
            className='h-full w-full object-cover' 
            src="https://i.pinimg.com/736x/b8/20/37/b820370b0d10d308f8ae365829b35db8.jpg" 
            alt='Social Login Background'
          />
        </Grid>

        <Grid size={{xs: 12, md: 5}} className='h-full flex items-center justify-center bg-gray-50'>
          <div className='px-4 w-full max-w-md'>
            <Card className='card p-8 shadow-lg rounded-xl'>
              <div className='flex flex-col items-center mb-6 space-y-2'>
                <h1 className='text-3xl font-bold text-[#912f56]'>Duli Social</h1>
                <p className='text-gray-500 text-sm'>Connect to the world</p>
              </div>

              <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
              </Routes>
            </Card>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Authentication;