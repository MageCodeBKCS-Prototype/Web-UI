<script lang="ts" setup>
import { computed, ref, onMounted } from "vue";
import { useVModel } from "@vueuse/core";
import UploadStatus from "./UploadStatus.vue";
import UploadsTableInfoDialog from "./UploadsTableInfoDialog.vue";
import UploadsTableDeleteDialog from "./UploadsTableDeleteDialog.vue";
import { useReportStore } from "@/api/stores";
import { UploadReport } from "@/types/uploads/UploadReport";

interface Props {
  search?: string;
}
const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(["update:search", "update:reports"]);
const reportStore = useReportStore();

// Table search value.
const search = useVModel(props, "search", emit);

// Table sort.
const sortBy = computed<any>(() => [{
  key: "date",
  order: "desc"
}]);

// Table headers
const headers = computed<any>(() => [
  { title: "Name", key: "name", sortable: true },
  { title: "Upload date", key: "date", sortable: true },
  { title: "Status", key: "status", sortable: true },
  { title: "", key: "actions", sortable: false, align: "right" },
]);


const reportList = ref({
  data_list: []
});
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const loadReportList = async () => {
  const response = await reportStore.list(currentPage.value, pageSize.value);
  reportList.value.data_list = response.data_list;
  currentPage.value = response.current_page;
  pageSize.value = response.page_size;
  total.value = response.total;
}

onMounted(async () => {
  await loadReportList();
});

// Table items
// In the format for the Vuetify data-table.
const items = computed(() =>
  // reportStore.reports.
  reportList.value.data_list.map((report: any) => {
    report.name = report.dataset.name;
    report.date = report.created_at;
    report.reportId = report.id;
    return {
      name: report.dataset.name,
      date: new Date(report.created_at),
      status: report.status,
      isFromSharing: false,
      report: report,
      done:
        report.status === "error" ||
        report.status === "failed" ||
        report.status === "finished" ||
        report.status === "deleted",
    }
  })  
);
const totalPages = computed(() => total.value % pageSize.value == 0 ? Math.floor(total.value / pageSize.value) : Math.floor(total.value / pageSize.value) + 1);

const selectedReportId = ref<string | undefined>();
const selectedReport = ref<UploadReport | undefined>();

const infoDialog = ref(false);
const deleteDialog = ref(false);
const shareDialog = ref(false);

// Open the dialog for a specific report.
const openInfoDialog = (e: Event, value: any): void => {
  selectedReportId.value = value.item.report.id;
  selectedReport.value = value.item.report;
  infoDialog.value = true;
};

// Open the dialog for deleting a specific report.
const openDeleteDialog = (item: any): void => {
  selectedReportId.value = item.report.reportId;
  selectedReport.value = item.report;
  deleteDialog.value = true;
};

// Open the dialog for sharing a specific report.
const openShareDialog = (item: any): void => {
  selectedReportId.value = item.report.reportId;
  selectedReport.value = item.report;
  shareDialog.value = true;
};

const handleCurrentPageChange = async (page: number) => {
  await loadReportList();
}

const handlePageSizeChange = async (pageSixe: number) => {
  await loadReportList();
}

</script>

<template>
  <div>
    <v-data-table
      v-model:search="search"
      :headers="headers"
      :items="items"
      :sort-by="sortBy"
      :items-per-page="0"
      density="comfortable"
      @click:row="openInfoDialog"
    >
      <!-- Status -->
      <template #item.status="{ item }">
        <upload-status :status="item.status" />
      </template>

      <template #item.date="{ item }">
        <file-timestamp :timestamp="item.date" long/>
      </template>

      <!-- Actions -->
      <template #item.actions="{ item }">
        <!-- Delete -->
        <v-btn
          variant="text"
          color="error"
          icon="mdi-delete"
          :disabled="!item.done"
          @click.stop="openDeleteDialog(item)"
        />

        <!-- Share-->
        <v-btn
          variant="text"
          color="primary"
          icon="mdi-share-variant"
          :disabled="item.status !== 'finished'"
          @click.stop="openShareDialog(item)"
        />
      </template>

      <template #no-data>
        Your uploads will appear here.
        See our <a href="https://dolos.ugent.be/try/">demo</a> page for an example of a report.
      </template>

      <template v-slot:bottom> </template>
    </v-data-table>

    <div class="ml-2" style="display: flex; flex-direction: row; justify-content: space-around;">
      <div style="display: flex; flex-direction: row; align-items: center;">
        <p class="mr-4 mb-4">Items per page</p>
        <v-select
          style="max-width: 70%;"
          label=""
          v-model="pageSize"
          :items="[10, 15, 20, 25, 30]"
          @update:modelValue="handlePageSizeChange"
        />
      </div>

      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="5"
        @update:modelValue="handleCurrentPageChange"
      ></v-pagination>
    </div>

    <uploads-table-info-dialog
      v-if="selectedReport"
      v-model:open="infoDialog"
      :report="selectedReport"
      @open:share="shareDialog = true"
      @open:delete="deleteDialog = true"
    />

    <!-- <uploads-table-delete-dialog
      v-if="selectedReport"
      v-model:open="deleteDialog"
      :report="selectedReport"
    /> -->

    <uploads-table-delete-dialog
      v-if="selectedReport"
      v-model:open="deleteDialog"
      :report="selectedReport"
      @update:reports=loadReportList
    />

    <uploads-table-share-dialog
      v-if="selectedReport"
      v-model:open="shareDialog"
      :report="selectedReport"
    />
  </div>
</template>
