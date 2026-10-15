package com.todo.taskservice.exception;

import java.sql.SQLException;

import org.junit.jupiter.api.Test;

import org.springframework.orm.jpa.JpaSystemException;

import static org.assertj.core.api.Assertions.assertThat;

/** FR-014: a broken database connection is "service unavailable" whatever exception wraps it. */
class GlobalExceptionHandlerTest {

	@Test
	void recognisesAConnectionFailureHiddenBehindARollbackError() {
		SQLException closed = new SQLException("Connection is closed", "08003");
		JpaSystemException rollbackFailed = new JpaSystemException(new RuntimeException("Unable to rollback", closed));

		assertThat(GlobalExceptionHandler.isDatabaseUnavailable(rollbackFailed, 0)).isTrue();
	}

	@Test
	void recognisesAFailedRollbackWithoutSqlState() {
		// what Spring throws when the query failed on a dropped connection: the rollback error, no SQL state
		JpaSystemException rollbackFailed = new JpaSystemException(new org.hibernate.TransactionException(
				"Unable to rollback against JDBC Connection", new SQLException("Connection is closed")));

		assertThat(GlobalExceptionHandler.isDatabaseUnavailable(rollbackFailed, 0)).isTrue();
	}

	@Test
	void recognisesAConnectionFailureInASuppressedException() {
		RuntimeException outer = new RuntimeException("rollback failed");
		outer.addSuppressed(new java.net.SocketException("connection aborted"));

		assertThat(GlobalExceptionHandler.isDatabaseUnavailable(outer, 0)).isTrue();
	}

	@Test
	void anOrdinaryErrorIsNotADatabaseOutage() {
		assertThat(GlobalExceptionHandler.isDatabaseUnavailable(new IllegalStateException("bug"), 0)).isFalse();
		assertThat(GlobalExceptionHandler.isDatabaseUnavailable(new SQLException("syntax", "42601"), 0)).isFalse();
	}

}
