package com.todo.taskservice.exception;

import java.net.URI;

/** Problem types of the API contract (architecture/cross-cutting/error-handling.md, rule 1). */
public final class ProblemTypes {

	public static final URI VALIDATION = URI.create("/problems/validation");

	public static final URI TASK_NOT_FOUND = URI.create("/problems/task-not-found");

	public static final URI TASK_COMPLETION_FINAL = URI.create("/problems/task-completion-final");

	public static final URI SERVICE_UNAVAILABLE = URI.create("/problems/service-unavailable");

	public static final URI INTERNAL = URI.create("/problems/internal");

	private ProblemTypes() {
	}

}
