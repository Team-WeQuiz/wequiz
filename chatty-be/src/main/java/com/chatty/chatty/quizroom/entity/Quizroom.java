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
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

@DynamicInsert
@DynamicUpdate
@Entity
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(of = "id", callSuper = false)
@Table(name = "`quizrooms`")
public class Quizroom extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Long id;

    @Column(length = 20, nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer num_of_quiz;

    @Column(nullable = false)
    private Integer time_limit;

    @Column(columnDefinition = "INTEGER NOT NULL DEFAULT 0")
    private Integer player_num;

    @Column(nullable = false)
    private Integer player_limit_num;

    @Column(length = 10)
    private String code;

    @Column(nullable = false)
    private String link;

    @Column(columnDefinition = "BOOLEAN NOT NULL DEFAULT false")
    private Boolean is_started;

    @Column(columnDefinition = "BOOLEAN NOT NULL DEFAULT false")
    private Boolean is_finished;

    @Column
    private String quiz_doc_id;

    @Column
    private String score_doc_id;
}
