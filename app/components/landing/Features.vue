<template>
  <section id="features" class="w-full px-4 py-16 bg-background-dark">
    <div class="max-w-7xl mx-auto flex flex-col gap-10">
      <div class="flex items-center justify-between">
        <h2 class="text-white text-3xl font-bold tracking-tight">Why Trivvio?</h2>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Feature 1 -->
        <div
          class="flex flex-col gap-4 rounded-xl border border-border-dark bg-surface-dark p-6 hover:bg-surface-dark/80 transition-colors"
        >
          <div class="text-blue-400 bg-blue-400/10 w-fit p-3 rounded-lg">
            <Icon name="material-symbols-light:sync" />
          </div>
          <div>
            <h3 class="text-white text-lg font-bold mb-2">Real-time Sync</h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              Seamless low-latency gameplay ensures everyone sees the question at the exact same
              time, no matter their connection.
            </p>
          </div>
        </div>
        <!-- Feature 2 -->
        <div
          class="flex flex-col gap-4 rounded-xl border border-border-dark bg-surface-dark p-6 hover:bg-surface-dark/80 transition-colors"
        >
          <div class="text-yellow-400 bg-yellow-400/10 w-fit p-3 rounded-lg">
            <Icon name="material-symbols-light:speed" />
          </div>
          <div>
            <h3 class="text-white text-lg font-bold mb-2">Speed-based Scoring</h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              The faster you answer, the more points you get. It's not just about being right, it's
              about being quick.
            </p>
          </div>
        </div>
        <!-- Feature 3 -->
        <div
          class="flex flex-col gap-4 rounded-xl border border-border-dark bg-surface-dark p-6 hover:bg-surface-dark/80 transition-colors"
        >
          <div class="text-green-400 bg-green-400/10 w-fit p-3 rounded-lg">
            <Icon name="material-symbols-light:login" />
          </div>
          <div>
            <h3 class="text-white text-lg font-bold mb-2">Instant Access</h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              No registration required for players. Just enter the code on any device with a browser
              and start playing.
            </p>
          </div>
        </div>
        <!-- Feature 4 -->
        <div
          class="flex flex-col gap-4 rounded-xl border border-border-dark bg-surface-dark p-6 hover:bg-surface-dark/80 transition-colors"
        >
          <div class="text-purple-400 bg-purple-400/10 w-fit p-3 rounded-lg">
            <Icon name="material-symbols-light:brush" />
          </div>
          <div>
            <h3 class="text-white text-lg font-bold mb-2">Custom Themes</h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              Customize the look of your lobby and game screen to match your party, company brand,
              or classroom.
            </p>
          </div>
        </div>
        <!-- Feature 5 -->
        <div
          class="flex flex-col gap-4 rounded-xl border border-border-dark bg-surface-dark p-6 hover:bg-surface-dark/80 transition-colors"
        >
          <div class="text-pink-400 bg-pink-400/10 w-fit p-3 rounded-lg">
            <Icon name="material-symbols-light:bar-chart" />
          </div>
          <div>
            <h3 class="text-white text-lg font-bold mb-2">Analytics</h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              Get detailed reports after the game. See who answered what and identify the toughest
              questions.
            </p>
          </div>
        </div>
        <!-- Feature 6 -->
        <div
          class="flex flex-col gap-4 rounded-xl border border-border-dark bg-surface-dark p-6 hover:bg-surface-dark/80 transition-colors"
        >
          <div class="text-orange-400 bg-orange-400/10 w-fit p-3 rounded-lg">
            <Icon name="material-symbols-light:devices" />
          </div>
          <div>
            <h3 class="text-white text-lg font-bold mb-2">Any Device</h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              Works on smartphones, tablets, laptops, and smartboards. If it has a browser, it can
              play Trivvio.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
