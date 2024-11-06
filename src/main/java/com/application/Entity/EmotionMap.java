package com.application.Entity;

import lombok.*;
import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "emotion_maps")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
// AllArgs, Builder 모두 사용하시는 건가요? 필요한 것만 선언하는 게 어떨까 싶네요. static 메서드 패턴도 시간이 되실 때 보면 좋을거 같아요
public class EmotionMap {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "client_id")
    private Client client;

    private String dominantEmotion;
    private String keywordSummary;
    private String analysisSummary;

    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt;
}
