package com.todo.taskservice.common;

import com.todo.taskservice.AbstractPostgresIT;
import org.junit.jupiter.api.Test;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Plan Test Design row "Cross-cutting" (T007). */
class CrossCuttingIT extends AbstractPostgresIT {

	@Test
	void echoesTheCorrelationIdTheCallerSends() throws Exception {
		this.mockMvc.perform(get("/api/v1/tasks").header("X-Correlation-Id", "abc-123"))
			.andExpect(status().isOk())
			.andExpect(header().string("X-Correlation-Id", "abc-123"));
	}

	@Test
	void createsACorrelationIdWhenTheCallerSendsNone() throws Exception {
		MvcResult result = this.mockMvc.perform(get("/api/v1/tasks")).andExpect(status().isOk()).andReturn();
		assertThat(result.getResponse().getHeader("X-Correlation-Id")).matches("[0-9a-f-]{36}");
	}

	@Test
	void errorsAreProblemDetailsWithoutInternalDetails() throws Exception {
		MvcResult result = this.mockMvc
			.perform(post("/api/v1/tasks").contentType(MediaType.APPLICATION_JSON).content("{not json"))
			.andExpect(status().isBadRequest())
			.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
			.andExpect(jsonPath("$.type").value("/problems/validation"))
			.andExpect(jsonPath("$.status").value(400))
			.andReturn();
		String body = result.getResponse().getContentAsString();
		assertThat(body).doesNotContain("Exception", "at com.", "at org.", "trace");
	}

	@Test
	void setsTheSecurityHeaders() throws Exception {
		this.mockMvc.perform(get("/api/v1/tasks"))
			.andExpect(header().string("X-Content-Type-Options", "nosniff"))
			.andExpect(header().string("Referrer-Policy", "no-referrer"))
			.andExpect(header().string("Content-Security-Policy", "default-src 'self'"));
	}

	@Test
	void readinessIsUpWhenTheDatabaseIsReachable() throws Exception {
		this.mockMvc.perform(get("/actuator/health/readiness"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.status").value("UP"));
	}

	@Test
	void publishesThePublicApiContract() throws Exception {
		this.mockMvc.perform(get("/v3/api-docs"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.paths['/api/v1/tasks'].get.operationId").value("listTasks"))
			.andExpect(jsonPath("$.paths['/api/v1/tasks'].post.operationId").value("createTask"))
			.andExpect(jsonPath("$.paths['/api/v1/tasks/{id}'].patch.operationId").value("completeTask"))
			.andExpect(jsonPath("$.paths['/api/v1/tasks/{id}'].delete.operationId").value("deleteTask"))
			.andExpect(jsonPath("$.paths['/api/v1/tasks'].post.responses['201']").exists())
			.andExpect(jsonPath("$.paths['/api/v1/tasks'].post.responses['400']").exists())
			.andExpect(jsonPath("$.paths['/api/v1/tasks/{id}'].patch.responses['404']").exists())
			.andExpect(jsonPath("$.paths['/api/v1/tasks/{id}'].patch.responses['409']").exists())
			.andExpect(jsonPath("$.paths['/api/v1/tasks/{id}'].delete.responses['204']").exists())
			.andExpect(jsonPath("$.paths['/api/v1/tasks'].get.responses['503']").exists())
			.andExpect(jsonPath("$.components.schemas.Task").exists());
	}

}
