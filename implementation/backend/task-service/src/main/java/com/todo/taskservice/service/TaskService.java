package com.todo.taskservice.service;

import java.time.Clock;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

import com.todo.taskservice.dto.TaskResponse;
import com.todo.taskservice.entity.Task;
import com.todo.taskservice.exception.ApiFieldError;
import com.todo.taskservice.exception.CompletionFinalException;
import com.todo.taskservice.exception.TaskNotFoundException;
import com.todo.taskservice.exception.TaskValidationException;
import com.todo.taskservice.repository.TaskRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** All business rules of the shared task list (spec 001, research R1–R5). */
@Service
public class TaskService {

	/** Maximum title length in UTF-16 code units, the unit the browser's maxlength uses (research R1). */
	public static final int MAX_TITLE_LENGTH = 100;

	private static final char ZERO_WIDTH_NO_BREAK_SPACE = (char) 0xFEFF;

	private final TaskRepository taskRepository;

	private final Clock clock;

	public TaskService(TaskRepository taskRepository, Clock clock) {
		this.taskRepository = taskRepository;
		this.clock = clock;
	}

	/** All tasks, newest first; equal creation instants ordered by id (research R3). */
	@Transactional(readOnly = true)
	public List<TaskResponse> listTasks() {
		return this.taskRepository.findAllByOrderByCreatedAtDescIdDesc().stream().map(TaskResponse::from).toList();
	}

	/** Adds a not-completed task; white space at either end of the title is removed first (FR-001–FR-004). */
	@Transactional
	public TaskResponse createTask(String title) {
		String stripped = stripSpaces(title);
		if (stripped.isEmpty()) {
			throw new TaskValidationException("title", ApiFieldError.REQUIRED, "A title is required.");
		}
		if (stripped.length() > MAX_TITLE_LENGTH) {
			throw new TaskValidationException("title", ApiFieldError.TOO_LONG,
					"A title can have at most " + MAX_TITLE_LENGTH + " characters.");
		}
		Instant createdAt = Instant.now(this.clock).truncatedTo(ChronoUnit.MICROS);
		Task task = new Task(UUID.randomUUID(), stripped, false, createdAt);
		return TaskResponse.from(this.taskRepository.save(task));
	}

	/**
	 * Marks a task as completed; repeating it changes nothing. Completion is final: asking for "not completed" on a
	 * completed task is rejected (FR-007, FR-009, research R4).
	 */
	@Transactional
	public TaskResponse completeTask(UUID id, boolean completed) {
		if (!completed) {
			Task task = this.taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
			if (task.isCompleted()) {
				throw new CompletionFinalException(id);
			}
			return TaskResponse.from(task);
		}
		if (this.taskRepository.markCompleted(id) == 0) {
			throw new TaskNotFoundException(id);
		}
		return this.taskRepository.findById(id)
			.map(TaskResponse::from)
			.orElseThrow(() -> new TaskNotFoundException(id));
	}

	/**
	 * Removes white space at both ends, including Unicode spaces such as the non-breaking space that
	 * {@link String#strip()} keeps, so the result matches the browser's {@code trim()} (research R2).
	 */
	static String stripSpaces(String value) {
		if (value == null) {
			return "";
		}
		int start = 0;
		int end = value.length();
		while (start < end && isSpace(value.charAt(start))) {
			start++;
		}
		while (end > start && isSpace(value.charAt(end - 1))) {
			end--;
		}
		return value.substring(start, end);
	}

	private static boolean isSpace(char c) {
		return Character.isWhitespace(c) || Character.isSpaceChar(c) || c == ZERO_WIDTH_NO_BREAK_SPACE;
	}

	/** Deletes a task permanently (FR-010, FR-011, research R5). */
	@Transactional
	public void deleteTask(UUID id) {
		if (this.taskRepository.deleteTaskById(id) == 0) {
			throw new TaskNotFoundException(id);
		}
	}

}
