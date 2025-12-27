<template>
  <div class="flex-grow flex flex-col items-center w-full">
    <section class="w-full px-4 py-16 md:py-20 max-w-7xl mx-auto">
      <div class="@container">
        <div class="flex flex-col gap-10 md:gap-10 lg:flex-row items-center">
          <!-- Hero Text -->
          <div
            class="flex flex-col gap-6 flex-1 text-center lg:text-left items-center lg:items-start"
          >
            <div
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-dark border border-border-dark w-fit"
            >
              <span class="flex h-2 w-2 rounded-full bg-green-500" />
              <span class="text-xs font-medium text-gray-300">Live multiplayer ready</span>
            </div>
            <h1
              class="text-white text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight"
            >
              Real-Time Trivia.
            </h1>
            <h1
              class="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500"
            >
              Epic Competition.
            </h1>
            <h2 class="text-gray-400 text-lg md:text-xl font-normal leading-relaxed max-w-xl">
              Create games, challenge friends, and compete live on the leaderboard. The ultimate
              quiz experience for everyone.
            </h2>
            <div class="flex flex-wrap gap-4 justify-center lg:justify-start w-full">
              <button
                class="flex min-w-[140px] items-center justify-center rounded-xl h-12 px-6 bg-primary hover:bg-blue-600 transition-all text-white text-base font-bold shadow-lg shadow-primary/30 hover:scale-105 active:scale-95"
              >
                Create Game
              </button>
              <button
                class="flex min-w-[140px] items-center justify-center rounded-xl h-12 px-6 bg-surface-dark hover:bg-[#252b36] border border-border-dark transition-all text-white text-base font-bold hover:scale-105 active:scale-95"
              >
                Join Game
              </button>
            </div>
            <div class="flex items-center gap-4 text-sm text-gray-500 pt-2">
              <div class="flex -space-x-2">
                <div
                  class="w-8 h-8 rounded-full border-2 border-background-dark bg-gray-700 bg-cover"
                  data-alt="User avatar 1"
                  style="
                    background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCC20Zpsgh0l-zYs2iE8LSgG-TBT2YAseO7-jJM7jpk3F13-QcPHG_6dgya-XUKWA5GAv19Vojks8tkScATSlfYgSsmMZvgakQZ0C-sclap3bJTYvpdjmNdDeJBnBUj3zz-jxBo6cayYXn85wldyrOAVky_0SKq_hZgfxdbKr6wvZioVM9ZIbrXw_lhEi6cDHBTnZu4ILDbiEQUlwpK3kjY6EwkABuaFcao4hJnt4sJmbQRfecIqB-v_GGX67JjP8kXjoIHqlCj7mRa');
                  "
                />
                <div
                  class="w-8 h-8 rounded-full border-2 border-background-dark bg-gray-700 bg-cover"
                  data-alt="User avatar 2"
                  style="
                    background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCT47g0VKpL9hwK6fKHiidNd0l1QOm9O7u91LRWA_wB3e3EhEeNGTLmztVqXZA5CVcX-ZMtI2Sc2nDUJZ0LIf1s5gzfc0JKS0FjCQDfAxsn-7kCoUUFpxSSVO7VN75m7uQ1SSW27ycnIAPgJX4KDAib_WiffyAcjs_LSZcdUNU0lv8mO3faovWg9TzTO7gkx0icswnH9Xu-L7YNq_ONDKFhkrpwGekhb5ndSgGMVOCGV3U8yumS1oqQrpbd464Y6sVCopDRvIzuL-sP');
                  "
                />
                <div
                  class="w-8 h-8 rounded-full border-2 border-background-dark bg-gray-700 bg-cover"
                  data-alt="User avatar 3"
                  style="
                    background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBTvLOBYfbNKaMWzBIxHY3hrClD9NpWzsD1x07HB_AMiJWW6Dnrmdp8jdMbjofv9Pk6Z7mrs8qaVPuI2IUJlaXp-9toVoI-_Zosa-IzJq5kl4BEbL2wnZgrlgJntFtgNPqGc_T8VqXIAdnkCYOpQobl1e_d8i7t_Q0_s4FWo-UGGAGsxT5dsqRed5IlhznsJHl-Ix9k2dibpsKhpczyrvfBWbJrVFgfmQlwEpvp3JNPrkXJm4G_H6y-5qTR2Mgbb6LsK6Njv0CgePIx');
                  "
                />
              </div>
              <p>Join 10,000+ players today</p>
            </div>
          </div>
          <!-- Hero Visual/Image -->
          <div class="flex-1 w-full max-w-[600px] lg:max-w-none relative">
            <!-- Decorative blur behind image -->
            <div
              class="absolute inset-0 bg-primary/20 blur-3xl rounded-full transform rotate-12 scale-90"
            />
            <div
              class="relative bg-surface-dark border border-border-dark rounded-2xl p-2 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500"
            >
              <div
                class="w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-800 relative group"
              >
                <img
                  alt="Abstract colorful geometric shapes representing a vibrant game interface"
                  class="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                  data-alt="Abstract colorful geometric shapes representing a vibrant game interface"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAt6t6tuVraN-E9X9OqOOFlh8QtqQJXm6IwUEQzFmWL_6zeEHb8YC0WGOGAQ8vFxGHgJ7N4M8UIg68Ays8lBfE8hi6gnIGzbeMMN7pTOQDBjwOzoWYmlInW_Xk-nDs1wFlcoG8rev6lxRwR7jV_FUYmTfg7DMGO3gaD5_9TrCzrC6JhTUdVmZ6ryzNViUgRwcD25hsSXpTxe4FBGriVFTiW89MKUXHYmyuY0Qk38PPgYzshwwle2jGm0E-YwnuZJvAEnDV32gInmMEK"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-background-dark/90 to-transparent flex flex-col justify-end p-6"
                >
                  <div class="flex items-center gap-3 mb-4">
                    <div class="bg-red-500 w-full h-3 rounded-full opacity-70" />
                    <div class="text-white font-bold font-mono">12s</div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div
                      class="h-12 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg"
                    >
                      Paris
                    </div>
                    <div
                      class="h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-white"
                    >
                      London
                    </div>
                    <div
                      class="h-12 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg"
                    >
                      Tokyo
                    </div>
                    <div
                      class="h-12 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg"
                    >
                      New York
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
