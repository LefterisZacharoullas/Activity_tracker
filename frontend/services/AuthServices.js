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
            return { success: true, token: access_token, status: res.status };

        } catch (error) {
            return { success: false, error: error.message, status: error?.response?.status };
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
            return token ? true : false; // Returns true if token exists, false otherwise
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
            return { success: true, user: res.data, status: res.status };
        } catch (error) {
            if (error?.response) {
                const status = error.response.status;
                if (status === 422) {
                    return { error: "Validation error: " + error.message };
                } else if (status === 409) {
                    return { error: "User already exists" };
                } else if (status === 404) {
                    return {error: "Network error, Connect to the internet"}
                }
                else {
                    return { error: "Error registering user: " + error.message };
                }
            }
            return { error: "Network or server error: " + error.message, status: error?.response?.status };
        }
    }
}

export default AuthServices;