package com.chatty.chatty.player.entity;

import com.chatty.chatty.common.entity.BaseEntity;
import com.chatty.chatty.quizroom.entity.QuizRoom;
import com.chatty.chatty.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
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
@Table(name = "players")
public class Player extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "player_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private QuizRoom quizRoom;

    @Column(unique = true, length = 10, nullable = false)
    private String nickname;

    @Column(nullable = false)
    private Integer timeTaken;

    @PrePersist
    public void setDefaultColumns() {
        this.timeTaken = this.timeTaken == null ? -1 : this.timeTaken;
    }
}
