package com.todo.taskservice.common;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/** Standard response headers (architecture/cross-cutting/security.md, rule 5). */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 2)
public class SecurityHeadersFilter extends OncePerRequestFilter {

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {
		response.setHeader("X-Content-Type-Options", "nosniff");
		response.setHeader("Referrer-Policy", "no-referrer");
		response.setHeader("Content-Security-Policy", "default-src 'self'");
		if (request.isSecure()) {
			response.setHeader("Strict-Transport-Security", "max-age=31536000");
		}
		chain.doFilter(request, response);
	}

}
