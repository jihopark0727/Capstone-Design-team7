package com.application.Repository;

import com.application.Entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    // 특정 Client의 모든 세션을 조회
    List<Session> findByClientId(Long clientId);
}
