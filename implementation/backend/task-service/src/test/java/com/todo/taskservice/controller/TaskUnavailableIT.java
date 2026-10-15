package com.todo.taskservice.controller;

import com.todo.taskservice.AbstractPostgresIT;
import com.todo.taskservice.TaskApi;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.testcontainers.postgresql.PostgreSQLContainer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * FR-014 (service, T030): with the database stopped the service answers 503 without internal details and readiness
 * is DOWN. Uses its own container so the shared one keeps running.
 */
@SpringBootTest(properties = "spring.datasource.hikari.connection-timeout=2000")
@AutoConfigureMockMvc
@DirtiesContext
class TaskUnavailableIT {

	@ServiceConnection
	static final PostgreSQLContainer DATABASE = new PostgreSQLContainer(AbstractPostgresIT.POSTGRES_IMAGE);

	static {
		DATABASE.start();
	}

	@Autowired
	private MockMvc mockMvc;

	@AfterAll
	static void cleanUp() {
		if (DATABASE.isRunning()) {
			DATABASE.stop();
		}
	}

	@Test
	void answersServiceUnavailableAndReportsNotReadyWhenTheDatabaseIsDown() throws Exception {
		TaskApi api = new TaskApi(this.mockMvc);
		api.list().andExpect(status().isOk());

		DATABASE.stop();

		MvcResult list = api.list()
			.andExpect(status().isServiceUnavailable())
			.andExpect(jsonPath("$.type").value("/problems/service-unavailable"))
			.andReturn();
		api.create("Buy milk")
			.andExpect(status().isServiceUnavailable())
			.andExpect(jsonPath("$.type").value("/problems/service-unavailable"));
		assertThat(list.getResponse().getContentAsString()).doesNotContain("Exception", "jdbc", "Connection");

		this.mockMvc.perform(get("/actuator/health/readiness"))
			.andExpect(status().isServiceUnavailable())
			.andExpect(jsonPath("$.status").value("DOWN"));
	}

}
