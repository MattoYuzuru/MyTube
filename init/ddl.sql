-- MyTube Database Schema

-- Создание расширений для uuid
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Енамы
CREATE TYPE user_sex AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE user_role AS ENUM ('USER', 'MODERATOR', 'ADMIN');
CREATE TYPE video_status AS ENUM ('PROCESSING', 'READY', 'FAILED', 'DELETED');
CREATE TYPE video_visibility AS ENUM ('PUBLIC', 'UNLISTED', 'PRIVATE');
CREATE TYPE report_status AS ENUM ('PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED');
CREATE TYPE report_type AS ENUM ('SPAM', 'HARASSMENT', 'INAPPROPRIATE_CONTENT', 'COPYRIGHT', 'OTHER');

-- Таблица юзеров
CREATE TABLE users
(
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email             VARCHAR(255) UNIQUE NOT NULL,
    username          VARCHAR(50) UNIQUE  NOT NULL,
    first_name        VARCHAR(100)        NOT NULL,
    last_name         VARCHAR(100)        NOT NULL,
    password_hash     VARCHAR(255), -- Может быть нулом для oauth пользователей
    birth_date        DATE,
    sex               user_sex,
    phone_number      VARCHAR(20),
    avatar_url        VARCHAR(500),
    banner_url        VARCHAR(500),
    is_email_verified BOOLEAN          DEFAULT FALSE,
    role              user_role        DEFAULT 'USER',
    created_at        TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    last_login_at     TIMESTAMP,
    is_active         BOOLEAN          DEFAULT TRUE
);

-- Таблица oauth провайдеров
CREATE TABLE oauth_providers
(
    id               BIGSERIAL PRIMARY KEY,
    user_id          UUID         NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    provider         VARCHAR(50)  NOT NULL, -- google, github пока только они
    provider_user_id VARCHAR(255) NOT NULL,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (provider, provider_user_id)
);

-- Таблица каналов (по сути расширение юзера)
CREATE TABLE channels
(
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id          UUID         NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    channel_name     VARCHAR(100) NOT NULL,
    description      TEXT,
    subscriber_count BIGINT           DEFAULT 0,
    video_count      BIGINT           DEFAULT 0,
    view_count       BIGINT           DEFAULT 0,
    created_at       TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP        DEFAULT CURRENT_TIMESTAMP
);

-- Таблица подписок
CREATE TABLE subscriptions
(
    id            BIGSERIAL PRIMARY KEY,
    subscriber_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    channel_id    UUID NOT NULL REFERENCES channels (id) ON DELETE CASCADE,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (subscriber_id, channel_id)
);

-- Таблица видео
CREATE TABLE videos
(
    id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id         UUID         NOT NULL REFERENCES channels (id) ON DELETE CASCADE,
    title              VARCHAR(255) NOT NULL,
    description        TEXT,
    duration_seconds   INTEGER,
    file_path          VARCHAR(500),
    thumbnail_url      VARCHAR(500),
    dash_playlist_path VARCHAR(500),
    status             video_status     DEFAULT 'PROCESSING',
    visibility         video_visibility DEFAULT 'PUBLIC',
    view_count         BIGINT           DEFAULT 0,
    like_count         BIGINT           DEFAULT 0,
    dislike_count      BIGINT           DEFAULT 0,
    comment_count      BIGINT           DEFAULT 0,
    comments_enabled   BOOLEAN          DEFAULT TRUE,
    upload_date        TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    published_at       TIMESTAMP,
    updated_at         TIMESTAMP        DEFAULT CURRENT_TIMESTAMP
);

-- Таблица тегов
CREATE TABLE tags
(
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Связь видео и тегов
CREATE TABLE video_tags
(
    video_id UUID REFERENCES videos (id) ON DELETE CASCADE,
    tag_id   BIGINT REFERENCES tags (id) ON DELETE CASCADE,
    PRIMARY KEY (video_id, tag_id)
);

-- Таблица плейлистов
CREATE TABLE playlists
(
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id  UUID         NOT NULL REFERENCES channels (id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    visibility  video_visibility DEFAULT 'PUBLIC',
    video_count INTEGER          DEFAULT 0,
    created_at  TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP        DEFAULT CURRENT_TIMESTAMP
);

-- Связь плейлист-видео
CREATE TABLE playlist_videos
(
    id          BIGSERIAL PRIMARY KEY,
    playlist_id UUID    NOT NULL REFERENCES playlists (id) ON DELETE CASCADE,
    video_id    UUID    NOT NULL REFERENCES videos (id) ON DELETE CASCADE,
    position    INTEGER NOT NULL,
    added_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (playlist_id, video_id)
);

-- Таблица комментариев
CREATE TABLE comments
(
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id          UUID NOT NULL REFERENCES videos (id) ON DELETE CASCADE,
    user_id           UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES comments (id) ON DELETE CASCADE,
    content           TEXT NOT NULL,
    like_count        BIGINT           DEFAULT 0,
    dislike_count     BIGINT           DEFAULT 0,
    is_pinned         BOOLEAN          DEFAULT FALSE,
    created_at        TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    CHECK (parent_comment_id IS NULL OR parent_comment_id != id)
);

-- Таблица лайков/дизлайков видео
CREATE TABLE video_reactions
(
    id         BIGSERIAL PRIMARY KEY,
    user_id    UUID    NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    video_id   UUID    NOT NULL REFERENCES videos (id) ON DELETE CASCADE,
    is_like    BOOLEAN NOT NULL, -- true = like, false = dislike
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, video_id)
);

-- Таблица лайков/дизлайков комментариев
CREATE TABLE comment_reactions
(
    id         BIGSERIAL PRIMARY KEY,
    user_id    UUID    NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    comment_id UUID    NOT NULL REFERENCES comments (id) ON DELETE CASCADE,
    is_like    BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, comment_id)
);

-- Таблица жалоб
CREATE TABLE reports
(
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id         UUID        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    reported_video_id   UUID REFERENCES videos (id) ON DELETE CASCADE,
    reported_comment_id UUID REFERENCES comments (id) ON DELETE CASCADE,
    reported_user_id    UUID REFERENCES users (id) ON DELETE CASCADE,
    type                report_type NOT NULL,
    reason              TEXT        NOT NULL,
    status              report_status    DEFAULT 'PENDING',
    reviewed_by         UUID        REFERENCES users (id) ON DELETE SET NULL,
    reviewed_at         TIMESTAMP,
    created_at          TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (reported_video_id IS NOT NULL AND reported_comment_id IS NULL AND reported_user_id IS NULL) OR
        (reported_video_id IS NULL AND reported_comment_id IS NOT NULL AND reported_user_id IS NULL) OR
        (reported_video_id IS NULL AND reported_comment_id IS NULL AND reported_user_id IS NOT NULL)
        )
);

-- Таблица модераторов каналов
CREATE TABLE channel_moderators
(
    id         BIGSERIAL PRIMARY KEY,
    channel_id UUID NOT NULL REFERENCES channels (id) ON DELETE CASCADE,
    user_id    UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    granted_by UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (channel_id, user_id)
);

-- Аналитика: просмотры видео (и детальная статистика)
CREATE TABLE video_views
(
    id                 BIGSERIAL PRIMARY KEY,
    video_id           UUID NOT NULL REFERENCES videos (id) ON DELETE CASCADE,
    user_id            UUID REFERENCES users (id) ON DELETE SET NULL, -- NULL для анонимных
    ip_address         INET,
    user_agent         TEXT,
    watch_time_seconds INTEGER   DEFAULT 0,
    viewed_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_id         VARCHAR(100)
);

-- Аналитика: агрегированная статистика по дням
CREATE TABLE daily_video_stats
(
    id                 BIGSERIAL PRIMARY KEY,
    video_id           UUID NOT NULL REFERENCES videos (id) ON DELETE CASCADE,
    date               DATE NOT NULL,
    view_count         BIGINT           DEFAULT 0,
    unique_viewers     BIGINT           DEFAULT 0,
    average_watch_time DOUBLE PRECISION DEFAULT 0,
    like_count         BIGINT           DEFAULT 0,
    dislike_count      BIGINT           DEFAULT 0,
    comment_count      BIGINT           DEFAULT 0,
    UNIQUE (video_id, date)
);

-- Аналитика каналов: агрегированная статистика по дням
CREATE TABLE daily_channel_stats
(
    id               BIGSERIAL PRIMARY KEY,
    channel_id       UUID NOT NULL REFERENCES channels (id) ON DELETE CASCADE,
    date             DATE NOT NULL,
    subscriber_count BIGINT DEFAULT 0,
    new_subscribers  BIGINT DEFAULT 0,
    total_views      BIGINT DEFAULT 0,
    total_watch_time BIGINT DEFAULT 0,
    video_count      BIGINT DEFAULT 0,
    UNIQUE (channel_id, date)
);

-- История загрузок видео (для обработки)
CREATE TABLE video_processing_logs
(
    id         BIGSERIAL PRIMARY KEY,
    video_id   UUID        NOT NULL REFERENCES videos (id) ON DELETE CASCADE,
    stage      VARCHAR(50) NOT NULL, -- UPLOAD, VALIDATION, ENCODING, THUMBNAIL, DASH
    status     VARCHAR(20) NOT NULL, -- STARTED, SUCCESS, FAILED
    message    TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_username ON users (username);
CREATE INDEX idx_users_created_at ON users (created_at);
CREATE INDEX idx_oauth_provider_user ON oauth_providers (provider, provider_user_id);

CREATE INDEX idx_channels_user_id ON channels (user_id);
CREATE INDEX idx_subscriptions_subscriber ON subscriptions (subscriber_id);
CREATE INDEX idx_subscriptions_channel ON subscriptions (channel_id);

CREATE INDEX idx_videos_channel_id ON videos (channel_id);
CREATE INDEX idx_videos_status ON videos (status);
CREATE INDEX idx_videos_visibility ON videos (visibility);
CREATE INDEX idx_videos_published_at ON videos (published_at);
CREATE INDEX idx_videos_view_count ON videos (view_count);

CREATE INDEX idx_comments_video_id ON comments (video_id);
CREATE INDEX idx_comments_user_id ON comments (user_id);
CREATE INDEX idx_comments_parent_id ON comments (parent_comment_id);
CREATE INDEX idx_comments_created_at ON comments (created_at);

CREATE INDEX idx_video_views_video_id ON video_views (video_id);
CREATE INDEX idx_video_views_viewed_at ON video_views (viewed_at);
CREATE INDEX idx_video_views_user_id ON video_views (user_id);

CREATE INDEX idx_daily_video_stats_video_date ON daily_video_stats (video_id, date);
CREATE INDEX idx_daily_channel_stats_channel_date ON daily_channel_stats (channel_id, date);

-- Триггеры для автоматического обновления счетчиков
CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE
    ON users
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_channels_updated_at
    BEFORE UPDATE
    ON channels
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at
    BEFORE UPDATE
    ON videos
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playlists_updated_at
    BEFORE UPDATE
    ON playlists
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE
    ON comments
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Функция для создания канала при регистрации пользователя
CREATE OR REPLACE FUNCTION create_channel_for_user()
    RETURNS TRIGGER AS
$$
BEGIN
    INSERT INTO channels (user_id, channel_name, description)
    VALUES (NEW.id, NEW.username, 'Добро пожаловать на мой канал!');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_channel_after_user_creation
    AFTER INSERT
    ON users
    FOR EACH ROW
EXECUTE FUNCTION create_channel_for_user();

-- Добавляем тестового администратора (пароль: admin123)
INSERT INTO users (email, username, first_name, last_name, password_hash, role, is_email_verified, is_active)
VALUES ('admin@mytube.com', 'admin', 'Admin', 'User', '$2a$10$rLFnQz8kDrB7mCOz7EYBj.5V9Zb7V1YZ8GYE3k4L2mVwN6YmZ8vYu',
        'ADMIN', true, true);