package com.todo.taskservice.controller;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.todo.taskservice.AbstractPostgresIT;
import com.todo.taskservice.TaskApi;
import com.todo.taskservice.TaskServiceApplication;
import com.todo.taskservice.dto.TaskResponse;
import com.todo.taskservice.entity.Task;
import com.todo.taskservice.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.boot.WebApplicationType;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** US1: viewing the shared list (T013, T019, T020, T026). */
class TaskListIT extends AbstractPostgresIT {

	private TaskApi api;

	@BeforeEach
	void setUp() {
		this.api = new TaskApi(this.mockMvc);
	}

	@Test
	void emptyListReturnsAnEmptyArray() throws Exception {
		// US1-AS1
		this.api.list().andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(0)));
	}

	@Test
	void tasksSurviveAnApplicationRestart() throws Exception {
		// US1-AS4: a second, freshly started application reads the same tasks from the database
		this.api.createId("Buy milk");
		String callSamId = this.api.createId("Call Sam");
		this.api.complete(callSamId, "true").andExpect(status().isOk());
		List<TaskResponse> before = this.taskRepository.findAllByOrderByCreatedAtDescIdDesc()
			.stream()
			.map(TaskResponse::from)
			.toList();

		try (ConfigurableApplicationContext restarted = new SpringApplicationBuilder(TaskServiceApplication.class)
			.web(WebApplicationType.NONE)
			.run("--spring.datasource.url=" + POSTGRES.getJdbcUrl(),
					"--spring.datasource.username=" + POSTGRES.getUsername(),
					"--spring.datasource.password=" + POSTGRES.getPassword(), "--spring.main.banner-mode=off")) {
			List<TaskResponse> after = restarted.getBean(TaskService.class).listTasks();
			assertThat(after).containsExactlyElementsOf(before);
			assertThat(after).extracting(TaskResponse::title).containsExactly("Call Sam", "Buy milk");
			assertThat(after).extracting(TaskResponse::completed).containsExactly(true, false);
		}
	}

	@Test
	void everyTaskShowsItsTitleAndCompletionState() throws Exception {
		// US1-AS5
		this.taskRepository.save(new Task(UUID.randomUUID(), "Pay rent", true, Instant.parse("2026-10-13T08:00:00Z")));
		this.taskRepository.save(new Task(UUID.randomUUID(), "Buy milk", false, Instant.parse("2026-10-13T07:00:00Z")));

		this.api.list()
			.andExpect(status().isOk())
			.andExpect(jsonPath("$", hasSize(2)))
			.andExpect(jsonPath("$[0].title").value("Pay rent"))
			.andExpect(jsonPath("$[0].completed").value(true))
			.andExpect(jsonPath("$[1].title").value("Buy milk"))
			.andExpect(jsonPath("$[1].completed").value(false));
	}

	@Test
	void listsNewestFirstAndBreaksTiesByIdDescending() throws Exception {
		// US1-AS8
		this.clock.fixAt(Instant.parse("2026-10-13T08:00:00Z"));
		this.api.createId("Buy milk");
		this.clock.fixAt(Instant.parse("2026-10-13T08:01:00Z"));
		this.api.createId("Call Sam");
		this.clock.fixAt(Instant.parse("2026-10-13T08:02:00Z"));
		this.api.createId("Pay rent");

		this.api.list()
			.andExpect(jsonPath("$[0].title").value("Pay rent"))
			.andExpect(jsonPath("$[1].title").value("Call Sam"))
			.andExpect(jsonPath("$[2].title").value("Buy milk"));

		this.taskRepository.deleteAll();
		Instant same = Instant.parse("2026-10-13T09:00:00Z");
		UUID low = UUID.fromString("00000000-0000-0000-0000-000000000001");
		UUID high = UUID.fromString("ffffffff-0000-0000-0000-000000000001");
		this.taskRepository.save(new Task(low, "Low id", false, same));
		this.taskRepository.save(new Task(high, "High id", false, same));

		this.api.list()
			.andExpect(jsonPath("$[0].id").value(high.toString()))
			.andExpect(jsonPath("$[1].id").value(low.toString()));
	}

}
