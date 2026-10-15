package com.todo.taskservice.service;

import java.time.Clock;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import com.todo.taskservice.entity.Task;
import com.todo.taskservice.exception.CompletionFinalException;
import com.todo.taskservice.repository.TaskRepository;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/** US2-AS4 (unit, T045): completion is final. */
class TaskServiceCompleteTest {

	private final TaskRepository repository = mock(TaskRepository.class);

	private final TaskService service = new TaskService(this.repository, Clock.systemUTC());

	@Test
	void refusesToSetACompletedTaskBackToNotCompleted() {
		UUID id = UUID.randomUUID();
		when(this.repository.findById(id)).thenReturn(Optional.of(new Task(id, "Buy milk", true, Instant.now())));

		assertThatThrownBy(() -> this.service.completeTask(id, false)).isInstanceOf(CompletionFinalException.class);
		verify(this.repository, never()).markCompleted(any());
		verify(this.repository, never()).save(any());
	}

	@Test
	void notCompletedRequestOnAnOpenTaskChangesNothing() {
		UUID id = UUID.randomUUID();
		when(this.repository.findById(id)).thenReturn(Optional.of(new Task(id, "Buy milk", false, Instant.now())));

		assertThat(this.service.completeTask(id, false).completed()).isFalse();
		verify(this.repository, never()).markCompleted(any());
	}

}
