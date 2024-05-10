package com.chatty.chatty.user.entity;

import com.chatty.chatty.auth.entity.Provider;
import com.chatty.chatty.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "users")
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column
    private String password;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isValid = false;

    @Column
    private String profileImage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Provider loginType = Provider.NORMAL;

    public void changePassword(String password) {
        this.password = password;
    }

    public void changeProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }
}
