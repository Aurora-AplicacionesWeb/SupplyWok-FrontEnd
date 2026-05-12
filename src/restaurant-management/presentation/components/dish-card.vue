<script setup>
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';

const props = defineProps({
    dish: { type: Object, required: true },
    compact: { type: Boolean, default: false }
});

const emit = defineEmits(['add-to-order']);
const { t } = useI18n();
</script>

<template>
    <article class="dish-card" :class="{ 'dish-card--compact': compact }">
        <div class="dish-card__body">
            <div class="dish-card__header">
                <h3 class="dish-card__name">{{ dish.name }}</h3>
                <span v-if="dish.outstanding" class="dish-card__badge">
                    <i class="pi pi-star-fill" />
                </span>
            </div>
            <p v-if="!compact" class="dish-card__description">{{ dish.description }}</p>
            <div class="dish-card__meta">
                <span class="dish-card__price">S/ {{ dish.price.toFixed(2) }}</span>
            </div>
        </div>
        <div class="dish-card__actions">
            <Button
                :label="compact ? '' : t('restaurantManagement.dishMenuPage.addToOrder')"
                :icon="compact ? 'pi pi-plus' : 'pi pi-plus'"
                severity="danger"
                :text="compact"
                :rounded="compact"
                :size="compact ? 'small' : undefined"
                :style="compact ? { width: '32px', height: '32px' } : {}"
                @click="emit('add-to-order', dish)"
            />
        </div>
    </article>
</template>

<style scoped>
.dish-card {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 16px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 14px rgba(45, 36, 30, 0.06);
    border: 1px solid #f0e8dd;
    transition: box-shadow 0.2s;
}

.dish-card:hover {
    box-shadow: 0 8px 24px rgba(45, 36, 30, 0.1);
}

.dish-card--compact {
    padding: 10px 12px;
    border-radius: 12px;
}

.dish-card__body {
    flex: 1;
    min-width: 0;
}

.dish-card__header {
    display: flex;
    align-items: center;
    gap: 6px;
}

.dish-card__name {
    margin: 0;
    color: #40342d;
    font-size: 15px;
    font-weight: 600;
    font-family: 'Poppins', system-ui, sans-serif;
}

.dish-card--compact .dish-card__name {
    font-size: 13px;
}

.dish-card__badge {
    color: #e9b824;
    font-size: 11px;
}

.dish-card__description {
    margin: 4px 0 0;
    color: #7d7065;
    font-size: 12px;
    line-height: 1.4;
}

.dish-card__meta {
    margin-top: 6px;
}

.dish-card__price {
    font-weight: 700;
    color: #c21204;
    font-size: 15px;
}

.dish-card--compact .dish-card__price {
    font-size: 13px;
}

.dish-card__actions {
    display: flex;
    align-items: flex-end;
}
</style>
