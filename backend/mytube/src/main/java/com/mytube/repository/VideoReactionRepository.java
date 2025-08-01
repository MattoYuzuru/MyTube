package com.mytube.repository;

import com.mytube.entity.VideoReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface VideoReactionRepository extends JpaRepository<VideoReaction, Long> {

    Optional<VideoReaction> findByUserIdAndVideoId(UUID userId, UUID videoId);

    boolean existsByUserIdAndVideoId(UUID userId, UUID videoId);
}