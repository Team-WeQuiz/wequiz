package com.chatty.chatty.quizroom.controller;

import com.chatty.chatty.quizroom.controller.dto.MakeRoomRequest;
import com.chatty.chatty.quizroom.controller.dto.MakeRoomResponse;
import com.chatty.chatty.quizroom.entity.QuizRoom;
import com.chatty.chatty.quizroom.service.QuizRoomService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rooms")
public class QuizRoomController {

    private final QuizRoomService quizRoomService;

    public QuizRoomController(QuizRoomService quizRoomService) {
        this.quizRoomService = quizRoomService;
    }

    @GetMapping
    public ResponseEntity<List<QuizRoom>> rooms() {
        List<QuizRoom> rooms = quizRoomService.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(rooms);
    }

    @PostMapping
    public ResponseEntity<MakeRoomResponse> makeRoom(@RequestBody MakeRoomRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(quizRoomService.makeRoom(request));
    }

}
