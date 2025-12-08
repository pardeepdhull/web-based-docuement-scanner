/**
 * DocuScan - Authentication Module
 * Handles user authentication for browser-front-end demonstration
 * Uses localStorage for credential storage (demo purposes only)
 */

const DocuAuth = (function() {
    const AUTH_KEY = 'docuscan_auth';
    const USERS_KEY = 'docuscan_users';
    
    // Default admin user credentials
    const DEFAULT_USER = {
        username: 'admin',
        // SHA-256 hash of 'admin123' - for demo purposes
        // In production, use proper server-side authentication
        passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
        isAdmin: true,
        isActive: true
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
            return { success: false, message: 'User not found. Please check your username.' };
        }

        // Check if user is active
        if (user.isActive === false) {
            return { success: false, message: 'Your account is inactive. Please contact an administrator.' };
        }

        const inputHash = await hashPassword(password);
        if (inputHash !== user.passwordHash) {
            return { success: false, message: 'Incorrect password. Please try again.' };
        }

        // Set authenticated session
        const session = {
            username: user.username,
            isAdmin: user.isAdmin || false,
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

    /**
     * Check if current user is an admin
     * @returns {boolean}
     */
    function isAdmin() {
        const session = getSession();
        return session && session.isAdmin === true;
    }

    /**
     * Register a new user
     * @param {string} username - Username
     * @param {string} password - Plain text password
     * @returns {Promise<{success: boolean, message: string}>}
     */
    async function register(username, password) {
        // Validate inputs
        if (!username || !username.trim()) {
            return { success: false, message: 'Please enter a username' };
        }
        if (!password || !password.trim()) {
            return { success: false, message: 'Please enter a password' };
        }

        const trimmedUsername = username.trim();

        // Check username length
        if (trimmedUsername.length < 3) {
            return { success: false, message: 'Username must be at least 3 characters long' };
        }

        // Check password length
        if (password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters long' };
        }

        const users = getUsers();
        
        // Check if username already exists (case-insensitive)
        const existingUser = users.find(u => u.username.toLowerCase() === trimmedUsername.toLowerCase());
        if (existingUser) {
            return { success: false, message: 'Username already exists. Please choose a different username.' };
        }

        // Hash the password
        const passwordHash = await hashPassword(password);

        // Create new user
        const newUser = {
            username: trimmedUsername,
            passwordHash,
            isAdmin: false,
            isActive: true,
            createdAt: new Date().toISOString()
        };

        // Add user to the list
        users.push(newUser);
        saveUsers(users);

        return { success: true, message: 'Registration successful! You can now log in.' };
    }

    /**
     * Get all users (admin only)
     * @returns {Array} Array of user objects (without password hashes)
     */
    function getAllUsers() {
        if (!isAdmin()) {
            return [];
        }

        const users = getUsers();
        // Return users without password hashes for security
        return users.map(u => ({
            username: u.username,
            isAdmin: u.isAdmin || false,
            isActive: u.isActive !== false, // default to true if not set
            createdAt: u.createdAt
        }));
    }

    /**
     * Delete a user (admin only)
     * @param {string} username - Username to delete
     * @returns {boolean} Success status
     */
    function deleteUser(username) {
        if (!isAdmin()) {
            return false;
        }

        const currentUser = getCurrentUsername();
        if (currentUser === username) {
            return false; // Cannot delete self
        }

        const users = getUsers();
        const filteredUsers = users.filter(u => u.username !== username);
        
        if (filteredUsers.length === users.length) {
            return false; // User not found
        }

        saveUsers(filteredUsers);
        return true;
    }

    /**
     * Toggle user active status (admin only)
     * @param {string} username - Username to toggle
     * @param {boolean} isActive - New active status
     * @returns {boolean} Success status
     */
    function setUserStatus(username, isActive) {
        if (!isAdmin()) {
            return false;
        }

        const currentUser = getCurrentUsername();
        if (currentUser === username) {
            return false; // Cannot modify self
        }

        const users = getUsers();
        const user = users.find(u => u.username === username);
        
        if (!user) {
            return false; // User not found
        }

        user.isActive = isActive;
        saveUsers(users);
        return true;
    }

    // Initialize on load
    init();

    // Public API
    return {
        login,
        logout,
        isAuthenticated,
        getSession,
        getCurrentUsername,
        isAdmin,
        register,
        getAllUsers,
        deleteUser,
        setUserStatus
    };
})();
