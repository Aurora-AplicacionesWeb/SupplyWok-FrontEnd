<script setup>
import LoginForm from '../components/login-form.vue';
import LanguageSelector from '../components/language-selector.vue';
</script>

<template>
  <div class="auth-view">
    <LanguageSelector />
    <main class="auth-container">
      <LoginForm />
    </main>
  </div>
</template>

<style scoped>
.auth-view {
  min-height: 100vh;
  width: 100%;
  background-color: #f4f0e6;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2rem;
}
</style>
