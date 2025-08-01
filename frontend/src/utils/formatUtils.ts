// Форматирование чисел
export const formatNumber = (num: number): string => {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};

// Форматирование количества просмотров
export const formatViewCount = (count: number): string => {
    if (count === 1) return '1 просмотр';
    if (count < 5) return `${count} просмотра`;
    return `${formatNumber(count)} просмотров`;
};

// Форматирование количества подписчиков
export const formatSubscriberCount = (count: number): string => {
    if (count === 1) return '1 подписчик';
    if (count < 5) return `${count} подписчика`;
    return `${formatNumber(count)} подписчиков`;
};

// Форматирование длительности видео
export const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Форматирование времени с момента публикации
export const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.ceil(diffDays / 7);
    const diffMonths = Math.ceil(diffDays / 30);
    const diffYears = Math.ceil(diffDays / 365);

    if (diffMinutes < 60) {
        if (diffMinutes === 1) return 'минуту назад';
        if (diffMinutes < 5) return `${diffMinutes} минуты назад`;
        return `${diffMinutes} минут назад`;
    }

    if (diffHours < 24) {
        if (diffHours === 1) return 'час назад';
        if (diffHours < 5) return `${diffHours} часа назад`;
        return `${diffHours} часов назад`;
    }

    if (diffDays === 1) return 'вчера';
    if (diffDays < 7) {
        if (diffDays < 5) return `${diffDays} дня назад`;
        return `${diffDays} дней назад`;
    }

    if (diffWeeks === 1) return 'неделю назад';
    if (diffWeeks < 4) {
        if (diffWeeks < 5) return `${diffWeeks} недели назад`;
        return `${diffWeeks} недель назад`;
    }

    if (diffMonths === 1) return 'месяц назад';
    if (diffMonths < 12) {
        if (diffMonths < 5) return `${diffMonths} месяца назад`;
        return `${diffMonths} месяцев назад`;
    }

    if (diffYears === 1) return 'год назад';
    if (diffYears < 5) return `${diffYears} года назад`;
    return `${diffYears} лет назад`;
};

// Форматирование размера файла
export const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
};

// Форматирование даты
export const formatDate = (dateString: string, format: 'short' | 'long' | 'datetime' = 'long'): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {};

    switch (format) {
        case 'short':
            options.day = '2-digit';
            options.month = '2-digit';
            options.year = 'numeric';
            break;
        case 'long':
            options.day = 'numeric';
            options.month = 'long';
            options.year = 'numeric';
            break;
        case 'datetime':
            options.day = '2-digit';
            options.month = '2-digit';
            options.year = 'numeric';
            options.hour = '2-digit';
            options.minute = '2-digit';
            break;
    }

    return date.toLocaleDateString('ru-RU', options);
};

// Обрезка текста с многоточием
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
};

// Создание слага из строки
export const createSlug = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // удаляем специальные символы
        .replace(/[\s_-]+/g, '-') // заменяем пробелы и подчеркивания на дефисы
        .replace(/^-+|-+$/g, ''); // удаляем дефисы в начале и конце
};

// Валидация email
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Валидация пароля
export const isValidPassword = (password: string): boolean => {
    return password.length >= 6;
};

// Валидация имени пользователя
export const isValidUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
    return usernameRegex.test(username);
};

// Получение инициалов из имени
export const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

// Генерация случайного цвета для аватара
export const generateAvatarColor = (seed: string): string => {
    const colors = [
        '#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff', '#44ffff',
        '#ff8844', '#88ff44', '#4488ff', '#ff4488', '#88ff88', '#8844ff'
    ];

    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
};

// Проверка поддерживаемого формата файла
export const isValidFileFormat = (fileName: string, allowedFormats: string[]): boolean => {
    const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    return allowedFormats.includes(extension);
};

// Получение расширения файла
export const getFileExtension = (fileName: string): string => {
    return fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
};

// Проверка размера файла
export const isValidFileSize = (fileSize: number, maxSize: number): boolean => {
    return fileSize <= maxSize;
};

export default {
    formatNumber,
    formatViewCount,
    formatSubscriberCount,
    formatDuration,
    formatTimeAgo,
    formatFileSize,
    formatDate,
    truncateText,
    createSlug,
    isValidEmail,
    isValidPassword,
    isValidUsername,
    getInitials,
    generateAvatarColor,
    isValidFileFormat,
    getFileExtension,
    isValidFileSize,
};