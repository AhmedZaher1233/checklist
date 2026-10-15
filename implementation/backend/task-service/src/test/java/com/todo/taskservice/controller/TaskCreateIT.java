package com.todo.taskservice.controller;

import com.todo.taskservice.AbstractPostgresIT;
import com.todo.taskservice.TaskApi;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.matchesPattern;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** US1: adding a task (T015, T017, T023, T025). */
class TaskCreateIT extends AbstractPostgresIT {

	private TaskApi api;

	@BeforeEach
	void setUp() {
		this.api = new TaskApi(this.mockMvc);
	}

	@Test
	void addsANotCompletedTask() throws Exception {
		// US1-AS2
		this.api.create("Buy milk")
			.andExpect(status().isCreated())
			.andExpect(header().string("Location", matchesPattern("/api/v1/tasks/[0-9a-f-]{36}")))
			.andExpect(jsonPath("$.id").isString())
			.andExpect(jsonPath("$.title").value("Buy milk"))
			.andExpect(jsonPath("$.completed").value(false))
			.andExpect(jsonPath("$.createdAt").isString());

		this.api.list().andExpect(jsonPath("$", hasSize(1))).andExpect(jsonPath("$[0].title").value("Buy milk"));
	}

	@ParameterizedTest
	@ValueSource(strings = { "{\"title\":\"\"}", "{\"title\":\"   \"}", "{}", "{\"title\":null}" })
	void rejectsAMissingOrBlankTitle(String body) throws Exception {
		// US1-AS3
		this.api.createRaw(body)
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.type").value("/problems/validation"))
			.andExpect(jsonPath("$.errors[0].field").value("title"))
			.andExpect(jsonPath("$.errors[0].code").value("required"));

		assertThat(this.taskRepository.count()).isZero();
	}

	@Test
	void acceptsOneHundredCharactersAndRejectsMore() throws Exception {
		// US1-AS6
		String hundred = "a".repeat(100);
		this.api.create(hundred).andExpect(status().isCreated()).andExpect(jsonPath("$.title").value(hundred));

		this.api.create("a".repeat(101))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.type").value("/problems/validation"))
			.andExpect(jsonPath("$.errors[0].field").value("title"))
			.andExpect(jsonPath("$.errors[0].code").value("too-long"));

		assertThat(this.taskRepository.count()).isEqualTo(1);
	}

	@Test
	void allowsDuplicateTitles() throws Exception {
		// US1-AS7
		String first = this.api.createId("Buy milk");
		String second = this.api.createId("Buy milk");

		assertThat(first).isNotEqualTo(second);
		this.api.list()
			.andExpect(jsonPath("$", hasSize(2)))
			.andExpect(jsonPath("$[0].title").value("Buy milk"))
			.andExpect(jsonPath("$[1].title").value("Buy milk"));
	}

	@Test
	void storesTheTitleWithoutSurroundingSpacesAndChecksTheLengthAfterwards() throws Exception {
		// US1-AS6 / FR-003: 100 characters wrapped in spaces are accepted and stored without them
		String hundred = "b".repeat(100);
		this.api.create("  " + hundred + "  ")
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.title").value(hundred));
	}

}
