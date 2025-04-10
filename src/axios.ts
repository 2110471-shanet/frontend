import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:5000";

const customAxios = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true,
});

export default customAxios;