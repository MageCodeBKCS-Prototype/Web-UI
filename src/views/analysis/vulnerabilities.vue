<template>
  <div class="heading">
    <h2 class="heading-title">
      Vulnerabilities of {{ fileName }}
    </h2>
    <div class="heading-subtitle text-medium-emphasis">
      List of vulnerabilities of the current submission.
    </div>
  </div>

  <v-row>
    <v-col cols="12" md="8">
      <v-alert
        v-if="selectedItem.item"
        density="compact"
        :text="selectedItem.item.description"
        :title="selectedItem.item.name"
        :color="severityMapping(selectedItem.item.severity).darken"
        :icon="severityMapping(selectedItem.item.severity).icon"
      ></v-alert>

      <v-card class="mt-4">
        <v-card-title>Code viewer</v-card-title>
        <v-card-subtitle class="pb-2">
          View the code of this submission.
        </v-card-subtitle>

        <my-submission-code v-if="loading && selectedItem.item && content" class="submission-code" :content="content" language="python" :cordination="selectedItem.item.cordination" :severity="selectedItem.item.severity"/>
      </v-card>
    </v-col>

    <v-col cols="12" md="4">
      <v-card
        title="Vulnerabilities"
      >
        <template v-slot:append>
          <v-select
            :items="['All', 'Warning', 'Error']"
          ></v-select>
        </template>

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
            :active="i === selectedItem.index"
            @click="handleItemClick(item, i)"
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
import {useCodeqlStore, useFileStore, Vulnerability} from '@/api/stores'
import { onMounted, ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { File } from "@/api/models";

const codeqlStore = useCodeqlStore()
const fileStore = useFileStore()

const route = useRoute();
const fileName = route.params?.fileName;

const vulnerabilities = ref<Vulnerability[]>([])
const file = ref<File>();
const content = ref('')
const loading = ref(false)

const selectedItem = ref<{item: Vulnerability | null, index: number | null}>({item: null, index: null})

function fetchFileContent() {
  const files = fileStore.filesList
  file.value = files.find((file) => file.shortPath === fileName);
  content.value = String(file.value?.content)
}

const initialize = () => {
  fetchFileContent()

  vulnerabilities.value = codeqlStore.getVulnerabilitiesByFilename(String(fileName))
  

  if (vulnerabilities.value.length < 0) {
    selectedItem.value.item = null
  } else {
    selectedItem.value.item = vulnerabilities.value[0]
    selectedItem.value.index = 0
  }

}

initialize()


watch(() => route.params.fileName, () => {
  initialize()
});




// onMounted(() => {
  // loading.value = true
// })

const handleItemClick = (item: any, index: number) => {
  selectedItem.value.item = item
  selectedItem.value.index = index
}

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

// handleItemClick(vulnerabilities[0], 0)
// const items = [
//         { text: 'Constant in conditional expression or statement', subtitle: 'The conditional is always true or always false', type: 'warning' },
//         { text: 'Clear-text storage of sensitive information', subtitle: 'Sensitive information stored without encryption or hashing can expose it to an attacker', type: 'error' },
//         { text: 'Binding a socket to all network interfaces', subtitle: 'Binding a socket to all interfaces opens it up to traffic from any IPv4 address and is therefore associated with security risks', type: 'error' },
//         { text: 'Arbitrary file write during tarfile extraction', subtitle: 'Extracting files from a malicious tar archive without validating that the destination file path is within the destination directory can cause files outside the destination directory to be overwritten', type: 'error' },
//       ]


// initialize()



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
