package com.todo.taskservice.controller;

import com.todo.taskservice.AbstractPostgresIT;
import com.todo.taskservice.TaskApi;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** US3: deleting a task (T060, T062, T063, T065). */
class TaskDeleteIT extends AbstractPostgresIT {

	private TaskApi api;

	@BeforeEach
	void setUp() {
		this.api = new TaskApi(this.mockMvc);
	}

	@Test
	void deletesATaskAndKeepsTheOthers() throws Exception {
		// US3-AS1
		String buyMilk = this.api.createId("Buy milk");
		this.api.createId("Call Sam");

		this.api.delete(buyMilk).andExpect(status().isNoContent());

		this.api.list().andExpect(jsonPath("$", hasSize(1))).andExpect(jsonPath("$[0].title").value("Call Sam"));
	}

	@Test
	void deletesACompletedTask() throws Exception {
		// US3-AS2
		String id = this.api.createId("Buy milk");
		this.api.complete(id, "true").andExpect(status().isOk());

		this.api.delete(id).andExpect(status().isNoContent());

		this.api.list().andExpect(jsonPath("$", hasSize(0)));
	}

	@Test
	void aDeletedTaskIsGoneForGood() throws Exception {
		// US3-AS3
		String id = this.api.createId("Buy milk");
		this.api.delete(id).andExpect(status().isNoContent());

		this.api.list().andExpect(jsonPath("$", hasSize(0)));
		this.api.delete(id)
			.andExpect(status().isNotFound())
			.andExpect(jsonPath("$.type").value("/problems/task-not-found"));
	}

	@Test
	void deletingATaskThatDoesNotExistIsNotFound() throws Exception {
		// Edge (gone, delete)
		this.api.delete("6f1d1b8e-0000-4000-8000-000000000000")
			.andExpect(status().isNotFound())
			.andExpect(jsonPath("$.type").value("/problems/task-not-found"));
		this.api.delete("not-a-uuid")
			.andExpect(status().isNotFound())
			.andExpect(jsonPath("$.type").value("/problems/task-not-found"));
	}

}
