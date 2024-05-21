import axiosClient from "@/api/utils/axios_client";
import { defineStore, storeToRefs } from "pinia";
import { useAuthStore } from "@/api/stores";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { UploadReport } from "@/types/uploads/UploadReport";
import { AxiosProgressEvent } from "axios";

export const useReportStore = defineStore("report", () => {
    const authStore = useAuthStore();
    const { token } = storeToRefs(authStore);
    const route = useRoute();

    const reports = ref({
        data_list: []
    });
    const currentReport = ref<UploadReport>();

    const reportUrl = computed(() => {
        if (!route.path.startsWith("/reports")) {
            return undefined;
        }

        const reportId = route.params.reportId as string | undefined;
        if (reportId) {
            return `${import.meta.env.VITE_API_URL}/reports/${reportId}`
        }

        return undefined;
    });

    const dataUrl = computed(() => {
        return reportUrl.value ? `${reportUrl.value}/data` : undefined;
    });

    function getReportRouteById(reportId: string) {
        if (reportId) {
            return `/reports/${reportId}`
        }

        return undefined;
    }


    async function list(currentPage: number = 1, pageSize: number = 10) {
        const response = await axiosClient.get(
            `${import.meta.env.VITE_API_URL}/reports?current_page=${currentPage}&page_size=${pageSize}`,
            {
                headers: {
                    'Authorization': `Bearer ${token.value}`,
                    'Content-Type': 'application/json'
                }
            }
        )

        if (!response.data) {
            throw new Error("Dữ liệu không tìm thấy");
        }
        
        reports.value = response.data;
        return response.data;
    };

    async function deleteReport(reportId: string) {
        await axiosClient.delete(
            `${import.meta.env.VITE_API_URL}/reports/${reportId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token.value}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // await list();
    }

    async function getReportById(reportId: string) {
        const response = await axiosClient.get(
            `${import.meta.env.VITE_API_URL}/reports/${reportId}`,
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

        return response.data;
    }

    async function getCurrentReport() {
        if (!reportUrl.value) {
            return undefined;
        }

        const response = await axiosClient.get(
            reportUrl.value,
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

        currentReport.value = response.data;
        
        return response.data;
    }

    async function createReport(data: any, uploadProcessCallback: (_: AxiosProgressEvent) => void) {        
        const response = await axiosClient.post(
            // "http://127.0.0.1:8000/reports",
            `${import.meta.env.VITE_API_URL}/reports`,
            data,
            {
                headers: {
                    'Authorization': `Bearer ${token.value}`
                },
                onUploadProgress: uploadProcessCallback
            }
        )

        return response;
    }

    return {
        reports,
        reportUrl,
        dataUrl,
        currentReport,
        getReportRouteById,
        list,
        getReportById,
        getCurrentReport,
        createReport,
        deleteReport
    }
})
