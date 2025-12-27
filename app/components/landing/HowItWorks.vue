<template>
  <section id="howitworks" class="w-full px-4 py-16 bg-surface-dark/30 border-y border-border-dark/50">
    <div class="max-w-7xl mx-auto flex flex-col gap-12">
      <div class="flex flex-col gap-4 text-center md:text-left max-w-[720px]">
        <h2 class="text-white text-3xl md:text-4xl font-black tracking-tight">How It Works</h2>
        <p class="text-gray-400 text-lg">
          Get started with your first trivia night in three simple steps.
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Step 1 -->
        <div
          class="group flex flex-col gap-6 rounded-2xl border border-border-dark bg-background-dark p-8 hover:border-primary/50 transition-colors relative overflow-hidden"
        >
          <div
            class="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl transform translate-x-10 -translate-y-10 group-hover:bg-primary/10 transition-colors"
          />
          <div
            class="size-14 rounded-xl bg-surface-dark border border-border-dark flex items-center justify-center text-primary shadow-inner"
          >
            <Icon name="material-symbols-light:laptop-chromebook" class="text-3xl" />
          </div>
          <div class="flex flex-col gap-2 relative z-10">
            <h3 class="text-white text-xl font-bold">1. Host Creates Game</h3>
            <p class="text-gray-400">
              Select a category or write your own questions. The host gets a unique PIN code to
              display on screen.
            </p>
          </div>
        </div>
        <!-- Step 2 -->
        <div
          class="group flex flex-col gap-6 rounded-2xl border border-border-dark bg-background-dark p-8 hover:border-purple-500/50 transition-colors relative overflow-hidden"
        >
          <div
            class="absolute top-0 right-0 p-32 bg-purple-500/5 rounded-full blur-3xl transform translate-x-10 -translate-y-10 group-hover:bg-purple-500/10 transition-colors"
          />
          <div
            class="size-14 rounded-xl bg-surface-dark border border-border-dark flex items-center justify-center text-purple-500 shadow-inner"
          >
            <Icon name="material-symbols-light:groups" class="text-3xl" />
          </div>
          <div class="flex flex-col gap-2 relative z-10">
            <h3 class="text-white text-xl font-bold">2. Players Join Lobby</h3>
            <p class="text-gray-400">
              Players enter the PIN on their phones to join. No app download required, just pure
              browser-based fun.
            </p>
          </div>
        </div>
        <!-- Step 3 -->
        <div
          class="group flex flex-col gap-6 rounded-2xl border border-border-dark bg-background-dark p-8 hover:border-green-500/50 transition-colors relative overflow-hidden"
        >
          <div
            class="absolute top-0 right-0 p-32 bg-green-500/5 rounded-full blur-3xl transform translate-x-10 -translate-y-10 group-hover:bg-green-500/10 transition-colors"
          />
          <div
            class="size-14 rounded-xl bg-surface-dark border border-border-dark flex items-center justify-center text-green-500 shadow-inner"
          >
            <Icon name="material-symbols-light:bolt" class="text-3xl" />
          </div>
          <div class="flex flex-col gap-2 relative z-10">
            <h3 class="text-white text-xl font-bold">3. Compete Live</h3>
            <p class="text-gray-400">
              Questions appear on the big screen. Answer fast on your device to score higher points
              and win.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
