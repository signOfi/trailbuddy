package com.trail.backend.dto;

import com.trail.backend.model.Difficulty;
import com.trail.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventDTO {
    private long id;
    private String title;
    private LocalDateTime date;
    private String location;
    private String description;
    private Difficulty difficulty;
    private Long hostId;
    private String hostName;
    private int spots;
    private String eventImageUrl;
    private List<Long> participantIds;
}
