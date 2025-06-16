import api from './api';
import config from './config';

const ErrorResponse = (error) => {
    console.error("Error:", error);

    const status = error.response?.status;
    const detail = error.response?.data?.detail;

    const isArray = Array.isArray(detail);
    const msg = isArray ? detail[0]?.msg : detail;
    const ctx = isArray ? detail[0]?.ctx?.error : null;
    const input = isArray ? detail[0]?.input : null;

    return {
        error: msg || error.message,
        invalidInput: ctx || input || null,
        status,
    };
};

const ActivityServices = {
    // Get request for activities
    async getActivities() {
        try {
            const res = await api.get(`${config.apiUrl}/user/activities`);
            return { data: res.data, status: res.status };
        } catch (error) {
            console.error("Error fetching activities:", error);
            return ErrorResponse(error);
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
            return ErrorResponse(error);
        }
    },

    // Delete request to remove an activity
    async deleteActivity(activityId) {
        try {
            const res = await api.delete(`${config.apiUrl}/user/activities/${activityId}`);
            return { data: res.data, status: res.status };
        } catch (error) {
            console.error("Error deleting activity:", error);
            return ErrorResponse(error);
        }
    },

    // Put request to update an existing activity
    async putActivity(activityId, activityData) {
        try {
            const res = await api.put(`${config.apiUrl}/user/activities/${activityId}`, activityData);
            return { data: res.data, status: res.status };
        } catch (error) {
            console.error("Error updating activity:", error);
            return ErrorResponse(error);
        }
    },
}

export default ActivityServices;