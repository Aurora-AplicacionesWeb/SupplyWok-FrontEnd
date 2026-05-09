<script setup>
import SidebarMenu from './sidebar-menu.vue';
</script>

<template>
  <div class="layout">
    <SidebarMenu />
    <main class="layout__content">
      <!-- Future main content goes here -->
    </main>
  </div>
</template>

<style>
/* Base styles are located in style.css */
.layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.layout__content {
  flex: 1;
  background-color: #EDEBE5; /* Matching var(--bg-color) */
}
</style>
