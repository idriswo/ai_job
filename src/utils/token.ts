import axios from "axios";

export function saveToken(token: string) {
    localStorage.setItem("store_token", token);
}

export const getToken = () => {
    return localStorage.getItem("store_token");
};

export const removeToken = () => {
    localStorage.removeItem("store_token");
};

export function saveRefreshToken(token: string) {
    localStorage.setItem("refresh_token", token);
}

export const getRefreshToken = () => {
    return localStorage.getItem("refresh_token");
};

export const removeRefreshToken = () => {
    localStorage.removeItem("refresh_token");
};

export const axiosRequest = axios.create({
    baseURL: import.meta.env.VITE_API_URL, 
});

axiosRequest.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

axiosRequest.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/api/Auth/login')) {
            originalRequest._retry = true;
            
            const refreshToken = getRefreshToken();
            if (refreshToken) {
                try {
                    const { data } = await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/Auth/refresh`, {
                        refreshToken
                    });
                    
                    const newToken = data?.data?.token || data?.token || data?.accessToken || data?.access_token;
                    const newRefreshToken = data?.data?.refreshToken || data?.refreshToken;
                    
                    if (newToken) {
                        saveToken(newToken);
                        if (newRefreshToken) saveRefreshToken(newRefreshToken);
                        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                        return axiosRequest(originalRequest);
                    }
                } catch (refreshError) {
                    removeToken();
                    removeRefreshToken();
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            } else {
                removeToken();
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

export const logoutUser = async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
        try {
            await axiosRequest.post('/api/Auth/logout', { refreshToken });
        } catch (error) {
            console.error("Logout API failed", error);
        }
    }
    removeToken();
    removeRefreshToken();
    window.location.href = '/';
};