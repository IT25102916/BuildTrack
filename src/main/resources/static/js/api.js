/**
 * API Wrapper for handling HTTP requests and global error recovery.
 */

const API_BASE = '/api';

/**
 * Custom Error class to carry validation or standard error info from the backend
 */
class ApiError extends Error {
    constructor(status, message, details = null) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

/**
 * Core fetch wrapper that automatically handles JSON parsing and error throwing.
 */
async function fetchClient(endpoint, options = {}) {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, config);
        
        // Handle 204 No Content
        if (response.status === 204) {
            return null;
        }

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            // This maps to our Spring Boot ErrorResponse record or auth error map
            const errorMsg = data?.message || data?.error || 'An unexpected error occurred';
            let details = null;
            
            // If it's a validation error (400), Spring sends field errors in the message string usually,
            // or we could parse them if we sent them properly structured.
            // For now, pass the raw string so the UI can attempt to display it.
            if (response.status === 400 && data?.message) {
                try {
                    // Try parsing if we sent Map.toString() from Spring Boot
                    details = data.message; 
                } catch (e) {
                    details = data.message;
                }
            }
            
            throw new ApiError(response.status, errorMsg, details);
        }

        return data;
    } catch (error) {
        // If it's a network error (fetch failed entirely)
        if (!(error instanceof ApiError)) {
            console.error('Network or Parse Error:', error);
            throw new ApiError(0, 'Failed to connect to the server. Please check your connection.');
        }
        throw error; // Re-throw ApiError for UI to catch
    }
}

const api = {
    get: (endpoint) => fetchClient(endpoint),
    post: (endpoint, body) => fetchClient(endpoint, { method: 'POST', body }),
    put: (endpoint, body) => fetchClient(endpoint, { method: 'PUT', body }),
    delete: (endpoint) => fetchClient(endpoint, { method: 'DELETE' })
};
