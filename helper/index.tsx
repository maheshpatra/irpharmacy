import Axios, { AxiosError } from "axios";
import { _retrieveData, _storeData, _removeData } from "../local_storage";
import { router } from "expo-router";

export const AbortRequest = new AbortController();

const BASE_URL = "https://irhealthcareservice.com/app_api/v2/";

const instance = Axios.create({
    headers: { "Accept": "*/*" },
    baseURL: BASE_URL,
    timeout: 20000,
});

instance.interceptors.request.use(
    async (config) => {
        config.timeout = 20000;
        try {
            const token = await _retrieveData('ACCESS_TOKEN');
            const tokenStr = typeof token === 'string' ? token : null;
            if (tokenStr && tokenStr !== 'error') {
                config.headers.Authorization = `Bearer ${tokenStr}`;
            }
        } catch { }
        return config;
    },
    (error) => Promise.reject(error)
);

instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = await _retrieveData('REFRESH_TOKEN');
                if (!refreshToken || refreshToken === 'error') throw new Error("No refresh token");

                const formData = new FormData();
                formData.append('refresh_token', refreshToken);

                const response = await fetch(`${BASE_URL}auth/refresh_token.php`, {
                    method: 'POST',
                    body: formData,
                });
                const payload = await response.json();

                if (payload.status === 'success' && payload.data?.access_token) {
                    await _storeData('ACCESS_TOKEN', payload.data.access_token);
                    if (payload.data.refresh_token) {
                        await _storeData('REFRESH_TOKEN', payload.data.refresh_token);
                    }
                    originalRequest.headers.Authorization = `Bearer ${payload.data.access_token}`;
                    return instance(originalRequest);
                } else {
                    throw new Error("Refresh failed");
                }
            } catch {
                await _removeData('ACCESS_TOKEN');
                await _removeData('REFRESH_TOKEN');
                await _removeData('USER_DATA');
                router.replace('/');
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default instance;