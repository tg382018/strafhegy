<template>
  <div class="sort-controls">
    <div class="sort-label">Sort by:</div>
    <div class="sort-buttons">
      <WinButton 
        variant="sub" 
        class="sort-btn" 
        :class="{ active: modelValue === 'subscribers' }"
        @click="$emit('update:modelValue', 'subscribers')"
      >
        👥 Most Subscribers
      </WinButton>
      <WinButton 
        variant="sub" 
        class="sort-btn" 
        :class="{ active: modelValue === 'newest' }"
        @click="$emit('update:modelValue', 'newest')"
      >
        ✨ Newest
      </WinButton>
      <WinButton 
        variant="sub" 
        class="sort-btn" 
        :class="{ active: modelValue === 'oldest' }"
        @click="$emit('update:modelValue', 'oldest')"
      >
        📜 Oldest
      </WinButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import WinButton from "./WinButton.vue";
defineProps<{
  modelValue: 'newest' | 'oldest' | 'subscribers';
}>();

defineEmits<{
  (e: 'update:modelValue', val: 'newest' | 'oldest' | 'subscribers'): void;
}>();
</script>

<style scoped>
.sort-controls {
  width: 100%;
  max-width: 1400px;
  margin: 20px auto 0;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.sort-label {
  font-size: 12px;
  font-weight: bold;
  color: #000;
  text-shadow: 1px 1px #fff;
}

.sort-buttons {
  display: flex;
  gap: 8px;
}

.sort-btn {
  background: #c0c0c0;
  border: 1px solid #000;
  box-shadow: inset 1px 1px #ffffff, 1px 1px #808080;
  padding: 4px 12px;
  font-size: 11px;
  cursor: pointer;
  color: #000;
  display: flex;
  align-items: center;
  gap: 4px;
}

.sort-btn:active, .sort-btn.active {
  box-shadow: inset 1px 1px #808080, 1px 1px #ffffff;
  background: #d0d0d0;
}

.sort-btn.active {
  font-weight: bold;
  border-color: #000080;
}
</style>
