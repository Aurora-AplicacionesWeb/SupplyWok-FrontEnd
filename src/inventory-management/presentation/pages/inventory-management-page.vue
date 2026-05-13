<script setup>
import { onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import InventoryDataTable from '../components/inventory-data-table.component.vue';
import useInventoryManagementStore from '../../application/inventory-management.store.js';

const { t } = useI18n();
const store = useInventoryManagementStore();

async function handleDeleteItem(itemId) {
  await store.deleteInventoryItem(itemId);
}

onMounted(async () => {
  if (!store.loaded) await store.fetchAll();
});

const unitsOptions = computed(() => store.inventoryUnits.map((u) => ({ label: u, value: u })));
</script>

<template>
  <section class="inventory-management-page">
	<header class="inventory-management-page__hero">
	  <div>
		<span class="kicker">{{ t('inventoryManagement.page.kicker') }}</span>
		<h1>{{ t('inventoryManagement.page.title') }}</h1>
		<p class="lead">{{ t('inventoryManagement.page.description') }}</p>
	  </div>
	  <div>
		<button class="primary">{{ t('inventoryManagement.page.actions.add') }}</button>
	  </div>
	</header>

	<div class="inventory-management-page__metrics">
	  <article>
		<strong>{{ store.totalInventoryItems }}</strong>
		<span>{{ t('inventoryManagement.metrics.items') }}</span>
	  </article>
	  <article>
		<strong>{{ store.totalCurrentStock }}</strong>
		<span>{{ t('inventoryManagement.metrics.totalStock') }}</span>
	  </article>
	  <article>
		<strong>{{ store.criticalItemsCount }}</strong>
		<span>{{ t('inventoryManagement.metrics.critical') }}</span>
	  </article>
	  <article>
		<strong>{{ store.stockMovements.length }}</strong>
		<span>{{ t('inventoryManagement.metrics.movements') }}</span>
	  </article>
	</div>

	<InventoryDataTable :items="store.inventoryItems" :loading="store.loading" :units="unitsOptions" @delete="handleDeleteItem" />
  </section>
</template>

<style scoped>
.inventory-management-page__hero { display:flex; justify-content:space-between; align-items:center; gap:20px; margin-bottom:18px; }
.inventory-management-page__hero h1 { color: #000000; margin: 0; }
.kicker { display:inline-block; color:#a07832; font-weight:700; text-transform:uppercase; }
.lead { color:#6d6d6d; margin-top:6px; }
.inventory-management-page__metrics { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:18px; }
.inventory-management-page__metrics article { background:#fff; padding:12px; border-radius:10px; box-shadow:0 8px 18px rgba(0,0,0,0.04); }
.inventory-management-page__metrics strong { display:block; font-size:20px; }
.primary { background: #c21204; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
.primary:hover { background: #a01903; box-shadow: 0 4px 12px rgba(194, 18, 4, 0.3); }
</style>


