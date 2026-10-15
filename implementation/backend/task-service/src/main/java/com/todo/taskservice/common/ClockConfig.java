package com.todo.taskservice.common;

import java.time.Clock;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** The single source of the current time (architecture/cross-cutting/date-and-time.md, rule 3). */
@Configuration(proxyBeanMethods = false)
public class ClockConfig {

	@Bean
	public Clock clock() {
		return Clock.systemUTC();
	}

}
