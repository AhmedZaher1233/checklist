package com.todo.taskservice.dto;

import java.time.Instant;
import java.util.UUID;

import com.todo.taskservice.entity.Task;
import io.swagger.v3.oas.annotations.media.Schema;

/** A task as the API returns it (contract schema "Task"). */
@Schema(name = "Task")
public record TaskResponse(UUID id, String title, boolean completed, Instant createdAt) {

	public static TaskResponse from(Task task) {
		return new TaskResponse(task.getId(), task.getTitle(), task.isCompleted(), task.getCreatedAt());
	}

}
