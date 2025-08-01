import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    Avatar,
    Grid,
    // Divider,
    Card,
    CardContent,
    Tabs,
    Tab,
    // IconButton,
} from '@mui/material';
import { Edit, Save, Cancel, VideoLibrary, Analytics } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [profileData, setProfileData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        username: user?.username || '',
        email: user?.email || '',
    });
    const [stats, setStats] = useState({
        totalVideos: 0,
        totalViews: 0,
        totalSubscribers: 0,
        totalLikes: 0,
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
            });
            fetchStats();
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            const response = await axios.get('/api/users/profile/stats');
            setStats(response.data);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axios.put('/api/users/profile', profileData);
            setSuccess('Профиль успешно обновлен');
            setEditing(false);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Не удалось обновить профиль');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (user) {
            setProfileData({
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
            });
        }
        setEditing(false);
        setError('');
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    if (!user) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">
                    Пользователь не найден
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper
                elevation={3}
                sx={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                }}
            >
                <Box sx={{ borderBottom: 1, borderColor: '#333' }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        sx={{
                            '& .MuiTab-root': {
                                color: 'text.secondary',
                                '&.Mui-selected': {
                                    color: '#ff4444',
                                },
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#ff4444',
                            },
                        }}
                    >
                        <Tab icon={<Edit />} label="Профиль" />
                        <Tab icon={<VideoLibrary />} label="Мои видео" />
                        <Tab icon={<Analytics />} label="Аналитика" />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Avatar
                                    src={user.avatarUrl}
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        mx: 'auto',
                                        mb: 2,
                                        bgcolor: '#ff4444',
                                        fontSize: 48,
                                    }}
                                >
                                    {user.firstName.charAt(0)}
                                </Avatar>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {user.firstName} {user.lastName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    @{user.username}
                                </Typography>
                                {user.channel && (
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Канал: {user.channel.channelName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {user.channel.subscriberCount} подписчиков
                                        </Typography>
                                    </Box>
                                )}
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Card sx={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
                                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                            <Typography variant="h6" sx={{ color: '#ff4444' }}>
                                                {stats.totalVideos}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Видео
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={6}>
                                    <Card sx={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
                                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                            <Typography variant="h6" sx={{ color: '#ff4444' }}>
                                                {stats.totalViews}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Просмотров
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} md={8}>
                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}
                            {success && (
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    {success}
                                </Alert>
                            )}

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    Информация профиля
                                </Typography>
                                {!editing ? (
                                    <Button
                                        startIcon={<Edit />}
                                        onClick={() => setEditing(true)}
                                        sx={{ color: '#ff4444' }}
                                    >
                                        Редактировать
                                    </Button>
                                ) : (
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            startIcon={<Save />}
                                            onClick={handleSave}
                                            disabled={loading}
                                            sx={{
                                                color: '#ff4444',
                                                borderColor: '#ff4444',
                                                '&:hover': { borderColor: '#ff6b6b' }
                                            }}
                                            variant="outlined"
                                        >
                                            Сохранить
                                        </Button>
                                        <Button
                                            startIcon={<Cancel />}
                                            onClick={handleCancel}
                                            color="inherit"
                                        >
                                            Отмена
                                        </Button>
                                    </Box>
                                )}
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Имя"
                                        name="firstName"
                                        value={profileData.firstName}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: editing ? '#2a2a2a' : 'transparent',
                                                '&:hover fieldset': {
                                                    borderColor: editing ? '#ff4444' : 'inherit',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#ff4444',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#ff4444',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Фамилия"
                                        name="lastName"
                                        value={profileData.lastName}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: editing ? '#2a2a2a' : 'transparent',
                                                '&:hover fieldset': {
                                                    borderColor: editing ? '#ff4444' : 'inherit',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#ff4444',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#ff4444',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Имя пользователя"
                                        name="username"
                                        value={profileData.username}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: editing ? '#2a2a2a' : 'transparent',
                                                '&:hover fieldset': {
                                                    borderColor: editing ? '#ff4444' : 'inherit',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#ff4444',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#ff4444',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        value={profileData.email}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        type="email"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: editing ? '#2a2a2a' : 'transparent',
                                                '&:hover fieldset': {
                                                    borderColor: editing ? '#ff4444' : 'inherit',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#ff4444',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#ff4444',
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <VideoLibrary sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            Функция "Мои видео" будет добавлена позже
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Здесь вы сможете управлять своими загруженными видео
                        </Typography>
                    </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" sx={{ color: '#ff4444', mb: 1 }}>
                                        {stats.totalViews}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Общие просмотры
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" sx={{ color: '#ff4444', mb: 1 }}>
                                        {stats.totalSubscribers}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Подписчики
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" sx={{ color: '#ff4444', mb: 1 }}>
                                        {stats.totalLikes}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Лайки
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" sx={{ color: '#ff4444', mb: 1 }}>
                                        {stats.totalVideos}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Видео
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </TabPanel>
            </Paper>
        </Container>
    );
};

export default ProfilePage;