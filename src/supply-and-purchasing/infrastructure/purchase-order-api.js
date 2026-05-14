import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const purchaseOrdersEndpointPath = import.meta.env.VITE_PURCHASE_ORDERS_ENDPOINT_PATH ?? '';
const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';

let mockPurchaseOrders = [
    {
        id: 1,
        supplierId: 201,
        supplierName: 'Golden Wok Produce',
        orderDate: '2026-05-10',
        priority: 'High',
        status: 'Pending',
        items: [
            { id: 1, inventoryItemId: 101, productName: 'Rice', quantity: 25, unitPrice: 4.5, unitType: 'kg' },
            { id: 2, inventoryItemId: 102, productName: 'Soy Sauce', quantity: 12, unitPrice: 8.2, unitType: 'ltr' }
        ]
    },
    {
        id: 2,
        supplierId: 202,
        supplierName: 'Andes Cold Chain',
        orderDate: '2026-05-09',
        priority: 'Medium',
        status: 'In Preparation',
        items: [
            { id: 3, inventoryItemId: 103, productName: 'Chicken Breast', quantity: 18, unitPrice: 14.8, unitType: 'kg' }
        ]
    },
    {
        id: 3,
        supplierId: 203,
        supplierName: 'Orient Pantry Co.',
        orderDate: '2026-05-08',
        priority: 'Low',
        status: 'Delivered',
        items: [
            { id: 4, inventoryItemId: 104, productName: 'Sesame Oil', quantity: 6, unitPrice: 18.4, unitType: 'ltr' }
        ]
    }
];

/**
 * Infrastructure adapter for Supply and Purchasing HTTP endpoints.
 *
 * @class PurchaseOrderApi
 * @extends BaseApi
 */
export class PurchaseOrderApi extends BaseApi {
    /** @type {BaseEndpoint|null} */
    #purchaseOrdersEndpoint;

    /** Creates the endpoint client for purchase orders when an endpoint path is available. */
    constructor() {
        super();
        this.#purchaseOrdersEndpoint = purchaseOrdersEndpointPath && !useMockApi
            ? new BaseEndpoint(this, purchaseOrdersEndpointPath)
            : null;
    }

    /**
     * Retrieves purchase order resources.
     *
     * @returns {Promise<import('axios').AxiosResponse<Array<Object>|{purchaseOrders:Array<Object>}>>}
     */
    getPurchaseOrders() {
        if (this.#purchaseOrdersEndpoint) {
            return this.#purchaseOrdersEndpoint.getAll().catch((error) => {
                console.warn('Remote purchase orders API unavailable, using local fallback.', error);
                return {
                    status: 200,
                    statusText: 'OK',
                    data: { purchaseOrders: mockPurchaseOrders }
                };
            });
        }

        return Promise.resolve({
            status: 200,
            statusText: 'OK',
            data: { purchaseOrders: mockPurchaseOrders }
        });
    }

    /**
     * Persists a new purchase order resource.
     *
     * @param {Object} resource - Purchase order data to persist.
     * @returns {Promise<import('axios').AxiosResponse<Object>>}
     */
    createPurchaseOrder(resource) {
        if (this.#purchaseOrdersEndpoint) {
            return this.#purchaseOrdersEndpoint.create(resource).catch((error) => {
                console.warn('Remote purchase orders API unavailable during creation, using local fallback.', error);

                const newPurchaseOrder = {
                    ...resource,
                    id: mockPurchaseOrders.length + 1
                };

                mockPurchaseOrders = [newPurchaseOrder, ...mockPurchaseOrders];

                return {
                    status: 201,
                    statusText: 'Created',
                    data: newPurchaseOrder
                };
            });
        }

        const newPurchaseOrder = {
            ...resource,
            id: mockPurchaseOrders.length + 1
        };

        mockPurchaseOrders = [newPurchaseOrder, ...mockPurchaseOrders];

        return Promise.resolve({
            status: 201,
            statusText: 'Created',
            data: newPurchaseOrder
        });
    }
}
