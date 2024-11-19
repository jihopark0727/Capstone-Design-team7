package com.application.Repository;

import com.application.Entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {

    // 특정 상담사 ID로 배정된 내담자 조회
    @Query("SELECT c FROM Client c JOIN c.counselors co WHERE co.id = :counselorId")
    List<Client> findByCounselorsId(@Param("counselorId") Long counselorId);

    // 특정 상담 주제 ID로 내담자 조회
    @Query("SELECT c FROM Client c JOIN c.counselingTopics ct WHERE ct.id = :topicId")
    List<Client> findByCounselingTopicsId(@Param("topicId") Long topicId);

    // 특정 상담사에게 배정된 특정 내담자 조회
    @Query("SELECT c FROM Client c JOIN c.counselors co WHERE c.id = :clientId AND co.id = :counselorId")
    Client findByIdAndCounselorId(@Param("clientId") Long clientId, @Param("counselorId") Long counselorId);
}
