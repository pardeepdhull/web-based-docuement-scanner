/**
 * DocuScan - Authentication Module
 * Handles user authentication for browser-front-end demonstration
 * Uses localStorage for credential storage (demo purposes only)
 */

const DocuAuth = (function() {
    const AUTH_KEY = 'docuscan_auth';
    const USERS_KEY = 'docuscan_users';
    
    // Default demo user credentials
    const DEFAULT_USER = {
        username: 'admin',
        // SHA-256 hash of 'password123' - for demo purposes
        // In production, use proper server-side authentication
        passwordHash: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'
    };

    /**
     * Initialize authentication system
     * Sets up default user if not exists
     */
    function init() {
        const users = getUsers();
        if (users.length === 0) {
            // Create default demo user
            saveUsers([DEFAULT_USER]);
        }
    }

    /**
     * Get users from localStorage
     * @returns {Array} Array of user objects
     */
    function getUsers() {
        try {
            const usersJson = localStorage.getItem(USERS_KEY);
            return usersJson ? JSON.parse(usersJson) : [];
        } catch (error) {
            console.error('Error reading users:', error);
            return [];
        }
    }

    /**
     * Save users to localStorage
     * @param {Array} users - Array of user objects
     */
    function saveUsers(users) {
        try {
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        } catch (error) {
            console.error('Error saving users:', error);
        }
    }

    /**
     * Hash a password using SHA-256
     * @param {string} password - Plain text password
     * @returns {Promise<string>} - Hex encoded hash
     */
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Attempt to log in a user
     * @param {string} username - Username
     * @param {string} password - Plain text password
     * @returns {Promise<{success: boolean, message: string}>}
     */
    async function login(username, password) {
        // Validate inputs
        if (!username || !username.trim()) {
            return { success: false, message: 'Please enter a username' };
        }
        if (!password) {
            return { success: false, message: 'Please enter a password' };
        }

        const users = getUsers();
        const user = users.find(u => u.username.toLowerCase().trim() === username.toLowerCase().trim());

        if (!user) {
            return { success: false, message: 'Invalid username or password' };
        }

        const inputHash = await hashPassword(password);
        if (inputHash !== user.passwordHash) {
            return { success: false, message: 'Invalid username or password' };
        }

        // Set authenticated session
        const session = {
            username: user.username,
            loggedInAt: new Date().toISOString()
        };
        
        try {
            localStorage.setItem(AUTH_KEY, JSON.stringify(session));
            return { success: true, message: 'Login successful' };
        } catch (error) {
            console.error('Error saving session:', error);
            return { success: false, message: 'Failed to save session' };
        }
    }

    /**
     * Log out the current user
     */
    function logout() {
        try {
            localStorage.removeItem(AUTH_KEY);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }

    /**
     * Check if user is currently authenticated
     * @returns {boolean}
     */
    function isAuthenticated() {
        try {
            const sessionJson = localStorage.getItem(AUTH_KEY);
            if (!sessionJson) return false;
            
            const session = JSON.parse(sessionJson);
            return session && session.username && session.loggedInAt;
        } catch (error) {
            console.error('Error checking authentication:', error);
            return false;
        }
    }

    /**
     * Get current session info
     * @returns {Object|null}
     */
    function getSession() {
        try {
            const sessionJson = localStorage.getItem(AUTH_KEY);
            if (!sessionJson) return null;
            return JSON.parse(sessionJson);
        } catch (error) {
            console.error('Error reading session:', error);
            return null;
        }
    }

    /**
     * Get current username
     * @returns {string|null}
     */
    function getCurrentUsername() {
        const session = getSession();
        return session ? session.username : null;
    }

    // Initialize on load
    init();

    // Public API
    return {
        login,
        logout,
        isAuthenticated,
        getSession,
        getCurrentUsername
    };
})();
