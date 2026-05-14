import { defineStore } from 'pinia';
import { ref } from 'vue';
import { normalizeRole } from './role-routing.js';

const USER_ROLE_STORAGE_KEY = 'supplywok:user-role';
const USER_PLAN_STORAGE_KEY = 'supplywok:user-plan';

function readStoredUserRole() {
  return normalizeRole(window.localStorage.getItem(USER_ROLE_STORAGE_KEY));
}

function readStoredUserPlan() {
  return window.localStorage.getItem(USER_PLAN_STORAGE_KEY) || 'Premium';
}

const useSessionStore = defineStore('session', () => {
  const userRole = ref(readStoredUserRole());
  const subscriptionPlan = ref(readStoredUserPlan());

  function setUserRole(role) {
    const normalizedRole = normalizeRole(role);
    userRole.value = normalizedRole;

    if (normalizedRole) {
      window.localStorage.setItem(USER_ROLE_STORAGE_KEY, normalizedRole);
    } else {
      window.localStorage.removeItem(USER_ROLE_STORAGE_KEY);
    }
  }

  function setSubscriptionPlan(plan) {
    subscriptionPlan.value = plan;
    window.localStorage.setItem(USER_PLAN_STORAGE_KEY, plan);
  }

  function toggleUserRole() {
    setUserRole(userRole.value === 'supplier' ? 'restaurant' : 'supplier');
  }

  function clearUserRole() {
    setUserRole(null);
  }

  return {
    userRole,
    subscriptionPlan,
    setUserRole,
    setSubscriptionPlan,
    toggleUserRole,
    clearUserRole
  };
});

export default useSessionStore;
