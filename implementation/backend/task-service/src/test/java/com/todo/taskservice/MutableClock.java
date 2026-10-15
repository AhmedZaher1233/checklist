package com.todo.taskservice;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;

/** A UTC clock tests can fix to a given instant, or let follow the system clock. */
public class MutableClock extends Clock {

	private volatile Instant fixed;

	public void fixAt(Instant instant) {
		this.fixed = instant;
	}

	public void useSystemTime() {
		this.fixed = null;
	}

	@Override
	public ZoneId getZone() {
		return ZoneOffset.UTC;
	}

	@Override
	public Clock withZone(ZoneId zone) {
		throw new UnsupportedOperationException("The test clock is always UTC");
	}

	@Override
	public Instant instant() {
		Instant current = this.fixed;
		return (current != null) ? current : Instant.now();
	}

}
