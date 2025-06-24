import config from './config';
import ErrorResponse from "@/utilities/ErrorResponse"
import axios from 'axios';

const PublicServices = {
    async getStatus() {
        try {
            const res = await axios.get(`${config.apiUrl}/status`);
            return { data: res.data, status: res.status };
        } catch (error) {
            console.error("Error fetching todo:", error);
            return ErrorResponse(error);
        }
    }
}

export default PublicServices;