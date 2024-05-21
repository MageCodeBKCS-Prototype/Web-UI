import { defineStore, storeToRefs } from "pinia";
import { shallowRef, computed, nextTick, watch, ref, ComputedRef } from "vue";
import { File, Label, Legend, Pair } from "@/api/models";
import { useApiStore, usePairStore, useAuthStore } from "@/api/stores";
import { names, animals, uniqueNamesGenerator } from "unique-names-generator";
import { commonFilenamePrefix, parseCsv } from "../utils";
import {
  FileInterestingnessCalculator,
  FileScoring,
  SimilarityScore,
} from "@/util/FileInterestingness";
import { ParseRemoteConfig } from "papaparse";

export interface Vulnerability {
  name: string;
  description: string;
  message: string;
  filename: string;
  severity: string;
  coordination: [number, number, number, number];
}

/**
 * Store containing the file data & helper functions.
 */
export const useCodeqlStore = defineStore("codeql", () => {
  // Stores
  const apiStore = useApiStore();
  // const pairStore = usePairStore();
  const { token } = storeToRefs(useAuthStore());

  // State
  const hydrated = shallowRef(false);

  const vulnerabilitiesById = shallowRef<Vulnerability[]>([]);
  const vulnerabilitiesList = computed(() => Object.values(vulnerabilitiesById.value));

  // const hasLabels = shallowRef(false);
  // const hasUnlabeled = shallowRef(false);
  // const hasTimestamps = shallowRef(false);

  const vulnerabilitiesActiveById = shallowRef<Vulnerability[]>([]);
  const vulnerabilitiesActiveList = computed<Vulnerability[]>(() =>
    Object.values(vulnerabilitiesActiveById.value)
  );

  // Functions

  async function hydrate(): Promise<void> {
    try {
      const parsed = parse(await fetch());
      vulnerabilitiesById.value = parsed.vulnerabilities;
      console.log(vulnerabilitiesById);
      
    } catch {
      vulnerabilitiesById.value = []
    }

    hydrated.value = true;
  }

  async function fetch(
    url: string = apiStore.url + "/codeql.csv"
  ): Promise<any[]> {
    return await parseCsv(url, {
      downloadRequestHeaders: {
        'Authorization': `Bearer ${token.value}`,
      },
      download: true,
      complete: (results) => {
      },
    });
  }

  // Parse the files from a CSV string.
  function parse(fileData: any[]): {
    vulnerabilities: Vulnerability[];
  } {
    const vulnerabilities: Vulnerability[] = [];

    // TODO: working
    for (const row of fileData) {
      const vulnerability = row as Vulnerability;

      vulnerability.coordination = [parseInt(row.start_line), parseInt(row.start_column), parseInt(row.end_line), parseInt(row.end_column)]
      vulnerabilities.push(vulnerability);
    }

    return { vulnerabilities };
  }

  // Get vulnerabilities for a file.
  function getVulnerabilitiesByFilename(fileName: string) {
    return vulnerabilitiesList.value.filter((f) => f.filename === fileName);
  }

  return {
    getVulnerabilitiesByFilename,
    vulnerabilitiesById,
    vulnerabilitiesList,
    vulnerabilitiesActiveById,
    vulnerabilitiesActiveList,
    hydrated,
    hydrate
  };
});
