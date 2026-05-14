import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { IamApi } from '../infrastructure/iam.api.js';

/**
 * Pinia store for managing Identity and Access Management state.
 */
export const useIamStore = defineStore('iam', () => {
  const api = new IamApi();

  // --- State ---
  const users = ref([]);
  const currentUser = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // --- Computed (Getters) ---
  const isAuthenticated = computed(() => currentUser.value !== null);
  const currentUserRole = computed(() => currentUser.value?.role || null);

  // --- Actions ---

  /**
   * Loads all users from the API.
   */
  const loadUsers = async () => {
    loading.value = true;
    error.value = null;
    try {
      users.value = await api.getUsers();
    } catch (err) {
      error.value = 'Failed to load users';
    } finally {
      loading.value = false;
    }
  };

  /**
   * Simulates a login process by fetching all users and matching credentials locally.
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<boolean>} True if login is successful.
   */
  const login = async (email, password) => {
    loading.value = true;
    error.value = null;
    try {
      // Since there is no specific login endpoint, we fetch all and find the match
      const allUsers = await api.getUsers();
      const user = allUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        currentUser.value = user;
        return true;
      } else {
        error.value = 'Invalid email or password';
        return false;
      }
    } catch (err) {
      error.value = 'Login process failed';
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Registers a new user.
   * @param {User} userData 
   */
  const registerUser = async (userData) => {
    loading.value = true;
    error.value = null;
    try {
      const newUser = await api.createUser(userData);
      if (newUser) {
        users.value.push(newUser);
        return true;
      }
      return false;
    } catch (err) {
      error.value = 'Registration failed';
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Clears the current user session.
   */
  const logout = () => {
    currentUser.value = null;
  };

  return {
    users,
    currentUser,
    loading,
    error,
    isAuthenticated,
    currentUserRole,
    loadUsers,
    login,
    registerUser,
    logout
  };
});
