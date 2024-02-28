package com.chatty.chatty.player.entity;

import com.chatty.chatty.common.entity.BaseEntity;
import com.chatty.chatty.quizroom.entity.Quizroom;
import com.chatty.chatty.user.entity.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@IdClass(PlayerId.class)
@Table(name = "`players`")
public class Player extends BaseEntity {

    @Id
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Id
    @ManyToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Quizroom quizroom;

    @Column(unique = true, length = 10, nullable = false)
    private String nickname;

    @Column(columnDefinition = "INTEGER NOT NULL DEFAULT 0")
    private Integer progress;

    @Column(columnDefinition = "INTEGER NOT NULL DEFAULT -1")
    private Integer time_taken;

    @Column(columnDefinition = "BOOLEAN NOT NULL DEFAULT false")
    private Boolean is_done;
}
