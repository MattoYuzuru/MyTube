package com.mytube.repository;

import com.mytube.entity.VideoView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface VideoViewRepository extends JpaRepository<VideoView, Long> {

    @Query("SELECT COUNT(DISTINCT vv.sessionId) FROM VideoView vv WHERE vv.video.id = :videoId")
    long countUniqueViewsByVideoId(@Param("videoId") UUID videoId);

    @Query("SELECT AVG(vv.watchTimeSeconds) FROM VideoView vv WHERE vv.video.id = :videoId")
    Double getAverageWatchTimeByVideoId(@Param("videoId") UUID videoId);
}