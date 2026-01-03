<template>
  <div />
</template>

<script setup lang="ts">
import type { GameWithQuestions } from '~/composables/game'

defineProps<{
  game: GameWithQuestions
}>()
</script>
