package com.chatty.chatty.aws.entity;

import java.util.List;

public record Question(

        String id,

        Integer question_number,

        String type,

        String question,

        List<String> options,

        String answer
) {
}
