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
@Table(name = "users")
public class User extends BaseEntity {

    private static final String DEFAULT_PROFILE_IMAGE = "bit.ly/wequiz_profile_image";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private Boolean isValid;

    @Column(nullable = false)
    private String profileImage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Provider loginType;

    @PrePersist
    public void setDefaultColumns() {
        this.loginType = this.loginType == null ? Provider.NORMAL : this.loginType;
        this.isValid = this.isValid != null && this.isValid;
        this.profileImage = this.profileImage == null ? DEFAULT_PROFILE_IMAGE : this.profileImage;
    }
}
