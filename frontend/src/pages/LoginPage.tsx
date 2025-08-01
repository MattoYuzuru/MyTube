import React, { useState } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    Divider,
    // IconButton,
} from '@mui/material';
import { Google, GitHub } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        emailOrUsername: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData.emailOrUsername, formData.password);
            navigate('/');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOAuthLogin = (provider: string) => {
        window.location.href = `/oauth2/authorization/${provider}`;
    };

    return (
        <Container component="main" maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                }}
            >
                <Typography component="h1" variant="h4" sx={{ mb: 3, color: '#ff4444', fontWeight: 'bold' }}>
                    Вход в MyTube
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="emailOrUsername"
                        label="Email или имя пользователя"
                        name="emailOrUsername"
                        autoComplete="username"
                        autoFocus
                        value={formData.emailOrUsername}
                        onChange={handleChange}
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
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#ff4444',
                            },
                        }}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Пароль"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
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
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#ff4444',
                            },
                        }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{
                            mt: 3,
                            mb: 2,
                            py: 1.5,
                            bgcolor: '#ff4444',
                            '&:hover': {
                                bgcolor: '#ff6b6b',
                            },
                            '&:disabled': {
                                bgcolor: '#666',
                            },
                        }}
                    >
                        {loading ? 'Вход...' : 'Войти'}
                    </Button>

                    <Divider sx={{ my: 2, borderColor: '#444' }}>
                        <Typography variant="body2" color="text.secondary">
                            или
                        </Typography>
                    </Divider>

                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Google />}
                            onClick={() => handleOAuthLogin('google')}
                            sx={{
                                py: 1.5,
                                borderColor: '#4285f4',
                                color: '#4285f4',
                                '&:hover': {
                                    borderColor: '#5a95f5',
                                    backgroundColor: 'rgba(66, 133, 244, 0.1)',
                                },
                            }}
                        >
                            Google
                        </Button>

                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<GitHub />}
                            onClick={() => handleOAuthLogin('github')}
                            sx={{
                                py: 1.5,
                                borderColor: '#333',
                                color: '#fff',
                                '&:hover': {
                                    borderColor: '#555',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                            }}
                        >
                            GitHub
                        </Button>
                    </Box>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Нет аккаунта?{' '}
                            <Link
                                to="/register"
                                style={{
                                    color: '#ff4444',
                                    textDecoration: 'none',
                                }}
                            >
                                Зарегистрироваться
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginPage;