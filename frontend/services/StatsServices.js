import api from './api';
import config from './config';
import ErrorResponse from "@/utilities/ErrorResponse";

const StatsServices = {
    // Get request for user stats
    async getUserStats(range) {
        try {
            const res = await api.get(`${config.apiUrl}/user/stats?range_conf=${range}`);
            return { data: res.data, status: res.status };
        } catch (error) {
            console.error("Error fetching user stats:", error);
            return ErrorResponse(error);
        }
    }
};

export default StatsServices;