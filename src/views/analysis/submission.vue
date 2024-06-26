<template>
  <div>
    <transition name="slide-y-transition" mode="out-in">
      <div v-if="file" :key="file.id">
        <breadcrumbs
          :current-text="file.extra.fullName ?? file.shortPath"
          :previous-fallback-text="`View by submission`"
          :previous-fallback-to="{ name: 'Submissions' }"
        />

        <div class="heading">
          <h2 class="heading-title">
            Submission by {{ file.extra.fullName ?? file.shortPath }}
          </h2>
          <div class="heading-subtitle text-medium-emphasis">
            Relevant information about the current submission.
          </div>
        </div>

        <v-row>
          <v-col cols="12" md="8">
            <v-card>
              <v-card-title>Compare</v-card-title>
              <v-card-subtitle class="pb-2">
                Compare this submission with other submissions
              </v-card-subtitle>

              <submissions-pairs-table :file="file" />
            </v-card>

            <!-- <v-card class="mt-4">
              <v-card-title>Cluster Timeline</v-card-title>
              <v-card-subtitle class="pb-2">
                Visual representation of which submission was submitted first.
              </v-card-subtitle>

              <v-card-text v-if="!cluster">
                Submission is not part of any cluster.
              </v-card-text>

              <v-card-text v-else-if="!hasTimestamps">
                <div class="d-flex align-center info-text">
                  <v-icon color="info">mdi-information</v-icon>

                  <span class="ml-2">
                    The dataset you analyzed did not contain timestamps, so some
                    visualizations will not be available. Learn how to add
                    metadata
                    <a
                      href="https://dolos.ugent.be/guide/dodona.html"
                      target="_blank"
                      >here</a
                    >.
                  </span>
                </div>
              </v-card-text>

              <v-card-text v-else>
                <cluster-time-series
                  :cluster="cluster"
                  :node-size="8"
                  :selected-files="[file]"
                  node-tooltip
                  node-clickable
                  @click:node="onNodeClick"
                />
              </v-card-text>
            </v-card> -->

            <v-card class="mt-4">
              <v-card-title>Code viewer</v-card-title>
              <v-card-subtitle class="pb-2">
                View the code of this submission.
              </v-card-subtitle>

              <submission-code class="submission-code" :file="file" />
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <!-- <v-card>
              <v-card-title>Information</v-card-title>
              <v-card-text>
                <div class="info-item" v-if="hasLabels">
                  <v-icon :color="label.color">mdi-label-outline</v-icon>
                  <label-text
                    :label="label.name"
                    :color="label.color"
                    colored
                  />
                </div>

                <div class="info-item">
                  <v-icon>mdi-file-document-outline</v-icon>
                  <span>{{ file.shortPath }}</span>
                </div>

                <div class="info-item" v-if="hasTimestamps">
                  <v-icon>mdi-clock-outline</v-icon>
                  <file-timestamp :file="file" long />
                </div>
              </v-card-text>
            </v-card> -->

            <v-card>
              <v-card-title>Machine Code Probability</v-card-title>
              <v-card-text>
                <div class="stat-card-content">
                  <span class="submission-similarity">
                    <similarity-display
                      :similarity="machine_code_probability"
                      progress
                      dim-below-cutoff
                    />
                  </span>
                </div>
              </v-card-text>
            </v-card>

            <v-card class="mt-4">
              <v-card-title>
                Vulnerabilities
                <router-link
                  class="text-subtitle-1"
                  :to="{ name: 'Vulnerability', params: { fileId: fileId } }"
                >
                  View details
                </router-link>
              </v-card-title>
              <v-card-text>
                <v-btn
                  prepend-icon="mdi-alert"
                  base-color="warning"
                >
                  <!-- <template v-slot:prepend>
                    <v-icon color="success"></v-icon>
                  </template> -->

                  {{ num_warnings }} warnings
                </v-btn>
                <v-btn
                  prepend-icon="mdi-alert-circle"
                  base-color="error"
                  class="ml-4"
                >
                  <!-- <template v-slot:prepend>
                    <v-icon color="success"></v-icon>
                  </template> -->

                  {{ num_errors }} errors
                </v-btn>

                <v-btn
                  prepend-icon="mdi-star-circle"
                  base-color="success"
                  class="mt-4"
                >
                  <!-- <template v-slot:prepend>
                    <v-icon color="success"></v-icon>
                  </template> -->

                  {{ num_recommendations }} recommendations
                </v-btn>
              </v-card-text>
            </v-card>

            <!-- <v-card class="mt-4">
              <v-card-title>Cluster Graph</v-card-title>
              <v-card-subtitle>
                Visual representation of submissions in the same cluster.
              </v-card-subtitle>
              <v-card-text v-if="!cluster">
                Submission is not part of any cluster.
              </v-card-text>
              <v-card-text v-else>
                <div class="submission-graph">
                  <graph-canvas
                    :pairs="clusterPairs"
                    :files="clusterFiles"
                    :legend="legend"
                    :clustering="clustering"
                    :selected-node="file"
                    :node-size="8"
                    :show-singletons="false"
                    node-tooltip
                    node-clickable
                    @click:node="onNodeClick"
                  >
                    <graph-legend v-model:legend="legend" readonly />
                  </graph-canvas>
                </div>
              </v-card-text>
            </v-card> -->

            <v-card class="mt-4">
              <v-card-title>Similarity histogram</v-card-title>
              <v-card-subtitle>
                Highest similarity of this submission (red) compared to the
                highest similarity of other submissions.
              </v-card-subtitle>
              <v-card-text>
                <submission-histogram field="similarity" :file="file" />
              </v-card-text>
            </v-card>

            <v-card class="mt-4">
              <v-card-title>Longest fragment histogram</v-card-title>
              <v-card-subtitle>
                Longest fragment of this submission (red) compared to the
                longest fragment of other submissions.
              </v-card-subtitle>
              <v-card-text>
                <submission-histogram field="longestFragment" :file="file" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <template v-else>
        <v-row>
          <v-col>
            <v-card>
              <v-card-title>Not found</v-card-title>
              <v-card-text>This file was not found.</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { File } from "@/api/models";
import { useApiStore, useFileStore, usePairStore, useCodeqlStore } from "@/api/stores";
import { useCluster } from "@/composables";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const fileId = computed(() => route.params?.fileId);

const router = useRouter();
const fileStore = useFileStore();
const pairStore = usePairStore();
const apiStore = useApiStore();
const codeQlStore = useCodeqlStore();
const { legend, hasTimestamps, hasLabels, filesById } = storeToRefs(fileStore);
const { clustering } = storeToRefs(pairStore);
const { currentReport } = storeToRefs(apiStore);
const { vulnerabilitiesList } = storeToRefs(codeQlStore);

// Get the file by id.
const file = computed(() => filesById.value[+fileId.value]);

// Get the label of the file.
const label = computed(() => file.value.label);

// Get the cluster of the file.
const cluster = computed(() => pairStore.getCluster(file.value));

// Get machine code probability
const machine_code_probability = computed(() => {
  if (currentReport.value) {
    const reportFile = currentReport.value?.report_file?.find(rf => rf.filename == file.value.shortPath);
    if (reportFile) {
      return reportFile.machine_code_probability;
    }
  }

  return 0;
});

const vulnerabilities_of_file = computed(() => {
  if (vulnerabilitiesList.value) {
    return vulnerabilitiesList.value.filter(vulnerability => vulnerability.filename == file.value.shortPath);
  }

  return []
});

const num_errors = computed(() => vulnerabilities_of_file.value.filter(vulnerability => vulnerability.severity == "error").length)
const num_warnings = computed(() => vulnerabilities_of_file.value.filter(vulnerability => vulnerability.severity == "warning").length)
const num_recommendations = computed(() => vulnerabilities_of_file.value.filter(vulnerability => vulnerability.severity == "recommendation").length)

// Cluster
const { clusterPairs, clusterFiles } = useCluster(cluster);
// Go to the submission when a node is clicked.
const onNodeClick = (file: File): void => {
  router.push({ name: "Submissions", params: { fileId: String(file.id) } });
};
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
</style>
