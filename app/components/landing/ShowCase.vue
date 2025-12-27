<template>
  <section class="w-full px-4 py-20 max-w-7xl mx-auto">
    <div
      class="bg-gradient-to-br from-surface-dark to-background-dark border border-border-dark rounded-3xl p-6 md:p-12 overflow-hidden relative"
    >
      <!-- Background pattern -->
      <div
        class="absolute inset-0 opacity-10"
        style="
          background-image: radial-gradient(#3b4354 1px, transparent 1px);
          background-size: 24px 24px;
        "
      />
      <div class="flex flex-col md:flex-row gap-12 items-center relative z-10">
        <div class="flex-1 flex flex-col gap-6">
          <h2 class="text-3xl md:text-5xl font-black text-white leading-tight">
            Experience the thrill of <span class="text-primary">live competition.</span>
          </h2>
          <ul class="flex flex-col gap-4 mt-2">
            <li class="flex items-center gap-3 text-gray-300">
              <Icon name="material-symbols-light:check-circle text-green-500" class="text-base" />
              <span>Instant feedback on answers</span>
            </li>
            <li class="flex items-center gap-3 text-gray-300">
              <Icon name="material-symbols-light:check-circle text-green-500" class="text-base" />
              <span>Animated leaderboards between rounds</span>
            </li>
          </ul>
          <div class="mt-4">
            <a
              class="text-primary font-bold hover:text-white transition-colors flex items-center gap-2"
              href="#features"
            >
              Explore all features
              <Icon name="material-symbols-light:arrow-forward" class="text-xl" />
            </a>
          </div>
        </div>
        <div class="flex-1 w-full relative perspective-1000">
          <div
            class="bg-gray-900 rounded-xl border-4 border-gray-800 shadow-2xl overflow-hidden aspect-video transform rotate-y-12 rotate-x-6 hover:rotate-0 transition-all duration-700 ease-out origin-center"
          >
            <img
              alt="Laptop screen showing leaderboard with colorful bars"
              class="w-full h-full object-cover"
              data-alt="Laptop screen showing leaderboard with colorful bars"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuByxGm1qqN-LW49ylj-gkOyEYEQgKjSZbJhXSvtzuvRvoAL2nw8-TUeYrDcjrKI1XJdDELpXG4yCKOIWNKldWzLlB3mMzaXAzGKxIsnr7tomxea3X-qpL5qtJBSwF_fv47XaC9fBB2zHCo-oCkalss4J2xWirPxlC8BsENDaCI6U07JK5UJsYHjm9PyYY7E8FxGohpYcVQGF5lYyCrtN36B9E7yqdsF50yR4-OjhH9dBYx_FlObumfPrvYaGpRgOX7uH68-Cq2Il4Ic"
            >
            <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div class="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
                <div class="flex items-center gap-3 text-white font-bold">
                  <Icon name="material-symbols-light:emoji-events" class="text-xl" />
                  Leaderboard Top 3
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
