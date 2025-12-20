<template>
  <div class="min-h-screen bg-zama p-4 text-foreground">
    <!-- Header -->
    <div class="max-w-6xl mx-auto mb-8">
      <div
        class="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20 shadow-lg"
      >
        <div class="flex items-center space-x-4">
          <img
            src="/media/fhearnlogo.png"
            alt="FHEarn Logo"
            class="h-[60px] w-[100px]"
          />
          <div>
            <h1 class="text-2xl font-bold text-foreground">FHEarn</h1>
            <p class="text-muted-foreground">Onchain Score-Based Custom APY</p>
          </div>
        </div>

        <!-- Wallet Connection -->
        <div v-if="!isConnected" class="flex items-center space-x-4">
          <div
            class="bg-orange-500/20 border border-orange-500/30 rounded-lg px-4 py-2 flex items-center space-x-2"
          >
            <svg
              class="w-5 h-5 text-orange-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="text-orange-400">Please connect your wallet</span>
          </div>
          <button
            @click="connectWithOnboard"
            class="bg-gradient-to-r from-primary-300 to-primary-200 text-primary-foreground px-6 py-2 rounded-lg hover:from-primary-400 hover:to-primary-300 transition-all duration-200 font-medium flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
              />
            </svg>
            <span>Connect Wallet</span>
          </button>
        </div>

        <div v-else class="flex items-center space-x-4">
          <div
            class="bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2 flex items-center space-x-2"
          >
            <div class="w-2 h-2 bg-green-400 rounded-full"></div>
            <span class="text-green-400">Connected</span>
          </div>
          <div class="text-sm text-muted-foreground">
            {{ account?.slice(0, 6) }}...{{ account?.slice(-4) }}
          </div>
          <button
            @click="disconnectWallet"
            class="px-3 py-1.5 text-sm rounded-md bg-slate-700 hover:bg-slate-600 border border-slate-600 text-foreground transition"
            title="Disconnect"
          >
            Disconnect
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="bg-surface rounded-xl border border-slate-700 p-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-foreground mb-4">
            Welcome to FHEarn
          </h2>
          <p class="text-muted-foreground mb-8 max-w-2xl mx-auto">
            FHEarn is a confidential DeFi platform built with Fully Homomorphic
            Encryption (FHE). Experience privacy-preserving financial services
            on the blockchain.
          </p>

          <!-- Features Grid -->
          <div class="grid md:grid-cols-3 gap-6 mb-8">
            <div class="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <div
                class="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto"
              >
                <svg
                  class="w-6 h-6 text-primary-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-foreground mb-2">
                Score-Based APY
              </h3>
              <p class="text-muted-foreground text-sm">
                Earn personalized rewards based on your on-chain activity score
                and engagement level
              </p>
            </div>

            <div class="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <div
                class="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto"
              >
                <svg
                  class="w-6 h-6 text-primary-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-foreground mb-2">
                Privacy Protection
              </h3>
              <p class="text-muted-foreground text-sm">
                Your financial data remains encrypted and confidential
              </p>
            </div>

            <div class="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <div
                class="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto"
              >
                <svg
                  class="w-6 h-6 text-primary-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-foreground mb-2">
                FHEVM Powered
              </h3>
              <p class="text-muted-foreground text-sm">
                Built on Zama's FHEVM for secure computation
              </p>
            </div>
          </div>

          <!-- Loading Metrics -->
          <div
            v-if="isConnected && isLoadingMetrics"
            class="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-6 mb-8 border border-blue-500/30"
          >
            <div class="flex items-center justify-center space-x-4">
              <div
                class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"
              ></div>
              <div>
                <h3 class="text-xl font-bold text-blue-300 mb-2">
                  Loading Wallet Metrics...
                </h3>
                <p class="text-blue-200 text-sm">
                  Fetching your onchain data from Ethereum Mainnet
                </p>
              </div>
            </div>
          </div>

          <!-- Stake Section -->
          <div
            v-if="isConnected && walletMetrics && !isLoadingMetrics"
            class="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg p-6 mb-8 border border-green-500/30"
          >
            <h3 class="text-xl font-bold text-green-300 mb-6">
              Confidential Staking
            </h3>

            <!-- Stake Input Section -->
            <div v-if="!stakeInfo.isActive" class="mb-6">
              <div class="mb-4">
                <label class="block text-sm font-medium text-green-200 mb-2">
                  Stake Amount (Sepolia ETH)
                </label>
                <!-- Network Status -->
                <div
                  v-if="
                    fhevmStatus && fhevmStatus.network !== 'Sepolia Testnet'
                  "
                  class="bg-red-900/30 border border-red-500/30 rounded-lg p-4 mb-4"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-red-300 font-bold">⚠️ Wrong Network</h3>
                      <p class="text-red-200 text-sm">
                        Current: {{ fhevmStatus.network }} ({{
                          fhevmStatus.chainId
                        }})
                      </p>
                      <p class="text-red-200 text-sm">
                        Required: Sepolia Testnet (0xaa36a7)
                      </p>
                    </div>
                    <button
                      @click="switchToSepolia"
                      class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Switch to Sepolia
                    </button>
                  </div>
                </div>

                <div>
                  <input
                    v-model="stakeAmount"
                    type="number"
                    step="0.001"
                    min="0.001"
                    placeholder="0.001"
                    class="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-foreground placeholder-slate-400 focus:border-green-400 focus:ring-1 focus:ring-green-400"
                  />
                </div>
                <p class="text-xs text-green-300 mt-1">
                  Your APY: {{ walletMetrics.apy }}% ({{ walletMetrics.tier }}
                  Tier)
                </p>
              </div>

              <button
                @click="stakeETH"
                :disabled="
                  !stakeAmount || parseFloat(stakeAmount) <= 0 || isStaking
                "
                class="w-full bg-gradient-to-r from-green-500 to-green-400 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-500 transition-all duration-200 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  v-if="isStaking"
                  class="animate-spin w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <svg
                  v-else
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>{{ isStaking ? "Staking..." : "Stake ETH" }}</span>
              </button>
            </div>

            <!-- Active Stake Info -->
            <div v-else class="space-y-4">
              <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-slate-800/50 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-muted-foreground text-sm"
                      >Staked Amount</span
                    >
                    <svg
                      class="w-4 h-4 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 002-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div class="text-foreground font-semibold text-lg">
                    {{ stakeInfo.amount }} ETH
                  </div>
                </div>

                <div class="bg-slate-800/50 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-muted-foreground text-sm"
                      >Current Rewards</span
                    >
                    <svg
                      class="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div class="text-yellow-300 font-semibold text-lg">
                    {{ stakeInfo.rewards }} ETH
                  </div>
                </div>
              </div>

              <!-- Action Button -->
              <div class="flex justify-center">
                <button
                  @click="withdrawAll"
                  :disabled="isWithdrawing"
                  class="bg-gradient-to-r from-red-500 to-red-400 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-red-500 transition-all duration-200 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    v-if="isWithdrawing"
                    class="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <svg
                    v-else
                    class="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L9 10.586 8.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>{{
                    isWithdrawing ? "Withdrawing..." : "Withdraw All"
                  }}</span>
                </button>
              </div>

              <!-- Stake Info -->
              <div class="text-xs text-green-300">
                <p>Staked on: {{ stakeInfo.stakeDate }}</p>
                <p>
                  APY: {{ walletMetrics.apy }}% ({{ walletMetrics.tier }} Tier)
                </p>
                <p>Rewards update every 2 minutes</p>
              </div>
            </div>
          </div>

          <!-- Comprehensive Wallet Analytics -->
          <div
            v-if="isConnected && walletMetrics && !isLoadingMetrics"
            class="bg-slate-800/50 rounded-lg p-6 border border-slate-700 mb-8"
          >
            <h3 class="text-lg font-semibold text-foreground mb-4">
              Covalent API Wallet Analytics (Ethereum Mainnet)
            </h3>

            <!-- Onchain Score & APY Section -->
            <div
              class="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-6 mb-6 border border-blue-500/30"
            >
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-xl font-bold text-blue-300">
                  Your Onchain Score
                </h4>
                <div class="flex items-center space-x-4">
                  <div class="text-center">
                    <div class="text-3xl font-bold text-blue-200">
                      {{ walletMetrics.onchainScore }}
                    </div>
                    <div class="text-sm text-blue-400">
                      {{ walletMetrics.tier }}
                    </div>
                  </div>
                  <div class="text-center">
                    <div class="text-3xl font-bold text-green-200">
                      {{ walletMetrics.apy }}%
                    </div>
                    <div class="text-sm text-green-400">APY</div>
                  </div>
                </div>
              </div>
              <p class="text-blue-200 text-sm">
                Your score is calculated based on transaction activity, wallet
                age, multi-chain usage, and token diversity. Higher scores
                unlock better APY rates!
              </p>
            </div>

            <!-- Core Metrics Row -->
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div class="bg-slate-700/50 rounded-lg p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-muted-foreground text-sm">ETH Balance</span>
                  <svg
                    class="w-4 h-4 text-primary-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="text-foreground font-semibold">
                  {{ walletMetrics.balance }} ETH
                </div>
              </div>

              <div class="bg-slate-700/50 rounded-lg p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-muted-foreground text-sm"
                    >Total Transactions</span
                  >
                  <svg
                    class="w-4 h-4 text-primary-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="text-foreground font-semibold">
                  {{ walletMetrics.totalTx }}
                </div>
              </div>

              <div class="bg-slate-700/50 rounded-lg p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-muted-foreground text-sm">Wallet Age</span>
                  <svg
                    class="w-4 h-4 text-primary-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="text-foreground font-semibold">
                  {{ walletMetrics.walletAge }}
                </div>
              </div>
            </div>

            <!-- Token & NFT Metrics Row -->
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div class="bg-slate-700/50 rounded-lg p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-muted-foreground text-sm"
                    >Total Tokens</span
                  >
                  <svg
                    class="w-4 h-4 text-primary-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="text-foreground font-semibold">
                  {{ walletMetrics.totalTokens }}
                </div>
              </div>

              <div class="bg-slate-700/50 rounded-lg p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-muted-foreground text-sm"
                    >Active Tokens</span
                  >
                  <svg
                    class="w-4 h-4 text-primary-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="text-foreground font-semibold">
                  {{ walletMetrics.activeTokens }}
                </div>
              </div>

              <div class="bg-slate-700/50 rounded-lg p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-muted-foreground text-sm"
                    >Last Transaction</span
                  >
                  <svg
                    class="w-4 h-4 text-primary-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="text-foreground font-semibold">
                  {{ walletMetrics.lastTxDate }}
                </div>
              </div>
            </div>

            <!-- Multi-Chain Metrics Row -->
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div class="bg-slate-700/50 rounded-lg p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-muted-foreground text-sm"
                    >Total Tokens (All Chains)</span
                  >
                  <svg
                    class="w-4 h-4 text-primary-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="text-foreground font-semibold">
                  {{ walletMetrics.totalTokensAcrossChains }}
                </div>
              </div>

              <div class="bg-slate-700/50 rounded-lg p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-muted-foreground text-sm"
                    >Active Chains</span
                  >
                  <svg
                    class="w-4 h-4 text-primary-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="text-foreground font-semibold">
                  {{ walletMetrics.activeChains }}
                </div>
              </div>
            </div>
          </div>
          <!-- FHEVM Status -->
          <div
            v-if="fhevmStatus"
            class="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
          >
            <h3 class="text-lg font-semibold text-foreground mb-4">
              FHEVM Connection Status
            </h3>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Network:</span>
                <span class="text-foreground">{{ fhevmStatus.network }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Chain ID:</span>
                <span class="text-foreground">{{ fhevmStatus.chainId }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">FHEVM Instance:</span>
                <span class="text-green-400">✅ Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { BrowserProvider, ethers } from "ethers";

// FHEVM SDK
const SDK_URL = "https://cdn.zama.ai/relayer-sdk-js/0.2.0/relayer-sdk-js.js";
let initSDK: any;
let createInstance: any;
let SepoliaConfig: any;

// Single source of truth for the stake contract address
const STAKE_CONTRACT_ADDRESS = "0x73Cd102fA66551c82Eb97C50634Cbd19f2091f98";

// State
const isConnected = ref(false);
const account = ref<string | null>(null);
const fhevmStatus = ref<any>(null);
const isMetaMaskInstalled = ref(false);
const walletMetrics = ref<any>(null);
const isLoadingMetrics = ref(false);

// Stake State
const stakeAmount = ref<string>("");
const isStaking = ref(false);
const isClaiming = ref(false);
const isWithdrawing = ref(false);
const stakeInfo = ref({
  isActive: false,
  amount: "0",
  rewards: "0.00000000",
  stakeDate: "",
  apy: 0,
});

// Rewards computation helpers
const SECONDS_PER_YEAR = 31536000n;
let rewardTimer: any = null;

function computeRewardWei(
  amountWei: bigint,
  apyPct: number,
  startSec: number,
  nowSec: number
): bigint {
  const elapsed = BigInt(Math.max(0, nowSec - startSec));
  return (amountWei * BigInt(apyPct) * elapsed) / (SECONDS_PER_YEAR * 100n);
}

function formatEthFromWeiBigInt(wei: bigint, decimals = 8): string {
  return (Number(wei) / 1e18).toFixed(decimals);
}

function startRewardUpdatesBaseline(baseline: {
  amountWei: bigint;
  apy: number;
  startSec: number;
}) {
  const tick = () => {
    const t = Math.floor(Date.now() / 1000);
    const rw = computeRewardWei(
      baseline.amountWei,
      baseline.apy,
      baseline.startSec,
      t
    );
    const formatted = formatEthFromWeiBigInt(rw, 8);
    stakeInfo.value.rewards = formatted;
    console.log("reward(tick):", formatted, "ETH");
    localStorage.setItem("fhearn_stake_info", JSON.stringify(stakeInfo.value));
  };
  // immediate compute and log
  tick();
  if (rewardTimer) clearInterval(rewardTimer);
  rewardTimer = setInterval(tick, 30000);
}

function stopRewardUpdates() {
  if (rewardTimer) {
    clearInterval(rewardTimer);
    rewardTimer = null;
  }
}

// Covalent API Configuration
const COVALENT_API_KEY = import.meta.env.VITE_COVALENT_API_KEY || "cqt_rQYgTTqMb3kmpdQKvfdXxffQjtK4";
const COVALENT_BASE_URL = "https://api.covalenthq.com/v1";

// NOTE: Web3-Onboard disabled due to build type issues; keeping functions to preserve API
async function connectWithOnboard() {
  // Fallback to current MetaMask connect flow
  await connectWallet();
}

async function disconnectWallet() {
  try {
    stopRewardUpdates();
  } catch {}
  localStorage.removeItem("fhearn_stake_info");
  stakeInfo.value = {
    isActive: false,
    amount: "0",
    rewards: "0.00000000",
    stakeDate: "",
    apy: 0,
  };
  walletMetrics.value = null;
  isConnected.value = false;
  account.value = null;
  fhevmStatus.value = null;
}

// Onchain Score Calculation Algorithm
function calculateOnchainScore(metrics: any) {
  const {
    totalTx,
    walletAge,
    totalTokensAcrossChains,
    activeChains,
    activeTokens,
    balance,
  } = metrics;

  // Convert string values to numbers
  const txCount = parseInt(totalTx.replace(/,/g, "")) || 0;
  const walletAgeYears = parseFloat(walletAge.replace(" years", "")) || 0;
  const tokenCount = parseInt(totalTokensAcrossChains) || 0;
  const chainCount = parseInt(activeChains) || 0;
  const activeTokenCount = parseInt(activeTokens) || 0;
  const ethBalance = parseFloat(balance) || 0;

  console.log("Calculating score with metrics:", {
    txCount,
    walletAgeYears,
    tokenCount,
    chainCount,
    activeTokenCount,
    ethBalance,
  });

  // Scoring Algorithm Components
  let score = 0;

  // 1. Transaction Activity Score (0-30 points)
  const txScore = Math.min(30, Math.log10(txCount + 1) * 10);
  score += txScore;

  // 2. Wallet Age Score (0-20 points)
  const ageScore = Math.min(20, walletAgeYears * 2);
  score += ageScore;

  // 3. Multi-chain Activity Score (0-25 points)
  const chainScore = Math.min(25, chainCount * 5);
  score += chainScore;

  // 4. Token Diversity Score (0-15 points)
  const diversityScore = Math.min(15, Math.log10(tokenCount + 1) * 5);
  score += diversityScore;

  // 5. Active Token Score (0-10 points)
  const activeScore = Math.min(10, activeTokenCount * 2);
  score += activeScore;

  // 6. Balance Score (0-20 points) - ETH balance
  const balanceScore = Math.min(20, Math.log10(ethBalance * 1000 + 1) * 3);
  score += balanceScore;

  // Bonus multipliers
  let multiplier = 1;

  // Multi-chain bonus
  if (chainCount >= 3) multiplier += 0.1;
  if (chainCount >= 5) multiplier += 0.1;

  // High activity bonus
  if (txCount >= 100) multiplier += 0.1;
  if (txCount >= 500) multiplier += 0.1;

  // Veteran bonus
  if (walletAgeYears >= 2) multiplier += 0.1;
  if (walletAgeYears >= 4) multiplier += 0.1;

  score = Math.round(score * multiplier);

  // Cap the score at 150
  score = Math.min(150, score);

  console.log("Calculated score:", score);
  return score;
}

// APY Calculation based on Score
function calculateAPY(score: number) {
  let baseAPY = 0;

  if (score >= 120) {
    baseAPY = 25; // Tier 1: Elite (120-150)
  } else if (score >= 90) {
    baseAPY = 20; // Tier 2: Advanced (90-119)
  } else if (score >= 70) {
    baseAPY = 15; // Tier 3: Experienced (70-89)
  } else if (score >= 50) {
    baseAPY = 12; // Tier 4: Intermediate (50-69)
  } else if (score >= 30) {
    baseAPY = 8; // Tier 5: Beginner (30-49)
  } else {
    baseAPY = 5; // Tier 6: Newcomer (0-29)
  }

  return baseAPY;
}

// Get Score Tier Name
function getScoreTier(score: number) {
  if (score >= 120) return "Elite";
  if (score >= 90) return "Advanced";
  if (score >= 70) return "Experienced";
  if (score >= 50) return "Intermediate";
  if (score >= 30) return "Beginner";
  return "Newcomer";
}

// Fetch comprehensive wallet metrics from Covalent API
async function fetchWalletMetrics(address: string) {
  isLoadingMetrics.value = true;
  try {
    console.log("Fetching comprehensive wallet metrics for:", address);

    // Test multiple chains to see if we can get aggregated data
    const supportedChains = [
      { id: 1, name: "Ethereum Mainnet" },
      { id: 137, name: "Polygon" },
      { id: 56, name: "BSC" },
      { id: 43114, name: "Avalanche" },
      { id: 250, name: "Fantom" },
      { id: 42161, name: "Arbitrum" },
      { id: 10, name: "Optimism" },
    ];

    console.log("Testing multiple chains for aggregated data...");

    // Test if Covalent provides aggregated data across chains (with rate limiting)
    const chainPromises = supportedChains.map(async (chain, index) => {
      try {
        // Add delay to avoid rate limiting
        if (index > 0) {
          await new Promise((resolve) => setTimeout(resolve, index * 500)); // 500ms delay between requests
        }

        const [balanceResponse, txSummaryResponse, txListResponse] =
          await Promise.all([
            fetch(
              `${COVALENT_BASE_URL}/${chain.id}/address/${address}/balances_v2/?key=${COVALENT_API_KEY}`
            ),
            fetch(
              `${COVALENT_BASE_URL}/${chain.id}/address/${address}/transactions_summary/?key=${COVALENT_API_KEY}`
            ),
            fetch(
              `${COVALENT_BASE_URL}/${chain.id}/address/${address}/transactions_v2/?key=${COVALENT_API_KEY}&page-size=1000&page-number=0`
            ),
          ]);

        const [balanceData, txSummaryData, txListData] = await Promise.all([
          balanceResponse.json(),
          txSummaryResponse.json(),
          txListResponse.json(),
        ]);

        // Use multiple sources for transaction count
        const txCount =
          txSummaryData.data?.total_count ||
          txListData.data?.pagination?.total_count ||
          txListData.data?.items?.length ||
          0;

        return {
          chain: chain.name,
          chainId: chain.id,
          tokenCount: balanceData.data?.items?.length || 0,
          txCount: txCount,
          hasData: balanceData.data?.items?.length > 0 || txCount > 0,
        };
      } catch (error: any) {
        console.warn(`Error fetching data for ${chain.name}:`, error.message);
        return {
          chain: chain.name,
          chainId: chain.id,
          tokenCount: 0,
          txCount: 0,
          hasData: false,
          error: error.message,
        };
      }
    });

    const chainResults = await Promise.all(chainPromises);
    console.log("Multi-chain results:", chainResults);

    // Calculate total metrics across all chains
    const totalTokensAcrossChains = chainResults.reduce(
      (sum, result) => sum + result.tokenCount,
      0
    );
    const totalTxAcrossChains = chainResults.reduce(
      (sum, result) => sum + result.txCount,
      0
    );
    const activeChains = chainResults.filter((result) => result.hasData).length;

    console.log(
      `Total tokens across ${activeChains} chains:`,
      totalTokensAcrossChains
    );
    console.log(
      `Total transactions across ${activeChains} chains:`,
      totalTxAcrossChains
    );

    // Debug: Show transaction count per chain
    chainResults.forEach((result) => {
      if (result.txCount > 0) {
        console.log(`${result.chain}: ${result.txCount} transactions`);
      }
    });

    // Fetch multiple endpoints in parallel (Ethereum Mainnet - Chain ID: 1)
    const [balanceResponse, txResponse, txSummaryResponse] = await Promise.all([
      // 1. Token Balances - Ethereum Mainnet
      fetch(
        `${COVALENT_BASE_URL}/1/address/${address}/balances_v2/?key=${COVALENT_API_KEY}`
      ),
      // 2. Transaction History - Ethereum Mainnet (with proper pagination)
      fetch(
        `${COVALENT_BASE_URL}/1/address/${address}/transactions_v2/?key=${COVALENT_API_KEY}&page-size=1000&page-number=0`
      ),
      // 3. Transaction Summary - Alternative endpoint for total count
      fetch(
        `${COVALENT_BASE_URL}/1/address/${address}/transactions_summary/?key=${COVALENT_API_KEY}`
      ),
    ]);

    const [balanceData, txData, txSummaryData] = await Promise.all([
      balanceResponse.json(),
      txResponse.json(),
      txSummaryResponse.json(),
    ]);

    // Calculate comprehensive metrics
    const ethBalance =
      balanceData.data?.items?.find(
        (item: any) =>
          item.contract_address === "0x0000000000000000000000000000000000000000"
      )?.balance || "0";

    // Debug transaction data
    console.log("Transaction data:", txData);
    console.log("Transaction summary data:", txSummaryData);
    console.log("Transaction pagination:", txData.data?.pagination);
    console.log("Transaction items count:", txData.data?.items?.length);

    // Try multiple sources for transaction count
    const totalTx =
      txSummaryData.data?.total_count ||
      txData.data?.pagination?.total_count ||
      txData.data?.items?.length ||
      0;
    const totalTokens = balanceData.data?.items?.length || 0;

    // Calculate wallet age (first transaction date)
    const firstTx = txData.data?.items?.[txData.data.items.length - 1];
    const walletAge = firstTx
      ? calculateAge(firstTx.block_signed_at)
      : "Unknown";

    // Get last transaction date
    const lastTxDate = txData.data?.items?.[0]?.block_signed_at
      ? new Date(txData.data.items[0].block_signed_at).toLocaleDateString()
      : "Never";

    // Calculate active tokens (non-zero balance)
    const activeTokens =
      balanceData.data?.items?.filter(
        (item: any) => parseFloat(item.balance) > 0
      ).length || 0;

    // Calculate score and APY
    const onchainScore = calculateOnchainScore({
      totalTx: totalTxAcrossChains.toLocaleString(),
      walletAge: walletAge,
      totalTokensAcrossChains: totalTokensAcrossChains,
      activeChains: activeChains,
      activeTokens: activeTokens,
      balance: (parseFloat(ethBalance) / Math.pow(10, 18)).toFixed(4),
    });

    const apy = calculateAPY(onchainScore);
    const tier = getScoreTier(onchainScore);

    walletMetrics.value = {
      // Core Metrics
      balance: (parseFloat(ethBalance) / Math.pow(10, 18)).toFixed(4),
      totalTx: totalTxAcrossChains.toLocaleString(), // Multi-chain total
      walletAge: walletAge,

      // Token Metrics
      totalTokens: totalTokens,
      activeTokens: activeTokens,

      // Multi-Chain Metrics
      totalTokensAcrossChains: totalTokensAcrossChains,
      activeChains: activeChains,

      // Activity Metrics
      lastTxDate: lastTxDate,

      // Score & APY Metrics
      onchainScore: onchainScore,
      apy: apy,
      tier: tier,
    };

    console.log("Comprehensive wallet metrics loaded:", walletMetrics.value);

    // Check stake status after loading metrics
    await checkStakeStatus(address);
  } catch (error: any) {
    console.error("Error fetching wallet metrics:", error);
    console.log("Fetching Ethereum Mainnet metrics...");
    walletMetrics.value = {
      balance: "Error",
      portfolioValue: "Error",
      totalTx: "Error",
      walletAge: "Error",
      totalTokens: "Error",
      activeTokens: "Error",
      totalNFTs: "Error",
      gasUsed: "Error",
      avgGasPrice: "Error",
      lastTxDate: "Error",
    };
  } finally {
    isLoadingMetrics.value = false;
  }
}

// Calculate age from date string
function calculateAge(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return `${diffDays} days`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} months`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} years`;
  }
}

// Check stake status from contract
async function checkStakeStatus(userAddress: string) {
  try {
    console.log("🔍 Checking stake status for:", userAddress);

    if (!fhevmStatus.value?.instance) {
      console.log("❌ FHEVM not initialized, skipping stake check");
      return;
    }

    const contractAddress = STAKE_CONTRACT_ADDRESS;
    // Prefer full info if available (amount, timestamp, lastClaimTime, apyRate, isActive)
    const contractABI = [
      {
        inputs: [{ internalType: "address", name: "user", type: "address" }],
        name: "getStakeInfoFull",
        outputs: [
          { internalType: "euint64", name: "", type: "bytes32" },
          { internalType: "euint64", name: "", type: "bytes32" },
          { internalType: "euint64", name: "", type: "bytes32" },
          { internalType: "euint64", name: "", type: "bytes32" },
          { internalType: "bool", name: "", type: "bool" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "user", type: "address" }],
        name: "getStakeInfo",
        outputs: [
          { internalType: "euint64", name: "", type: "bytes32" },
          { internalType: "euint64", name: "", type: "bytes32" },
          { internalType: "euint64", name: "", type: "bytes32" },
          { internalType: "bool", name: "", type: "bool" },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];

    // Create provider and signer (prefer MetaMask provider if multiple wallets)
    const injected =
      (window as any).ethereum?.providers?.find((p: any) => p?.isMetaMask) ||
      (window as any).ethereum;
    const provider = new ethers.BrowserProvider(injected);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );

    // Try getStakeInfoFull first, fallback to getStakeInfo
    let onchainStakeInfo: any;
    let isActive: boolean;
    try {
      onchainStakeInfo = await contract.getStakeInfoFull(userAddress);
      console.log("📊 Onchain stake info (full):", onchainStakeInfo);
      isActive = Boolean(onchainStakeInfo[4]);
    } catch (e) {
      onchainStakeInfo = await contract.getStakeInfo(userAddress);
      console.log("📊 Onchain stake info (basic):", onchainStakeInfo);
      isActive = Boolean(onchainStakeInfo[3]);
    }

    console.log("🔍 Stake Status Check:");
    console.log("  👤 User Address:", userAddress);
    console.log("  📋 Contract Address:", contractAddress);
    console.log("  ✅ Has Active Stake:", isActive);

    if (isActive) {
      console.log("✅ Active stake found onchain");

      // Decrypt the encrypted values using FHEVM
      try {
        console.log("📊 Raw onchain data:", onchainStakeInfo);

        // Convert Proxy(_Result) objects to proper hex strings using ethers.hexlify
        const encryptedAmountStr = ethers.hexlify(onchainStakeInfo[0]);
        const encryptedTimestampStr = ethers.hexlify(onchainStakeInfo[1]);
        // When full info exists, index 2 is lastClaimTime; otherwise we set it equal to timestamp
        const hasFull = onchainStakeInfo.length >= 5;
        const encryptedLastClaimStr = hasFull
          ? ethers.hexlify(onchainStakeInfo[2])
          : encryptedTimestampStr;
        const encryptedAPYStr = hasFull
          ? ethers.hexlify(onchainStakeInfo[3])
          : ethers.hexlify(onchainStakeInfo[2]);

        console.log("🔤 Converted to hex strings:");
        console.log("  💰 Amount string:", encryptedAmountStr);
        console.log("  📅 Timestamp string:", encryptedTimestampStr);
        console.log("  📈 APY string:", encryptedAPYStr);

        // Public decrypt per-handle (hex strings, array-of-one to match SDK)
        console.log("🔓 PublicDecrypt per handle (amount/timestamp/apy)...");
        const fhe = fhevmStatus.value.instance;

        // Helpers for public key normalization (defined BEFORE use)
        const ensure0x = (hex: string) => {
          if (typeof hex !== "string") return hex as any;
          return hex.startsWith("0x") ? hex : "0x" + hex;
        };

        const bytesToHex = (u8: Uint8Array) => {
          return (
            "0x" +
            Array.from(u8)
              .map((b) => b.toString(16).padStart(2, "0"))
              .join("")
          );
        };

        const normalizePublicKey = (pk: any): string => {
          if (!pk) throw new Error("No public key returned by FHEVM");

          if (typeof pk === "string") return ensure0x(pk.toLowerCase());
          if (typeof pk.publicKey === "string")
            return ensure0x(pk.publicKey.toLowerCase());
          if (pk.publicKey instanceof Uint8Array)
            return bytesToHex(pk.publicKey);
          if (typeof pk.public_key === "string")
            return ensure0x(pk.public_key.toLowerCase());
          if (typeof pk.key === "string") return ensure0x(pk.key.toLowerCase());
          if (pk.eip712 && typeof pk.eip712.publicKey === "string") {
            return ensure0x(pk.eip712.publicKey.toLowerCase());
          }
          if (pk instanceof Uint8Array) return bytesToHex(pk);
          if (pk?.buffer && typeof pk.byteLength === "number") {
            return bytesToHex(
              new Uint8Array(pk.buffer, pk.byteOffset ?? 0, pk.byteLength)
            );
          }
          if (
            pk.publicKey &&
            pk.privateKey &&
            typeof pk.publicKey === "string"
          ) {
            return ensure0x(pk.publicKey.toLowerCase());
          }

          throw new Error("Unsupported public key format");
        };

        const decryptOneUser = async (hexStr: string) => {
          try {
            // Convert handle hex -> bytes for userDecrypt
            const ciphertextBytes = ethers.getBytes(hexStr);

            // Get user's public key from SDK and normalize to hex string
            const pkRaw = await fhe.getPublicKey();
            const normalizedPk = normalizePublicKey(pkRaw);
            const publicKeyId = pkRaw?.publicKeyId || pkRaw?.id || "";

            const decrypted = await fhe.userDecrypt({
              ciphertext: ciphertextBytes,
              publicKey: normalizedPk,
              owner: await signer.getAddress(),
              publicKeyId,
              contractAddresses: [STAKE_CONTRACT_ADDRESS],
              signer,
            });
            return decrypted;
          } catch (e: any) {
            console.error("userDecrypt failed:", e?.message || e);
            throw e;
          }
        };

        const decryptOne = async (hexStr: string) => {
          try {
            const res = await fhe.publicDecrypt([hexStr]);
            return res[hexStr];
          } catch (e: any) {
            if (
              typeof e?.message === "string" &&
              e.message.includes("not allowed for public decryption")
            ) {
              console.warn(
                "Public decrypt not allowed for handle; falling back to userDecrypt"
              );
              return await decryptOneUser(hexStr);
            }
            throw e;
          }
        };

        const vAmount = await decryptOne(encryptedAmountStr);
        const vTimestamp = await decryptOne(encryptedTimestampStr);
        const vLastClaim = await decryptOne(encryptedLastClaimStr);
        const vAPY = await decryptOne(encryptedAPYStr);

        console.log("🔓 Values:", { vAmount, vTimestamp, vAPY });

        // Map to UI
        const amountWei = BigInt(vAmount.toString());
        const tsSec = Number(vTimestamp.toString());
        const lastSec = Number(vLastClaim.toString());
        const stakeAPY = Number(vAPY.toString());

        const stakeAmountETH = (Number(amountWei) / 1e18).toFixed(4);
        const stakeDate = new Date(tsSec * 1000).toLocaleString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        stakeInfo.value = {
          isActive: true,
          amount: stakeAmountETH,
          rewards: "0.00000000",
          stakeDate,
          apy: stakeAPY,
        };
        console.log("💾 Final Stake Info Updated:", stakeInfo.value);

        // Start BigInt-based reward updates from baseline = max(timestamp, lastClaim)
        const baselineStart = Math.max(tsSec, lastSec);
        startRewardUpdatesBaseline({
          amountWei,
          apy: stakeAPY,
          startSec: baselineStart,
        });

        console.log("  ✅ Is Active:", stakeInfo.value.isActive);
        console.log("  💰 Amount:", stakeInfo.value.amount, "ETH");
        console.log("  🎁 Rewards:", stakeInfo.value.rewards, "ETH");
        console.log("  📅 Date:", stakeInfo.value.stakeDate);
        console.log("  📈 APY:", stakeInfo.value.apy, "%");
      } catch (decryptError: any) {
        console.error("❌ Failed to decrypt FHEVM values:", decryptError);
        console.warn(
          "⚠️ Keeping cached stake info since decrypt failed temporarily"
        );
        console.warn(
          "💡 This is a temporary issue. Stake data is still on-chain."
        );

        // DO NOT clear localStorage - keep cached data
        // localStorage.removeItem("fhearn_stake_info");

        // Keep existing stake info instead of resetting
        // Stake info is still valid on-chain, just decrypt failed
      }
    } else {
      console.log("❌ No active stake found onchain");
      console.log("🔍 Stake Status Details:");
      console.log("  👤 User Address:", userAddress);
      console.log("  📋 Contract Address:", contractAddress);
      console.log("  ❌ Has Active Stake:", false);
      console.log("  💡 Action: Will show staking interface");

      // Clear localStorage and reset stake info
      localStorage.removeItem("fhearn_stake_info");
      stakeInfo.value = {
        isActive: false,
        amount: "0",
        rewards: "0",
        stakeDate: "",
        apy: 0,
      };

      console.log("🧹 Cleared localStorage and reset stake info");
    }
  } catch (error: any) {
    console.error("❌ Error checking stake status:", error);
    console.log("🔍 Error Details:");
    console.log("  👤 User Address:", userAddress);
    console.log("  📋 Contract Address:", STAKE_CONTRACT_ADDRESS);
    console.log("  ⚠️ Error Message:", error.message);
    console.log(
      "  💡 Action: Preserve current UI/cache; decryption can retry later"
    );
  }
}

// Switch to Sepolia Network
async function switchToSepolia() {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }], // Sepolia chainId
    });
    console.log("✅ Switched to Sepolia Testnet");
    return true;
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xaa36a7",
              chainName: "Sepolia Testnet",
              nativeCurrency: {
                name: "SepoliaETH",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: ["https://eth-sepolia.public.blastapi.io"],
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        });
        console.log("✅ Added and switched to Sepolia Testnet");
        return true;
      } catch (addError: any) {
        console.error("❌ Failed to add Sepolia network:", addError);
        return false;
      }
    } else {
      console.error("❌ Failed to switch to Sepolia:", switchError);
      return false;
    }
  }
}

// Check MetaMask installation
// Stake Functions
function setMaxAmount() {
  if (walletMetrics.value?.balance) {
    stakeAmount.value = (
      parseFloat(walletMetrics.value.balance) * 0.95
    ).toFixed(3); // 95% of balance
  }
}

async function stakeETH() {
  if (!stakeAmount.value || parseFloat(stakeAmount.value) <= 0) return;

  isStaking.value = true;

  try {
    // Check if FHEVM is available
    if (!fhevmStatus.value?.instance) {
      console.log("FHEVM Status:", fhevmStatus.value);
      throw new Error("FHEVM not initialized");
    }

    const amount = parseFloat(stakeAmount.value);
    const apy = walletMetrics.value?.apy || 5;

    console.log("Starting real FHEVM stake operation...");
    console.log("Amount:", amount, "APY:", apy);

    // Get contract instance
    const contractAddress = STAKE_CONTRACT_ADDRESS; // Deployed FHEarnStake (Sepolia)

    // Validate contract address
    if (!ethers.isAddress(contractAddress)) {
      throw new Error(`Invalid contract address: ${contractAddress}`);
    }

    // Ensure address is in checksum format
    const checksumAddress = ethers.getAddress(contractAddress);
    console.log("Using contract address:", checksumAddress);
    console.log("Address validation passed");
    const contractABI = [
      {
        inputs: [
          {
            internalType: "externalEuint64",
            name: "encryptedAmount",
            type: "bytes32",
          },
          {
            internalType: "externalEuint64",
            name: "encryptedAPY",
            type: "bytes32",
          },
          { internalType: "uint256", name: "deadline", type: "uint256" },
          { internalType: "bytes", name: "inputProof", type: "bytes" },
          { internalType: "uint64", name: "apyClear", type: "uint64" },
        ],
        name: "stake",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
    ];

    // Create contract instance using FHEVM SDK method
    console.log("Creating contract instance...");

    // Try to create contract using FHEVM SDK
    let contract;
    try {
      // Method 1: Use FHEVM SDK's contract creation
      if (fhevmStatus.value.instance.createContract) {
        contract = fhevmStatus.value.instance.createContract(
          checksumAddress,
          contractABI
        );
      } else {
        // Method 2: Use ethers directly but with FHEVM-compatible approach
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        contract = new ethers.Contract(checksumAddress, contractABI, signer);
      }
      console.log("Contract instance created successfully");
    } catch (contractError: any) {
      console.error("Contract creation error:", contractError);
      throw new Error(
        `Failed to create contract instance: ${contractError.message}`
      );
    }

    // Encrypt stake amount and APY using FHEVM
    console.log(
      "FHEVM Instance methods:",
      Object.keys(fhevmStatus.value.instance)
    );

    // Try different encryption methods
    let encryptedAmount, encryptedAPY, inputProof;

    console.log("Attempting encryption...");

    if (fhevmStatus.value.instance.createEncryptedInput) {
      // Use createEncryptedInput method - Zama documentation approach
      console.log(
        "Using createEncryptedInput method (Zama documentation approach)"
      );

      try {
        // Step 1: Create encrypted input with contract address and user address
        const input = fhevmStatus.value.instance.createEncryptedInput(
          checksumAddress,
          account.value
        );
        console.log("Created encrypted input object");

        // Step 2: Add values to the input (use 64-bit + BigInt per SDK input guide)
        // Amount in wei as BigInt
        input.add64(ethers.parseUnits(amount.toString(), 18));
        // APY as 64-bit integer
        input.add64(BigInt(apy));
        console.log("Added values to encrypted input");

        // Step 3: Encrypt and get handles + proof
        const enc = await input.encrypt();
        console.log("Encryption completed");

        // Step 4: Extract handles and proof
        encryptedAmount = enc.handles[0]; // First handle (amount)
        encryptedAPY = enc.handles[1]; // Second handle (APY)
        inputProof = enc.inputProof; // Proof for both values

        console.log(
          "Encryption successful with createEncryptedInput (Zama approach)"
        );
        console.log("Encrypted amount handle:", encryptedAmount);
        console.log("Encrypted APY handle:", encryptedAPY);
        console.log("Input proof:", inputProof);
      } catch (error: any) {
        console.error("createEncryptedInput failed:", error.message);
        throw error;
      }
    } else if (fhevmStatus.value.instance.encrypt64) {
      console.log("Using encrypt64 method");
      encryptedAmount = fhevmStatus.value.instance.encrypt64(
        Math.floor(amount * 1e18)
      );
      encryptedAPY = fhevmStatus.value.instance.encrypt64(apy);
      console.log("Encryption successful with encrypt64");
    } else if (fhevmStatus.value.instance.encrypt) {
      console.log("Using encrypt method");
      encryptedAmount = fhevmStatus.value.instance.encrypt(
        Math.floor(amount * 1e18)
      );
      encryptedAPY = fhevmStatus.value.instance.encrypt(apy);
      console.log("Encryption successful with encrypt");
    } else if (fhevmStatus.value.instance.ecrypt) {
      // Note: this might be a typo in FHEVM
      console.log("Using ecrypt method (typo)");
      encryptedAmount = fhevmStatus.value.instance.ecrypt(
        Math.floor(amount * 1e18)
      );
      encryptedAPY = fhevmStatus.value.instance.ecrypt(apy);
      console.log("Encryption successful with ecrypt");
    } else if (fhevmStatus.value.instance.encryptUint64) {
      console.log("Using encryptUint64 method");
      encryptedAmount = fhevmStatus.value.instance.encryptUint64(
        Math.floor(amount * 1e18)
      );
      encryptedAPY = fhevmStatus.value.instance.encryptUint64(apy);
      console.log("Encryption successful with encryptUint64");
    } else {
      throw new Error("No encryption method found on FHEVM instance");
    }

    console.log("Encrypted amount:", encryptedAmount);
    console.log("Encrypted APY:", encryptedAPY);
    console.log("Input proof:", inputProof);

    console.log("Calling real contract with encrypted data...");
    console.log("Contract address:", checksumAddress);
    console.log("Encrypted amount type:", typeof encryptedAmount);
    console.log("Encrypted APY type:", typeof encryptedAPY);
    console.log("Input proof type:", typeof inputProof);

    // Validate encrypted parameters
    if (!encryptedAmount || !encryptedAPY) {
      throw new Error("Encryption failed - missing encrypted parameters");
    }

    console.log("All parameters validated, calling contract...");

    // Calculate deadline (5 minutes from now)
    const deadline = Math.floor(Date.now() / 1000) + 300; // 5 minutes

    // Call the contract with real ETH
    const tx = await contract.stake(
      encryptedAmount,
      encryptedAPY,
      deadline,
      inputProof,
      BigInt(apy),
      {
        value: ethers.parseEther(amount.toString()),
        gasLimit: 1000000,
      }
    );

    console.log("Transaction sent:", tx.hash);

    // Wait for transaction confirmation
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);

    // Update stake info
    stakeInfo.value = {
      isActive: true,
      amount: stakeAmount.value,
      rewards: "0",
      stakeDate: new Date().toLocaleDateString(),
      apy: apy,
    };

    // Save to localStorage for persistence
    localStorage.setItem("fhearn_stake_info", JSON.stringify(stakeInfo.value));

    console.log("Stake successful!");
  } catch (error: any) {
    console.error("Stake error:", error);
    alert("Staking failed: " + error.message);
  } finally {
    isStaking.value = false;
  }
}

async function claimRewards() {
  if (!stakeInfo.value.isActive) return;

  isClaiming.value = true;

  try {
    // Real contract call
    const injected =
      (window as any).ethereum?.providers?.find((p: any) => p?.isMetaMask) ||
      (window as any).ethereum;
    const provider = new ethers.BrowserProvider(injected);
    const signer = await provider.getSigner();

    const contractABI = [
      {
        name: "claimReward",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [],
        outputs: [],
      },
    ];
    const contract = new ethers.Contract(
      STAKE_CONTRACT_ADDRESS,
      contractABI,
      signer
    );

    console.log("Sending claimReward tx...");
    const tx = await contract.claimReward({ gasLimit: 500000 });
    console.log("Claim tx sent:", tx.hash);
    await tx.wait();
    console.log("Claim tx confirmed");

    // Refresh on-chain state and rewards baseline
    await checkStakeStatus(await signer.getAddress());
  } catch (error: any) {
    console.error("Claim error:", error);
    alert("Claim failed: " + error.message);
  } finally {
    isClaiming.value = false;
  }
}

async function withdrawAll() {
  if (!stakeInfo.value.isActive) return;

  isWithdrawing.value = true;

  try {
    const injected =
      (window as any).ethereum?.providers?.find((p: any) => p?.isMetaMask) ||
      (window as any).ethereum;
    const provider = new ethers.BrowserProvider(injected);
    const signer = await provider.getSigner();

    const contractABI = [
      {
        name: "withdrawAll",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [],
        outputs: [],
      },
      {
        name: "withdrawAllClear",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [],
        outputs: [],
      },
    ];
    const contract = new ethers.Contract(
      STAKE_CONTRACT_ADDRESS,
      contractABI,
      signer
    );

    console.log("Sending withdrawAll tx...");
    // Prefer clear-path when available
    let tx;
    if (contract.withdrawAllClear) {
      console.log("Sending withdrawAllClear tx...");
      tx = await contract.withdrawAllClear({ gasLimit: 600000 });
    } else {
      console.log("Sending withdrawAll tx...");
      tx = await contract.withdrawAll({ gasLimit: 600000 });
    }
    console.log("Withdraw tx sent:", tx.hash);
    await tx.wait();
    console.log("Withdraw tx confirmed");

    // Refresh on-chain state (should become inactive)
    await checkStakeStatus(await signer.getAddress());
  } catch (error: any) {
    console.error("Withdrawal error:", error);
    alert("Withdrawal failed: " + error.message);
  } finally {
    isWithdrawing.value = false;
  }
}

// Load stake info from localStorage on mount
function loadStakeInfo() {
  const savedStakeInfo = localStorage.getItem("fhearn_stake_info");
  if (savedStakeInfo) {
    // Only hydrate if we don't already have an active on-chain state
    if (!stakeInfo.value.isActive) {
      stakeInfo.value = JSON.parse(savedStakeInfo);
    }
  }
}

// Update rewards every 2 minutes
function startRewardUpdates() {
  if (stakeInfo.value.isActive) {
    setInterval(() => {
      if (stakeInfo.value.isActive) {
        const stakeTime =
          new Date().getTime() - new Date(stakeInfo.value.stakeDate).getTime();
        const daysStaked = stakeTime / (1000 * 60 * 60 * 24);
        const annualReward =
          parseFloat(stakeInfo.value.amount) * (stakeInfo.value.apy / 100);
        const currentReward = (annualReward * daysStaked) / 365;

        stakeInfo.value.rewards = currentReward.toFixed(6);

        // Save to localStorage
        localStorage.setItem(
          "fhearn_stake_info",
          JSON.stringify(stakeInfo.value)
        );
      }
    }, 120000); // 2 minutes
  }
}

onMounted(async () => {
  // Fix MetaMask provider conflict (if multiple wallets exist)
  if ((window as any).ethereum?.providers) {
    const metamaskProvider = (window as any).ethereum.providers.find(
      (p: any) => p.isMetaMask
    );
    if (metamaskProvider) {
      (window as any).ethereum = metamaskProvider;
      console.log("✅ Using MetaMask provider");
    }
  }

  isMetaMaskInstalled.value = typeof window.ethereum !== "undefined";

  if (isMetaMaskInstalled.value) {
    await initializeFHEVM();
    await checkConnection();

    // Re-run flow on provider events
    try {
      (window as any).ethereum?.on?.(
        "accountsChanged",
        async (accs: string[]) => {
          // If wallet fully disconnected in provider
          if (!accs || accs.length === 0) {
            await disconnectWallet();
            return;
          }
          // If account switches while connected, force manual reconnect
          if (isConnected.value) {
            await disconnectWallet();
            console.log("🔌 Account changed. Please connect wallet again.");
            return;
          }
          // If not connected (e.g., after manual disconnect), do NOT auto-connect
        }
      );
      (window as any).ethereum?.on?.("chainChanged", async () => {
        // Only refresh flow if currently connected
        if (isConnected.value) {
          if (!fhevmStatus.value?.instance) await initializeFHEVM();
          if (account.value) await fetchWalletMetrics(account.value);
        }
      });
    } catch {}
  }

  // Load stake info and start reward updates
  loadStakeInfo();
});

// Initialize FHEVM
async function initializeFHEVM() {
  try {
    const sdk = await import(/* @vite-ignore */ SDK_URL);
    initSDK = sdk.initSDK;
    createInstance = sdk.createInstance;
    SepoliaConfig = sdk.SepoliaConfig;

    await initSDK();

    // Check if we're on Sepolia
    const provider = window.ethereum;
    const chainId = await provider.request({
      method: "eth_chainId",
    });

    fhevmStatus.value = {
      network: chainId === "0xaa36a7" ? "Sepolia Testnet" : "Unknown",
      chainId: chainId,
    };

    // If not on Sepolia, try to switch
    if (chainId !== "0xaa36a7") {
      console.log("⚠️ Not on Sepolia Testnet, attempting to switch...");
      const switched = await switchToSepolia();
      if (!switched) {
        console.error("❌ Failed to switch to Sepolia Testnet");
        return;
      }
      // Re-check chainId after switch
      const newChainId = await provider.request({ method: "eth_chainId" });
      fhevmStatus.value = {
        network: newChainId === "0xaa36a7" ? "Sepolia Testnet" : "Unknown",
        chainId: newChainId,
      };
    }

    if (fhevmStatus.value.network === "Sepolia Testnet") {
      console.log("✅ Connected to Sepolia Testnet");

      // Create FHEVM instance
      const fhevmConfig = { ...SepoliaConfig, network: provider };
      const fhevmInstance = await createInstance(fhevmConfig);
      console.log("FHEVM instance created:", fhevmInstance);

      // Update fhevmStatus with instance
      fhevmStatus.value = {
        ...fhevmStatus.value,
        instance: fhevmInstance,
        config: fhevmConfig,
      };

      // Self-test removed on request
      console.log("🔧 publicDecrypt self-test disabled");

      // Check if FHEVM is in real mode (not mock)
      console.log("FHEVM Config:", fhevmConfig);
      console.log("FHEVM Instance methods:", Object.keys(fhevmInstance));

      // Test FHEVM functionality
      try {
        const testKeypair = await fhevmInstance.generateKeypair();
        console.log(
          "✅ FHEVM Keypair generation successful - Real mode confirmed"
        );
        console.log("Keypair:", testKeypair);

        // Check available methods
        console.log("FHEVM Instance methods:", Object.keys(fhevmInstance));
        console.log(
          "FHEVM Instance prototype:",
          Object.getOwnPropertyNames(Object.getPrototypeOf(fhevmInstance))
        );
      } catch (error) {
        console.error("❌ FHEVM Keypair generation failed:", error);
      }
    } else {
      console.warn(
        "⚠️ Not on Sepolia! Current chainId:",
        chainId,
        "Expected: 0xaa36a7"
      );
    }
  } catch (error) {
    console.error("FHEVM initialization error:", error);
  }
}

// Check wallet connection
async function checkConnection() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        isConnected.value = true;
        account.value = accounts[0];

        // Fetch wallet metrics for already connected wallet
        await fetchWalletMetrics(accounts[0]);
      }
    } catch (error: any) {
      console.error("Error checking connection:", error);
    }
  }
}

// Connect wallet
async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask is not installed!");
    return;
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts.length > 0) {
      isConnected.value = true;
      account.value = accounts[0];

      // Ensure FHEVM ready then run full flow
      if (!fhevmStatus.value?.instance) {
        await initializeFHEVM();
      }
      await fetchWalletMetrics(accounts[0]);
    }
  } catch (error) {
    console.error("Error connecting wallet:", error);
  }
}
</script>

<style scoped>
.bg-zama {
  background: linear-gradient(
    135deg,
    #050209 0%,
    #1e0a33 25%,
    #2d1a44 50%,
    #1e0a33 75%,
    #050209 100%
  );
  background-attachment: fixed;
}

.bg-surface {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3),
    0 2px 4px -1px rgba(0, 0, 0, 0.2);
}

.text-foreground {
  color: #f8fafc;
}

.text-muted-foreground {
  color: #94a3b8;
}

.border-slate-700 {
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2);
}

.bg-slate-800\/50 {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2);
}

.bg-slate-700\/50 {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 1px 3px -1px rgba(0, 0, 0, 0.15);
}

.text-primary-400 {
  color: #60a5fa;
}

.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.from-primary-300 {
  --tw-gradient-from: #93c5fd;
}

.to-primary-200 {
  --tw-gradient-to: #bfdbfe;
}

.text-primary-foreground {
  color: #1e40af;
}

.hover\:from-primary-400:hover {
  --tw-gradient-from: #60a5fa;
}

.hover\:to-primary-300:hover {
  --tw-gradient-to: #93c5fd;
}
</style>
