<template>
  <div class="heading">
    <h2 class="heading-title">
      Vulnerabilities of {{ file.shortPath }}
    </h2>
    <div class="heading-subtitle text-medium-emphasis">
      List of vulnerabilities of the current submission.
    </div>
  </div>

  <h3 v-if="vulnerabilities.length <= 0" class="heading-title">
    No vulnerabilities found in {{ file.shortPath }}
  </h3>

  <v-row v-if="vulnerabilities.length > 0">
    <v-col cols="12" md="8">
      <v-alert
        v-if="selectedVulnerability"
        density="compact"
        :text="selectedVulnerability.description"
        :title="selectedVulnerability.name"
        :color="severityMapping(selectedVulnerability.severity).darken"
        :icon="severityMapping(selectedVulnerability.severity).icon"
      ></v-alert>

      <v-card class="mt-4">
        <v-card-title>Code viewer</v-card-title>
        <v-card-subtitle class="pb-2">
          View the code of this submission.
        </v-card-subtitle>

        <my-submission-code class="submission-code"
                            language="python"
                            :coordination="selectedVulnerability?.coordination"
                            :severity="selectedVulnerability?.severity"
                            :currentFile="file"
        />
      </v-card>
    </v-col>

    <v-col cols="12" md="4">
      <v-card title="Vulnerabilities">
<!--        <template v-slot:append>-->
<!--          <v-select-->
<!--            :items="['All', 'Warning', 'Error']"-->
<!--          ></v-select>-->
<!--        </template>-->

        <v-list density="compact">
          <v-list-item
            v-for="(item, i) in vulnerabilities"
            :key="i"
            :value="item"
            :color="severityMapping(item.severity).darken"
            lines="three"
            class="mb-2"
            :base-color="severityMapping(item.severity).base"
            :title="item.name"
            :subtitle="item.description"
            :active="selectedVulnerability === item"
            @click="selectedVulnerability = item"
          >
            <template v-slot:prepend>
              <v-icon :icon="severityMapping(item.severity).icon"></v-icon>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useFileStore, useCodeqlStore, Vulnerability } from "@/api/stores";

const fileStore = useFileStore();
const route = useRoute();

const fileId = computed(() => route.params?.fileId);
const { filesById } = storeToRefs(fileStore);
// Get the file by id.
const file = computed(() => filesById.value[+fileId.value]);
// const currentFileName = ref(route.params.fileName.toString());
// const currentFileName = computed(() => file.value.shortPath);

const codeqlStore = useCodeqlStore()

const vulnerabilities = ref<Vulnerability[]>([])
const selectedVulnerability = ref<Vulnerability | null>(null)

const severityMapping = (type: string) => {
  switch (type) {
    case 'warning':
      return {
        base: 'orange',
        darken: 'orange darken-6',
        icon: 'mdi-alert'
      }
    case 'error':
      return {
        base: 'red',
        darken: 'red darken-6',
        icon: 'mdi-alert-circle'
      }
    case 'recommendation':
      return {
        base: 'green',
        darken: 'green darken-6',
        icon: 'mdi-star-circle'
      }
    default:
      return {
        base: 'grey',
        darken: 'grey darken-6',
        icon: 'mdi-alert'
      }
  }
}

const initialize = () => {
  // currentFileName.value = route.params.fileName.toString()

  // Fetch vulnerabilities
  vulnerabilities.value = codeqlStore.getVulnerabilitiesByFilename(file.value.shortPath)
  if (vulnerabilities.value.length < 0) {
    selectedVulnerability.value = null
  } else {
    selectedVulnerability.value = vulnerabilities.value[0]
  }
}

watch(() => route.params.fileName, () => {
  initialize()
});

initialize()
</script>

<style lang="scss" scoped>
.info {
  &-item {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
}

.submission {
  &-code {
    height: 500px;
  }

  &-graph {
    height: 350px;
  }
}

.item-warning {
  background-color: rgb(255, 221, 0, 0.3);
  color: #F9A825;
}

.item-error {
  background-color: rgb(255, 49, 49);
  color: white;
}
</style>
