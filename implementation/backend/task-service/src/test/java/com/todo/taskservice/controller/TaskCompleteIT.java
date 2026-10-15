package com.todo.taskservice.controller;

import java.time.Instant;

import com.todo.taskservice.AbstractPostgresIT;
import com.todo.taskservice.TaskApi;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** US2: marking a task as completed (T041, T043, T044, T046, T048, T049). */
class TaskCompleteIT extends AbstractPostgresIT {

	private TaskApi api;

	@BeforeEach
	void setUp() {
		this.api = new TaskApi(this.mockMvc);
	}

	@Test
	void marksATaskAsCompletedAndRepeatingItChangesNothing() throws Exception {
		// US2-AS1
		String id = this.api.createId("Buy milk");

		this.api.complete(id, "true")
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.id").value(id))
			.andExpect(jsonPath("$.title").value("Buy milk"))
			.andExpect(jsonPath("$.completed").value(true));
		this.api.complete(id, "true").andExpect(status().isOk()).andExpect(jsonPath("$.completed").value(true));
	}

	@Test
	void aCompletedTaskStaysCompleted() throws Exception {
		// US2-AS2
		String id = this.api.createId("Buy milk");
		this.api.complete(id, "true").andExpect(status().isOk());

		this.api.list().andExpect(jsonPath("$[0].id").value(id)).andExpect(jsonPath("$[0].completed").value(true));
	}

	@Test
	void completingOneTaskLeavesTheOthersOpen() throws Exception {
		// US2-AS3
		this.clock.fixAt(Instant.parse("2026-10-13T08:00:00Z"));
		String buyMilk = this.api.createId("Buy milk");
		this.clock.fixAt(Instant.parse("2026-10-13T08:01:00Z"));
		this.api.createId("Call Sam");

		this.api.complete(buyMilk, "true").andExpect(status().isOk());

		this.api.list()
			.andExpect(jsonPath("$[0].title").value("Call Sam"))
			.andExpect(jsonPath("$[0].completed").value(false))
			.andExpect(jsonPath("$[1].title").value("Buy milk"))
			.andExpect(jsonPath("$[1].completed").value(true));
	}

	@Test
	void completionIsFinal() throws Exception {
		// US2-AS4 / FR-009
		String id = this.api.createId("Buy milk");
		this.api.complete(id, "true").andExpect(status().isOk());

		this.api.complete(id, "false")
			.andExpect(status().isConflict())
			.andExpect(jsonPath("$.type").value("/problems/task-completion-final"));
		this.api.list().andExpect(jsonPath("$[0].completed").value(true));
	}

	@Test
	void completingDoesNotChangeTheOrder() throws Exception {
		// US2-AS5
		this.clock.fixAt(Instant.parse("2026-10-13T08:00:00Z"));
		this.api.createId("Buy milk");
		this.clock.fixAt(Instant.parse("2026-10-13T08:01:00Z"));
		String callSam = this.api.createId("Call Sam");
		this.clock.fixAt(Instant.parse("2026-10-13T08:02:00Z"));
		this.api.createId("Pay rent");
		this.clock.fixAt(Instant.parse("2026-10-13T09:00:00Z"));

		this.api.complete(callSam, "true").andExpect(status().isOk());

		this.api.list()
			.andExpect(jsonPath("$[0].title").value("Pay rent"))
			.andExpect(jsonPath("$[1].title").value("Call Sam"))
			.andExpect(jsonPath("$[2].title").value("Buy milk"));
	}

	@Test
	void completingATaskThatDoesNotExistIsNotFound() throws Exception {
		// Edge (gone, complete)
		String id = this.api.createId("Buy milk");
		this.api.delete(id).andExpect(status().isNoContent());

		this.api.complete(id, "true")
			.andExpect(status().isNotFound())
			.andExpect(jsonPath("$.type").value("/problems/task-not-found"));
		this.api.complete("not-a-uuid", "true")
			.andExpect(status().isNotFound())
			.andExpect(jsonPath("$.type").value("/problems/task-not-found"));
	}

	@Test
	void rejectsAMissingCompletedValue() throws Exception {
		String id = this.api.createId("Buy milk");
		this.api.complete(id, "null")
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.type").value("/problems/validation"));
	}

}
