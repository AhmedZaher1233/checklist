package com.todo.taskservice.controller;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import com.todo.taskservice.dto.CreateTaskRequest;
import com.todo.taskservice.dto.TaskResponse;
import com.todo.taskservice.dto.UpdateTaskRequest;
import com.todo.taskservice.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Translates HTTP to {@link TaskService} calls and back; holds no business rules. Every operation is public: the
 * product has no sign-in (architecture/cross-cutting/security.md, rule 1).
 */
@RestController
@RequestMapping("/api/v1/tasks")
@Tag(name = "Tasks")
@SecurityRequirements
public class TaskController {

	private final TaskService taskService;

	public TaskController(TaskService taskService) {
		this.taskService = taskService;
	}

	@GetMapping
	@Operation(operationId = "listTasks", summary = "List all tasks, newest first")
	@ApiResponse(responseCode = "200", description = "All tasks, newest first")
	@ApiResponse(responseCode = "500", description = "Unexpected error", content = @Content(mediaType = "application/problem+json", schema = @Schema(implementation = ProblemDetail.class)))
	@ApiResponse(responseCode = "503", description = "The service cannot reach its data store", content = @Content(mediaType = "application/problem+json", schema = @Schema(implementation = ProblemDetail.class)))
	public List<TaskResponse> listTasks() {
		return this.taskService.listTasks();
	}

	@PostMapping
	@Operation(operationId = "createTask", summary = "Add a task")
	@ApiResponse(responseCode = "201", description = "The task was created")
	@ApiResponse(responseCode = "400", description = "The request is invalid", content = @Content(mediaType = "application/problem+json", schema = @Schema(implementation = ProblemDetail.class)))
	@ApiResponse(responseCode = "500", description = "Unexpected error", content = @Content(mediaType = "application/problem+json", schema = @Schema(implementation = ProblemDetail.class)))
	@ApiResponse(responseCode = "503", description = "The service cannot reach its data store", content = @Content(mediaType = "application/problem+json", schema = @Schema(implementation = ProblemDetail.class)))
	public ResponseEntity<TaskResponse> createTask(@RequestBody CreateTaskRequest request) {
		TaskResponse created = this.taskService.createTask(request.title());
		return ResponseEntity.created(URI.create("/api/v1/tasks/" + created.id())).body(created);
	}

	@PatchMapping("/{id}")
	@Operation(operationId = "completeTask", summary = "Mark a task as completed")
	@ApiResponse(responseCode = "200", description = "The task, now completed")
	@ApiResponse(responseCode = "400", description = "The request is invalid", content = @Content(mediaType = "application/problem+json", schema = @Schema(implementation = ProblemDetail.class)))
	@ApiResponse(responseCode = "404", description = "The task does not exist", content = @Content(mediaType = "application/problem+json", schema = @Schema(implementation = ProblemDetail.class)))
	@ApiResponse(responseCode = "409", description = "Completion is final", content = @Content(mediaType = "application/problem+json", schema = @Schema(implementation = ProblemDetail.class)))
	@ApiResponse(responseCode = "500", description = "Unexpected error", content = @Content(mediaType = "application/problem+json", schema = @Schema(implementation = ProblemDetail.class)))
	@ApiResponse(responseCode = "503", description = "The service cannot reach its data store", content = @Content(mediaType = "application/problem+json", schema = @Schema(implementation = ProblemDetail.class)))
	public TaskResponse completeTask(@PathVariable("id") UUID id, @Valid @RequestBody UpdateTaskRequest request) {
		return this.taskService.completeTask(id, request.completed());
	}

	@DeleteMapping("/{id}")
	@Operation(operationId = "deleteTask", summary = "Delete a task permanently")
	@ApiResponse(responseCode = "204", description = "The task was deleted")
	@ApiResponse(responseCode = "404", description = "The task does not exist", content = @Content(mediaType = "application/problem+json", schema = @Schema(implementation = ProblemDetail.class)))
	@ApiResponse(responseCode = "500", description = "Unexpected error", content = @Content(mediaType = "application/problem+json", schema = @Schema(implementation = ProblemDetail.class)))
	@ApiResponse(responseCode = "503", description = "The service cannot reach its data store", content = @Content(mediaType = "application/problem+json", schema = @Schema(implementation = ProblemDetail.class)))
	public ResponseEntity<Void> deleteTask(@PathVariable("id") UUID id) {
		this.taskService.deleteTask(id);
		return ResponseEntity.noContent().build();
	}

}
