package com.todo.taskservice.exception;

/** A business validation rule rejected the request. */
public class TaskValidationException extends RuntimeException {

	private final transient ApiFieldError fieldError;

	public TaskValidationException(String field, String code, String message) {
		super(message);
		this.fieldError = new ApiFieldError(field, code, message);
	}

	public ApiFieldError getFieldError() {
		return this.fieldError;
	}

}
