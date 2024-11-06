package com.application.Entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "counselors")  // 데이터베이스 테이블 이름에 맞춰 수정
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Counselor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;
	// 이메일 길이 제한은 없나요?

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;
	// JPA에서 camelcase to underscore로 매핑하는 옵션을 제공해요
	// Hibernate 단에서 지원하는 옵션도 있고, Spring Data JPA 단에서 제공하는 옵션도 있어서 원하는 것을 선택하시면 될 거 같아요

    @Column(columnDefinition = "TEXT")
    private String token;
	// 항상 Column 어노테이션으로만 필드 매핑을 하는 것보다 상황에 맞는 어노테이션을 적용하는 게 좋을 거 같아요
	// Lob, Temporal, Enumerated 등등
	// 음? 그런데 다른 코드에서는 또 잘 사용하신거 같은데, 혹시 요거 페어 코딩중이라 각자 코드 스타일이 다른 건가요?

    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt;
	// 궁금한게 혹시 JPA DDL 자동 생성 기능 설정하는 곳이 안 보이는데, none 옵션으로 두고 하시는 건가요?
	// validate 모드도 사용해보시는 건 어떠신가요?

    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "last_login_at")
    private Timestamp lastLoginAt;

    // 자동 생성 시간 설정
    @PrePersist
    protected void onCreate() {
        this.createdAt = new Timestamp(System.currentTimeMillis());
        this.updatedAt = this.createdAt;
    }

    // 업데이트 시간 자동 갱신
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = new Timestamp(System.currentTimeMillis());
    }
}
