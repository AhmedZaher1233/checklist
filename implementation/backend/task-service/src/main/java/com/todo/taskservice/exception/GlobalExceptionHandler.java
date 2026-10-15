package com.todo.taskservice.exception;

import java.net.URI;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.transaction.CannotCreateTransactionException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * The single place where exceptions become responses: application/problem+json, never stack traces, class names
 * or SQL (architecture/cross-cutting/error-handling.md).
 */
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

	private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler(TaskValidationException.class)
	ResponseEntity<Object> handleTaskValidation(TaskValidationException ex) {
		return validationProblem(List.of(ex.getFieldError()));
	}

	@ExceptionHandler(TaskNotFoundException.class)
	ResponseEntity<Object> handleTaskNotFound(TaskNotFoundException ex) {
		return taskNotFound();
	}

	@ExceptionHandler(CompletionFinalException.class)
	ResponseEntity<Object> handleCompletionFinal(CompletionFinalException ex) {
		return problem(HttpStatus.CONFLICT, ProblemTypes.TASK_COMPLETION_FINAL, "Completion is final",
				"A completed task cannot be set back to not completed.");
	}

	@ExceptionHandler({ DataAccessResourceFailureException.class, CannotGetJdbcConnectionException.class,
			CannotCreateTransactionException.class })
	ResponseEntity<Object> handleDatabaseUnavailable(Exception ex) {
		log.error("Database unavailable", ex);
		return problem(HttpStatus.SERVICE_UNAVAILABLE, ProblemTypes.SERVICE_UNAVAILABLE, "Service unavailable", null);
	}

	@ExceptionHandler(Exception.class)
	ResponseEntity<Object> handleUnexpected(Exception ex) {
		if (isDatabaseUnavailable(ex, 0)) {
			// e.g. the query failed on a broken connection and the rollback error hides it
			return handleDatabaseUnavailable(ex);
		}
		log.error("Unexpected error", ex);
		return problem(HttpStatus.INTERNAL_SERVER_ERROR, ProblemTypes.INTERNAL, "Unexpected error", null);
	}

	/** True when anything in the cause chain says the database connection failed (SQL state class 08). */
	static boolean isDatabaseUnavailable(Throwable error, int depth) {
		if (error == null || depth > 20) {
			return false;
		}
		if (error instanceof DataAccessResourceFailureException || error instanceof CannotGetJdbcConnectionException
				|| error instanceof CannotCreateTransactionException
				|| error instanceof org.hibernate.exception.JDBCConnectionException
				// commit or rollback could not reach the database (the original error is dropped by Spring)
				|| error instanceof org.hibernate.TransactionException
				|| error instanceof java.net.SocketException
				|| error instanceof java.sql.SQLTransientConnectionException) {
			return true;
		}
		if (error instanceof java.sql.SQLException sql && sql.getSQLState() != null
				&& sql.getSQLState().startsWith("08")) {
			return true;
		}
		for (Throwable suppressed : error.getSuppressed()) {
			if (isDatabaseUnavailable(suppressed, depth + 1)) {
				return true;
			}
		}
		return error.getCause() != error && isDatabaseUnavailable(error.getCause(), depth + 1);
	}

	@Override
	protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex,
			HttpHeaders headers, HttpStatusCode status, WebRequest request) {
		return validationProblem(List.of(new ApiFieldError("body", ApiFieldError.INVALID, "The request body is invalid.")));
	}

	@Override
	protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
			HttpHeaders headers, HttpStatusCode status, WebRequest request) {
		List<ApiFieldError> errors = ex.getBindingResult()
			.getFieldErrors()
			.stream()
			.map((error) -> new ApiFieldError(error.getField(), ApiFieldError.INVALID, "The value is invalid."))
			.toList();
		return validationProblem(errors);
	}

	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	ResponseEntity<Object> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
		// a path id that is not a UUID cannot name an existing task
		if ("id".equals(ex.getName())) {
			return taskNotFound();
		}
		return validationProblem(List.of(new ApiFieldError(ex.getName(), ApiFieldError.INVALID, "The value is invalid.")));
	}

	private ResponseEntity<Object> taskNotFound() {
		return problem(HttpStatus.NOT_FOUND, ProblemTypes.TASK_NOT_FOUND, "Task not found", null);
	}

	private ResponseEntity<Object> validationProblem(List<ApiFieldError> errors) {
		ProblemDetail body = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
		body.setType(ProblemTypes.VALIDATION);
		body.setTitle("Invalid request");
		body.setProperty("errors", errors);
		return respond(body);
	}

	private ResponseEntity<Object> problem(HttpStatus status, URI type, String title, String detail) {
		ProblemDetail body = ProblemDetail.forStatus(status);
		body.setType(type);
		body.setTitle(title);
		body.setDetail(detail);
		return respond(body);
	}

	private ResponseEntity<Object> respond(ProblemDetail body) {
		return ResponseEntity.status(body.getStatus()).contentType(MediaType.APPLICATION_PROBLEM_JSON).body(body);
	}

}
