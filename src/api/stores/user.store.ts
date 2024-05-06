import { defineStore, storeToRefs } from "pinia";
import { shallowRef, ref } from "vue"
import axios from "axios";
import axiosClient from "@/api/utils/axios_client";
import { useAuthStore } from "@/api/stores";

export const useUserStore = defineStore("user", () => {
    const authStore = useAuthStore();
    const { user, token } = storeToRefs(authStore);

    // const user = ref(JSON.parse(localStorage.getItem('user') || "{}"));
    // const token = shallowRef(localStorage.getItem('token'));

    async function getProfile() {
        const response = await axiosClient.get(
            `${import.meta.env.VITE_API_URL}/users/me`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )

        if (!response.data) {
            throw new Error("Dữ liệu không tìm thấy");
        }

        localStorage.setItem('user', JSON.stringify(response.data));
        user.value = response.data;
    }

    async function update(username: string) {
        const response = await axiosClient.put(
            `${import.meta.env.VITE_API_URL}/users/update`,
            {
                username: username
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.value}`
                }
            }
        )

        if (!response.data) {
            throw new Error("Dữ liệu không tìm thấy");
        }

        user.value.username = username;
        localStorage.setItem('user', JSON.stringify(user.value));
    }

    async function changePassword(oldPassword: string, password: string, passwordConfirmation: string) {
        const response = await axiosClient.put(
            `${import.meta.env.VITE_API_URL}/users/change_password`,
            {
                old_password: oldPassword,
                password: password,
                password_confirmation: passwordConfirmation 
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.value}`
                }
            }
        )

        if (!response.data) {
            throw new Error("Dữ liệu không tìm thấy");
        }
    }

    return {
        user,
        getProfile,
        update,
        changePassword
    }
})