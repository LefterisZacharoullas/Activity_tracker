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

export default ErrorResponse