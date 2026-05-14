<script setup>
defineProps({
    icon: {
        type: String,
        required: true
    },
    value: {
        type: [String, Number],
        required: true
    },
    label: {
        type: String,
        required: true
    },
    iconClass: {
        type: String,
        default: ''
    },
    badge: {
        type: String,
        default: ''
    },
    badgeClass: {
        type: String,
        default: ''
    }
});
</script>

<template>
    <article class="stat-card">
        <div class="stat-card__header">
            <i class="pi stat-card__icon" :class="[icon, iconClass]"></i>
            <span v-if="badge" class="stat-card__badge" :class="badgeClass">{{ badge }}</span>
        </div>

        <strong class="stat-card__value">{{ value }}</strong>
        <p class="stat-card__label">{{ label }}</p>
    </article>
</template>

<style scoped>
.stat-card {
    min-height: 152px;
    padding: 22px 24px;
    border: 1px solid #efe4d4;
    border-radius: 8px;
    background: #fffdf9;
    box-shadow: 0 16px 34px rgba(58, 42, 20, 0.08);
}

.stat-card__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
}

.stat-card__icon {
    font-size: 22px;
}

.stat-card__value {
    display: block;
    margin-top: 14px;
    color: #241c17;
    font-size: 17px;
    font-weight: 700;
}

.stat-card__label {
    margin: 6px 0 0;
    color: #41352d;
    font-size: 16px;
    line-height: 1.25;
    text-transform: uppercase;
}

.stat-card__badge {
    display: inline-flex;
    align-items: center;
    min-height: 24px;
    padding: 0 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 700;
}

.stat-card__badge--alert {
    background: #fdeaea;
    color: #ff4d4f;
}

.stat-card__icon--orders {
    color: #dca11b;
}

.stat-card__icon--deliveries {
    color: #3d73ff;
}

.stat-card__icon--forecast {
    color: #34a853;
}

.stat-card__icon--alerts {
    color: #d91f26;
}
</style>
