<template>
  <div class="landing">
    <div class="background">
      <div class="aurora">
        <div class="aurora-layer aurora-layer-1"></div>
        <div class="aurora-layer aurora-layer-2"></div>
        <div class="aurora-layer aurora-layer-3"></div>
        <div class="aurora-layer aurora-layer-4"></div>
      </div>
      <div class="twinkling"></div>
      <div
        v-for="i in 8"
        :key="i"
        class="floating-orb"
        :style="getOrbStyle(i)"
      ></div>
    </div>

    <section class="hero">
      <div class="container">
        <transition name="fade-down" appear>
          <div class="hero-content">
            <h1 class="hero-title">
              <span class="gradient-text">FHEarn</span>
            </h1>
            <p class="hero-subtitle">
              Confidential Score-Based Yield on
              <span class="highlight">FHEVM</span>
            </p>
            <p class="hero-description">
              Earn dynamic APY between 5% and 25% that adapts to your on-chain
              reputation. Multi-chain analytics score your wallet while Fully
              Homomorphic Encryption keeps stake amounts, rewards, and APY
              private.
            </p>
            <transition name="scale" appear>
              <button @click="launchApp" class="launch-btn">
                <span>Launch dApp</span>
                <svg
                  class="arrow-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </transition>
          </div>
        </transition>

        <div class="features">
          <transition-group name="slide-up" appear>
            <div
              class="feature-card"
              :style="{ transitionDelay: '0ms' }"
              key="f1"
            >
              <div class="feature-icon">🔒</div>
              <h3 class="feature-title">Complete Privacy</h3>
              <p class="feature-description">
                FHE keeps your stake data private. Only you can decrypt values.
              </p>
            </div>
            <div
              class="feature-card"
              :style="{ transitionDelay: '100ms' }"
              key="f2"
            >
              <div class="feature-icon">📈</div>
              <h3 class="feature-title">Score-Based APY</h3>
              <p class="feature-description">
                Your on-chain activity score determines your personalized APY
                rate. Higher engagement = Higher rewards.
              </p>
            </div>
            <div
              class="feature-card"
              :style="{ transitionDelay: '200ms' }"
              key="f3"
            >
              <div class="feature-icon">🛡️</div>
              <h3 class="feature-title">Secure by Design</h3>
              <p class="feature-description">
                Powered by Zama's FHEVM, built with Vue and Ethers.js.
              </p>
            </div>
          </transition-group>
        </div>
      </div>

      <transition name="bounce" appear>
        <div class="scroll-indicator"><div class="mouse"></div></div>
      </transition>
    </section>

    <section class="overview">
      <div class="container">
        <h2 class="section-title">Why FHEarn?</h2>
        <p class="section-subtitle">
          A confidential savings experience that rewards healthy on-chain
          behaviour with personalised APY.
        </p>
        <div class="overview-grid">
          <div class="overview-card">
            <span class="pill">Privacy First</span>
            <h3>Encrypted Staking</h3>
            <p>
              Stake values, APY and rewards stay encrypted end-to-end with
              Zama’s FHEVM. Only the wallet owner can decrypt balances.
            </p>
          </div>
          <div class="overview-card">
            <span class="pill">Adaptive Yield</span>
            <h3>Score-Based APY</h3>
            <p>
              Wallets collect up to 150 points across activity, age, diversity
              and balances, unlocking tiered APY ranging from 5% to 25%.
            </p>
          </div>
          <div class="overview-card">
            <span class="pill">Multi-Chain</span>
            <h3>Analytics & Insights</h3>
            <p>
              Covalent aggregates data from Ethereum, Polygon, BSC, Avalanche,
              Fantom, Arbitrum and Optimism to fuel our scoring engine.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="score-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Score Engine</h2>
          <p class="section-subtitle">
            Each wallet is graded out of 150 points. Bonus multipliers reward
            veteran, multi-chain and high-activity accounts.
          </p>
        </div>
        <div class="score-grid">
          <div
            class="score-card"
            v-for="metric in scoreMetrics"
            :key="metric.title"
          >
            <span class="score-label">{{ metric.label }}</span>
            <h3>{{ metric.title }}</h3>
            <p>{{ metric.description }}</p>
            <span class="score-cap">Up to {{ metric.cap }} pts</span>
          </div>
        </div>
      </div>
    </section>

    <section class="apy-section">
      <div class="container">
        <h2 class="section-title">APY Tiers</h2>
        <p class="section-subtitle">
          Final score is capped at 150. APY tiers refresh automatically when you
          restake.
        </p>
        <div class="tier-table">
          <div class="tier-row tier-header">
            <span>Score</span>
            <span>Tier</span>
            <span>APY</span>
          </div>
          <div class="tier-row" v-for="tier in apyTiers" :key="tier.tier">
            <span>{{ tier.score }}</span>
            <span>{{ tier.tier }}</span>
            <span>{{ tier.apy }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="architecture">
      <div class="container architecture-wrapper">
        <div class="architecture-card">
          <span class="pill">Architecture</span>
          <h2>End-to-End Flow</h2>
          <p>
            FHEarn combines a Vue 3 front-end, confidential staking contracts,
            and external data providers to deliver a private yet data-rich user
            experience.
          </p>
        </div>
        <div class="architecture-columns">
          <div class="architecture-column">
            <h3>Frontend</h3>
            <ul>
              <li>Vue 3 + Vite SPA</li>
              <li>Ethers v6 wallet integration</li>
              <li>FHEVM Relayer SDK for encryption</li>
            </ul>
          </div>
          <div class="architecture-column">
            <h3>Contracts</h3>
            <ul>
              <li>`FHEarnStake.sol` for encrypted staking</li>
              <li>`FHEarnCore.sol` utilities & FHE helpers</li>
              <li>Sepolia deployment via Hardhat</li>
            </ul>
          </div>
          <div class="architecture-column">
            <h3>Data & Services</h3>
            <ul>
              <li>Covalent multi-chain analytics</li>
              <li>Zama FHEVM relayer (decryption pipeline)</li>
              <li>Sepolia RPC + MetaMask</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works">
      <div class="container">
        <h2 class="section-title">How It Works</h2>
        <p class="section-subtitle">
          Seamless flow from wallet connection to encrypted staking, animated to
          show your journey at a glance.
        </p>
        <div class="process">
          <div class="process-icons">
            <div
              class="process-icon"
              v-for="step in processSteps"
              :key="step.title"
            >
              <div class="process-icon-wrap">
                <span class="process-icon-number">{{ step.number }}</span>
              </div>
            </div>
          </div>
          <div class="process-track">
            <div class="process-track-fill"></div>
          </div>
          <div class="process-steps">
            <div
              class="process-step"
              v-for="(step, index) in processSteps"
              :key="`detail-${step.title}`"
              :style="{ animationDelay: `${index * 4}s` }"
            >
              <span class="process-step-number">{{ step.number }}</span>
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq">
      <div class="container">
        <h2 class="section-title">FAQ</h2>
        <div class="faq-list">
          <div class="faq-item" :style="{ transitionDelay: '0ms' }" key="q1">
            <h3 class="faq-question">What is FHEVM?</h3>
            <p class="faq-answer">
              FHEVM (Fully Homomorphic Encryption Virtual Machine) enables
              computations on encrypted data without decryption. Your stake
              amounts and APY remain private.
            </p>
          </div>
          <div class="faq-item" :style="{ transitionDelay: '100ms' }" key="q2">
            <h3 class="faq-question">How is my Score APY calculated?</h3>
            <p class="faq-answer">
              Your APY is determined by analyzing your on-chain activity,
              transaction history, and engagement across networks in the
              Ethereum ecosystem.
            </p>
          </div>
          <div class="faq-item" :style="{ transitionDelay: '200ms' }" key="q3">
            <h3 class="faq-question">Is my data really private?</h3>
            <p class="faq-answer">
              Yes! All stake data is encrypted with FHE before being stored
              on-chain. Only you can decrypt your values using your wallet's
              private key.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="tech">
      <div class="container">
        <h2 class="section-title">Powered by</h2>
        <div class="tech-grid">
          <transition-group name="fade-in" appear>
            <div class="tech-item" key="t1">
              <img :src="fhevmLogo" alt="FHEVM" class="tech-img" />
              <span class="tech-name">FHEVM</span>
            </div>
            <div class="tech-item" key="t2">
              <img :src="zamaLogo" alt="Zama" class="tech-img" />
              <span class="tech-name">Zama</span>
            </div>
            <div class="tech-item" key="t3">
              <img :src="sepoliaLogo" alt="Sepolia" class="tech-img" />
              <span class="tech-name">Sepolia</span>
            </div>
            <div class="tech-item" key="t4">
              <img :src="vueLogo" alt="Vue 3" class="tech-img" />
              <span class="tech-name">Vue 3</span>
            </div>
          </transition-group>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Landing",
  emits: ["launch-app"],
  setup(_, { emit }) {
    const launchApp = () => emit("launch-app");
    const fhevmLogo = "/media/fhelogo.webp";
    const zamaLogo = "/media/zamalogo.jpg";
    const sepoliaLogo = "/media/ethereumlogo.jpg";
    const vueLogo = "/media/vue3logo.jpeg";
    const getOrbStyle = (i: number) => ({
      "--delay": `${i * 1.2}s`,
      "--duration": `${5 + i * 1.2}s`,
      left: `${15 + i * 12}%`,
      top: `${20 + (i % 3) * 30}%`,
    });
    const scoreMetrics = [
      {
        label: "Activity",
        title: "Transaction Activity",
        description: "log₁₀(totalTx + 1) × 10 highlights consistent usage.",
        cap: 30,
      },
      {
        label: "Longevity",
        title: "Wallet Age",
        description: "Every year on-chain adds 2 points up to a 20-point cap.",
        cap: 20,
      },
      {
        label: "Multi-Chain",
        title: "Network Diversity",
        description:
          "Active chains contribute 5 points each, rewarding explorers.",
        cap: 25,
      },
      {
        label: "Tokens",
        title: "Token Diversity",
        description: "log₁₀(totalTokens + 1) × 5 showcases portfolio breadth.",
        cap: 15,
      },
      {
        label: "Active Tokens",
        title: "Live Positions",
        description:
          "2 points per actively used asset up to a 10-point maximum.",
        cap: 10,
      },
      {
        label: "Balance",
        title: "ETH Balance Score",
        description:
          "Higher balances add weight via log scaling for up to 20 points.",
        cap: 20,
      },
    ];

    const apyTiers = [
      { score: "120 – 150", tier: "Elite", apy: "25% APY" },
      { score: "90 – 119", tier: "Advanced", apy: "20% APY" },
      { score: "70 – 89", tier: "Experienced", apy: "15% APY" },
      { score: "50 – 69", tier: "Intermediate", apy: "12% APY" },
      { score: "30 – 49", tier: "Beginner", apy: "8% APY" },
      { score: "0 – 29", tier: "Newcomer", apy: "5% APY" },
    ];
    const processSteps = [
      {
        number: "01",
        title: "Connect Wallet",
        description:
          "Link MetaMask on Sepolia and detect existing confidential stakes immediately.",
      },
      {
        number: "02",
        title: "Score & Encrypt",
        description:
          "Run multi-chain analytics, assign APY and encrypt stake inputs via FHEVM relayer.",
      },
      {
        number: "03",
        title: "Stake Privately",
        description:
          "Lock funds with encrypted principal and rewards while APY accrues under encryption.",
      },
    ];
    return {
      launchApp,
      getOrbStyle,
      processSteps,
      scoreMetrics,
      apyTiers,
      fhevmLogo,
      zamaLogo,
      sepoliaLogo,
      vueLogo,
    };
  },
});
</script>

<style scoped>
.landing {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0a0e27 100%);
  position: relative;
  overflow: hidden;
}

/* Animated Background */
.background {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

/* Aurora Background */
.aurora {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.aurora-layer {
  position: absolute;
  inset: -50%;
  width: 200%;
  height: 200%;
  opacity: 0.55;
  filter: blur(60px);
  mix-blend-mode: multiply;
}

.aurora-layer-1 {
  background: radial-gradient(
    ellipse at 20% 50%,
    rgba(99, 102, 241, 0.3) 0%,
    rgba(118, 75, 162, 0.2) 30%,
    transparent 60%
  );
  animation: aurora-1 12s ease-in-out infinite alternate;
}

.aurora-layer-2 {
  background: radial-gradient(
    ellipse at 80% 70%,
    rgba(139, 92, 246, 0.3) 0%,
    rgba(99, 102, 241, 0.2) 30%,
    transparent 60%
  );
  animation: aurora-2 14s ease-in-out infinite alternate;
}

.aurora-layer-3 {
  background: radial-gradient(
    ellipse at 50% 30%,
    rgba(59, 130, 246, 0.25) 0%,
    rgba(99, 102, 241, 0.15) 30%,
    transparent 60%
  );
  animation: aurora-3 16s ease-in-out infinite alternate;
}

.aurora-layer-4 {
  background: radial-gradient(
    ellipse at 60% 80%,
    rgba(118, 75, 162, 0.3) 0%,
    rgba(139, 92, 246, 0.2) 30%,
    transparent 60%
  );
  animation: aurora-4 10s ease-in-out infinite alternate;
}

@keyframes aurora-1 {
  0% {
    transform: translate(-10%, -10%) rotate(0deg) scale(1);
  }
  33% {
    transform: translate(10%, 20%) rotate(120deg) scale(1.2);
  }
  66% {
    transform: translate(-20%, 10%) rotate(240deg) scale(0.9);
  }
  100% {
    transform: translate(5%, -5%) rotate(360deg) scale(1.1);
  }
}

@keyframes aurora-2 {
  0% {
    transform: translate(20%, 10%) rotate(45deg) scale(1.1);
  }
  33% {
    transform: translate(-10%, -15%) rotate(165deg) scale(0.8);
  }
  66% {
    transform: translate(15%, 25%) rotate(285deg) scale(1.3);
  }
  100% {
    transform: translate(-5%, 5%) rotate(405deg) scale(1);
  }
}

@keyframes aurora-3 {
  0% {
    transform: translate(-15%, 15%) rotate(90deg) scale(0.9);
  }
  33% {
    transform: translate(25%, -10%) rotate(210deg) scale(1.1);
  }
  66% {
    transform: translate(-10%, 20%) rotate(330deg) scale(0.85);
  }
  100% {
    transform: translate(10%, -20%) rotate(450deg) scale(1.15);
  }
}

@keyframes aurora-4 {
  0% {
    transform: translate(10%, -20%) rotate(135deg) scale(1.2);
  }
  33% {
    transform: translate(-25%, 15%) rotate(255deg) scale(0.9);
  }
  66% {
    transform: translate(15%, -10%) rotate(375deg) scale(1.05);
  }
  100% {
    transform: translate(-5%, 25%) rotate(495deg) scale(1.1);
  }
}

.twinkling {
  position: absolute;
  inset: 0;
  background: radial-gradient(
      circle at 20% 50%,
      rgba(99, 102, 241, 0.15) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(139, 92, 246, 0.15) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 40% 20%,
      rgba(59, 130, 246, 0.1) 0%,
      transparent 50%
    );
  animation: move-twink-back 12s ease-in-out infinite alternate;
  z-index: 1;
}

@keyframes move-twink-back {
  0% {
    transform: translateY(0px) translateX(0px) scale(1);
    opacity: 0.6;
  }
  25% {
    transform: translateY(-20px) translateX(-30px) scale(1.05);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-40px) translateX(-20px) scale(1.1);
    opacity: 0.9;
  }
  75% {
    transform: translateY(-30px) translateX(-10px) scale(1.05);
    opacity: 0.7;
  }
  100% {
    transform: translateY(-10px) translateX(-40px) scale(1);
    opacity: 0.6;
  }
}

/* Floating Orbs */
.floating-orb {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(99, 102, 241, 0.35) 0%,
    rgba(139, 92, 246, 0.22) 30%,
    transparent 70%
  );
  filter: blur(50px);
  animation: float-pulse var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
  z-index: 2;
}

@keyframes float-pulse {
  0% {
    transform: translate(0, 0) scale(0.8);
    opacity: 0.3;
  }
  25% {
    transform: translate(30px, 30px) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translate(60px, 60px) scale(1.2);
    opacity: 0.8;
  }
  75% {
    transform: translate(40px, 40px) scale(1);
    opacity: 0.6;
  }
  100% {
    transform: translate(0, 0) scale(0.8);
    opacity: 0.3;
  }
}

@keyframes trackFill {
  0% {
    width: 0%;
    background-position: 0% 50%;
  }
  33% {
    width: 35%;
    background-position: 50% 50%;
  }
  66% {
    width: 70%;
    background-position: 75% 50%;
  }
  90% {
    width: 100%;
    background-position: 100% 50%;
  }
  100% {
    width: 100%;
    background-position: 100% 50%;
  }
}

@keyframes stepReveal {
  0% {
    opacity: 0.35;
    transform: translateY(10px);
  }
  5% {
    opacity: 1;
    transform: translateY(0);
  }
  25% {
    opacity: 1;
    transform: translateY(0);
  }
  35% {
    opacity: 0.35;
    transform: translateY(10px);
  }
  100% {
    opacity: 0.35;
    transform: translateY(10px);
  }
}

/* Hero Section */
.hero {
  position: relative;
  z-index: 1;
  padding: 80px 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  text-align: center;
}

.hero-content {
  margin-bottom: 80px;
}

.hero-title {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  margin-bottom: 1rem;
  letter-spacing: -2px;
}

.gradient-text {
  background: linear-gradient(
    135deg,
    rgba(180, 83, 9, 1) 0%,
    /* dark orange (#b45309) */ rgba(217, 119, 6, 1) 20%,
    /* deeper orange (#d97706) */ rgba(147, 51, 234, 1) 60%,
    /* purple (#9333ea) */ rgba(126, 34, 206, 1) 80%,
    /* dark purple (#7e22ce) */ rgba(180, 83, 9, 1) 100%
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: aurora-gradient 8s ease-in-out infinite;
}

@keyframes aurora-gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.hero-subtitle {
  font-size: clamp(1.25rem, 3vw, 2rem);
  color: #a8b2d1;
  margin-bottom: 1.5rem;
}

.highlight {
  color: #10b981;
  font-weight: 600;
}

.hero-description {
  max-width: 600px;
  margin: 0 auto 3rem;
  font-size: 1.125rem;
  color: #8b95b7;
  line-height: 1.8;
}

/* Launch Button */
.launch-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.launch-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
}

.launch-btn:active {
  transform: translateY(0);
}

.arrow-icon {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.3s ease;
}

.launch-btn:hover .arrow-icon {
  transform: translateX(4px);
}

/* Features Grid */
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 80px;
}

.feature-card {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  transition: all 0.3s ease;
}

.feature-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: #667eea;
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.2);
}

.feature-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.feature-icon svg {
  width: 30px;
  height: 30px;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: white;
}

.feature-description {
  color: #8b95b7;
  line-height: 1.7;
}

.section-subtitle {
  color: #8b95b7;
  max-width: 640px;
  margin: 0.75rem auto 3rem;
  line-height: 1.8;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.9rem;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #fef9c3;
}

.overview,
.score-section,
.apy-section,
.architecture {
  position: relative;
  z-index: 1;
  padding: 90px 20px;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.overview-card {
  padding: 2rem;
  background: rgba(18, 22, 48, 0.65);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 18px 45px rgba(8, 12, 35, 0.4);
  transition: transform 0.3s ease, border-color 0.3s ease;
  text-align: left;
}

.overview-card h3 {
  font-size: 1.5rem;
  margin: 1rem 0 0.75rem;
}

.overview-card p {
  color: #9ca7c6;
  line-height: 1.8;
}

.overview-card:hover {
  transform: translateY(-6px);
  border-color: rgba(249, 115, 22, 0.65);
}

.process {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  margin-top: 3.5rem;
}

.process-icons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1.5rem;
  justify-items: center;
}

.process-icon-wrap {
  width: 96px;
  height: 96px;
  border-radius: 24px;
  background: rgba(20, 24, 52, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 18px 40px rgba(8, 12, 30, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.process-icon-number {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #facc15;
}

.process-track {
  position: relative;
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.15);
}

.process-track-fill {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #f97316, #c026d3, #38bdf8);
  background-size: 200% 100%;
  animation: trackFill 12s ease-in-out infinite;
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  text-align: left;
}

.process-step {
  background: rgba(18, 22, 48, 0.7);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1.75rem;
  box-shadow: 0 15px 40px rgba(8, 12, 35, 0.35);
  opacity: 0.35;
  transform: translateY(10px);
  animation: stepReveal 12s ease-in-out infinite;
}

.process-step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(243, 244, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #fbbf24;
  margin-bottom: 1rem;
}

.process-step h3 {
  font-size: 1.35rem;
  margin-bottom: 0.75rem;
}

.process-step p {
  color: #a5b4fc;
  line-height: 1.75;
}

.process-step:nth-child(2) {
  animation-delay: 4s;
}

.process-step:nth-child(3) {
  animation-delay: 8s;
}

.section-header {
  text-align: center;
}

.score-grid {
  margin: 3rem auto 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
  max-width: 1080px;
}

.score-card {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 220px;
  text-align: left;
}

.score-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #fbbf24;
}

.score-card h3 {
  font-size: 1.25rem;
}

.score-card p {
  color: #9ca7c6;
  flex: 1;
  line-height: 1.7;
}

.score-cap {
  font-size: 0.85rem;
  color: #a855f7;
  font-weight: 600;
}

.tier-table {
  margin: 0 auto;
  max-width: 720px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(16, 20, 45, 0.75);
  box-shadow: 0 18px 50px rgba(5, 10, 30, 0.45);
}

.tier-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 1.1rem 1.5rem;
  align-items: center;
}

.tier-row span {
  color: #dbeafe;
}

.tier-row + .tier-row {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.tier-header {
  background: rgba(255, 255, 255, 0.08);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.tier-row span:last-child {
  font-weight: 700;
  color: #fbbf24;
}

.architecture-wrapper {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.6fr);
  gap: 2.5rem;
  align-items: start;
}

.architecture-card {
  padding: 2.25rem;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 45px rgba(8, 12, 40, 0.35);
  text-align: left;
}

.architecture-card h2 {
  font-size: 2rem;
  margin: 1rem 0;
}

.architecture-card p {
  color: #9ca7c6;
  line-height: 1.8;
}

.architecture-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
}

.architecture-column {
  padding: 1.5rem;
  background: rgba(12, 16, 38, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 18px;
  box-shadow: 0 14px 35px rgba(5, 10, 25, 0.35);
  text-align: left;
}

.architecture-column h3 {
  font-size: 1.15rem;
  margin-bottom: 0.75rem;
  color: #facc15;
}

.architecture-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.architecture-column li {
  color: #c7d2fe;
  font-size: 0.95rem;
}

/* Scroll Indicator */
.scroll-indicator {
  margin-top: auto;
  padding-bottom: 2rem;
}

.mouse {
  width: 24px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  position: relative;
  margin: 0 auto;
}

.mouse::before {
  content: "";
  position: absolute;
  width: 4px;
  height: 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 2px;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  animation: scroll 2s infinite;
}

@keyframes scroll {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(12px);
  }
}

/* Technology Section */
.tech {
  padding: 100px 20px;
  position: relative;
  z-index: 1;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: white;
  text-align: center;
}

.tech-grid {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  transition: transform 0.3s ease;
}

.tech-item:hover {
  transform: scale(1.1) translateY(-5px);
}

.tech-icon {
  font-size: 3rem;
}

.tech-img {
  width: 144px;
  height: 144px;
  object-fit: contain;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
}

.tech-name {
  color: #a8b2d1;
  font-weight: 600;
  font-size: 1.125rem;
}

/* Animations */
.fade-down-enter-active {
  transition: all 0.8s ease;
}

.fade-down-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.scale-enter-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.slide-up-enter-active {
  transition: all 0.6s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.fade-in-enter-active {
  transition: all 0.8s ease;
}

.fade-in-enter-from {
  opacity: 0;
}

.bounce-enter-active {
  animation: bounce 2s ease infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* How It Works Section */
.how-it-works {
  padding: 100px 20px;
  position: relative;
  z-index: 1;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* FAQ Section */
.faq {
  padding: 100px 20px;
  position: relative;
  z-index: 1;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
}

.faq-list {
  max-width: 800px;
  margin: 60px auto 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.faq-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  transition: all 0.3s ease;
}

.faq-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(102, 126, 234, 0.3);
  transform: translateX(10px);
}

.faq-question {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: white;
}

.faq-answer {
  color: #8b95b7;
  line-height: 1.8;
}

@media (max-width: 1024px) {
  .score-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* Responsive */
@media (max-width: 768px) {
  .section-subtitle {
    margin-bottom: 2rem;
  }

  .overview,
  .score-section,
  .apy-section,
  .architecture {
    padding: 70px 20px;
  }

  .hero {
    padding: 60px 20px;
  }

  .features {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: 60px;
  }

  .feature-card {
    padding: 1.5rem;
  }

  .score-grid {
    grid-template-columns: 1fr;
  }

  .tier-table {
    border-radius: 16px;
  }

  .tier-row {
    grid-template-columns: 1fr 1fr;
    row-gap: 0.75rem;
  }

  .tier-row span:nth-child(3) {
    grid-column: span 2;
    justify-self: flex-start;
  }

  .tier-row.tier-header {
    grid-template-columns: repeat(3, 1fr);
  }

  .tier-row.tier-header span:nth-child(3) {
    grid-column: auto;
  }

  .tech-grid {
    gap: 2rem;
  }

  .process-icons {
    gap: 1rem;
  }

  .process-icon-wrap {
    width: 76px;
    height: 76px;
  }

  .process-steps {
    grid-template-columns: 1fr;
  }

  .process-step {
    padding: 1.5rem;
  }

  .architecture-wrapper {
    grid-template-columns: 1fr;
  }

  .faq {
    padding: 60px 20px;
  }

  .faq-item {
    padding: 1.5rem;
  }
}
</style>
