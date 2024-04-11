package com.chatty.chatty.quizroom.controller;

import com.chatty.chatty.auth.support.AuthUser;
import com.chatty.chatty.quizroom.controller.dto.CreateRoomRequest;
import com.chatty.chatty.quizroom.controller.dto.CreateRoomResponse;
import com.chatty.chatty.quizroom.controller.dto.RoomDetailResponse;
import com.chatty.chatty.quizroom.controller.dto.RoomQuizResponse;
import com.chatty.chatty.quizroom.entity.QuizRoom;
import com.chatty.chatty.quizroom.service.QuizRoomService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
    public ResponseEntity<List<QuizRoom>> getRooms() {
        List<QuizRoom> rooms = quizRoomService.getRooms();
        return ResponseEntity.status(HttpStatus.OK).body(rooms);
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<RoomDetailResponse> getRoomDetail(@PathVariable Long roomId) {
        return ResponseEntity.status(HttpStatus.OK).body(quizRoomService.getRoomDetail(roomId));
    }

    @GetMapping("/{roomId}/quiz")
    public ResponseEntity<RoomQuizResponse> getRoomQuiz(@PathVariable Long roomId) {
        return ResponseEntity.status(HttpStatus.OK).body(quizRoomService.getRoomQuiz(roomId));
    }

    @PostMapping
    public ResponseEntity<CreateRoomResponse> createRoom(@RequestBody CreateRoomRequest request, @AuthUser Long userId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(quizRoomService.createRoom(request, userId));
    }
}
