import { getStoredSession } from "../utils/authStorage";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001/api";

const buildUrl = (path) => `${API_BASE_URL}${path}`;

export const request = async (path, options = {}) => {
    const session = getStoredSession();
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    if (session?.token) {
        headers.Authorization = `Bearer ${session.token}`;
    }

    const response = await fetch(buildUrl(path), {
        ...options,
        headers,
    });

    const rawText = await response.text();
    let data = null;

    if (rawText) {
        try {
            data = JSON.parse(rawText);
        } catch {
            data = { message: rawText };
        }
    }

    if (!response.ok) {
        throw new Error(data?.message || "Request failed");
    }

    return data;
};

export default API_BASE_URL;