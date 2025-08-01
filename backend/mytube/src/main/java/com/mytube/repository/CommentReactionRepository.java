package com.mytube.repository;

import com.mytube.entity.CommentReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CommentReactionRepository extends JpaRepository<CommentReaction, Long> {

    Optional<CommentReaction> findByUserIdAndCommentId(UUID userId, UUID commentId);

    boolean existsByUserIdAndCommentId(UUID userId, UUID commentId);
}