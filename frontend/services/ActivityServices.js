import api from './api';
import config from './config';

const ActivityServices = {
    // Get request for activities
    async getActivities() {
        try {
            const res = await api.get(`${config.apiUrl}/user/activities`);

            if ( res.status === 200) {
                console.log("Activities fetched successfully:", res.data);
                return res.data;
            }

            console.warn("Unexpected success status:", res.status);
            return { error: `Unexpected status: ${res.status}` };
            
        } catch (error) {
            console.error("Error fetching activities:", error);
            return { error: error.message };
        }
    },
    // Post request to create a new activity
    // Example of activityData:
    // {"exercise_name": "string","exercise_weight": 0,"exercise_reps": 0,"date": "2025-06-09"}
    async postActivity(activityData) {
        try {
            const res = await api.post(`${config.apiUrl}/user/activities`, activityData);

            if (res.status === 200) {
                console.log("Activity created successfully:", res.data);
                return res.data;
            }

            console.warn("Unexpected success status:", res.status);
            return { error: `Unexpected status: ${res.status}` };

        } catch (error) {
            if (error.response) {
                const status = error.response.status;

                if (status === 422) {
                    console.error("Validation error:", error.response.data);
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
    },

    // Delete request to remove an activity
    async deleteActivity(activityId) {
        try {
            const res = await api.delete(`${config.apiUrl}/user/activities/${activityId}`);

            if (res.status === 200) {
                console.log("Activity deleted successfully:", res.data);
                return res.data;
            }

            console.warn("Unexpected success status:", res.status);
            return { error: `Unexpected status: ${res.status}` };

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