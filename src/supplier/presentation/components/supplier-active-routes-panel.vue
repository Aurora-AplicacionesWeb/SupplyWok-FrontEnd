<script setup>
defineProps({
    title: {
        type: String,
        required: true
    },
    routes: {
        type: Array,
        default: () => []
    },
    emptyText: {
        type: String,
        required: true
    }
});

function formatPriorityClass(priority) {
    return `routes-panel__priority--${String(priority ?? '').toLowerCase()}`;
}
</script>

<template>
    <article class="routes-panel">
        <header class="routes-panel__header">
            <h2>{{ title }}</h2>
        </header>

        <div v-if="routes.length" class="routes-panel__list">
            <article v-for="route in routes" :key="route.id" class="routes-panel__item">
                <div class="routes-panel__item-head">
                    <strong>{{ route.routeName }}</strong>
                    <span class="routes-panel__priority" :class="formatPriorityClass(route.priority)">
                        {{ route.priority }}
                    </span>
                </div>

                <p class="routes-panel__meta">{{ route.schedule }}</p>
                <p class="routes-panel__timestamp">{{ route.timestamp }}</p>
            </article>
        </div>

        <p v-else class="routes-panel__empty">{{ emptyText }}</p>
    </article>
</template>

<style scoped>
.routes-panel {
    min-height: 388px;
    border: 1px solid #efe4d4;
    border-radius: 8px;
    background: #fffdf9;
    box-shadow: 0 16px 34px rgba(58, 42, 20, 0.08);
}

.routes-panel__header {
    padding: 12px 18px;
    border-bottom: 1px solid #ece5dc;
}

.routes-panel__header h2 {
    margin: 0;
    color: #4b5768;
    font-family: 'Poppins', system-ui, sans-serif;
    font-size: 18px;
}

.routes-panel__list {
    display: grid;
    gap: 18px;
    padding: 16px;
}

.routes-panel__item {
    padding: 12px 12px 14px;
    border: 1px solid #f0ebe3;
    border-radius: 8px;
    background: #ffffff;
}

.routes-panel__item-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
}

.routes-panel__item-head strong {
    color: #2d241e;
    font-size: 15px;
    font-weight: 700;
}

.routes-panel__meta {
    margin: 8px 0 0;
    color: #6f665d;
    font-size: 14px;
}

.routes-panel__timestamp {
    margin: 18px 0 0;
    color: #b0a79b;
    font-size: 12px;
}

.routes-panel__priority {
    display: inline-flex;
    align-items: center;
    min-height: 22px;
    padding: 0 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 700;
}

.routes-panel__priority--high {
    background: #fdeaea;
    color: #ff4d4f;
}

.routes-panel__priority--medium {
    background: #fff4dc;
    color: #ee9b00;
}

.routes-panel__priority--low {
    background: #eaf7ed;
    color: #34a853;
}

.routes-panel__empty {
    margin: 0;
    padding: 22px 18px;
    color: #6f665d;
    font-size: 14px;
}
</style>
