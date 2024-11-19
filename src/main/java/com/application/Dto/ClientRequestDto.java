package com.application.Dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Data
public class ClientRequestDto {
    private String registrationStatus;
    private String name;
    private String contactNumber;
    private String gender;
    private int age;
    private String registrationDate;

    private String counselingTopics; // 문자열로 받아옴

    @JsonIgnore
    public List<String> getTopicList() {
        return counselingTopics != null
                ? Arrays.asList(counselingTopics.split(","))
                : Collections.emptyList();
    }
}

