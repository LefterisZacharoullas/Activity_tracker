import api from "./api"
import ErrorResponse from "@/utilities/ErrorResponse"
import config from "./config";

const BookServices = {
    async postBook(newBook) {
        try {
            const res = await api.post(`${config.apiUrl}/user/book`, newBook);
            return {data: res.data, status: res.status}
        } catch (error) {
            console.error("Error to call postBook")
            return ErrorResponse(error);
        }
    }, 

    async getBook() {
        try {
            const res = await api.get(`${config.apiUrl}/user/books`)
            return {data: res.data, status: res.status};
        } catch (error) {
            console.error("Error to call getBooks")
            return ErrorResponse(error);
        }
    },

    async deleteBook(id) {
        try {
            const res = await api.delete(`${config.apiUrl}/user/book/${id}`)
            return {data: res.data, status: res.status}
        } catch (error) {
            console.error("Error deleteing data");
            return ErrorResponse(error);
        }
    },

    async updateBook(id, book) {
        try {
            const res = await api.put(`${config.apiUrl}/user/book/${id}`, book)
            return {data: res.data, status: res.status}
        } catch (error) {
            console.error("Error puting data");
            return ErrorResponse(error);
        }
    },

    async postBookProgress(bookId, statusID, progress) {
        try {
            console.log("postBookProgress called with:", { bookId, statusID, progress }); // log input
            const res = await api.post(`${config.apiUrl}/user/reading/${bookId}/status/${statusID}`, progress);
            return {data: res.data, status: res.status}
        } catch (error) {
            console.error("Error to call postBookProgress")
            return ErrorResponse(error);
        }
    }
}

export default BookServices;