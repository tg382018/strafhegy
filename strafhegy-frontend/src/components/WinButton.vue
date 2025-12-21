<template>
  <button 
    :class="['win-button', variantClass]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <span class="button-content">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  variant?: 'win' | 'sub' | 'secondary' | 'close-pos' | 'taskbar-item';
  disabled?: boolean;
}>();

defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const variantClass = computed(() => {
  switch (props.variant) {
    case 'sub': return 'sub-btn';
    case 'secondary': return 'sub-btn secondary';
    case 'close-pos': return 'win-btn close-pos-btn';
    case 'taskbar-item': return 'taskbar-item';
    default: return 'win-btn';
  }
});
</script>

<style scoped>
.win-button {
  --win-grey: #c0c0c0;
  --win-blue: #000080;
  --win-blue-light: #1084d0;
  --win-border-light: #ffffff;
  --win-border-dark: #808080;
  --win-border-black: #000000;
  
  font-family: "MS Sans Serif", "Segoe UI", Tahoma, sans-serif;
  cursor: pointer;
  padding: 0;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  height: 100%;
}

.win-button:active:not(:disabled) .button-content {
  transform: translate(1px, 1px);
}

/* Base Win Button (Small square) */
.win-btn {
  width: 16px;
  height: 14px;
  background: var(--win-grey);
  border: 1px solid;
  border-color: var(--win-border-light) var(--win-border-dark) var(--win-border-dark) var(--win-border-light);
  font-size: 10px;
  font-weight: bold;
}

.win-btn:active:not(:disabled) {
  border-color: var(--win-border-dark) var(--win-border-light) var(--win-border-light) var(--win-border-dark);
}

.win-btn:disabled {
  color: var(--win-border-dark);
  cursor: default;
}

/* Action Button (Large) */
.sub-btn {
  background: var(--win-grey) !important;
  color: #000;
  border: 1px solid var(--win-border-black);
  box-shadow: inset 1px 1px var(--win-border-light), 1px 1px var(--win-border-dark);
  padding: 4px 12px;
  font-size: 12px;
  min-height: 24px;
  width: auto;
}

.sub-btn:active:not(:disabled) {
  box-shadow: inset 1px 1px var(--win-border-dark), 1px 1px var(--win-border-light);
}

.sub-btn:disabled {
  color: var(--win-border-dark);
  text-shadow: 1px 1px var(--win-border-light);
  cursor: not-allowed;
}

/* Close Position Variation */
.close-pos-btn {
  padding: 0 8px;
  width: auto;
  height: 18px;
  font-size: 10px;
  background: #ff000022 !important;
  color: #cc0000;
  border-color: #cc0000 !important;
}

.close-pos-btn:hover:not(:disabled) {
  background: #ff000044 !important;
}

/* Taskbar Item Variation */
.taskbar-item {
  height: 22px;
  min-width: 100px;
  max-width: 160px;
  background: var(--win-grey);
  border: 1px solid var(--win-border-black);
  box-shadow: inset 1px 1px var(--win-border-light), 1px 1px var(--win-border-dark);
  font-size: 11px;
  text-align: left;
  padding: 0 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.taskbar-item:active {
  box-shadow: inset 1px 1px var(--win-border-dark), 1px 1px var(--win-border-light);
}
</style>
