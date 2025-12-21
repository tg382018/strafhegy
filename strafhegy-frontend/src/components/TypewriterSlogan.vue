<template>
  <div class="typewriter-container">
    <span class="typewriter-text">{{ displayedText }}</span>
    <span class="cursor" :class="{ 'blinking': isCursorBlinking }">|</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  text: {
    type: String,
    required: true,
    default: "Welcome to Strafhegy SocialFi"
  },
  typingSpeed: {
    type: Number,
    default: 100
  },
  startDelay: {
    type: Number,
    default: 500
  }
});

const displayedText = ref("");
const isCursorBlinking = ref(true);
let typingInterval: any = null;
let cursorInterval: any = null;

function startTyping() {
  displayedText.value = "";
  isCursorBlinking.value = false;
  let currentIndex = 0;

  // Clear any existing interval
  if (typingInterval) clearInterval(typingInterval);

  setTimeout(() => {
    typingInterval = setInterval(() => {
      if (currentIndex < props.text.length) {
        displayedText.value += props.text.charAt(currentIndex);
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        isCursorBlinking.value = true;
      }
    }, props.typingSpeed);
  }, props.startDelay);
}

onMounted(() => {
  startTyping();
});

onUnmounted(() => {
  if (typingInterval) clearInterval(typingInterval);
  if (cursorInterval) clearInterval(cursorInterval);
});

watch(() => props.text, () => {
  startTyping();
});
</script>

<style scoped>
.typewriter-container {
  font-family: "Courier New", Courier, monospace;
  font-weight: bold;
  color: #000;
  background: #fff;
  padding: 10px 15px;
  border: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  box-shadow: 1px 1px #000000;
  display: inline-block;
  max-width: 300px;
}

.typewriter-text {
  white-space: pre-wrap;
}

.cursor {
  display: inline-block;
  margin-left: 2px;
  font-weight: bold;
  color: #000;
}

.blinking {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
