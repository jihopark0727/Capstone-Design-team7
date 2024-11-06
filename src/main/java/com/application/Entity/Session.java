package com.application.Entity;

import lombok.*;
import jakarta.persistence.*;
import java.sql.Timestamp;
import java.util.Set;

@Entity
@Table(name = "sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_number")
    private Integer sessionNumber;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @ManyToOne
    @JoinColumn(name = "counselor_id")
    private Counselor counselor;

    @Column(name = "session_date")
    private Timestamp sessionDate;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<SessionRecording> sessionRecordings;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<EmotionAnalysisReport> emotionAnalysisReports;

	// 연관관계 매핑이 엄청 빡센 엔티티군요.. 요거 N+1 쿼리 이슈 좀 없을 지 검토 필요할 거 같아요
}
