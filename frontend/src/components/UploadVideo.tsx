import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    LinearProgress,
    Alert,
    Chip,
    IconButton,
} from '@mui/material';
import { CloudUpload, Close, Add } from '@mui/icons-material';
import { videoAPI } from '../utils/api';

interface UploadVideoProps {
    open: boolean;
    onClose: () => void;
    onUploadSuccess?: () => void;
}

const UploadVideo: React.FC<UploadVideoProps> = ({ open, onClose, onUploadSuccess }) => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');

    const handleVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 100 * 1024 * 1024) { // 100MB limit
                setError('Размер видео не должен превышать 100MB');
                return;
            }
            setVideoFile(file);
            if (!title) {
                setTitle(file.name.replace(/\.[^/.]+$/, ''));
            }
            setError('');
        }
    };

    const handleThumbnailFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('Размер превью не должен превышать 5MB');
                return;
            }
            setThumbnailFile(file);
            setError('');
        }
    };

    const handleAddTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 10) {
            setTags([...tags, newTag.trim()]);
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async () => {
        if (!videoFile || !title.trim()) {
            setError('Пожалуйста, выберите видео и введите название');
            return;
        }

        setLoading(true);
        setError('');
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('video', videoFile);
        if (thumbnailFile) {
            formData.append('thumbnail', thumbnailFile);
        }
        formData.append('title', title.trim());
        formData.append('description', description.trim());
        formData.append('tags', JSON.stringify(tags));

        try {
            await videoAPI.uploadVideo(formData);

            // Reset form
            setVideoFile(null);
            setThumbnailFile(null);
            setTitle('');
            setDescription('');
            setTags([]);
            setNewTag('');

            onUploadSuccess?.();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Не удалось загрузить видео');
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const handleClose = () => {
        if (!loading) {
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ color: '#ff4444', fontWeight: 'bold' }}>
                    Загрузить видео
                </Typography>
                <IconButton onClick={handleClose} disabled={loading}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {loading && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Загрузка видео... {uploadProgress}%
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={uploadProgress}
                            sx={{
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#ff4444',
                                },
                            }}
                        />
                    </Box>
                )}

                {/* Video Upload */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Видео файл *
                    </Typography>
                    <input
                        accept="video/*"
                        style={{ display: 'none' }}
                        id="video-upload"
                        type="file"
                        onChange={handleVideoFileChange}
                        disabled={loading}
                    />
                    <label htmlFor="video-upload">
                        <Button
                            variant="outlined"
                            component="span"
                            startIcon={<CloudUpload />}
                            disabled={loading}
                            sx={{
                                borderColor: '#ff4444',
                                color: '#ff4444',
                                '&:hover': { borderColor: '#ff6b6b' }
                            }}
                        >
                            {videoFile ? videoFile.name : 'Выбрать видео'}
                        </Button>
                    </label>
                </Box>

                {/* Thumbnail Upload */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Превью (необязательно)
                    </Typography>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="thumbnail-upload"
                        type="file"
                        onChange={handleThumbnailFileChange}
                        disabled={loading}
                    />
                    <label htmlFor="thumbnail-upload">
                        <Button
                            variant="outlined"
                            component="span"
                            startIcon={<CloudUpload />}
                            disabled={loading}
                            sx={{
                                borderColor: '#666',
                                color: 'text.secondary',
                                '&:hover': { borderColor: '#888' }
                            }}
                        >
                            {thumbnailFile ? thumbnailFile.name : 'Выбрать превью'}
                        </Button>
                    </label>
                </Box>

                {/* Title */}
                <TextField
                    fullWidth
                    label="Название *"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                    margin="normal"
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

                {/* Description */}
                <TextField
                    fullWidth
                    label="Описание"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                    margin="normal"
                    multiline
                    rows={3}
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

                {/* Tags */}
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Теги (максимум 10)
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        {tags.map((tag, index) => (
                            <Chip
                                key={index}
                                label={tag}
                                onDelete={() => handleRemoveTag(tag)}
                                disabled={loading}
                                sx={{
                                    backgroundColor: '#2a2a2a',
                                    color: '#ff4444',
                                }}
                            />
                        ))}
                    </Box>
                    {tags.length < 10 && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                size="small"
                                placeholder="Добавить тег"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                disabled={loading}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddTag();
                                    }
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#2a2a2a',
                                    },
                                }}
                            />
                            <Button
                                onClick={handleAddTag}
                                disabled={loading || !newTag.trim()}
                                variant="outlined"
                                size="small"
                                sx={{
                                    borderColor: '#ff4444',
                                    color: '#ff4444',
                                }}
                            >
                                <Add />
                            </Button>
                        </Box>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={handleClose} disabled={loading}>
                    Отмена
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={loading || !videoFile || !title.trim()}
                    variant="contained"
                    sx={{
                        bgcolor: '#ff4444',
                        '&:hover': { bgcolor: '#ff6b6b' },
                        '&:disabled': { bgcolor: '#666' }
                    }}
                >
                    {loading ? 'Загрузка...' : 'Загрузить'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UploadVideo;