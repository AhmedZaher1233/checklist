package com.todo.taskservice.repository;

import java.util.List;
import java.util.UUID;

import com.todo.taskservice.entity.Task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/** Stores and loads tasks; holds no business rules. */
public interface TaskRepository extends JpaRepository<Task, UUID> {

	List<Task> findAllByOrderByCreatedAtDescIdDesc();

	/** @return the number of rows changed: 0 when the task does not exist */
	@Modifying(flushAutomatically = true, clearAutomatically = true)
	@Query("update Task t set t.completed = true where t.id = :id")
	int markCompleted(@Param("id") UUID id);

	/** @return the number of rows deleted: 0 when the task does not exist */
	@Modifying(flushAutomatically = true, clearAutomatically = true)
	@Query("delete from Task t where t.id = :id")
	int deleteTaskById(@Param("id") UUID id);

}
