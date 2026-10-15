package com.todo.taskservice.dto;

import jakarta.validation.constraints.NotNull;

/** Request to change a task's completion state; only {@code true} can change a task. */
public record UpdateTaskRequest(@NotNull Boolean completed) {
}
