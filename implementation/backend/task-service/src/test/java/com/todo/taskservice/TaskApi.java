package com.todo.taskservice;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Small helper that calls the Task Service API the way a client does. */
public final class TaskApi {

	private static final Pattern ID = Pattern.compile("\"id\"\\s*:\\s*\"([0-9a-f-]{36})\"");

	private final MockMvc mockMvc;

	public TaskApi(MockMvc mockMvc) {
		this.mockMvc = mockMvc;
	}

	public ResultActions list() throws Exception {
		return this.mockMvc.perform(get("/api/v1/tasks"));
	}

	public ResultActions create(String title) throws Exception {
		return createRaw("{\"title\":" + json(title) + "}");
	}

	public ResultActions createRaw(String body) throws Exception {
		return this.mockMvc.perform(post("/api/v1/tasks").contentType(MediaType.APPLICATION_JSON).content(body));
	}

	/** Creates a task and returns its id. */
	public String createId(String title) throws Exception {
		String body = create(title).andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
		Matcher matcher = ID.matcher(body);
		if (!matcher.find()) {
			throw new IllegalStateException("No id in " + body);
		}
		return matcher.group(1);
	}

	public ResultActions complete(String id, String completedJson) throws Exception {
		return this.mockMvc.perform(patch("/api/v1/tasks/" + id).contentType(MediaType.APPLICATION_JSON)
			.content("{\"completed\":" + completedJson + "}"));
	}

	public ResultActions delete(String id) throws Exception {
		return this.mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
			.delete("/api/v1/tasks/" + id));
	}

	private static String json(String value) {
		if (value == null) {
			return "null";
		}
		StringBuilder out = new StringBuilder("\"");
		for (char c : value.toCharArray()) {
			switch (c) {
				case '"' -> out.append("\\\"");
				case '\\' -> out.append("\\\\");
				default -> {
					if (c < 0x20) {
						out.append(String.format("\\u%04x", (int) c));
					}
					else {
						out.append(c);
					}
				}
			}
		}
		return out.append('"').toString();
	}

}
