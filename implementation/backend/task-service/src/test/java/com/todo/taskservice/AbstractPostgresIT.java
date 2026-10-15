package com.todo.taskservice;

import java.time.Clock;

import com.todo.taskservice.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.testcontainers.postgresql.PostgreSQLContainer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Service tests against a real PostgreSQL 18.6 in Docker. One container and one application context are shared by
 * every subclass; each test starts from an empty task table and the system clock.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Import(AbstractPostgresIT.TestClockConfig.class)
public abstract class AbstractPostgresIT {

	public static final String POSTGRES_IMAGE = "postgres:18.6";

	@ServiceConnection
	protected static final PostgreSQLContainer POSTGRES = new PostgreSQLContainer(POSTGRES_IMAGE);

	static {
		POSTGRES.start();
	}

	@Autowired
	protected MockMvc mockMvc;

	@Autowired
	protected TaskRepository taskRepository;

	@Autowired
	protected MutableClock clock;

	@BeforeEach
	void resetState() {
		this.taskRepository.deleteAll();
		this.clock.useSystemTime();
	}

	@TestConfiguration(proxyBeanMethods = false)
	static class TestClockConfig {

		@Bean
		@Primary
		MutableClock testClock() {
			return new MutableClock();
		}

	}

}
