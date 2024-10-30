package com.application.Entity;

import lombok.*;
import jakarta.persistence.*;
import java.sql.Timestamp;
import java.util.Set; // Set 임포트 추가
import com.application.Entity.SessionRecording; // 다른 패키지에 있을 경우 임포트 필요
import com.application.Entity.EmotionAnalysisReport;

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
}
