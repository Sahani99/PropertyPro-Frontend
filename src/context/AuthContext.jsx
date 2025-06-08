import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// --- JSDoc types (if not using TypeScript) ---
/**
 * @typedef {object} UserType
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} role
 * @property {string} [dateJoined] // Optional, based on your backend model
 */
/**
 * @typedef {object} LoginCredentials
 * @property {string} email
 * @property {string} password
 */
/**
 * @typedef {object} LoginResult
 * @property {boolean} success
 * @property {string} [message]
 * @property {UserType} [user]
 * @property {string} [token]
 */
/**
 * @typedef {object} AuthContextType
 * @property {UserType|null} user
 * @property {string|null} token
 * @property {(credentials: LoginCredentials) => Promise<LoginResult>} login
 * @property {() => Promise<void>} logout // Made logout async just in case future needs
 * @property {boolean} loading // True when a login/logout operation is in progress
 * @property {boolean} initialLoading // True only during the initial token verification on app load
 * @property {boolean} isAuthenticated
 */
// --- End JSDoc types ---

/** @type {React.Context<AuthContextType | null>} */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token')); // Initialize token from localStorage
    const [loading, setLoading] = useState(false); // For login/logout operations
    const [initialLoading, setInitialLoading] = useState(true); // For initial token verification

    // --- API URL Configuration ---
    // VITE_API_URL should be the root of your backend, e.g., http://localhost:3001
    // We will append /api to it here.
    const API_ROOT_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const FULL_API_BASE_URL = `${API_ROOT_URL}/api`;

    // Set Axios base URL once. All requests will be relative to this.
    axios.defaults.baseURL = FULL_API_BASE_URL;
    console.log("AuthContext: Axios base URL set to:", FULL_API_BASE_URL);
    // --- End API URL Configuration ---

    // Effect to verify token on initial app load
    useEffect(() => {
        const verifyToken = async () => {
            // The `token` state is already initialized from localStorage.
            // The second useEffect (the one depending on `token`) will set the
            // Axios header if `token` is initially present.
            if (token) {
                console.log("AuthContext [verifyToken]: Found token in state. Verifying with backend...");
                // The Authorization header should be set by the other useEffect by now
                try {
                    const response = await axios.get('/users/me'); // Endpoint is /api/users/me
                    setUser(response.data.user || response.data); // Handle if backend returns { user: ... } or just data
                    // Token is already in state and localStorage, no need to set it again here
                    console.log("AuthContext [verifyToken]: Token verified. User set:", response.data.user || response.data);
                } catch (error) {
                    console.error("AuthContext [verifyToken]: Token verification failed.", error.response ? error.response.data : error.message);
                    localStorage.removeItem('token');
                    setToken(null); // This will trigger the other useEffect to clear the header
                    setUser(null);
                }
            } else {
                console.log("AuthContext [verifyToken]: No token found in state on initial load.");
            }
            setInitialLoading(false);
        };

        verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Runs ONCE on mount, token value at mount time is used.

    // Effect to manage Axios default Authorization header based on token state
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log("AuthContext [tokenEffect]: Axios Authorization header SET with new token.");
        } else {
            delete axios.defaults.headers.common['Authorization'];
            console.log("AuthContext [tokenEffect]: Axios Authorization header CLEARED.");
        }
    }, [token]); // Runs whenever the token state changes

    const login = async (credentials) => {
        setLoading(true);
        setError(null); // Clear previous errors
        try {
            console.log("AuthContext [login]: Attempting login for email:", credentials.email);
            // Endpoint is /api/users/login
            const response = await axios.post('/users/login', credentials);
            const { token: newToken, user: userData, message } = response.data;

            if (newToken && userData) {
                localStorage.setItem('token', newToken);
                setToken(newToken); // Update state, triggers header update effect
                setUser(userData);
                setLoading(false);
                console.log("AuthContext [login]: Login successful. User:", userData.name);
                return { success: true, user: userData, token: newToken, message: message || "Login successful!" };
            } else {
                // This case should ideally be handled by backend sending appropriate error status/message
                setLoading(false);
                const errMessage = response.data.message || "Login failed: Invalid response from server.";
                console.error("AuthContext [login]: Login failed. Server response issue:", response.data);
                setError(errMessage);
                return { success: false, message: errMessage };
            }
        } catch (error) {
            setLoading(false);
            const errorMessage = error.response?.data?.message || error.message || "Login failed due to an unknown error.";
            console.error("AuthContext [login]: Login API call failed:", errorMessage, error.response || error);
            setError(errorMessage);
            return { success: false, message: errorMessage };
        }
    };

    const logout = async () => { // async for potential future API call to invalidate token server-side
        setLoading(true);
        console.log("AuthContext [logout]: Logging out user.");
        localStorage.removeItem('token');
        setToken(null); // Update state, triggers header update effect
        setUser(null);
        // No need to manually delete axios.defaults.headers.common['Authorization']; the useEffect does it.
        setLoading(false);
        console.log("AuthContext [logout]: User logged out, token and user state cleared.");
    };

    // Add an error state to the context if you want to display general auth errors
    const [error, setError] = useState(null);


    /** @type {AuthContextType} */
    const contextValue = {
        user,
        token,
        login,
        logout,
        loading,
        initialLoading,
        isAuthenticated: !!user && !!token,
        error,      // Expose error state
        clearError: () => setError(null) // Method to clear error
    };

    // Show a loading screen ONLY during the very initial token verification phase
    if (initialLoading) {
        return <div>Loading authentication state...</div>; // Or a more sophisticated spinner
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

/** @returns {AuthContextType} */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider. Ensure your component is wrapped by <AuthProvider>.');
    }
    return context;
};