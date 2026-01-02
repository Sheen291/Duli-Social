import { Route, Routes } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import Authentication from './pages/Authentication/Authentication';
import HomePage from './pages/Home/HomePage';
import { useDispatch, useSelector } from 'react-redux';
import { getProfileAction } from './Redux/Auth/auth.action';
import CircularProgress from '@mui/material/CircularProgress';

function App() {
  const { auth } = useSelector(store => store);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (jwt) {
        await dispatch(getProfileAction(jwt));
      }
      setIsInitializing(false);
    };
    
    fetchProfile();
  }, [jwt, dispatch]);

  if (isInitializing) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="">
      <Routes>
        <Route path='/*' element={auth.user ? <HomePage /> : <Authentication />}/>
      </Routes>
    </div>
  );
}

export default App;