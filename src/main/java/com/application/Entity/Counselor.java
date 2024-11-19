package com.application.Entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "counselors")  // 테이블 이름
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Counselor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email; // 상담사의 이메일 (고유값)

    @Column(nullable = false)
    private String password; // 상담사의 비밀번호

    @Column(nullable = false, length = 100)
    private String name; // 상담사의 이름

    @Column(name = "phone_number", length = 20)
    private String phoneNumber; // 전화번호

    @Column(columnDefinition = "TEXT")
    private String token; // 인증 토큰

    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt; // 생성 시간

    @Column(name = "updated_at")
    private Timestamp updatedAt; // 수정 시간

    @Column(name = "last_login_at")
    private Timestamp lastLoginAt; // 마지막 로그인 시간

    // 다대다 관계 설정 (내담자와의 관계)
    @ManyToMany
    @JoinTable(
            name = "counselor_clients", // 상담사-내담자 연결 테이블
            joinColumns = @JoinColumn(name = "counselor_id"),
            inverseJoinColumns = @JoinColumn(name = "client_id")
    )
    private Set<Client> clients = new HashSet<>(); // 상담사와 연결된 내담자들

    // 생성 시간 설정
    @PrePersist
    protected void onCreate() {
        this.createdAt = new Timestamp(System.currentTimeMillis());
        this.updatedAt = this.createdAt;
    }

    // 수정 시간 설정
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = new Timestamp(System.currentTimeMillis());
    }

    // 내담자 관리 메서드
    public void addClient(Client client) {
        this.clients.add(client);
        client.getCounselors().add(this); // 양방향 관계 설정
    }

    public void removeClient(Client client) {
        this.clients.remove(client);
        client.getCounselors().remove(this); // 양방향 관계 해제
    }
}
