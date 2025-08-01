import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { Refresh, Home } from '@mui/icons-material';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReload = () => {
        window.location.reload();
    };

    private handleGoHome = () => {
        window.location.href = '/';
    };

    public render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh',
                        p: 3,
                        textAlign: 'center',
                        backgroundColor: '#0f0f0f'
                    }}
                >
                    <Alert
                        severity="error"
                        sx={{
                            mb: 3,
                            backgroundColor: '#2a2a2a',
                            border: '1px solid #444',
                            maxWidth: 600
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Что-то пошло не так
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Произошла неожиданная ошибка. Пожалуйста, перезагрузите страницу или вернитесь на главную.
                        </Typography>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <Box sx={{ mt: 2, p: 2, backgroundColor: '#1a1a1a', borderRadius: 1 }}>
                                <Typography variant="caption" component="pre" sx={{ textAlign: 'left' }}>
                                    {this.state.error.message}
                                </Typography>
                            </Box>
                        )}
                    </Alert>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<Refresh />}
                            onClick={this.handleReload}
                            sx={{
                                bgcolor: '#ff4444',
                                '&:hover': { bgcolor: '#ff6b6b' }
                            }}
                        >
                            Перезагрузить
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<Home />}
                            onClick={this.handleGoHome}
                            sx={{
                                borderColor: '#ff4444',
                                color: '#ff4444',
                                '&:hover': { borderColor: '#ff6b6b' }
                            }}
                        >
                            На главную
                        </Button>
                    </Box>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;