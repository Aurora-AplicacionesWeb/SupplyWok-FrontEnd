<script setup>
import { ref } from 'vue';
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

/** @type {import('vue').Ref<string>} Reactive state for the currently active menu item ID. */
const activeItem = ref('dashboard');

/** @type {import('vue').Ref<string>} Reactive state for the restaurant name. */
const restaurantName = ref('GRAN DRAGÓN CHIFA');

const {t}=useI18n();

/** @type {import('vue').Ref<string>} Reactive state for the current subscription plan. */
const currentPlan = ref('Premium');

const userRole = ref('supplier')

/** @type {MenuItem[]} Array containing the main navigation items. */
const menuItems = {
  restaurant: [
  { id: 'dashboard', i18nKey: 'shared.sidebar.dashboard', iconOff: '/images/icons/dashboard-icon.svg', iconOn: '/images/icons/dashboard-on-icon.svg', path: '/restaurant/dashboard' },
  { id: 'inventory', i18nKey: 'shared.sidebar.inventory', iconOff: '/images/icons/inventory-icon.svg', iconOn: '/images/icons/inventory-on-icon.svg', path: '/restaurant/inventory' },
  { id: 'orders', i18nKey: 'shared.sidebar.orders', iconOff: '/images/icons/orders-icon.svg', iconOn: '/images/icons/orders-on-icon.svg', path: '/restaurant/orders' },
  { id: 'kitchen-tickets', i18nKey: 'shared.sidebar.kitchen-tickets', iconOff: '/images/icons/kitchen-ticket-icon.svg', iconOn: '/images/icons/kitchen-tickets-on-icon.svg', path: '/restaurant/kitchen' },
  { id: 'suppliers', i18nKey: 'shared.sidebar.suppliers', iconOff: '/images/icons/suppliers-icon.svg', iconOn: '/images/icons/suppliers-on-icon.svg', path: '/restaurant/suppliers' },
  { id: 'tables-and-occupancy', i18nKey: 'shared.sidebar.tables-and-occupancy', iconOff: '/images/icons/tables-and-occupancy-icon.svg', iconOn: '/images/icons/tables-and-occupancy-on-icon.svg', path: '/restaurant/tables' },
  { id: 'alerts', i18nKey: 'shared.sidebar.alerts', iconOff: '/images/icons/alerts-icon.svg', iconOn: '/images/icons/alerts-on-icon.svg', path: '/restaurant/alerts' },
  { id: 'reports', i18nKey: 'shared.sidebar.reports', iconOff: '/images/icons/reports-icon.svg', iconOn: '/images/icons/reports-on-icon.svg', path: '/restaurant/reports' },
  { id: 'configuration', i18nKey: 'shared.sidebar.configuration', iconOff: '/images/icons/configuration-icon.svg', iconOn: '/images/icons/configuration-on-icon.svg', path: '/restaurant/configuration' },
  { id: 'subscription', i18nKey: 'shared.sidebar.subscription', iconOff: '/images/icons/subscripcion-icon.svg', iconOn: '/images/icons/subscription-on-icon.svg', path: '/restaurant/subscription' },

  ],
  supplier:[
    { id: 'dashboard', i18nKey: 'shared.sidebar.dashboard', iconOff: '/images/icons/dashboard-icon.svg', iconOn: '/images/icons/dashboard-on-icon.svg', path: '/supplier/dashboard' },
    { id: 'orders', i18nKey: 'shared.sidebar.orders', iconOff: '/images/icons/orders-icon.svg', iconOn: '/images/icons/orders-on-icon.svg', path: '/supplier/orders' },
    { id: 'clients', i18nKey: 'shared.sidebar.clients', iconOff: '/images/icons/clients-icon.svg', iconOn: '/images/icons/clients-icon.svg', path: '/supplier/clients' },
    { id: 'delivery', i18nKey: 'shared.sidebar.delivery', iconOff: '/images/icons/delivery-icon.svg', iconOn: '/images/icons/delivery-icon.svg', path: '/supplier/delivery' },
    { id: 'forecast', i18nKey: 'shared.sidebar.forecast', iconOff: '/images/icons/forecast-icon.svg', iconOn: '/images/icons/forecast-icon.svg', path: '/supplier/forecast' },
    { id: 'catalog', i18nKey: 'shared.sidebar.catalog', iconOff: '/images/icons/catalog-icon.svg', iconOn: '/images/icons/catalog-icon.svg', path: '/supplier/catalog' },
    { id: 'alerts', i18nKey: 'shared.sidebar.alerts', iconOff: '/images/icons/alerts-icon.svg', iconOn: '/images/icons/alerts-on-icon.svg', path: '/supplier/alerts' },
    { id: 'configuration', i18nKey: 'shared.sidebar.configuration', iconOff: '/images/icons/configuration-icon.svg', iconOn: '/images/icons/configuration-on-icon.svg', path: '/supplier/configuration' },
    { id: 'subscription', i18nKey: 'shared.sidebar.subscription', iconOff: '/images/icons/subscripcion-icon.svg', iconOn: '/images/icons/subscription-on-icon.svg', path: '/supplier/subscription' }
  ]
};

/**
 * Sets the given item ID as the active selection in the menu.
 * @param {string} itemId - The ID of the menu item to activate.
 * @returns {void}
 */
const selectItem = (itemId) => {
  activeItem.value = itemId;
};
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar--supplier': userRole === 'supplier' }">
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
      <span class="sidebar__tag sidebar__tag--role">{{ userRole === 'supplier' ? t('shared.sidebar.supplier') : t('shared.sidebar.restaurant')}}</span>
      <span class="sidebar__tag sidebar__tag--plan">{{t('shared.sidebar.current-plan')}} {{ currentPlan }}</span>
    </div>

    <!-- Navigation Menu -->
    <nav class="sidebar__nav" aria-label="Main Navigation">
      <ul class="sidebar__menu">
        <li
          v-for="item in menuItems[userRole]"
          :key="item.id"
          class="sidebar__item"
          :class="{ 'sidebar__item--active': activeItem === item.id }"
        >
          <button class="sidebar__button" @click="selectItem(item.id)">
            <img
              :src="activeItem === item.id ? item.iconOn : item.iconOff"
              :alt="`${ t(item.i18nKey)} icon`"
              class="sidebar__icon"
            />
            <span class="sidebar__label">{{ $t(item.i18nKey) }}</span>
          </button>
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

.sidebar--supplier .sidebar__tag--role,
.sidebar--supplier .sidebar__item--active::before {
  background-color: #B76A13;
}
</style>
