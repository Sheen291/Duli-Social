import React from 'react'
import { Card, Grid } from '@mui/material'
import Login from './Login'

const Authentication = () => {
  return (
    <div>
        <Grid container>
            <Grid className='w-7/12 h-screen overflow-hidden'>
                <img className='h-full w-full' src="https://i.pinimg.com/736x/32/17/2e/32172e42b55c02a3db0c5096f7d4b5af.jpg" alt=''></img>
            </Grid>
            <Grid className='w-5/12'>
                <div className='px-20 flex flex-col justify-center h-full'>
                  
                  <Card className='card p-8'>
                    <div className='flex flex-col items-center mb-5 space-y-1'>
                      <h1 className='logo text-center'>Duli Social</h1>
                      <p className='text-center text-sm w-[70&]'>Connect to the world</p>
                    </div>

                    <Login/>
                  </Card>
                </div>
            </Grid>
        </Grid>

    </div>
  )
}

export default Authentication
