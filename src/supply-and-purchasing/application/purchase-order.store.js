import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { PurchaseOrderApi } from '../infrastructure/purchase-order-api.js';
import { PurchaseOrderAssembler } from '../infrastructure/purchase-order.assembler.js';
import i18n from '../../i18n.js';

const purchaseOrderApi = new PurchaseOrderApi();
const translate = (key) => i18n.global.t(key);

/**
 * Application service store for the `Supply and Purchasing` bounded context.
 * It coordinates purchase order use cases and keeps a UI-facing state.
 *
 * @module usePurchaseOrderStore
 */
const usePurchaseOrderStore = defineStore('supply-and-purchasing', () => {
    const purchaseOrders = ref([]);
    const errors = ref([]);
    const validationErrors = ref({});
    const purchaseOrdersLoaded = ref(false);
    const loading = ref(false);

    /**
     * Number of loaded purchase orders.
     *
     * @type {import('vue').ComputedRef<number>}
     */
    const purchaseOrdersCount = computed(() => {
        return purchaseOrdersLoaded.value ? purchaseOrders.value.length : 0;
    });

    /**
     * Number of purchase orders in pending state.
     *
     * @type {import('vue').ComputedRef<number>}
     */
    const pendingPurchaseOrdersCount = computed(() => {
        return purchaseOrders.value.filter((purchaseOrder) => purchaseOrder.status === 'Pending').length;
    });

    /**
     * Number of high-priority purchase orders.
     *
     * @type {import('vue').ComputedRef<number>}
     */
    const highPriorityPurchaseOrdersCount = computed(() => {
        return purchaseOrders.value.filter((purchaseOrder) => purchaseOrder.priority === 'High').length;
    });

    /**
     * Loads purchase orders from infrastructure and updates the application state.
     *
     * @returns {Promise<void>}
     */
    async function fetchPurchaseOrders() {
        loading.value = true;
        try {
            const response = await purchaseOrderApi.getPurchaseOrders();
            purchaseOrders.value = PurchaseOrderAssembler.toEntitiesFromResponse(response);
            purchaseOrdersLoaded.value = true;
        } catch (error) {
            errors.value.push(error);
        } finally {
            loading.value = false;
        }
    }

    /**
     * Clears validation errors from the current application state.
     *
     * @returns {void}
     */
    function clearValidationErrors() {
        validationErrors.value = {};
    }

    /**
     * Clears one validation error scope from the current application state.
     *
     * @param {string} scope - Validation scope identifier.
     * @returns {void}
     */
    function clearValidationScope(scope) {
        const nextValidationErrors = { ...validationErrors.value };
        delete nextValidationErrors[scope];
        validationErrors.value = nextValidationErrors;
    }

    /**
     * Collects validation errors for a purchase order item.
     *
     * @param {Object} item - Purchase order item data.
     * @returns {Object} Validation errors keyed by field name.
     */
    function collectOrderItemValidationErrors(item) {
        const itemValidationErrors = {};
        const quantity = Number(item.quantity);
        const unitPrice = Number(item.unitPrice);

        if (!String(item.productName ?? '').trim()) {
            itemValidationErrors.productName = translate('supply-and-purchasing.validation.product-name-required');
        }

        if (!Number.isFinite(quantity) || quantity <= 0) {
            itemValidationErrors.quantity = translate('supply-and-purchasing.validation.quantity-invalid');
        }

        if (!String(item.unitType ?? '').trim()) {
            itemValidationErrors.unitType = translate('supply-and-purchasing.validation.unit-required');
        }

        if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
            itemValidationErrors.unitPrice = translate('supply-and-purchasing.validation.unit-price-invalid');
        }

        return itemValidationErrors;
    }

    /**
     * Validates one purchase order item and stores its scoped errors.
     *
     * @param {Object} item - Purchase order item data.
     * @param {string} [scope='draftLine'] - Validation scope identifier.
     * @returns {boolean} Whether the item is valid.
     */
    function validateOrderItem(item, scope = 'draftLine') {
        const itemValidationErrors = collectOrderItemValidationErrors(item);
        const nextValidationErrors = { ...validationErrors.value };

        if (Object.keys(itemValidationErrors).length > 0) {
            nextValidationErrors[scope] = itemValidationErrors;
            validationErrors.value = nextValidationErrors;
            return false;
        }

        delete nextValidationErrors[scope];
        validationErrors.value = nextValidationErrors;
        return true;
    }

    /**
     * Validates a purchase order entity before persistence.
     *
     * @param {import('../domain/model/purchase-order.entity.js').PurchaseOrder} purchaseOrder - Purchase order entity to validate.
     * @returns {boolean} Whether the purchase order is valid.
     */
    function validatePurchaseOrder(purchaseOrder) {
        const nextValidationErrors = {};

        if (!String(purchaseOrder.supplierId ?? '').trim()) {
            nextValidationErrors.supplierId = translate('supply-and-purchasing.validation.supplier-required');
        }

        if (!String(purchaseOrder.orderDate ?? '').trim()) {
            nextValidationErrors.orderDate = translate('supply-and-purchasing.validation.order-date-required');
        }

        if (!String(purchaseOrder.priority ?? '').trim()) {
            nextValidationErrors.priority = translate('supply-and-purchasing.validation.priority-required');
        }

        if (!Array.isArray(purchaseOrder.items) || purchaseOrder.items.length === 0) {
            nextValidationErrors.items = translate('supply-and-purchasing.validation.items-required');
        } else {
            const itemLinesValidationErrors = {};

            purchaseOrder.items.forEach((item, index) => {
                const itemValidationErrors = collectOrderItemValidationErrors(item);
                if (Object.keys(itemValidationErrors).length > 0) {
                    itemLinesValidationErrors[index] = itemValidationErrors;
                }
            });

            if (Object.keys(itemLinesValidationErrors).length > 0) {
                nextValidationErrors.itemLines = itemLinesValidationErrors;
            }
        }

        validationErrors.value = nextValidationErrors;
        return Object.keys(nextValidationErrors).length === 0;
    }

    /**
     * Creates a purchase order through infrastructure and appends it to local state.
     *
     * @param {import('../domain/model/purchase-order.entity.js').PurchaseOrder} purchaseOrder - Purchase order entity to persist.
     * @returns {Promise<boolean>}
     */
    async function addPurchaseOrder(purchaseOrder) {
        clearValidationScope('draftLine');

        if (!validatePurchaseOrder(purchaseOrder)) {
            return false;
        }

        try {
            const response = await purchaseOrderApi.createPurchaseOrder(purchaseOrder);
            const newPurchaseOrder = PurchaseOrderAssembler.toEntityFromResource(response.data);
            purchaseOrders.value.unshift(newPurchaseOrder);
            clearValidationErrors();
            return true;
        } catch (error) {
            errors.value.push(error);
            return false;
        }
    }

    return {
        purchaseOrders,
        errors,
        validationErrors,
        purchaseOrdersLoaded,
        loading,
        purchaseOrdersCount,
        pendingPurchaseOrdersCount,
        highPriorityPurchaseOrdersCount,
        fetchPurchaseOrders,
        clearValidationErrors,
        clearValidationScope,
        validateOrderItem,
        validatePurchaseOrder,
        addPurchaseOrder
    };
});

export default usePurchaseOrderStore;
