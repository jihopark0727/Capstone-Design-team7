package com.application.Service;

import com.application.Entity.Counselor;
import com.application.Repository.CounselorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CounselorService {

    @Autowired
    private CounselorRepository counselorRepository;

    public Counselor findCounselorByEmail(String email) {
        return counselorRepository.findByEmail(email);
    }

    // 추가적인 비즈니스 로직 구현
}
