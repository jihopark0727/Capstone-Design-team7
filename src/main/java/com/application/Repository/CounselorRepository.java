package com.application.Repository;

import com.application.Entity.Counselor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CounselorRepository extends JpaRepository<Counselor, Long> {
    boolean existsByEmail(String email);
    Counselor findByEmail(String email);
}
