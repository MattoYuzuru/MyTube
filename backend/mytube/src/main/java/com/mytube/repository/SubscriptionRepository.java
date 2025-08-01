package com.mytube.repository;

import com.mytube.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    boolean existsBySubscriberIdAndChannelId(UUID subscriberId, UUID channelId);

    Optional<Subscription> findBySubscriberIdAndChannelId(UUID subscriberId, UUID channelId);

    long countByChannelId(UUID channelId);

    long countBySubscriberId(UUID subscriberId);
}