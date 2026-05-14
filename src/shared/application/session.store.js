import { defineStore } from 'pinia';
import { ref } from 'vue';
import { normalizeRole } from './role-routing.js';

const USER_ROLE_STORAGE_KEY = 'supplywok:user-role';

function readStoredUserRole() {
  return normalizeRole(window.localStorage.getItem(USER_ROLE_STORAGE_KEY));
}

const useSessionStore = defineStore('session', () => {
  const userRole = ref(readStoredUserRole());

  function setUserRole(role) {
    const normalizedRole = normalizeRole(role);
    userRole.value = normalizedRole;

    if (normalizedRole) {
      window.localStorage.setItem(USER_ROLE_STORAGE_KEY, normalizedRole);
    } else {
      window.localStorage.removeItem(USER_ROLE_STORAGE_KEY);
    }
  }

  function toggleUserRole() {
    setUserRole(userRole.value === 'supplier' ? 'restaurant' : 'supplier');
  }

  function clearUserRole() {
    setUserRole(null);
  }

  return {
    userRole,
    setUserRole,
    toggleUserRole,
    clearUserRole
  };
});

export default useSessionStore;
