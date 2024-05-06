import axiosClient from "../utils/axios_client";
import { defineStore } from "pinia";
import { shallowRef, ref } from "vue"
import { useRouter } from "vue-router";

const loginUrl = `${import.meta.env.VITE_API_URL}/auth/login`;
const registerUrl = `${import.meta.env.VITE_API_URL}/auth/register`;

export const useAuthStore = defineStore("auth", () => {
    const user = ref(JSON.parse(localStorage.getItem('user') || "{}"));
    const token = shallowRef(localStorage.getItem('token'));
    const router = useRouter();

    async function register(username: string, email: string, password: string, confirmPassword: string) {
        const response = await axiosClient.post(
            registerUrl,
            {
                username: username,
                email: email,
                password: password,
                password_confirmation: confirmPassword
            }
        )

        if (!response.data) {
            throw new Error("Dữ liệu không tìm thấy");
        }
    }

    async function login(email:string, password:string) {
        const response = await axiosClient.post(
            loginUrl, 
            {
                email: email,
                password: password
            },
            {
                timeout: 10000,
                timeoutErrorMessage: "Timeout"
            }
        )

        if (!response.data || !response.data.token || !response.data.user) {
            throw new Error("Dữ liệu không tìm thấy");
        }

        user.value = response.data.user;
        token.value = response.data.token;

        localStorage.setItem('user', JSON.stringify(user.value));
        if (token.value)
            localStorage.setItem('token', token.value);
        router.push("/");        
    }

    function isAuthenticated() {
        return token.value && token.value !== "";
    }

    function logout() {
        user.value = {};
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        user.value = {};
        token.value = null;
        router.push("/login");
    }

    return {
        user,
        token,
        login,
        register,
        isAuthenticated,
        logout
    };
});