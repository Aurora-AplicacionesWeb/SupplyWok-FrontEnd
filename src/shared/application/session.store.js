import { defineStore } from 'pinia';
import { ref } from 'vue';

const useSessionStore = defineStore('session', () => {
  const userRole = ref('supplier');

  function setUserRole(role) {
    userRole.value = role;
  }

  function toggleUserRole() {
    userRole.value = userRole.value === 'supplier' ? 'restaurant' : 'supplier';
  }

  return {
    userRole,
    setUserRole,
    toggleUserRole
  };
});

export default useSessionStore;
