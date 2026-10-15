package com.todo.taskservice.entity;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** Persistence model of a task; never returned by a controller. */
@Entity
@Table(name = "task")
public class Task {

	@Id
	private UUID id;

	@Column(nullable = false, length = 100)
	private String title;

	@Column(nullable = false)
	private boolean completed;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	protected Task() {
	}

	public Task(UUID id, String title, boolean completed, Instant createdAt) {
		this.id = id;
		this.title = title;
		this.completed = completed;
		this.createdAt = createdAt;
	}

	public UUID getId() {
		return this.id;
	}

	public String getTitle() {
		return this.title;
	}

	public boolean isCompleted() {
		return this.completed;
	}

	public Instant getCreatedAt() {
		return this.createdAt;
	}

}
