<template>
  <main class="flex-grow flex items-center justify-center p-6 md:p-12 relative">
    <div
      class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none -z-10"
    />
    <div
      class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none -z-10"
    />

    <div
      class="glass-panel w-full max-w-md rounded-2xl p-8 flex flex-col gap-8 shadow-2xl relative overflow-hidden"
    >
      <div
        class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-70"
      />

      <div class="text-center space-y-2">
        <div
          class="inline-flex items-center justify-center size-16 rounded-2xl bg-[#282e39] text-primary mb-4 shadow-lg"
        >
          <Icon name="material-symbols-light:person-add" class="text-3xl" />
        </div>
        <h1 class="text-3xl font-black tracking-tight text-white">Join Game</h1>
        <p class="text-slate-400">Enter a nickname to join the lobby.</p>
      </div>

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
        <div class="space-y-2">
          <label class="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1"
            >Nickname</label
          >
          <div class="relative group">
            <div
              class="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur opacity-0 group-focus-within:opacity-50 transition duration-500"
            />
            <div class="relative">
              <input
                v-model="nickname"
                type="text"
                placeholder="e.g. TriviaMaster"
                class="w-full bg-[#1b1f27] border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-transparent transition-all"
                maxlength="15"
                required
                autofocus
              />
              <Icon
                name="material-symbols-light:badge"
                class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          :disabled="!nickname.trim() || loading"
          class="w-full bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg py-4 px-6 rounded-xl shadow-lg shadow-primary/30 transform transition hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2"
        >
          <span v-if="loading">Joining...</span>
          <span v-else>Join Game</span>
          <Icon v-if="!loading" name="material-symbols-light:arrow-forward" />
        </button>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
const nickname = ref('')
const loading = ref(false)

const emit = defineEmits<{
  (e: 'join', nickname: string): void
}>()

const handleSubmit = () => {
  if (!nickname.value.trim()) return
  loading.value = true
  emit('join', nickname.value.trim())
}
</script>
