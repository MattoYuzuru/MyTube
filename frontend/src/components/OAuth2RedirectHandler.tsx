import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CircularProgress, Box, Alert } from '@mui/material';
// import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const OAuth2RedirectHandler: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    // const { user } = useAuth();

    useEffect(() => {
        const handleOAuth2Redirect = async () => {
            const token = searchParams.get('token');
            const error = searchParams.get('error');

            if (error) {
                console.error('OAuth2 Error:', error);
                navigate('/login', { state: { error: 'Ошибка авторизации через внешний сервис' } });
                return;
            }

            if (token) {
                try {
                    localStorage.setItem('accessToken', token);

                    // Получаем данные пользователя
                    await axios.get('/api/auth/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    // Устанавливаем заголовок авторизации по умолчанию
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    navigate('/');
                } catch (err) {
                    console.error('Failed to fetch user after OAuth2:', err);
                    localStorage.removeItem('accessToken');
                    navigate('/login', { state: { error: 'Не удалось завершить авторизацию' } });
                }
            } else {
                navigate('/login', { state: { error: 'Отсутствует токен авторизации' } });
            }
        };

        handleOAuth2Redirect();
    }, [searchParams, navigate]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            gap={2}
        >
            <CircularProgress sx={{ color: '#ff4444' }} />
            <Alert severity="info" sx={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
                Завершаем авторизацию...
            </Alert>
        </Box>
    );
};

export default OAuth2RedirectHandler;