import Axios from "axios";
import { _retrieveData, _storeData, _removeData } from "../local_storage";
import { router } from "expo-router";

export const AbortRequest = new AbortController();

const instance = Axios.create({
    headers: {
        "Accept": "*/*",
    },
    baseURL: "https://irhealthcareservice.com/app_api/v2/",
    timeout: 5000,
    signal: AbortRequest.signal
});

instance.interceptors.request.use(
    async (config) => {
        config.timeout = 5000;
        const token = await _retrieveData('ACCESS_TOKEN');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Prevent infinite loops
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await _retrieveData('REFRESH_TOKEN');
                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                // Call refresh token endpoint
                const formData = new FormData();
                formData.append('refresh_token', refreshToken);

                // Using fetch to avoid circular dependency with axios interceptors
                const response = await fetch("https://irhealthcareservice.com/app_api/v2/auth/refresh_token.php", {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();

                if (data.status === 'success' && data.access_token) {
                    // Update tokens
                    await _storeData('ACCESS_TOKEN', data.access_token);
                    if (data.refresh_token) {
                        await _storeData('REFRESH_TOKEN', data.refresh_token);
                    }

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
                    return instance(originalRequest);
                } else {
                    throw new Error("Refresh token retrieval failed");
                }
            } catch (err) {
                // Logout user if refresh fails
                await _removeData('ACCESS_TOKEN');
                await _removeData('REFRESH_TOKEN');
                await _removeData('USER_DATA');
                router.replace('/login');
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default instance;