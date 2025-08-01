import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Box,
    TextField,
    InputAdornment,
} from '@mui/material';
import {
    VideoLibrary,
    Search,
    AccountCircle,
    Upload,
    Settings,
    Logout,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UploadVideo from './UploadVideo';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            await logout();
            handleMenuClose();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
            // Force logout even if API call fails
            handleMenuClose();
            navigate('/');
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleUploadClick = () => {
        setUploadDialogOpen(true);
    };

    const handleUploadSuccess = () => {
        // Можно добавить уведомление об успешной загрузке
        console.log('Video uploaded successfully');
    };

    return (
        <>
            <AppBar position="sticky" sx={{ bgcolor: '#1a1a1a', borderBottom: '1px solid #333' }}>
                <Toolbar>
                    {/* Logo */}
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="home"
                        onClick={() => navigate('/')}
                        sx={{ mr: 2 }}
                    >
                        <VideoLibrary sx={{ fontSize: 32, color: '#ff4444' }} />
                    </IconButton>

                    <Typography
                        variant="h5"
                        component="div"
                        sx={{
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #ff4444, #ff6b6b)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mr: 4
                        }}
                        onClick={() => navigate('/')}
                    >
                        MyTube
                    </Typography>

                    {/* Search Bar */}
                    <Box component="form" onSubmit={handleSearch} sx={{ flexGrow: 1, maxWidth: 600, mx: 2 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Поиск видео..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            size="small"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton type="submit" sx={{ color: '#ff4444' }}>
                                            <Search />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#2a2a2a',
                                    '&:hover fieldset': {
                                        borderColor: '#ff4444',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#ff4444',
                                    },
                                },
                            }}
                        />
                    </Box>

                    {/* User Actions */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {user ? (
                            <>
                                <Button
                                    startIcon={<Upload />}
                                    variant="outlined"
                                    onClick={handleUploadClick}
                                    sx={{
                                        color: '#ff4444',
                                        borderColor: '#ff4444',
                                        '&:hover': {
                                            borderColor: '#ff6b6b',
                                            backgroundColor: 'rgba(255, 68, 68, 0.1)',
                                        }
                                    }}
                                >
                                    Загрузить
                                </Button>

                                <IconButton onClick={handleMenuOpen} sx={{ ml: 1 }}>
                                    {user.avatarUrl ? (
                                        <Avatar src={user.avatarUrl} sx={{ width: 32, height: 32 }} />
                                    ) : (
                                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#ff4444' }}>
                                            {user.firstName.charAt(0)}
                                        </Avatar>
                                    )}
                                </IconButton>

                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    PaperProps={{
                                        sx: {
                                            backgroundColor: '#2a2a2a',
                                            border: '1px solid #444',
                                            minWidth: 200,
                                        },
                                    }}
                                >
                                    <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                                        <AccountCircle sx={{ mr: 2 }} />
                                        Профиль
                                    </MenuItem>
                                    <MenuItem onClick={handleMenuClose}>
                                        <Settings sx={{ mr: 2 }} />
                                        Настройки
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        <Logout sx={{ mr: 2 }} />
                                        Выйти
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    color="inherit"
                                    onClick={() => navigate('/login')}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        }
                                    }}
                                >
                                    Войти
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/register')}
                                    sx={{
                                        bgcolor: '#ff4444',
                                        '&:hover': {
                                            bgcolor: '#ff6b6b',
                                        }
                                    }}
                                >
                                    Регистрация
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Upload Video Dialog */}
            <UploadVideo
                open={uploadDialogOpen}
                onClose={() => setUploadDialogOpen(false)}
                onUploadSuccess={handleUploadSuccess}
            />
        </>
    );
};

export default Header;