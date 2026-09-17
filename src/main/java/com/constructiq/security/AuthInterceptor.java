package com.constructiq.security;

import com.constructiq.model.User;
import com.constructiq.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Arrays;
import java.util.Optional;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Autowired
    private UserRepository userRepository;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }

        HandlerMethod handlerMethod = (HandlerMethod) handler;

        // Determine if the endpoint requires role checking
        RequireRole classAnnotation = handlerMethod.getBeanType().getAnnotation(RequireRole.class);
        RequireRole methodAnnotation = handlerMethod.getMethodAnnotation(RequireRole.class);

        RequireRole requireRole = methodAnnotation != null ? methodAnnotation : classAnnotation;

        if (requireRole == null) {
            // No @RequireRole annotation means it's a public endpoint (or not secured by us)
            return true;
        }

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized - Please log in");
            return false;
        }

        Long userId = (Long) session.getAttribute("userId");
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isEmpty() || !userOpt.get().isActive()) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized - Invalid user or deactivated");
            return false;
        }

        User user = userOpt.get();
        String userRole = user.getRole().toLowerCase();

        // Admin has full access to everything, bypass role requirements
        if ("admin".equals(userRole)) {
            return true;
        }

        String[] allowedRoles = requireRole.value();
        
        // If allowedRoles is empty, it just means authentication is required, which we already verified
        if (allowedRoles.length == 0) {
            return true;
        }

        // Check if the user's role is in the allowed roles
        boolean isAuthorized = Arrays.stream(allowedRoles)
                .map(String::toLowerCase)
                .anyMatch(role -> role.equals(userRole));

        if (!isAuthorized) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Forbidden - Insufficient permissions");
            return false;
        }

        return true;
    }
}
