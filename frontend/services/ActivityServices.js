import api from './api';
import config from './config';

const ActivityServices = {
    // Get request for activities
    async getActivities() {
        try {
            const res = await api.get(`${config.apiUrl}/user/activities`);
            return { data: res.data, status: res.status };
        } catch (error) {
            console.error("Error fetching activities:", error);
            const status = error.response?.status;
            const detail = error.response?.data?.detail;
            const msg = detail?.[0]?.msg;
            const input = detail?.[0]?.input;
            return {
                error: msg || error.message,
                invalidInput: input,
                status,
            };
        }
    },
    // Post request to create a new activity
    // Example of activityData:
    // {"exercise_name": "string","exercise_weight": 0,"exercise_reps": 0,"date": "2025-06-09"}
    async postActivity(activityData) {
        try {
            const res = await api.post(`${config.apiUrl}/user/activities`, activityData);
            return { data: res.data, status: res.status };
        } catch (error) {
            console.error("Error creating activity:", error);
            const status = error.response?.status;
            const detail = error.response?.data?.detail;

            // Optional: extract specific error messages (e.g., for validation)
            const msg = detail?.[0]?.msg;
            const input = detail?.[0]?.input;

            return {
                error: msg || error.message,
                invalidInput: input,
                status,
            };
        }
    },

    // Delete request to remove an activity
    async deleteActivity(activityId) {
        try {
            const res = await api.delete(`${config.apiUrl}/user/activities/${activityId}`);
            return { data: res.data, status: res.status };
        } catch (error) {
            if (error.response) {
                const status = error.response.status;

                if (status === 404) {
                    console.error("Activity not found:", error.response.data);
                    return { error: error.response.data };
                }

                if (status === 401) {
                    console.error("Not authenticated", error.response.data);
                    return { error: error.response.data };
                }

                console.error(`Request failed with status ${status}:`, error.response.data);
                return { error: error.response.data };
            }

            console.error("Network or unexpected error:", error.message);
            return { error: error.message };
        }
    }
}

export default ActivityServices;