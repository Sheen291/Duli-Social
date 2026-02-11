import React, { useState, useEffect, useRef } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, Card, CardHeader, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { searchUserAction } from '../../Redux/Auth/auth.action';
import { createChat } from '../../Redux/Message/message.action';

const SearchUser = () => {
    const theme = useTheme();
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
                    backgroundColor: theme.palette.mode === 'dark' ? '#3A3B3C' : '#f0f2f5',
                    borderRadius: '20px',
                    padding: '8px 15px', 
                    display: 'flex', 
                    alignItems: 'center',
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'transparent' : 'transparent'}` // Có thể thêm border nếu muốn
                }}
            >
                <SearchIcon sx={{ color: 'text.secondary' }} /> 
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
                        fontSize: '15px',
                        color: theme.palette.text.primary 
                    }}
                />
            </div>

            {username && auth.searchUser.length > 0 && (
                <div 
                    className='absolute w-full z-50 top-[45px] left-0 shadow-lg rounded-lg overflow-hidden'
                    style={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`
                    }}
                >
                    
                    {auth.searchUser
                        .filter(user => user.id !== auth.user?.id) 
                        .map((item) => (
                            <Card
                                key={item.id}
                                onClick={() => handleClick(item.id)}
                                sx={{
                                    cursor: 'pointer',
                                    borderRadius: 0,
                                    boxShadow: 'none',
                                    borderBottom: 1,
                                    borderColor: 'divider',
                                    bgcolor: 'transparent',
                                    '&:last-child': { borderBottom: 'none' },
                                    '&:hover': {
                                        bgcolor: 'action.hover'
                                    },
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <CardHeader
                                    avatar={
                                        <Avatar src={item.image || ''} sx={{bgcolor: '#912f56', color: 'white'}}>
                                            {item.firstName[0]}
                                        </Avatar>
                                    }
                                    title={
                                        <span style={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                            {item.firstName + " " + item.lastName}
                                        </span>
                                    }
                                    subheader={
                                        <span style={{ fontSize: '12px', color: theme.palette.text.secondary }}>
                                            {"@" + (item.firstName + item.lastName).toLowerCase().replace(/\s/g, '')}
                                        </span>
                                    }
                                    sx={{ padding: '10px 16px' }}
                                />
                            </Card>
                    ))}
                    
                    {auth.searchUser.filter(user => user.id !== auth.user?.id).length === 0 && (
                        <div className='p-4 text-center text-sm' style={{ color: theme.palette.text.secondary }}>
                            No results found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchUser;