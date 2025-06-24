import api from './api';
import config from './config';
import ErrorResponse from "@/utilities/ErrorResponse"

const TodoServices = {
    async getTodo() {
        try {
            const res = await api.get(`${config.apiUrl}/user/todo`);
            return { data: res.data, status: res.status };
        } catch (error) {
            console.error("Error fetching todo:", error);
            return ErrorResponse(error);
        }
    },

    async getTodobyStatus(statusId) {
        try {
            const res = await api.get(`${config.apiUrl}/user/todo/${statusId}`);
            return { data: res.data, status: res.status };
        } catch (error) {
            console.error("Error fetching todo:", error);
            return ErrorResponse(error);
        }
    },
    
    async postTodo(addTodo, statusId) {
        try {
            const res = await api.post(`${config.apiUrl}/user/todo/${statusId}`, addTodo);
            return { data: res.data, status: res.status };
        } catch (error) {
            console.error("Error creating todo:", error);
            return ErrorResponse(error);
        }
    },

    async deleteTodo(todoId) {
        try {
            const res = await api.delete(`${config.apiUrl}/user/todo/${todoId}`);
            return { data: res.data, status: res.status };
        } catch (error) {
            console.error("Error deleting todo:", error);
            return ErrorResponse(error);
        }
    },

    async patchTodoStatus(todoId, statusId) {
        try {
            const res = await api.patch(`${config.apiUrl}/user/todo/${todoId}/status/${statusId}`)
            return { data: res.data, status: res.status};
        } catch (error) {
            console.error("Error pathing todo:", error);
            return ErrorResponse(error);
        }
    }
}

export default TodoServices;