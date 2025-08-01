package com.mytube.repository;

import com.mytube.entity.Channel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChannelRepository extends JpaRepository<Channel, UUID> {

    Optional<Channel> findByUserId(UUID userId);

    @Query("SELECT c FROM Channel c WHERE c.user.username = :username")
    Optional<Channel> findByUserUsername(@Param("username") String username);
}