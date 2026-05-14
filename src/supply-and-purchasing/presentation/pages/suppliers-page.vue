<script setup>
const supplierRows = [
  { supplier: 'Golden Wok Produce', contact: 'Martin Lau', email: 'mlau@goldenwok.pe', phone: '+51 987 100 120', category: 'GRAINS', linkedDate: '2026-04-21', sla: '98% SLA', responseTime: '1.6 H' },
  { supplier: 'Andes Cold Chain', contact: 'Valeria Lin', email: 'vlin@andescold.pe', phone: '+51 988 210 310', category: 'GRAINS', linkedDate: '2026-04-20', sla: '95% SLA', responseTime: '2.1 H' },
  { supplier: 'Orient Pantry Co.', contact: 'Jose Chen', email: 'jchen@orientpantry.pe', phone: '+51 977 543 210', category: 'PROTEIN', linkedDate: '2026-04-19', sla: '91% SLA', responseTime: '2.9 H' },
  { supplier: 'Pacific Dumpling Hub', contact: 'Julia Wong', email: 'jwong@pacificdumpling.pe', phone: '+51 964 404 700', category: 'SAUCES', linkedDate: '2026-04-18', sla: '94% SLA', responseTime: '3.4 H' },
  { supplier: 'Urban Service Goods', contact: 'Sofia Tello', email: 'stello@urbanservice.pe', phone: '+51 955 443 220', category: 'SEAFOOD', linkedDate: '2026-04-17', sla: '89% SLA', responseTime: '2.4 H' }
];
</script>

<template>
  <section class="suppliers-page">
    <header class="suppliers-page__hero">
      <span class="suppliers-page__kicker">Restaurant</span>
      <h1 class="suppliers-page__title">Suppliers</h1>
      <p class="suppliers-page__description">
        Visibility into contacts, supplied categories, and recent performance.
      </p>
    </header>

    <section class="suppliers-table-card">
      <div class="suppliers-table-card__table-wrap">
        <table class="suppliers-table">
          <thead>
            <tr>
              <th>SUPPLIER</th>
              <th>CONTACT</th>
              <th>SUPPLIED CATEGORIES</th>
              <th>LINKED HISTORY</th>
              <th>RESPONSE TIME</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="row in supplierRows" :key="row.supplier">
              <td class="suppliers-table__supplier-cell">{{ row.supplier }}</td>
              <td>
                <div class="suppliers-table__contact">
                  <strong>{{ row.contact }}</strong>
                  <small>{{ row.email }}</small>
                  <small>{{ row.phone }}</small>
                </div>
              </td>
              <td>
                <span class="suppliers-table__tag">{{ row.category }}</span>
              </td>
              <td>
                <div class="suppliers-table__history">
                  <strong>{{ row.linkedDate }}</strong>
                  <small>{{ row.sla }}</small>
                </div>
              </td>
              <td class="suppliers-table__time">{{ row.responseTime }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer class="suppliers-table-card__footer">
        <p>Showing {{ supplierRows.length }} of 142 total items</p>
        <div class="suppliers-table-card__pagination">
          <button type="button" disabled>Previous</button>
          <button type="button" class="suppliers-table-card__pagination-next">Next</button>
        </div>
      </footer>
    </section>
  </section>
</template>

<style scoped>
.suppliers-page {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.suppliers-page__hero {
  padding: 12px 6px 0;
}

.suppliers-page__kicker {
  display: inline-block;
  color: #a07832;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.suppliers-page__title {
  margin: 10px 0 8px;
  color: #221b2a;
  font-size: clamp(2.6rem, 4vw, 3.3rem);
  line-height: 1;
  letter-spacing: -0.04em;
}

.suppliers-page__description {
  color: #5b5247;
  font-size: 1.03rem;
}

.suppliers-table-card {
  background: #ffffff;
  border: 1px solid #eadbca;
  border-radius: 22px;
  box-shadow: 0 18px 36px rgba(47, 36, 29, 0.1);
  overflow: hidden;
}

.suppliers-table {
  width: 100%;
  border-collapse: collapse;
}

.suppliers-table thead th {
  padding: 15px 20px;
  border-bottom: 1px solid #eadbca;
  color: #85796d;
  font-size: 0.94rem;
  font-weight: 700;
  text-align: left;
}

.suppliers-table tbody td {
  padding: 14px 20px;
  border-bottom: 1px solid #f0e7dc;
  color: #31272f;
  vertical-align: middle;
}

.suppliers-table__supplier-cell {
  font-size: 1.02rem;
  font-weight: 700;
}

.suppliers-table__contact,
.suppliers-table__history {
  display: grid;
  gap: 2px;
}

.suppliers-table__contact strong,
.suppliers-table__history strong {
  color: #31272f;
}

.suppliers-table__contact small,
.suppliers-table__history small {
  color: #7e756b;
  font-size: 0.92rem;
}

.suppliers-table__tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: #f2efeb;
  color: #676057;
  font-size: 0.82rem;
  font-weight: 700;
}

.suppliers-table__time {
  color: #5a5249;
  font-weight: 600;
}

.suppliers-table-card__footer {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  padding: 14px 20px;
}

.suppliers-table-card__footer p {
  color: #8b8175;
  font-size: 0.95rem;
}

.suppliers-table-card__pagination {
  display: flex;
  gap: 8px;
}

.suppliers-table-card__pagination button {
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid #e6dbcf;
  border-radius: 12px;
  background: #ffffff;
  color: #b8ada3;
  font-weight: 600;
}

.suppliers-table-card__pagination-next {
  background: #2d241e !important;
  color: #ffffff !important;
  border-color: #2d241e !important;
}

@media (max-width: 1100px) {
  .suppliers-table-card__table-wrap {
    overflow-x: auto;
  }

  .suppliers-table {
    min-width: 930px;
  }
}

@media (max-width: 700px) {
  .suppliers-table-card__footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
