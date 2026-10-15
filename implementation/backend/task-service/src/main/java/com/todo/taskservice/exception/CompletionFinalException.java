package com.todo.taskservice.exception;

import java.util.UUID;

/** A completed task cannot be set back to not completed: completion is final. */
public class CompletionFinalException extends RuntimeException {

	public CompletionFinalException(UUID id) {
		super("Completion is final for task " + id);
	}

}
