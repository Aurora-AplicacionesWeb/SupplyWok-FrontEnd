<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import {useI18n} from "vue-i18n";

/**
 * @component SidebarMenu
 * @summary Main navigation sidebar for the application, displaying the branding and main modules.
 * @author Aurora Development Team
 */

/**
 * @typedef {Object} MenuItem
 * @property {string} id - Unique identifier for the menu item.
 * @property {string} i18nKey - Translation key for the display text.
 * @property {string} iconOff - Path to the default icon image.
 * @property {string} iconOn - Path to the active icon image.
 */

const route = useRoute();

/** @type {import('vue').Ref<string>} Reactive state for the restaurant name. */
const restaurantName = ref('GRAN DRAGÓN CHIFA');

/** @type {import('vue').Ref<string>} Reactive state for the current subscription plan. */
const currentPlan = ref('Premium');

const {t}=useI18n();

/** @type {MenuItem[]} Array containing the main navigation items. */
const menuItems = [
  { id: 'dashboard', path: '/dashboard', i18nKey: 'Dashboard', iconOff: '/images/icons/dashboard-icon.svg', iconOn: '/images/icons/dashboard-on-icon.svg' },
  { id: 'inventory', path: '/inventory', i18nKey: 'Inventory', iconOff: '/images/icons/inventory-icon.svg', iconOn: '/images/icons/inventory-on-icon.svg' },
  { id: 'orders', path: '/orders', i18nKey: 'Orders', iconOff: '/images/icons/orders-icon.svg', iconOn: '/images/icons/orders-on-icon.svg' },
  { id: 'kitchen-tickets', path: '/kitchen-tickets', i18nKey: 'Kitchen Tickets', iconOff: '/images/icons/kitchen-ticket-icon.svg', iconOn: '/images/icons/kitchen-tickets-on-icon.svg' },
  { id: 'suppliers', path: '/suppliers', i18nKey: 'Suppliers', iconOff: '/images/icons/suppliers-icon.svg', iconOn: '/images/icons/suppliers-on-icon.svg' },
  { id: 'tables-and-occupancy', path: '/tables-and-occupancy', i18nKey: 'Tables And Occupancy', iconOff: '/images/icons/tables-and-occupancy-icon.svg', iconOn: '/images/icons/tables-and-occupancy-on-icon.svg' },
  { id: 'alerts', path: '/alerts', i18nKey: 'Alerts', iconOff: '/images/icons/alerts-icon.svg', iconOn: '/images/icons/alerts-on-icon.svg' },
  { id: 'reports', path: '/reports', i18nKey: 'Reports', iconOff: '/images/icons/reports-icon.svg', iconOn: '/images/icons/reports-on-icon.svg' },
  { id: 'configuration', path: '/configuration', i18nKey: 'Configuration', iconOff: '/images/icons/configuration-icon.svg', iconOn: '/images/icons/configuration-on-icon.svg' },
  { id: 'subscription', path: '/subscription', i18nKey: 'Subscription', iconOff: '/images/icons/subscripcion-icon.svg', iconOn: '/images/icons/subscription-on-icon.svg' }
];

const activePath = computed(() => route.path);
</script>

<template>
  <aside class="sidebar">
    <!-- Branding Section -->
    <div class="sidebar__brand">
      <img src="/images/supplywok-logo.png" alt="SupplyWok Logo" class="sidebar__logo" />
      <div class="sidebar__brand-text">
        <h2 class="sidebar__title">SupplyWok</h2>
        <span class="sidebar__subtitle">{{ restaurantName }}</span>
      </div>
    </div>

    <!-- Status Tags Section -->
    <div class="sidebar__status">
      <span class="sidebar__tag sidebar__tag--role">Restaurant</span>
      <span class="sidebar__tag sidebar__tag--plan">Current plan: {{ currentPlan }}</span>
    </div>

    <!-- Navigation Menu -->
    <nav class="sidebar__nav" aria-label="Main Navigation">
      <ul class="sidebar__menu">
        <li 
          v-for="item in menuItems" 
          :key="item.id"
          class="sidebar__item"
          :class="{ 'sidebar__item--active': activePath === item.path }"
        >
          <RouterLink class="sidebar__button" :to="item.path">
            <img 
              :src="activePath === item.path ? item.iconOn : item.iconOff" 
              :alt="`${$t(item.i18nKey)} icon`" 
              class="sidebar__icon"
            />
            <span class="sidebar__label">{{ $t(item.i18nKey) }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
/* ─── Variables and Base ─── */
.sidebar {
  width: 280px;
  min-height: 100vh;
  background-color: #2D241E; /* Dark brown background from mockup */
  color: #B5B0A1; /* Muted text color for inactive elements */
  font-family: 'Montserrat', system-ui, sans-serif;
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  box-sizing: border-box;
}

/* ─── Brand Section ─── */
.sidebar__brand {
  display: flex;
  align-items: center;
  padding: 0 24px;
  margin-bottom: 16px;
  gap: 12px;
}

.sidebar__logo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.sidebar__brand-text {
  display: flex;
  flex-direction: column;
}

.sidebar__title {
  margin: 0;
  font-family: 'Poppins', system-ui, sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #FFFFFF;
}

.sidebar__subtitle {
  font-size: 11px;
  font-weight: 600;
  color: #8C857B;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* ─── Status Tags ─── */
.sidebar__status {
  display: flex;
  align-items: center;
  padding: 0 24px;
  margin-bottom: 32px;
  gap: 8px;
}

.sidebar__tag {
  font-size: 12px;
  border-radius: 6px;
}

.sidebar__tag--role {
  background-color: #C21204;
  color: #FFFFFF;
  padding: 4px 10px;
  font-weight: 600;
  font-family: 'Poppins', system-ui, sans-serif;
}

.sidebar__tag--plan {
  color: #8C857B;
  font-weight: 500;
}

/* ─── Navigation Menu ─── */
.sidebar__nav {
  flex-grow: 1;
}

.sidebar__menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px; /* Spacing between items */
}

.sidebar__item {
  position: relative;
}

.sidebar__button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 24px 12px 32px; /* Extra padding on left for the active bar */
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  text-decoration: none;
  transition: all 0.2s ease;
}

/* Inactive Icon and Text */
.sidebar__icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.sidebar__label {
  font-size: 15px;
  font-weight: 500; /* Medium for inactive */
  color: #A39B8F;
  transition: all 0.2s ease;
}

/* Hover Effects */
.sidebar__button:hover .sidebar__label {
  color: #E2DFD8;
}

.sidebar__button:hover .sidebar__icon {
  opacity: 1;
}

/* ─── Active State ─── */
.sidebar__item--active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 32px;
  width: 4px;
  background-color: #C21204; /* Red bar indicator */
  border-radius: 0 4px 4px 0;
}

.sidebar__item--active .sidebar__label {
  font-weight: 700; /* Bold */
  color: #FFFFFF; /* Lighter color */
}

.sidebar__item--active .sidebar__icon {
  opacity: 1;
}
</style>
