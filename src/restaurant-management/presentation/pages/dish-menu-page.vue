<script setup>
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import useRestaurantManagementStore from '../../application/restaurant-management.store.js';
import DishCard from '../components/dish-card.vue';
import InputText from 'primevue/inputtext';

const { t } = useI18n();
const router = useRouter();
const store = useRestaurantManagementStore();

const { dishes, dishCategories, dishesByCategory, loading } = storeToRefs(store);
const { fetchDishes, fetchDishCategories, addItemToOrder } = store;

const searchQuery = ref('');
const selectedCategoryId = ref(null);

const filteredDishesByCategory = computed(() => {
    const entries = Object.entries(dishesByCategory.value);
    return entries
        .filter(([_, group]) => {
            if (selectedCategoryId.value && Number(selectedCategoryId.value) !== group.category.id) return false;
            return true;
        })
        .map(([id, group]) => ({
            ...group,
            dishes: group.dishes.filter(d => {
                if (!searchQuery.value.trim()) return true;
                const q = searchQuery.value.toLowerCase();
                return d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q);
            })
        }))
        .filter(group => group.dishes.length > 0);
});

function categoryLabel(cat) {
    const key = cat.name.toLowerCase().replace(/\s+/g, '_');
    return t(`restaurantManagement.dishMenuPage.categories.${key}`) || cat.name;
}

function handleAddToOrder(dish) {
    addItemToOrder(dish, 1, '');
    router.push('/create-kitchen-order');
}

onMounted(() => {
    if (dishes.value.length === 0) fetchDishes();
    if (dishCategories.value.length === 0) fetchDishCategories();
});
</script>

<template>
    <section class="dish-menu-page">
        <div class="dish-menu-page__header">
            <div>
                <span class="dish-menu-page__kicker">{{ t('restaurantManagement.dishMenuPage.kicker') }}</span>
                <h1 class="dish-menu-page__title">{{ t('restaurantManagement.dishMenuPage.title') }}</h1>
                <p class="dish-menu-page__description">{{ t('restaurantManagement.dishMenuPage.description') }}</p>
            </div>
        </div>

        <div class="dish-menu-page__toolbar">
            <span class="dish-menu-page__search">
                <i class="pi pi-search" />
                <InputText v-model="searchQuery" :placeholder="t('restaurantManagement.dishMenuPage.searchPlaceholder')" />
            </span>

            <select v-model="selectedCategoryId" class="dish-menu-page__filter">
                <option :value="null">{{ t('restaurantManagement.dishMenuPage.category') }}: {{ t('restaurantManagement.tablesAndOccupancyPage.all') }}</option>
                <option v-for="cat in dishCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
        </div>

        <div v-if="loading" class="dish-menu-page__loading">
            <i class="pi pi-spin pi-spinner" />
        </div>

        <div v-else-if="filteredDishesByCategory.length === 0" class="dish-menu-page__empty">
            <p>{{ t('restaurantManagement.dishMenuPage.noDishes') }}</p>
        </div>

        <div v-else v-for="group in filteredDishesByCategory" :key="group.category.id" class="dish-menu-page__category-group">
            <h2 class="dish-menu-page__category-title">{{ categoryLabel(group.category) }}</h2>
            <div class="dish-menu-page__grid">
                <DishCard
                    v-for="dish in group.dishes"
                    :key="dish.id"
                    :dish="dish"
                    @add-to-order="handleAddToOrder"
                />
            </div>
        </div>
    </section>
</template>

<style scoped>
.dish-menu-page {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.dish-menu-page__kicker {
    display: inline-block;
    color: #a07832;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 6px;
    font-family: 'Montserrat', system-ui, sans-serif;
}

.dish-menu-page__title {
    margin: 0;
    color: #342923;
    font-size: clamp(2rem, 2.2vw, 2.4rem);
    font-family: 'Poppins', system-ui, sans-serif;
    font-weight: 700;
}

.dish-menu-page__description {
    margin: 8px 0 0;
    color: #65594f;
    font-family: 'Montserrat', system-ui, sans-serif;
    font-size: 14px;
}

.dish-menu-page__toolbar {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
}

.dish-menu-page__search {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 12px;
    border: 1px solid #ebe2d7;
    background: #fff;
    border-radius: 10px;
    flex: 1;
    min-width: 200px;
}

.dish-menu-page__search :deep(.p-inputtext) {
    border: none;
    background: transparent;
    box-shadow: none;
    width: 100%;
    color: #40342d;
}

.dish-menu-page__search :deep(.p-inputtext::placeholder) {
    color: #a09489;
}

.dish-menu-page__filter {
    border: 1px solid #ebe2d7;
    background: #fff;
    border-radius: 10px;
    padding: 0.78rem 0.9rem;
    color: #4b3d34;
    min-width: 160px;
}

.dish-menu-page__loading {
    display: flex;
    justify-content: center;
    padding: 48px;
    font-size: 24px;
    color: #a07832;
}

.dish-menu-page__empty {
    padding: 32px;
    text-align: center;
    color: #7d7065;
    background: #fff;
    border-radius: 18px;
}

.dish-menu-page__category-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.dish-menu-page__category-title {
    margin: 0;
    color: #40342d;
    font-size: 18px;
    font-weight: 700;
    padding-bottom: 4px;
    border-bottom: 2px solid #efe6da;
    font-family: 'Poppins', system-ui, sans-serif;
}

.dish-menu-page__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 14px;
}

@media (max-width: 640px) {
    .dish-menu-page__grid {
        grid-template-columns: 1fr;
    }

    .dish-menu-page__toolbar {
        flex-direction: column;
    }

    .dish-menu-page__search {
        width: 100%;
    }

    .dish-menu-page__filter {
        width: 100%;
    }
}
</style>
