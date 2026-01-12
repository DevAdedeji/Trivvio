<template>
  <div class="flex flex-col h-full w-full max-w-4xl mx-auto p-6 md:p-8 gap-8 relative z-10 font-sans items-center justify-center">

    <!-- Title -->
    <div class="text-center space-y-2 animate-fade-in-down">
      <h2 class="text-xs font-bold tracking-widest text-slate-400 uppercase">Game Over</h2>
      <h1 class="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        Final Standings
      </h1>
    </div>

    <!-- Podium -->
    <div class="flex items-end justify-center gap-4 md:gap-8 w-full min-h-[300px] mb-8 mt-16">

      <!-- 2nd Place -->
      <div v-if="top3[1]" class="flex flex-col items-center gap-4 animate-slide-up delay-100">
        <div class="flex flex-col items-center">
           <div class="size-20 rounded-full border-4 border-slate-300 overflow-hidden shadow-[0_0_20px_rgba(203,213,225,0.3)]">
             <img v-if="top3[1].avatar_url" :src="top3[1].avatar_url" class="w-full h-full object-cover" />
             <div v-else class="w-full h-full bg-slate-700 flex items-center justify-center text-2xl font-bold text-slate-300">
               {{ top3[1].display_name.charAt(0) }}
             </div>
           </div>
           <div class="font-bold text-slate-300 mt-2 text-lg">{{ top3[1].display_name }}</div>
           <div class="font-black text-slate-500">{{ top3[1].total_score }} pts</div>
        </div>
        <div class="w-24 md:w-32 h-32 bg-gradient-to-t from-slate-600 to-slate-500 rounded-t-lg flex items-start justify-center pt-4 relative">
          <span class="text-4xl font-black text-slate-300/50">2</span>
        </div>
      </div>

      <!-- 1st Place -->
      <div v-if="top3[0]" class="flex flex-col items-center gap-4 animate-slide-up z-10">
        <div class="flex flex-col items-center relative">
          <Icon name="noto:crown" class="text-5xl absolute -top-12 animate-bounce" />
           <div class="size-24 rounded-full border-4 border-yellow-400 overflow-hidden shadow-[0_0_30px_rgba(250,204,21,0.5)]">
             <img v-if="top3[0].avatar_url" :src="top3[0].avatar_url" class="w-full h-full object-cover" />
             <div v-else class="w-full h-full bg-yellow-600 flex items-center justify-center text-3xl font-bold text-yellow-100">
               {{ top3[0].display_name.charAt(0) }}
             </div>
           </div>
           <div class="font-bold text-yellow-400 mt-2 text-xl">{{ top3[0].display_name }}</div>
           <div class="font-black text-yellow-600">{{ top3[0].total_score }} pts</div>
        </div>
        <div class="w-28 md:w-40 h-48 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t-lg flex items-start justify-center pt-4 shadow-[0_0_50px_rgba(250,204,21,0.2)]">
          <span class="text-6xl font-black text-yellow-100/50">1</span>
        </div>
      </div>

      <!-- 3rd Place -->
      <div v-if="top3[2]" class="flex flex-col items-center gap-4 animate-slide-up delay-200">
        <div class="flex flex-col items-center">
           <div class="size-20 rounded-full border-4 border-orange-700 overflow-hidden shadow-[0_0_20px_rgba(194,65,12,0.3)]">
             <img v-if="top3[2].avatar_url" :src="top3[2].avatar_url" class="w-full h-full object-cover" />
             <div v-else class="w-full h-full bg-orange-800 flex items-center justify-center text-2xl font-bold text-orange-200">
               {{ top3[2].display_name.charAt(0) }}
             </div>
           </div>
           <div class="font-bold text-orange-400 mt-2 text-lg">{{ top3[2].display_name }}</div>
           <div class="font-black text-orange-600">{{ top3[2].total_score }} pts</div>
        </div>
        <div class="w-24 md:w-32 h-24 bg-gradient-to-t from-orange-800 to-orange-600 rounded-t-lg flex items-start justify-center pt-4">
          <span class="text-4xl font-black text-orange-200/50">3</span>
        </div>
      </div>

    </div>

    <!-- Rest of the players -->
    <div v-if="restPlayers.length > 0" class="w-full max-w-xl flex flex-col gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
      <div v-for="(player, idx) in restPlayers" :key="player.id"
        class="bg-[#1b1f27]/80 backdrop-blur rounded-lg p-3 flex items-center justify-between border border-slate-800/50 hover:border-slate-700 transition-colors animate-fade-in"
        :style="{ animationDelay: `${(idx + 3) * 100}ms` }"
      >
        <div class="flex items-center gap-3">
          <span class="font-bold text-slate-500 w-6 text-center">#{{ idx + 4 }}</span>
          <span class="font-bold text-slate-300">{{ player.display_name }}</span>
        </div>
        <span class="font-mono font-bold text-slate-400">{{ player.total_score }} pts</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-8 flex gap-4">
      <NuxtLink to="/" class="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-bold transition-all">
        Back to Home
      </NuxtLink>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { Database } from '~/types/supabase'
import confetti from 'canvas-confetti'

type Player = Database['public']['Tables']['players']['Row']

const props = defineProps<{
  players: Player[]
}>()

const sortedPlayers = computed(() => {
  return [...props.players].sort((a, b) => b.total_score - a.total_score)
})

const top3 = computed(() => sortedPlayers.value.slice(0, 3))
const restPlayers = computed(() => sortedPlayers.value.slice(3))

onMounted(() => {
  // Fire confetti
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  }

  const interval: any = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
})

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes fade-in-down {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
}

.animate-slide-up {
  animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0; /* Star hidden */
}

.animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
    opacity: 0;
}

.animate-fade-in-down {
    animation: fade-in-down 0.8s ease-out forwards;
}

.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
</style>
