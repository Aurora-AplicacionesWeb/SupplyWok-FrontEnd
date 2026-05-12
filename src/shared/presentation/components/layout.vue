<script setup>
import SidebarMenu from './sidebar-menu.vue';
import LanguageSwitcher from './language-switcher.vue';
</script>

<template>
  <div class="layout">
    <SidebarMenu />
    <div class="layout__main">
      <header class="layout__header">
        <strong class="layout__brand">SupplyWok</strong>
        <LanguageSwitcher />
      </header>
      <main class="layout__content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style>
.layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.layout__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.layout__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  background-color: #fff;
  border-bottom: 1px solid #efe6da;
}

.layout__brand {
  color: #2d241e;
  font-family: 'Poppins', system-ui, sans-serif;
  font-size: 18px;
  font-weight: 700;
}

.layout__content {
  flex: 1;
  background-color: #EDEBE5;
  padding: 24px;
  overflow-y: auto;
}
</style>
