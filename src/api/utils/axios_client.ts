import axios from "axios";

import router from "@/router";

const getAxiosClient = () => {
    const axiosClient = axios.create();
    axiosClient.interceptors.response.use(
        response => response,
        error => {
            if (error.response.status == 401) {
                if (router.currentRoute.value.path !== "/auth/login") {
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
                    router.push("/login");
                }
            }

            return Promise.reject(error);
        }
    )

    return axiosClient;
}

const axiosClient = getAxiosClient();

export default axiosClient;