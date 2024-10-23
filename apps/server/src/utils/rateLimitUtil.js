const rateLimit = require('express-rate-limit');

/**
 * Creates a rate limiter middleware with custom options.
 * @param {string} type - The type of limiter (e.g., 'login', 'register', 'passwordReset')
 * @param {number} maxAttempts - Maximum number of attempts allowed
 * @param {number} windowMinutes - Time window in minutes
 * @return {Function} Express middleware function
 */
const createRateLimiter = (type, maxAttempts, windowMinutes) => {
    return rateLimit({
        windowMs: windowMinutes * 60 * 1000,
        max: maxAttempts,
        message: `Too many ${type} attempts. Please try again later.`,
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });
};

// Predefined limiters
const loginLimiter = createRateLimiter('login', 5, 15);
const registrationLimiter = createRateLimiter('registration', 3, 60);
const passwordResetLimiter = createRateLimiter('password reset', 3, 60);
const generalLimiter = createRateLimiter('request', 100, 15);

module.exports = {
    createRateLimiter,
    loginLimiter,
    registrationLimiter,
    passwordResetLimiter,
    generalLimiter,
};