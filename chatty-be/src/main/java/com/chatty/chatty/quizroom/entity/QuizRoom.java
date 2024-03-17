package com.chatty.chatty.quizroom.entity;

import com.chatty.chatty.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
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
    private Integer numOfQuiz;

    @Column(nullable = false)
    private Integer timeLimit;

    @Column(nullable = false)
    private Integer playerNum;

    @Column(nullable = false)
    private Integer playerLimitNum;

    @Column(length = 10)
    private String code;

    @Column(nullable = false)
    private String link;

    @Column(nullable = false)
    private Status status;

    @PrePersist
    public void setDefaultColumns() {
        this.playerNum = this.playerNum == null ? 1 : this.playerNum;
        this.status = this.status == null ? Status.READY : this.status;
    }
}
