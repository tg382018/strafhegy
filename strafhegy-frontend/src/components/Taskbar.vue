<template>
  <div class="taskbar">
    <a href="mailto:tgulck@gmail.com" class="start-btn contact-link">
      <img src="/strafhegylogo.png" class="start-icon" />
      <span>Contact</span>
    </a>
    
    <div class="taskbar-divider"></div>
    
    <div class="taskbar-items">
      <WinButton v-if="myPanelMinimized" variant="taskbar-item" @click="$emit('restorePanel')">
        Creator.exe
      </WinButton>
      <WinButton 
        v-for="c in minimizedCreators" 
        :key="c.address" 
        variant="taskbar-item" 
        @click="$emit('restoreCreator', c.address)"
      >
        {{ c.username || 'User' }} ({{ maskAddress(c.address, 3) }})
      </WinButton>
    </div>
    
    <div class="taskbar-clock">
      {{ currentTime }}
    </div>
  </div>
</template>

<script setup lang="ts">
import WinButton from "./WinButton.vue";
defineProps<{
  currentTime: string;
  myPanelMinimized: boolean;
  minimizedCreators: any[];
}>();

defineEmits<{
  (e: 'restorePanel'): void;
  (e: 'restoreCreator', address: string): void;
}>();

function maskAddress(addr: string, last = 4) {
  if (!addr) return "";
  return `0x***${addr.slice(-last)}`;
}
</script>

<style scoped>
.taskbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 28px;
  background: #c0c0c0;
  border-top: 2px solid #ffffff;
  box-shadow: inset 0 1px #dfdfdf;
  display: flex;
  align-items: center;
  padding: 2px;
  z-index: 1000;
}

.start-btn {
  height: 22px;
  padding: 0 6px;
  background: #c0c0c0;
  border: 1px solid #000;
  box-shadow: inset 1px 1px #ffffff, 1px 1px #808080;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: bold;
  font-size: 11px;
  text-decoration: none;
  color: #000;
  margin-right: 4px;
}

.start-btn:active {
  box-shadow: inset 1px 1px #808080, 1px 1px #ffffff;
  padding: 1px 5px 0 7px;
}

.start-icon {
  width: 16px;
  height: 16px;
}

.taskbar-divider {
  width: 2px;
  height: 18px;
  background: #808080;
  border-right: 1px solid #ffffff;
  margin: 0 4px;
}

.taskbar-items {
  flex-grow: 1;
  display: flex;
  gap: 4px;
  overflow-x: auto;
}

.taskbar-item {
  height: 22px;
  min-width: 120px;
  max-width: 160px;
  background: #c0c0c0;
  border: 1px solid #000;
  box-shadow: inset 1px 1px #ffffff, 1px 1px #808080;
  padding: 0 8px;
  font-size: 11px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.taskbar-item:active {
  box-shadow: inset 1px 1px #808080, 1px 1px #ffffff;
}

.taskbar-clock {
  height: 22px;
  padding: 0 8px;
  background: #c0c0c0;
  border: 1px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  font-size: 11px;
  display: flex;
  align-items: center;
  margin-left: 4px;
}

.contact-link {
  cursor: pointer;
}
</style>
