package com.todo.taskservice.service;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

import com.todo.taskservice.dto.TaskResponse;
import com.todo.taskservice.entity.Task;
import com.todo.taskservice.exception.ApiFieldError;
import com.todo.taskservice.exception.TaskValidationException;
import com.todo.taskservice.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/** Unit tests of the title rules and creation time (T022, T026, T027). */
class TaskServiceTest {

	private static final Instant NOW = Instant.parse("2026-10-13T08:30:00.123456789Z");

	private static final String NBSP = String.valueOf((char) 0x00A0);

	private static final String BOM = String.valueOf((char) 0xFEFF);

	private static final String TAB = String.valueOf((char) 0x0009);

	private TaskRepository repository;

	private TaskService service;

	@BeforeEach
	void setUp() {
		this.repository = mock(TaskRepository.class);
		when(this.repository.save(any(Task.class))).thenAnswer((invocation) -> invocation.getArgument(0));
		this.service = new TaskService(this.repository, Clock.fixed(NOW, ZoneOffset.UTC));
	}

	@Test
	void acceptsATitleOfExactlyOneHundredCharacters() {
		// US1-AS6
		String hundred = "x".repeat(100);
		assertThat(this.service.createTask(hundred).title()).isEqualTo(hundred);
	}

	@Test
	void rejectsATitleOfOneHundredAndOneCharacters() {
		// US1-AS6
		assertThatThrownBy(() -> this.service.createTask("x".repeat(101)))
			.isInstanceOfSatisfying(TaskValidationException.class,
					(ex) -> assertThat(ex.getFieldError().code()).isEqualTo(ApiFieldError.TOO_LONG));
		verify(this.repository, never()).save(any());
	}

	@Test
	void checksTheLengthAfterRemovingSurroundingSpaces() {
		// US1-AS6 / FR-003
		String hundred = "x".repeat(100);
		assertThat(this.service.createTask("  " + hundred + "  ").title()).isEqualTo(hundred);
	}

	@Test
	void removesOrdinaryAndNonBreakingSpacesAroundTheTitle() {
		// US1 edge (strip) / FR-003
		assertThat(this.service.createTask("  Buy milk  ").title()).isEqualTo("Buy milk");
		assertThat(this.service.createTask(" " + TAB + "Buy milk  ").title()).isEqualTo("Buy milk");
		assertThat(this.service.createTask(NBSP + "Buy milk" + NBSP).title()).isEqualTo("Buy milk");
		assertThat(this.service.createTask(BOM + "Buy milk").title()).isEqualTo("Buy milk");
		assertThat(this.service.createTask("Buy  milk").title()).isEqualTo("Buy  milk");
	}

	@Test
	void rejectsATitleMadeOnlyOfSpacesAsRequired() {
		// US1-AS3 / FR-002
		for (String blank : new String[] { null, "", "   ", NBSP + NBSP, TAB }) {
			assertThatThrownBy(() -> this.service.createTask(blank))
				.isInstanceOfSatisfying(TaskValidationException.class,
						(ex) -> assertThat(ex.getFieldError().code()).isEqualTo(ApiFieldError.REQUIRED));
		}
		verify(this.repository, never()).save(any());
	}

	@Test
	void createsANotCompletedTaskAtTheClockTimeTruncatedToMicroseconds() {
		// FR-004, US1-AS8 (the creation instant sets the order)
		TaskResponse created = this.service.createTask("Buy milk");
		assertThat(created.completed()).isFalse();
		assertThat(created.createdAt()).isEqualTo(Instant.parse("2026-10-13T08:30:00.123456Z"));
		assertThat(created.id()).isNotNull();
	}

}
