package com.todo.taskservice.dto;

/** Request to add a task; the title is checked by the service. */
public record CreateTaskRequest(String title) {
}
