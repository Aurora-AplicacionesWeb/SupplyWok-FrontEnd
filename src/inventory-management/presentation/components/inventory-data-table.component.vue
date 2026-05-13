<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ConfirmDialog from 'primevue/confirmdialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import ProgressBar from 'primevue/progressbar';
import Tag from 'primevue/tag';
import { useConfirm } from 'primevue/useconfirm';

const confirm = useConfirm();
const emit = defineEmits(['delete']);

const props = defineProps({
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  units: { type: Array, default: () => [] }
});

const { t } = useI18n();
const search = ref('');
const selectedUnit = ref(null);

const filtered = computed(() => {
  const q = String(search.value ?? '').trim().toLowerCase();
  return props.items.filter((item) => {
	if (selectedUnit.value && item.unitOfMeasure !== selectedUnit.value) return false;
	if (!q) return true;
	return (
	  String(item.name ?? '').toLowerCase().includes(q) ||
	  String(item.id ?? '').toLowerCase().includes(q) ||
	  String(item.restaurantId ?? '').toLowerCase().includes(q)
	);
  });
});

function getStatus(item) {
  return item.getStockStatus ? item.getStockStatus() : 'healthy';
}

function statusSeverity(status) {
  if (status === 'critical') return 'danger';
  if (status === 'warning') return 'warning';
  return 'success';
}

function formatUnit(unit) {
  const map = {
	KILOGRAMS: t('inventoryManagement.units.kilograms'),
	LITERS: t('inventoryManagement.units.liters'),
	UNITS: t('inventoryManagement.units.units'),
	GRAMS: t('inventoryManagement.units.grams')
  };
  return map[unit] ?? unit;
}

function confirmDelete(item) {
  confirm.require({
	message: `¿Estás seguro de que deseas eliminar "${item.name}"?`,
	header: 'Confirmar eliminación',
	icon: 'pi pi-exclamation-triangle',
	accept() {
	  emit('delete', item.id);
	},
	reject() {
	  // No hacer nada
	}
  });
}
</script>

<template>
  <section class="inventory-data-table">
	<div class="inventory-data-table__toolbar">
	  <div class="inventory-data-table__heading">
		<h3>{{ t('inventoryManagement.table.title') }}</h3>
	  </div>

	  <div class="inventory-data-table__controls">
		<span class="inventory-data-table__search">
		  <i class="pi pi-search" />
		  <InputText v-model="search" :placeholder="t('inventoryManagement.table.searchPlaceholder')" />
		</span>

		<Dropdown v-model="selectedUnit" :options="units" optionLabel="label" optionValue="value" :placeholder="t('inventoryManagement.table.filterUnit')" class="inventory-data-table__dropdown" />
	  </div>
	</div>

	<DataTable :value="filtered" :loading="loading" paginator :rows="6" dataKey="id" rowHover class="inventory-data-table__grid">
	  <Column field="name" :header="t('inventoryManagement.table.columns.product')" sortable>
		<template #body="{ data }">
		  <div class="inventory-data-table__product-cell">
			<strong>{{ data.name }}</strong>
			<small>ID: {{ data.id }}</small>
		  </div>
		</template>
	  </Column>

	  <Column field="currentStock" :header="t('inventoryManagement.table.columns.stock')" sortable>
		<template #body="{ data }">
		  <div class="inventory-data-table__stock-cell">
			<div class="inventory-data-table__stock-value">{{ data.currentStock }}</div>
			<div class="inventory-data-table__stock-progress">
			  <ProgressBar :value="data.getStockLevelPercentage ? data.getStockLevelPercentage() : 0" />
			</div>
			<Tag :value="t(`inventoryManagement.stockStatus.${getStatus(data)}`)" :severity="statusSeverity(getStatus(data))" />
		  </div>
		</template>
	  </Column>

	  <Column field="unitOfMeasure" :header="t('inventoryManagement.table.columns.unit')">
		<template #body="{ data }">
		  <span>{{ formatUnit(data.unitOfMeasure) }}</span>
		</template>
	  </Column>

	  <Column field="restaurantId" :header="t('inventoryManagement.table.columns.restaurant')" />

	  <Column :header="t('inventoryManagement.table.columns.actions')" style="width: 120px;">
		<template #body="{ data }">
		  <button class="inventory-data-table__action-btn inventory-data-table__action-btn--edit" title="Editar" @click="() => {}">
			<i class="pi pi-pencil"></i>
		  </button>
		  <button class="inventory-data-table__action-btn inventory-data-table__action-btn--delete" title="Eliminar" @click="confirmDelete(data)">
			<i class="pi pi-trash"></i>
		  </button>
		</template>
	  </Column>
	</DataTable>

	<ConfirmDialog />
  </section>
</template>

<style scoped>
.inventory-data-table { background: #fff; border-radius: 12px; padding: 12px; box-shadow: 0 10px 24px rgba(0,0,0,0.06); }
.inventory-data-table__toolbar { display:flex; justify-content:space-between; align-items:center; gap:12px; padding:8px 4px; }
.inventory-data-table__controls { display:flex; gap:8px; align-items:center; }
.inventory-data-table__search { display:flex; align-items:center; gap:8px; padding:6px 10px; border-radius:8px; background:#fbf8f4; border:1px solid #eee; }
.inventory-data-table__product-cell small { display:block; color:#8e8177; font-size:12px; }
.inventory-data-table__stock-cell { display:flex; align-items:center; gap:12px; }
.inventory-data-table__stock-value { font-weight:700; }
.inventory-data-table__stock-progress { width:120px; }

.inventory-data-table__action-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px 8px;
  margin-right: 8px;
  font-size: 16px;
  border-radius: 4px;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.inventory-data-table__action-btn--edit { color: #7b6d61; }
.inventory-data-table__action-btn--edit:hover { background: rgba(123, 109, 97, 0.1); color: #5a4a3a; }

.inventory-data-table__action-btn--delete { color: #c21204; }
.inventory-data-table__action-btn--delete:hover { background: rgba(194, 18, 4, 0.1); color: #900; }
</style>



