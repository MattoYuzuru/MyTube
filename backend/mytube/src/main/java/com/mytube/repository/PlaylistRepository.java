package com.mytube.repository;

import com.mytube.entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, UUID> {

    @Query("SELECT p FROM Playlist p WHERE p.channel.id = :channelId ORDER BY p.createdAt DESC")
    List<Playlist> findByChannelIdOrderByCreatedAtDesc(@Param("channelId") UUID channelId);

    long countByChannelId(UUID channelId);
}
