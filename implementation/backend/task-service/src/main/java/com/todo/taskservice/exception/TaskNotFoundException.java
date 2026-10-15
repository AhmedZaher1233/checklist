package com.todo.taskservice.exception;

import java.util.UUID;

/** The requested task does not exist, for example because someone deleted it. */
public class TaskNotFoundException extends RuntimeException {

	public TaskNotFoundException(UUID id) {
		super("Task not found: " + id);
	}

}
