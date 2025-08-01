import React, {useState, useEffect} from 'react';
import {
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Avatar,
    Box,
    Chip,
    CircularProgress,
    Alert
} from '@mui/material';
import {PlayArrow, Visibility, ThumbUp} from '@mui/icons-material';
import axios from 'axios';

interface Video {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    viewCount: number;
    likeCount: number;
    duration: string;
    uploadDate: string;
    channel: {
        id: string;
        channelName: string;
        avatarUrl?: string;
        subscriberCount: number;
    };
    tags: string[];
}

const HomePage: React.FC = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get('/api/videos/trending');
                setVideos(response.data);
            } catch (err: any) {
                console.error('Failed to fetch videos:', err);
                setError('Не удалось загрузить видео');
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    const formatViewCount = (count: number): string => {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count.toString();
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'вчера';
        if (diffDays < 7) return `${diffDays} дней назад`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} недель назад`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} месяцев назад`;
        return `${Math.floor(diffDays / 365)} лет назад`;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress sx={{color: '#ff4444'}}/>
            </Box>
        );
    }

    if (error) {
        return (
            <Container sx={{mt: 4}}>
                <Alert severity="error" sx={{backgroundColor: '#2a2a2a', border: '1px solid #444'}}>
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{mt: 3, mb: 4}}>
            <Typography variant="h5" sx={{mb: 3, fontWeight: 'bold'}}>
                В тренде
            </Typography>

            <Grid container spacing={3}>
                {videos.map((video) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
                        <Card
                            sx={{
                                backgroundColor: '#1a1a1a',
                                border: '1px solid #333',
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    borderColor: '#ff4444'
                                }
                            }}
                        >
                            <Box sx={{position: 'relative'}}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={video.thumbnailUrl || '/placeholder-thumbnail.jpg'}
                                    alt={video.title}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: 8,
                                        right: 8,
                                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                        color: 'white',
                                        padding: '2px 6px',
                                        borderRadius: 1,
                                        fontSize: '12px'
                                    }}
                                >
                                    {video.duration}
                                </Box>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        opacity: 0,
                                        transition: 'opacity 0.2s',
                                        '&:hover': {opacity: 1}
                                    }}
                                >
                                    <PlayArrow sx={{fontSize: 48, color: '#ff4444'}}/>
                                </Box>
                            </Box>

                            <CardContent>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        mb: 1,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {video.title}
                                </Typography>

                                <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                    <Avatar
                                        src={video.channel.avatarUrl}
                                        sx={{width: 24, height: 24, mr: 1}}
                                    >
                                        {video.channel.channelName.charAt(0)}
                                    </Avatar>
                                    <Typography variant="body2" color="text.secondary">
                                        {video.channel.channelName}
                                    </Typography>
                                </Box>

                                <Box sx={{display: 'flex', alignItems: 'center', gap: 2, mb: 1}}>
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                        <Visibility sx={{fontSize: 14, color: 'text.secondary'}}/>
                                        <Typography variant="caption" color="text.secondary">
                                            {formatViewCount(video.viewCount)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                        <ThumbUp sx={{fontSize: 14, color: 'text.secondary'}}/>
                                        <Typography variant="caption" color="text.secondary">
                                            {formatViewCount(video.likeCount)}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Typography variant="caption" color="text.secondary" sx={{mb: 1, display: 'block'}}>
                                    {formatDate(video.uploadDate)}
                                </Typography>

                                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                    {video.tags.slice(0, 3).map((tag, index) => (
                                        <Chip
                                            key={index}
                                            label={tag}
                                            size="small"
                                            sx={{
                                                backgroundColor: '#2a2a2a',
                                                color: '#ff4444',
                                                fontSize: '10px',
                                                height: 20
                                            }}
                                        />
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {videos.length === 0 && !loading && (
                <Box sx={{textAlign: 'center', mt: 8}}>
                    <Typography variant="h6" color="text.secondary">
                        Пока нет видео для показа
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
                        Проверьте позже или загрузите свое первое видео!
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default HomePage;