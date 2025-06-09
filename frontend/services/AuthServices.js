import axios from 'axios';
import config from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthServices = {
    // Login request
    async login(username, password) {
        try {
            const params = new URLSearchParams();
            params.append('username', username);
            params.append('password', password);
            const res = await axios.post(`${config.apiUrl}/auth/token`, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const { access_token } = res.data;
            console.log("User logged in successfully:", res.data);
            await AsyncStorage.setItem('token', access_token);
            return { token: access_token };

        } catch (error) {
            return { error: error.message };
        }
    },

    // Logout request
    async logout() {
        try {
            await AsyncStorage.removeItem('token');
            console.log("User logged out successfully");
            return { success: true };
        } catch (error) {
            console.error("Error logging out:", error);
            return { error: error.message };
        }
    },

    // Check if user is authenticated
    async isAuthenticated() {
        try {
            const token = await AsyncStorage.getItem('token');
            return !!token; // Returns true if token exists, false otherwise
        } catch (error) {
            console.error("Error checking authentication status:", error);
            return false;
        }
    },

    // Register a new user
    async register(username, password) {
        try {
            const res = await axios.post(`${config.apiUrl}/auth/register`, {
                name: username,
                surname: null,
                email: null,
                active: true,
                password: password,
            },
            {headers: {'Content-Type': 'application/json'}}
            );
            console.log("User registered successfully:", res.data);
            return { success: true, user: res.data };
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                if (status === 422) {
                    return { error: "Validation error: " + error.response.data };
                } else if (status === 409) {
                    return { error: "User already exists" };
                } else {
                    return { error: "Error registering user: " + error.response.data };
                }
            }
            return { error: "Network or server error: " + error.message };
        }
    }
}

export default AuthServices;