// API endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        LOGOUT: '/api/auth/logout',
        REFRESH: '/api/auth/refresh',
        ME: '/api/auth/me',
    },
    VIDEOS: {
        TRENDING: '/api/videos/trending',
        SEARCH: '/api/videos/search',
        UPLOAD: '/api/videos/upload',
        BY_ID: (id: string) => `/api/videos/${id}`,
        LIKE: (id: string) => `/api/videos/${id}/like`,
        DISLIKE: (id: string) => `/api/videos/${id}/dislike`,
        COMMENTS: (id: string) => `/api/videos/${id}/comments`,
    },
    USERS: {
        PROFILE: '/api/users/profile',
        STATS: '/api/users/profile/stats',
        VIDEOS: '/api/users/videos',
        AVATAR: '/api/users/avatar',
    },
    CHANNELS: {
        BY_ID: (id: string) => `/api/channels/${id}`,
        SUBSCRIBE: (id: string) => `/api/channels/${id}/subscribe`,
        SUBSCRIPTIONS: '/api/channels/subscriptions',
        CREATE: '/api/channels',
    },
    COMMENTS: {
        BY_ID: (id: string) => `/api/comments/${id}`,
        LIKE: (id: string) => `/api/comments/${id}/like`,
        DISLIKE: (id: string) => `/api/comments/${id}/dislike`,
    },
};

// File size limits
export const FILE_LIMITS = {
    VIDEO_MAX_SIZE: 100 * 1024 * 1024, // 100MB
    THUMBNAIL_MAX_SIZE: 5 * 1024 * 1024, // 5MB
    AVATAR_MAX_SIZE: 2 * 1024 * 1024, // 2MB
};

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
};

// Video settings
export const VIDEO_SETTINGS = {
    MAX_TITLE_LENGTH: 100,
    MAX_DESCRIPTION_LENGTH: 5000,
    MAX_TAGS_COUNT: 10,
    MAX_TAG_LENGTH: 30,
};

// User settings
export const USER_SETTINGS = {
    MAX_USERNAME_LENGTH: 30,
    MIN_USERNAME_LENGTH: 3,
    MAX_NAME_LENGTH: 50,
    MIN_PASSWORD_LENGTH: 6,
};

// Theme colors
export const THEME_COLORS = {
    PRIMARY: '#ff4444',
    PRIMARY_HOVER: '#ff6b6b',
    BACKGROUND_DARK: '#0f0f0f',
    BACKGROUND_PAPER: '#1a1a1a',
    BACKGROUND_SECONDARY: '#2a2a2a',
    BORDER_COLOR: '#333',
    BORDER_HOVER: '#444',
    TEXT_PRIMARY: '#ffffff',
    TEXT_SECONDARY: '#b3b3b3',
};

// OAuth2 providers
export const OAUTH_PROVIDERS = {
    GOOGLE: 'google',
    GITHUB: 'github',
};

// Video quality options
export const VIDEO_QUALITIES = [
    {label: '144p', value: '144'},
    {label: '240p', value: '240'},
    {label: '360p', value: '360'},
    {label: '480p', value: '480'},
    {label: '720p', value: '720'},
    {label: '1080p', value: '1080'},
];

// Supported file formats
export const SUPPORTED_FORMATS = {
    VIDEO: ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm'],
    IMAGE: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    AUDIO: ['.mp3', '.wav', '.aac', '.ogg'],
};

// Error messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Ошибка сети. Проверьте подключение к интернету.',
    UNAUTHORIZED: 'Необходимо войти в систему.',
    FORBIDDEN: 'У вас нет прав для выполнения этого действия.',
    NOT_FOUND: 'Запрашиваемый ресурс не найден.',
    SERVER_ERROR: 'Внутренняя ошибка сервера. Попробуйте позже.',
    VALIDATION_ERROR: 'Проверьте правильность введенных данных.',
    FILE_TOO_LARGE: 'Размер файла превышает допустимый лимит.',
    INVALID_FILE_FORMAT: 'Неподдерживаемый формат файла.',
    LOGIN_FAILED: 'Неверные учетные данные.',
    REGISTRATION_FAILED: 'Не удалось создать аккаунт.',
    UPLOAD_FAILED: 'Не удалось загрузить файл.',
};

// Success messages
export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Вы успешно вошли в систему.',
    REGISTRATION_SUCCESS: 'Аккаунт успешно создан.',
    UPLOAD_SUCCESS: 'Файл успешно загружен.',
    PROFILE_UPDATED: 'Профиль успешно обновлен.',
    VIDEO_UPLOADED: 'Видео успешно загружено.',
    COMMENT_ADDED: 'Комментарий добавлен.',
    SUBSCRIBED: 'Вы подписались на канал.',
    UNSUBSCRIBED: 'Вы отписались от канала.',
};

// Local storage keys
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER_PREFERENCES: 'userPreferences',
    THEME: 'theme',
    LANGUAGE: 'language',
};

// Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    PROFILE: '/profile',
    OAUTH_REDIRECT: '/oauth2/redirect',
    SEARCH: '/search',
    VIDEO: (id: string) => `/video/${id}`,
    CHANNEL: (id: string) => `/channel/${id}`,
    UPLOAD: '/upload',
    SETTINGS: '/settings',
};

// Regular expressions
export const REGEX = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    USERNAME: /^[a-zA-Z0-9_-]{3,30}$/,
    PASSWORD: /^.{6,}$/,
    PHONE: /^\+?[\d\s-]{10,}$/,
};

// Time formats
export const TIME_FORMATS = {
    SHORT_DATE: 'dd.MM.yyyy',
    LONG_DATE: 'dd MMMM yyyy',
    DATE_TIME: 'dd.MM.yyyy HH:mm',
    TIME_ONLY: 'HH:mm',
};

export default {
    API_ENDPOINTS,
    FILE_LIMITS,
    PAGINATION,
    VIDEO_SETTINGS,
    USER_SETTINGS,
    THEME_COLORS,
    OAUTH_PROVIDERS,
    VIDEO_QUALITIES,
    SUPPORTED_FORMATS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    STORAGE_KEYS,
    ROUTES,
    REGEX,
    TIME_FORMATS,
};