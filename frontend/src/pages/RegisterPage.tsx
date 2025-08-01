import React, {useState} from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    Divider,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import {Google, GitHub} from '@mui/icons-material';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const {register} = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
        birthDate: '',
        sex: '',
        phoneNumber: '',
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

        // Валидация
        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        if (formData.password.length < 6) {
            setError('Пароль должен содержать минимум 6 символов');
            return;
        }

        setLoading(true);

        try {
            const registerData = {
                email: formData.email,
                username: formData.username,
                firstName: formData.firstName,
                lastName: formData.lastName,
                password: formData.password,
                birthDate: formData.birthDate || undefined,
                sex: formData.sex || undefined,
                phoneNumber: formData.phoneNumber || undefined,
            };

            await register(registerData);
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
        <Container component="main" maxWidth="md" sx={{mt: 4, mb: 4}}>
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
                <Typography component="h1" variant="h4" sx={{mb: 3, color: '#ff4444', fontWeight: 'bold'}}>
                    Регистрация в MyTube
                </Typography>

                {error && (
                    <Alert severity="error" sx={{width: '100%', mb: 2}}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{width: '100%'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="firstName"
                                label="Имя"
                                name="firstName"
                                autoComplete="given-name"
                                value={formData.firstName}
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
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Фамилия"
                                name="lastName"
                                autoComplete="family-name"
                                value={formData.lastName}
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
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="username"
                                label="Имя пользователя"
                                name="username"
                                autoComplete="username"
                                value={formData.username}
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
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                autoComplete="email"
                                type="email"
                                value={formData.email}
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
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Пароль"
                                type="password"
                                id="password"
                                autoComplete="new-password"
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
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Подтвердите пароль"
                                type="password"
                                id="confirmPassword"
                                value={formData.confirmPassword}
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
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="birthDate"
                                label="Дата рождения"
                                type="date"
                                id="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
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
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#ff4444',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="sex-label" sx={{'&.Mui-focused': {color: '#ff4444'}}}>
                                    Пол
                                </InputLabel>
                                <Select
                                    labelId="sex-label"
                                    id="sex"
                                    name="sex"
                                    value={formData.sex}
                                    label="Пол"
                                    onChange={(e) => setFormData({...formData, sex: e.target.value})}
                                    sx={{
                                        backgroundColor: '#2a2a2a',
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#ff4444',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#ff4444',
                                        },
                                    }}
                                >
                                    <MenuItem value="MALE">Мужской</MenuItem>
                                    <MenuItem value="FEMALE">Женский</MenuItem>
                                    <MenuItem value="OTHER">Другой</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="phoneNumber"
                                label="Номер телефона"
                                type="tel"
                                id="phoneNumber"
                                value={formData.phoneNumber}
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
                        </Grid>
                    </Grid>

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
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </Button>

                    <Divider sx={{my: 2, borderColor: '#444'}}>
                        <Typography variant="body2" color="text.secondary">
                            или
                        </Typography>
                    </Divider>

                    <Box sx={{display: 'flex', gap: 2, mb: 2}}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Google/>}
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
                            startIcon={<GitHub/>}
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

                    <Box sx={{textAlign: 'center', mt: 2}}>
                        <Typography variant="body2" color="text.secondary">
                            Уже есть аккаунт?{' '}
                            <Link
                                to="/login"
                                style={{
                                    color: '#ff4444',
                                    textDecoration: 'none',
                                }}
                            >
                                Войти
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default RegisterPage;