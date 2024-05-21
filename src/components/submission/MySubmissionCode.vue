<template>
  <div ref="editorElem" class="editor-element"></div>
</template>

<script lang="ts" setup>
import * as monaco from "monaco-editor";
import {onMounted, ref, shallowRef, watch} from "vue";
// import {useFileStore} from "@/api/stores";
import { File } from "@/api/models";
// import {useRoute} from "vue-router";

interface Props {
  currentFile: File | null;
  coordination?: [number, number, number, number];
  severity?: string;
}

const props = withDefaults(defineProps<Props>(), {
  currentFile: null,
  coordination: undefined,
  severity: "error",
});

// const fileStore = useFileStore()

// const route = useRoute();
// const currentFileName = ref(route.params.fileName.toString());
// const currentFile = ref();
// const content = ref<string>()

// Editor template ref
const editorElem = ref();
// Monaco editor
const editor = shallowRef<monaco.editor.IEditorOverrideServices>();
// Monaco editor decorations
const decorations = shallowRef([]);

// Colors for the different selections.
const colors = {
  error: "rgba(254, 37, 7, 0.7)",
  warning: "rgba(255,152,0, 0.7)",
  recommendation: "rgb(3,241,69)",

  matchHovering: "rgba(60, 115, 168, 0.3)",
  matchSelected: "rgba(26, 188, 156, 0.3)",
};

const severityColor = () => {
  switch (props.severity) {
    case 'error':
      return colors.error;
    case 'warning':
      return colors.warning;
    case 'recommendation':
      return colors.recommendation;
  }
};

const updateDecorations = (): void => {
  if (props.coordination?.length == 4) {
    decorations.value = editor.value?.deltaDecorations(
      decorations.value,
      [
        {
          range: new monaco.Range(...props.coordination),
          options: {
            isWholeLine: true,
            className: "highlight-match-" + props.severity,
            overviewRuler: {
              position: monaco.editor.OverviewRulerLane.Full,
              color: severityColor(),
            },
          },
        }
      ]
    );
    editor.value?.revealLineInCenter(props.coordination[0]);    
  }
};

// const getFileContent = () => {
//   const files = fileStore.filesList
//   // currentFile.value = files.find((file) => file.shortPath === currentFileName.value);
//   currentFile.value = files.find((file) => file.shortPath === props.filename);
//   content.value = String(currentFile.value?.content)
// };

const initEditor = (): void => {
  // Monaco editor
  editor.value = monaco.editor.create(editorElem.value, {
    // value: content.value,
    value: props.currentFile?.content,
    language: "python",
    readOnly: true,
    smoothScrolling: true,
    automaticLayout: true,
    renderLineHighlight: "none",
    renderValidationDecorations: "off",
    contextmenu: false,
    minimap: {
      enabled: true,
    }
  });
  // if (props.coordination) {
  //   editor.value.revealLineInCenter(props.coordination[0]);
  // }
};

watch(() => [props.coordination], (value) => {
  // if (value[0]) {
  //   currentFileName.value = value[0]?.toString();
  //   getFileContent();
  //   editor.value?.dispose();
  //   initEditor();
  // }
  updateDecorations();
});

onMounted(() => {
  // getFileContent();
  initEditor();
  updateDecorations();
});

</script>

<style lang="scss">
.highlight {
  &-match-error {
    background-color: v-bind("colors.error");
    transition: background-color 5s ease;

    &--selected {
      background-color: v-bind("colors.matchSelected");
    }

    &--hovering {
      background-color: v-bind("colors.matchHovering");
    }
  }

  &-match-warning {
    background-color: v-bind("colors.warning");
    transition: background-color 5s ease;

    &--selected {
      background-color: v-bind("colors.matchSelected");
    }

    &--hovering {
      background-color: v-bind("colors.matchHovering");
    }
  }

  &-match-recommendation {
    background-color: v-bind("colors.recommendation");
    transition: background-color 5s ease;

    &--selected {
      background-color: v-bind("colors.matchSelected");
    }

    &--hovering {
      background-color: v-bind("colors.matchHovering");
    }
  }
}
</style>
