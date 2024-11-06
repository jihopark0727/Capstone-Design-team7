package com.application.Entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.sql.Timestamp;
import java.util.Date;

@Entity
@Table(name = "clients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column
    private int age;

    @Column(length = 10)
    private String gender;
	// gender는 enum으로 선언하시는 게 어떨까요?

    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date registrationDate = new Date();

    @Column(name = "registration_status", length = 50, nullable = false)
    private String registrationStatus = "unassigned";

    @ManyToOne
    @JoinColumn(name = "emotion_map_id", referencedColumnName = "id")
    private EmotionMap emotionMap;

    @Column(updatable = false)
    private Timestamp createdAt;

    @Column
    private Timestamp updatedAt;

    // 자동으로 생성 시간과 수정 시간을 설정
    @PrePersist
    protected void onCreate() {
        this.createdAt = new Timestamp(System.currentTimeMillis());
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = new Timestamp(System.currentTimeMillis());
    }
}
