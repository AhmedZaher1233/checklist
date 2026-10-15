package com.todo.taskservice.exception;

/** One invalid field of a request: {@code code} is {@code required}, {@code too-long} or {@code invalid}. */
public record ApiFieldError(String field, String code, String message) {

	public static final String REQUIRED = "required";

	public static final String TOO_LONG = "too-long";

	public static final String INVALID = "invalid";

}
