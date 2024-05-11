package com.chatty.chatty.quizroom.controller;

import com.chatty.chatty.auth.support.AuthUser;
import com.chatty.chatty.quizroom.controller.dto.CodeRequestDTO;
import com.chatty.chatty.quizroom.controller.dto.CreateRoomRequest;
import com.chatty.chatty.quizroom.controller.dto.ExistQuizIdResponse;
import com.chatty.chatty.quizroom.controller.dto.RoomDetailResponse;
import com.chatty.chatty.quizroom.controller.dto.RoomIdResponse;
import com.chatty.chatty.quizroom.controller.dto.RoomListResponse;
import com.chatty.chatty.quizroom.controller.dto.RoomResultResponse;
import com.chatty.chatty.quizroom.service.QuizRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rooms")
@Slf4j
public class QuizRoomController {

    private final QuizRoomService quizRoomService;

    @PostMapping
    public ResponseEntity<RoomIdResponse> createRoom(
            @ModelAttribute CreateRoomRequest request,
            @AuthUser Long userId
    ) {
        RoomIdResponse response = quizRoomService.createRoom(request, userId);
        quizRoomService.broadcastUpdatedRoomList();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/create")
    public ResponseEntity<ExistQuizIdResponse> getExistQuizIdList(@AuthUser Long userId) {
        return ResponseEntity.status(HttpStatus.OK).body(quizRoomService.getExistQuizIdList(userId));
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<RoomDetailResponse> getReadyRoomDetails(
            @PathVariable Long roomId,
            @AuthUser Long userId
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(quizRoomService.getReadyRoomDetails(roomId, userId));
    }

    @PostMapping("/find-by-code")
    public ResponseEntity<RoomIdResponse> findRoomByCode(@RequestBody CodeRequestDTO request) {
        RoomIdResponse response = quizRoomService.findRoomByCode(request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/{roomId}/start")
    public ResponseEntity<Void> startRoom(@PathVariable Long roomId) {
        log.info("start room 호출");
        quizRoomService.startRoom(roomId);
        quizRoomService.broadcastUpdatedRoomList();
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @DeleteMapping("/{roomId}/end")
    public ResponseEntity<Void> finishRoom(@PathVariable Long roomId) {
        quizRoomService.finishRoom(roomId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/{roomId}/result")
    public ResponseEntity<RoomResultResponse> getTotalResult(@PathVariable Long roomId) {
        return ResponseEntity.status(HttpStatus.OK).body(quizRoomService.getTotalResult(roomId));
    }

    @MessageMapping("/rooms?page={page}")
    @SendTo("/sub/rooms?page={page}")
    public RoomListResponse getRooms(
            @DestinationVariable Integer page
    ) {
        return quizRoomService.getRooms(page);
    }
}
