package com.mytube.repository;

import com.mytube.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {

    @Query("SELECT c FROM Comment c WHERE c.video.id = :videoId AND c.parentComment IS NULL ORDER BY c.createdAt DESC")
    List<Comment> findRootCommentsByVideoIdOrderByCreatedAtDesc(@Param("videoId") UUID videoId);

    @Query("SELECT c FROM Comment c WHERE c.parentComment.id = :parentId ORDER BY c.createdAt ASC")
    List<Comment> findRepliesByParentIdOrderByCreatedAtAsc(@Param("parentId") UUID parentId);

    long countByVideoId(UUID videoId);

    long countByParentCommentId(UUID parentCommentId);
}