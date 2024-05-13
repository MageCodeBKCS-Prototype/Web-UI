<template>
  <div ref="editorElem" class="editor-element"></div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, shallowRef } from "vue";
import * as monaco from "monaco-editor";

interface Props {
  content: string;
  language: string;
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
  match: "rgba(254, 37, 7, 0.7)",
  matchHovering: "rgba(60, 115, 168, 0.3)",
  matchSelected: "rgba(26, 188, 156, 0.3)",
};

// Initialize the editor.
const initialize = (): void => {
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

  decorations.value = editor.value?.deltaDecorations(
    decorations.value,
    [
      {
        range: new monaco.Range(33, 0, 33, 9),
        options: {
          isWholeLine: true,
          className: "highlight-match",
          overviewRuler: {
            position: monaco.editor.OverviewRulerLane.Full,
            color: colors.match,
          },
        },
      }
    ]
  );

  editor.value.revealLineInCenter(33);
};

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
  &-match {
    background-color: v-bind("colors.match");
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