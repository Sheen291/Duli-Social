import React, { useState, useEffect, useRef } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, Card, CardHeader } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { searchUserAction } from '../../Redux/Auth/auth.action';
import { createChat } from '../../Redux/Message/message.action';

const SearchUser = () => {
    const [username, setUsername] = useState("");
    const dispatch = useDispatch();
    const auth = useSelector(store => store.auth);
    
    const searchRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (username.trim()) {
                dispatch(searchUserAction(username));
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [username, dispatch]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setUsername("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleSearchUser = (e) => {
        setUsername(e.target.value);
    }

    const handleClick = (id) => {
        dispatch(createChat({ userId: id }));
        setUsername("");
    }

    return (
        <div className='px-3 mb-4 relative' ref={searchRef}>
            <div
                style={{
                    backgroundColor: '#f0f2f5', borderRadius: '20px',
                    padding: '8px 15px', display: 'flex', alignItems: 'center'
                }}
            >
                <SearchIcon sx={{ color: '#65676b' }} />
                <input
                    type='text'
                    placeholder='Search user...'
                    value={username}
                    onChange={handleSearchUser}
                    style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        marginLeft: '10px',
                        width: '100%',
                        outline: 'none',
                        fontSize: '15px'
                    }}
                />
            </div>

            {username && auth.searchUser.length > 0 && (
                <div className='absolute w-full z-50 top-[45px] left-0 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100'>
                    
                    {auth.searchUser
                        .filter(user => user.id !== auth.user?.id) 
                        .map((item) => (
                            <Card
                                key={item.id}
                                className='cursor-pointer hover:bg-gray-100 rounded-none shadow-none border-b last:border-none transition-colors'
                                onClick={() => handleClick(item.id)}
                            >
                                <CardHeader
                                    avatar={<Avatar src={item.image || ''} sx={{bgcolor: '#912f56'}}>{item.firstName[0]}</Avatar>}
                                    title={
                                        <span className='font-semibold text-gray-800'>
                                            {item.firstName + " " + item.lastName}
                                        </span>
                                    }
                                    subheader={
                                        <span className='text-xs text-gray-500'>
                                            {"@" + (item.firstName + item.lastName).toLowerCase().replace(/\s/g, '')}
                                        </span>
                                    }
                                    sx={{ padding: '10px 16px' }}
                                />
                            </Card>
                    ))}
                    
                    {auth.searchUser.filter(user => user.id !== auth.user?.id).length === 0 && (
                        <div className='p-4 text-center text-gray-500 text-sm'>
                            No results found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchUser;