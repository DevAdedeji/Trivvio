<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-border-dark/50 bg-background-dark/80 backdrop-blur-md"
  >
    <div class="px-4 md:px-8 lg:px-10 py-3 flex items-center justify-between">
      <div class="flex items-center gap-2 text-white">
        <div class="size-8 flex items-center justify-center text-primary">
          <Icon name="material-symbols-light:bolt" />
        </div>
        <h2 class="text-white text-xl font-bold tracking-tight">Trivvio</h2>
      </div>
      <nav class="hidden md:flex items-center gap-8">
        <a class="text-gray-300 hover:text-white text-sm font-medium transition-colors" href="#howitworks"
          >How it Works</a
        >
        <a class="text-gray-300 hover:text-white text-sm font-medium transition-colors" href="#features"
          >Features</a
        >
      </nav>
      <div class="flex items-center gap-4">
        <button
          class="flex items-center justify-center rounded-xl h-10 px-5 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold shadow-lg shadow-primary/25"
        >
          <span class="truncate">Sign Up</span>
        </button>
      </div>
    </div>
  </header>
</template>
