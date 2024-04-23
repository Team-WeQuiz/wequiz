package com.chatty.chatty.quizroom.controller;

import com.chatty.chatty.auth.support.AuthUser;
import com.chatty.chatty.quizroom.controller.dto.CreateRoomRequest;
import com.chatty.chatty.quizroom.controller.dto.CreateRoomResponse;
import com.chatty.chatty.quizroom.controller.dto.RoomAbstractResponse;
import com.chatty.chatty.quizroom.controller.dto.RoomDetailResponse;
import com.chatty.chatty.quizroom.controller.dto.RoomQuizResponse;
import com.chatty.chatty.quizroom.entity.QuizRoom;
import com.chatty.chatty.quizroom.service.QuizRoomService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rooms")
@Slf4j
public class QuizRoomController {

    private final QuizRoomService quizRoomService;

    @GetMapping("/{roomId}")
    public ResponseEntity<RoomDetailResponse> getRoomDetail(@PathVariable Long roomId) {
        return ResponseEntity.status(HttpStatus.OK).body(quizRoomService.getRoomDetail(roomId));
    }

    @MessageMapping("/rooms?page={page}")
    @SendTo("/sub/rooms?page={page}")
    public List<RoomAbstractResponse> getRooms(@DestinationVariable Integer page) {
        return quizRoomService.getRooms(page);
    }

    @GetMapping("/{roomId}/quiz")
    public ResponseEntity<RoomQuizResponse> getRoomQuiz(@PathVariable Long roomId) {
        return ResponseEntity.status(HttpStatus.OK).body(quizRoomService.getRoomQuiz(roomId));
    }

    @PostMapping
    public ResponseEntity<CreateRoomResponse> createRoom(@ModelAttribute CreateRoomRequest request,
            @AuthUser Long userId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(quizRoomService.createRoom(request, userId));
    }
}
