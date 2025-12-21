<template>
  <header>
    <div class="logo">
      <div class="straf-logo-component">
        <div class="straf-icon-box">
          <div class="straf-dots"></div>
          <div class="straf-hex-outer"></div>
          <div class="straf-hex-inner"></div>
        </div>
        <div class="straf-text-box">
          <span class="straf-title">strafhegy</span>
          <span class="straf-subtitle">FHEVM</span>
        </div>
      </div>
    </div>

    <div class="header-actions">
      <div class="search-container">
        <input 
          :value="searchQuery" 
          @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          type="text" 
          class="search-input" 
          placeholder="Search creators by username or address..." 
        />
      </div>
      <button class="win-btn how-to-use-btn" @click="$emit('showHelp')">How to Use</button>
      <button class="connect-btn" :class="{ connected: isConnected }" @click="$emit('toggleWallet')">
        {{ connectLabel }}
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  isConnected: boolean;
  connectLabel: string;
  searchQuery: string;
}>();

defineEmits<{
  (e: 'toggleWallet'): void;
  (e: 'update:searchQuery', val: string): void;
  (e: 'showHelp'): void;
}>();
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: #c0c0c0;
  border-bottom: 2px solid #808080;
  box-shadow: inset 1px 1px #ffffff;
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
}

.straf-logo-component {
  --logo-scale: 0.6; 
  --primary-color: #006400;
  --secondary-color: #bc13fe;
  --text-color: #ffffff;
  
  display: inline-flex;
  align-items: center;
  gap: calc(15px * var(--logo-scale));
  font-family: 'Orbitron', sans-serif;
  background: transparent;
  user-select: none;
  cursor: pointer;
  padding: 5px;
}

.straf-icon-box {
  position: relative;
  width: calc(50px * var(--logo-scale));
  height: calc(50px * var(--logo-scale));
  display: flex;
  justify-content: center;
  align-items: center;
}

.straf-hex-outer {
  position: absolute;
  width: 100%;
  height: 100%;
  border: calc(3px * var(--logo-scale)) solid var(--primary-color);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  animation: strafSpin 10s linear infinite;
  box-shadow: 0 0 calc(10px * var(--logo-scale)) rgba(0, 243, 255, 0.4);
}

.straf-hex-inner {
  position: absolute;
  width: 55%;
  height: 55%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  animation: strafPulse 3s ease-in-out infinite alternate;
}

.straf-dots {
  position: absolute;
  width: 140%;
  height: 140%;
  border-radius: 50%;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  animation: strafSpinReverse 15s linear infinite;
}

.straf-text-box {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.straf-title {
  font-size: calc(28px * var(--logo-scale));
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: calc(1px * var(--logo-scale));
  background: linear-gradient(90deg, #888, var(--primary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 calc(10px * var(--logo-scale)) rgba(0, 100, 0, 0.3);
}

.straf-subtitle {
  font-size: calc(10px * var(--logo-scale));
  color: var(--secondary-color);
  letter-spacing: calc(3px * var(--logo-scale));
  margin-left: 2px;
  font-weight: 600;
}

@keyframes strafSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes strafSpinReverse {
  0% { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
}
@keyframes strafPulse {
  0% { opacity: 0.8; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1.1); box-shadow: 0 0 15px var(--secondary-color); }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-container {
  width: 300px;
}

.search-input {
  width: 100%;
  padding: 4px 8px;
  background: #fff;
  border: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  font-size: 12px;
  outline: none;
}

.win-btn {
  background: #c0c0c0;
  border: 1px solid #000000;
  box-shadow: inset 1px 1px #ffffff, 1px 1px #808080;
  padding: 4px 12px;
  font-size: 12px;
  cursor: pointer;
  color: #000;
}

.win-btn:active {
  box-shadow: inset 1px 1px #808080, 1px 1px #ffffff;
  padding: 5px 11px 3px 13px;
}

.connect-btn {
  background: #c0c0c0;
  border: 1px solid #000000;
  box-shadow: inset 1px 1px #ffffff, 1px 1px #808080;
  padding: 4px 16px;
  font-weight: 400;
  color: #000;
  cursor: pointer;
}

.connect-btn.connected {
  background: #e0e0e0;
}

.connect-btn:active {
  box-shadow: inset 1px 1px #808080, 1px 1px #ffffff;
  padding: 5px 15px 3px 17px;
}
</style>
