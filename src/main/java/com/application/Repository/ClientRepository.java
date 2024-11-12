package com.application.Repository;

import com.application.Entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByCounselors_Id(Long counselorId);  // 메서드 이름을 findByCounselors_Id로 수정하여 @ManyToMany 관계를 반영
}
