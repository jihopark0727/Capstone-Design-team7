package com.application.Entity;

import lombok.*;
import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "emotion_analysis_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmotionAnalysisReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "session_id")
    private Session session;

    @Column(name = "sentence_number")
    private Integer sentenceNumber;

    @Column(name = "sentence_text", nullable = false)
    private String sentenceText;

    private String dominantEmotion;
    private String keywords;  // Assuming JSON as String
    private String analysisSummary;

    @Column(name = "analyzed_at")
    private Timestamp analyzedAt;
}