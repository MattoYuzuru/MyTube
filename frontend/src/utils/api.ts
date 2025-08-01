import axios from 'axios';

// Создаем экземпляр axios с базовой конфигурацией
export const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Интерцептор для добавления токена к запросам
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Интерцептор для обработки ответов
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await axios.post('/api/auth/refresh', {
                        refreshToken: refreshToken
                    });

                    const {accessToken} = response.data;
                    localStorage.setItem('accessToken', accessToken);

                    // Повторяем оригинальный запрос с новым токеном
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    // Если обновление токена не удалось, очищаем storage и перенаправляем на логин
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            } else {
                // Нет refresh токена, перенаправляем на логин
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

// API методы для аутентификации
export const authAPI = {
    login: (emailOrUsername: string, password: string) =>
        api.post('/api/auth/login', {emailOrUsername, password}),

    register: (userData: any) =>
        api.post('/api/auth/register', userData),

    getCurrentUser: () =>
        api.get('/api/auth/me'),

    refreshToken: (refreshToken: string) =>
        api.post('/api/auth/refresh', {refreshToken}),

    logout: () =>
        api.post('/api/auth/logout'),
};

// API методы для работы с видео
export const videoAPI = {
    getTrending: () =>
        api.get('/api/videos/trending'),

    getVideo: (id: string) =>
        api.get(`/api/videos/${id}`),

    search: (query: string, page: number = 0, size: number = 20) =>
        api.get('/api/videos/search', {params: {query, page, size}}),

    uploadVideo: (formData: FormData) =>
        api.post('/api/videos/upload', formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        }),

    updateVideo: (id: string, data: any) =>
        api.put(`/api/videos/${id}`, data),

    deleteVideo: (id: string) =>
        api.delete(`/api/videos/${id}`),

    likeVideo: (id: string) =>
        api.post(`/api/videos/${id}/like`),

    dislikeVideo: (id: string) =>
        api.post(`/api/videos/${id}/dislike`),
};

// API методы для работы с пользователями
export const userAPI = {
    getProfile: () =>
        api.get('/api/users/profile'),

    updateProfile: (data: any) =>
        api.put('/api/users/profile', data),

    getProfileStats: () =>
        api.get('/api/users/profile/stats'),

    getUserVideos: (page: number = 0, size: number = 20) =>
        api.get('/api/users/videos', {params: {page, size}}),

    uploadAvatar: (formData: FormData) =>
        api.post('/api/users/avatar', formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        }),
};

// API методы для работы с каналами
export const channelAPI = {
    getChannel: (id: string) =>
        api.get(`/api/channels/${id}`),

    subscribe: (channelId: string) =>
        api.post(`/api/channels/${channelId}/subscribe`),

    unsubscribe: (channelId: string) =>
        api.delete(`/api/channels/${channelId}/subscribe`),

    getSubscriptions: () =>
        api.get('/api/channels/subscriptions'),

    createChannel: (data: any) =>
        api.post('/api/channels', data),

    updateChannel: (id: string, data: any) =>
        api.put(`/api/channels/${id}`, data),
};

// API методы для работы с комментариями
export const commentAPI = {
    getComments: (videoId: string, page: number = 0, size: number = 20) =>
        api.get(`/api/videos/${videoId}/comments`, {params: {page, size}}),

    addComment: (videoId: string, content: string) =>
        api.post(`/api/videos/${videoId}/comments`, {content}),

    updateComment: (commentId: string, content: string) =>
        api.put(`/api/comments/${commentId}`, {content}),

    deleteComment: (commentId: string) =>
        api.delete(`/api/comments/${commentId}`),

    likeComment: (commentId: string) =>
        api.post(`/api/comments/${commentId}/like`),

    dislikeComment: (commentId: string) =>
        api.post(`/api/comments/${commentId}/dislike`),
};

export default api;