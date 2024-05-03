package com.chatty.chatty.quizroom.entity;

import com.chatty.chatty.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(of = "id", callSuper = false)
@Table(name = "quiz_rooms")
public class QuizRoom extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Long id;

    @Column(length = 20, nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Integer numOfQuiz;

    @Column(nullable = false)
    @Builder.Default
    private Integer playerNum = 1;

    @Column(nullable = false)
    private Integer playerLimitNum;

    @Column(length = 10)
    private String code;

    @Column(nullable = false)
    @Builder.Default
    private Status status = Status.READY;

    @Column
    private String quizDocId;

    public void setQuizDocId(String id) {
        this.quizDocId = id;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public void setPlayerNum(Integer playerNum) {
        this.playerNum = playerNum;
    }
}
