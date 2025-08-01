package com.mytube.repository;

import com.mytube.entity.Video;
import com.mytube.entity.enums.VideoStatus;
import com.mytube.entity.enums.VideoVisibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VideoRepository extends JpaRepository<Video, UUID> {

    @Query("SELECT v FROM Video v WHERE v.channel.id = :channelId ORDER BY v.publishedAt DESC")
    List<Video> findByChannelIdOrderByPublishedAtDesc(@Param("channelId") UUID channelId);

    @Query("SELECT v FROM Video v WHERE v.visibility = 'PUBLIC' AND v.status = 'READY' ORDER BY v.publishedAt DESC")
    List<Video> findPublicVideosOrderByPublishedAtDesc();

    long countByChannelId(UUID channelId);

    long countByVisibility(VideoVisibility visibility);

    long countByStatus(VideoStatus status);

    Optional<Video> findTopByChannelIdOrderByPublishedAtDesc(UUID channelId);
}
