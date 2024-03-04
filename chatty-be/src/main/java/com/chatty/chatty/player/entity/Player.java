package com.chatty.chatty.player.entity;

import com.chatty.chatty.common.entity.BaseEntity;
import com.chatty.chatty.quizroom.entity.Quizroom;
import com.chatty.chatty.user.entity.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

@DynamicInsert
@DynamicUpdate
@Entity
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "`players`")
public class Player extends BaseEntity {

    @EmbeddedId
    private PlayerId id;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @MapsId("user_id")
    private User user;

    @ManyToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    @MapsId("room_id")
    private Quizroom quizroom;

    @Column(unique = true, length = 10, nullable = false)
    private String nickname;

    @Column(columnDefinition = "INTEGER NOT NULL DEFAULT 0")
    private Integer progress;

    @Column(columnDefinition = "INTEGER NOT NULL DEFAULT -1")
    private Integer timeTaken;

    @Column(columnDefinition = "BOOLEAN NOT NULL DEFAULT false")
    private Boolean isDone;
}
