<template>
  <div ref="editorElem" class="editor-element"></div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, shallowRef } from "vue";
import * as monaco from "monaco-editor";
import { watch, computed } from "vue";

interface Props {
  content: string;
  language: string;
  severity: string;
  cordination: [number, number, number, number];
}

const props = withDefaults(defineProps<Props>(), {});

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
  recommendation: "rgba(254, 37, 7, 0.7)",

  matchHovering: "rgba(60, 115, 168, 0.3)",
  matchSelected: "rgba(26, 188, 156, 0.3)",
};

// Initialize the editor.
const initialize = (): void => {
  console.log("MySubmission", props.content, props.language, props.severity, props.cordination);
  


  // Monaco editor
  editor.value = monaco.editor.create(editorElem.value, {
    value: props.content,
    language: props.language,
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
  console.log("MySubmission", editor.value.value);

  // Update decorations
  updateDecorations();
  editor.value.revealLineInCenter(33);
};

const severityColor = computed(() => {
  switch (props.severity) {
    case 'error':
      return colors.error;
    case 'warning':
      return colors.warning;
    case 'recommendation':
      return colors.recommendation;
  }
});

const updateDecorations = (): void => {
  if (props.cordination?.length == 4) {
    decorations.value = editor.value?.deltaDecorations(
      decorations.value,
      [
        {
          range: new monaco.Range(...props.cordination),
          options: {
            isWholeLine: true,
            className: "highlight-match-" + props.severity,
            overviewRuler: {
              position: monaco.editor.OverviewRulerLane.Full,
              color: severityColor.value,
            },
          },
        }
      ]
    );
  }
};

// Update the editor content.
watch(() => {[props.cordination, props.content]}, () => {
  initialize();
});


// Destroy the editor.
const destroy = (): void => {
  editor.value?.dispose();
};

// Initialize the editor when the component is mounted.
onMounted(() => initialize());

// Destroy the editor when the component is unmounted.
onUnmounted(() => destroy());
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