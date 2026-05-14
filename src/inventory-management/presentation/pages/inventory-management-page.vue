<script setup>
import InventoryDataTable from '../components/inventory-data-table.component.vue';
</script>

<template>
  <section class="inventory-management-page">
    <header class="inventory-management-page__hero">
      <div>
        <span class="inventory-management-page__kicker">Restaurant</span>
        <h1 class="inventory-management-page__title">Inventory</h1>
        <p class="inventory-management-page__description">
          Control stock, minimums and relationships with suppliers.
        </p>
      </div>

      <button type="button" class="inventory-management-page__action">
        <i class="pi pi-plus"></i>
        <span>add supply</span>
      </button>
    </header>

    <InventoryDataTable />
  </section>
</template>

<style scoped>
.inventory-management-page {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.inventory-management-page__hero {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: flex-start;
  padding: 12px 6px 0;
}

.inventory-management-page__kicker {
  display: inline-block;
  color: #a07832;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.inventory-management-page__title {
  margin: 10px 0 8px;
  color: #221b2a;
  font-size: clamp(2.6rem, 4vw, 3.3rem);
  line-height: 1;
  letter-spacing: -0.04em;
}

.inventory-management-page__description {
  color: #5b5247;
  font-size: 1.03rem;
}

.inventory-management-page__action {
  display: inline-flex;
  align-items: center;
  gap: 18px;
  min-height: 52px;
  padding: 0 22px;
  border: none;
  border-radius: 16px;
  background: #2d241e;
  color: #ffffff;
  font-size: 1.05rem;
  font-weight: 600;
  text-transform: lowercase;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(45, 36, 30, 0.16);
}

.inventory-management-page__action i {
  font-size: 1.1rem;
}

@media (max-width: 900px) {
  .inventory-management-page__hero {
    flex-direction: column;
  }
}
</style>
