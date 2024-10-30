package com.application.Repository;

import com.application.Entity.EmotionAnalysisReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmotionAnalysisReportRepository extends JpaRepository<EmotionAnalysisReport, Long> {
}
