import React, { useState, useEffect } from 'react';
import { 
    Box, TextField, Avatar, Typography, Tabs, Tab, Grid, InputAdornment, IconButton, CircularProgress, useTheme 
} from '@mui/material'; 
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useDispatch, useSelector } from 'react-redux';
import { searchUserAction, searchPostAction, searchReelsAction } from '../../Redux/Auth/auth.action';
import { useNavigate } from 'react-router-dom';
import PostCard from '../Post/PostCard';
import { CLEAR_SEARCH_RESULTS } from '../../Redux/Auth/auth.actionType';

const Search = () => {
    const theme = useTheme(); 
    const [query, setQuery] = useState("");
    const [submittedQuery, setSubmittedQuery] = useState(""); 
    const [tabValue, setTabValue] = useState(0);
    const [isSearching, setIsSearching] = useState(false);

    const dispatch = useDispatch();
    const { auth } = useSelector(store => store);
    const useNavigateHandler = useNavigate();

    // --- DEBOUNCE LOGIC ---
    useEffect(() => {
        if (!query.trim()) {
            setSubmittedQuery("");
            return;
        }
        const getData = setTimeout(() => {
            executeSearch(query, tabValue);
        }, 1000);

        return () => clearTimeout(getData);
    }, [query, tabValue]);

    useEffect(() => {
        return () => {
            dispatch({ type: CLEAR_SEARCH_RESULTS });
        };
    }, [dispatch]);

    useEffect(() => {
        if (submittedQuery) {
            document.title = `Results for "${submittedQuery}" | Duli Social`;
        } else {
            document.title = "Search | Duli Social";
        }
    }, [submittedQuery]);

    const executeSearch = async (keyword, tab) => {
        if (!keyword.trim()) return;
        setIsSearching(true);
        if (tab === 0) await dispatch(searchUserAction(keyword));
        else if (tab === 1) await dispatch(searchPostAction(keyword));
        else if (tab === 2) await dispatch(searchReelsAction(keyword));
        setSubmittedQuery(keyword);
        setIsSearching(false);
    };

    const handleInputChange = (e) => setQuery(e.target.value);
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') executeSearch(query, tabValue);
    };
    const handleClearQuery = () => {
        setQuery("");
        setSubmittedQuery("");
        document.title = "Search | Duli Social"; 
    };
    const handleTabChange = (event, newValue) => setTabValue(newValue);

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 3 }}>
            
            {/* INPUT AREA */}
            <Box sx={{ width: '100%', maxWidth: 600, px: 2, mb: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search..."
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                {query && (
                                    <IconButton onClick={handleClearQuery} size="small">
                                        <ClearIcon fontSize="small" sx={{ color: 'text.secondary' }}/>
                                    </IconButton>
                                )}
                            </InputAdornment>
                        ),
                        sx: {
                            borderRadius: '8px',
                            backgroundColor: theme.palette.mode === 'dark' ? '#262626' : '#efefef',
                            color: 'text.primary',
                            '& fieldset': { border: 'none' },
                            '&:hover fieldset': { border: 'none' },
                            '&.Mui-focused fieldset': { border: 'none' },
                            height: '45px',
                            fontSize: '0.95rem'
                        }
                    }}
                />
            </Box>

            {/* TABS */}
            <Box sx={{ width: '100%', maxWidth: 600, borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange} 
                    centered
                    TabIndicatorProps={{ style: { backgroundColor: theme.palette.primary.main } }}
                    sx={{
                        '& .MuiTab-root': {
                            textTransform: 'none', fontWeight: 600, fontSize: '1rem', 
                            color: 'text.secondary',
                            '&.Mui-selected': { color: 'text.primary' }
                        }
                    }}
                >
                    <Tab label="People" />
                    <Tab label="Posts" />
                    <Tab label="Reels" />
                </Tabs>
            </Box>

            {/* RESULTS AREA */}
            <Box sx={{ width: '100%', maxWidth: 600, px: 2, pb: 5 }}>
                
                {isSearching ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                        <CircularProgress sx={{ color: theme.palette.primary.main }} />
                    </Box>
                ) : (
                    <>
                        {/* KẾT QUẢ PEOPLE */}
                        {tabValue === 0 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {auth.searchUser?.map((item) => (
                                     <Box 
                                        key={item.id} 
                                        onClick={() => useNavigateHandler(`/profile/${item.id}`)} 
                                        sx={{ 
                                            display: 'flex', alignItems: 'center', p: 1.5, borderRadius: '8px', cursor: 'pointer', 
                                            transition: 'background-color 0.2s', 
                                            '&:hover': { backgroundColor: 'action.hover' } 
                                        }}
                                    >
                                        <Avatar src={item.image} sx={{ width: 44, height: 44, mr: 2, border: 1, borderColor: 'divider' }} />
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography variant="subtitle2" fontWeight="bold" sx={{ color: 'text.primary' }}>
                                                {item.firstName} {item.lastName}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                @{item.username || "user"} 
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        )}

                        {/* KẾT QUẢ POSTS */}
                        {tabValue === 1 && (
                            auth.searchPost?.map((post) => (
                                <Box key={post.id} sx={{ mb: 4, border: 1, borderColor: 'divider', borderRadius: '8px', overflow: 'hidden' }}>
                                     <PostCard item={post} /> 
                                </Box>
                            ))
                        )}

                        {/* KẾT QUẢ REELS */}
                        {tabValue === 2 && (
                            <Grid container spacing={1}>
                                {auth.searchReels?.map((reel) => (
                                    <Grid item size={{ xs: 4 }} key={reel.id}>
                                        <Box 
                                            onClick={() => useNavigateHandler(`/short-videos/${reel.id}`)} 
                                            sx={{ position: 'relative', paddingTop: '177.77%', bgcolor: 'black', cursor: 'pointer', borderRadius: '4px', overflow: 'hidden', '&:hover .video-overlay': { opacity: 1 } }}
                                        >
                                            <video 
                                                src={reel.videoUrl} 
                                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                                                muted 
                                            />
                                            <Box className="video-overlay" sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(0,0,0,0.2)', opacity: 0, transition: '0.2s' }} />
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        )}

                        {/* EMPTY STATE */}
                        {!isSearching && submittedQuery && (
                            (tabValue === 0 && auth.searchUser?.length === 0) ||
                            (tabValue === 1 && auth.searchPost?.length === 0) ||
                            (tabValue === 2 && auth.searchReels?.length === 0)
                        ) && (
                            <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'text.secondary' }}>
                                  <SearchIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
                                  <Typography variant="h6">No results found for "{submittedQuery}"</Typography>
                             </Box>
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
};

export default Search;