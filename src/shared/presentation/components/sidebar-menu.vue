<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
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
const { t } = useI18n();
const restaurantName = ref('GRAN DRAGON CHIFA');
const currentPlan = ref('Premium');

const menuItems = [
  { id: 'dashboard', path: '/dashboard', i18nKey: 'shared.sidebar.dashboard', iconOff: '/images/icons/dashboard-icon.svg', iconOn: '/images/icons/dashboard-on-icon.svg' },
  { id: 'inventory', path: '/inventory', i18nKey: 'shared.sidebar.inventory', iconOff: '/images/icons/inventory-icon.svg', iconOn: '/images/icons/inventory-on-icon.svg' },
  { id: 'orders', path: '/orders', i18nKey: 'shared.sidebar.orders', iconOff: '/images/icons/orders-icon.svg', iconOn: '/images/icons/orders-on-icon.svg' },
  { id: 'kitchen-tickets', path: '/kitchen-tickets', i18nKey: 'shared.sidebar.kitchen-tickets', iconOff: '/images/icons/kitchen-ticket-icon.svg', iconOn: '/images/icons/kitchen-tickets-on-icon.svg' },
  { id: 'suppliers', path: '/suppliers', i18nKey: 'shared.sidebar.suppliers', iconOff: '/images/icons/suppliers-icon.svg', iconOn: '/images/icons/suppliers-on-icon.svg' },
  { id: 'tables-and-occupancy', path: '/tables-and-occupancy', i18nKey: 'shared.sidebar.tables-and-occupancy', iconOff: '/images/icons/tables-and-occupancy-icon.svg', iconOn: '/images/icons/tables-and-occupancy-on-icon.svg' },
  { id: 'alerts', path: '/alerts', i18nKey: 'shared.sidebar.alerts', iconOff: '/images/icons/alerts-icon.svg', iconOn: '/images/icons/alerts-on-icon.svg' },
  { id: 'reports', path: '/reports', i18nKey: 'shared.sidebar.reports', iconOff: '/images/icons/reports-icon.svg', iconOn: '/images/icons/reports-on-icon.svg' },
  { id: 'configuration', path: '/configuration', i18nKey: 'shared.sidebar.configuration', iconOff: '/images/icons/configuration-icon.svg', iconOn: '/images/icons/configuration-on-icon.svg' },
  { id: 'subscription', path: '/subscription', i18nKey: 'shared.sidebar.subscription', iconOff: '/images/icons/subscripcion-icon.svg', iconOn: '/images/icons/subscription-on-icon.svg' }
];

const activePath = computed(() => route.path);
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__brand">
      <img src="/images/supplywok-logo.png" alt="SupplyWok Logo" class="sidebar__logo" />
      <div class="sidebar__brand-text">
        <h2 class="sidebar__title">SupplyWok</h2>
        <span class="sidebar__subtitle">{{ restaurantName }}</span>
      </div>
    </div>

    <div class="sidebar__status">
      <span class="sidebar__tag sidebar__tag--role">{{ t('shared.sidebar.restaurant') }}</span>
      <span class="sidebar__tag sidebar__tag--plan">{{ t('shared.sidebar.current-plan') }} {{ currentPlan }}</span>
    </div>

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
              :alt="`${t(item.i18nKey)} icon`"
              class="sidebar__icon"
            />
            <span class="sidebar__label">{{ t(item.i18nKey) }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 280px;
  min-height: 100vh;
  background-color: #2d241e;
  color: #b5b0a1;
  font-family: 'Montserrat', system-ui, sans-serif;
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  box-sizing: border-box;
}

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
  color: #ffffff;
}

.sidebar__subtitle {
  font-size: 11px;
  font-weight: 600;
  color: #8c857b;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

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
  background-color: #c21204;
  color: #ffffff;
  padding: 4px 10px;
  font-weight: 600;
  font-family: 'Poppins', system-ui, sans-serif;
}

.sidebar__tag--plan {
  color: #8c857b;
  font-weight: 500;
}

.sidebar__nav {
  flex-grow: 1;
}

.sidebar__menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar__item {
  position: relative;
}

.sidebar__button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 24px 12px 32px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  text-decoration: none;
  transition: all 0.2s ease;
}

.sidebar__icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.sidebar__label {
  font-size: 15px;
  font-weight: 500;
  color: #a39b8f;
  transition: all 0.2s ease;
}

.sidebar__button:hover .sidebar__label {
  color: #e2dfd8;
}

.sidebar__button:hover .sidebar__icon {
  opacity: 1;
}

.sidebar__item--active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 32px;
  width: 4px;
  background-color: #c21204;
  border-radius: 0 4px 4px 0;
}

.sidebar__item--active .sidebar__label {
  font-weight: 700;
  color: #ffffff;
}

.sidebar__item--active .sidebar__icon {
  opacity: 1;
}
</style>
