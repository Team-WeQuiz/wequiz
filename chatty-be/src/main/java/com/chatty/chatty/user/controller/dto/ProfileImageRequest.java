package com.chatty.chatty.user.controller.dto;

import org.springframework.web.multipart.MultipartFile;

public record ProfileImageRequest(
        MultipartFile file
) {

}
