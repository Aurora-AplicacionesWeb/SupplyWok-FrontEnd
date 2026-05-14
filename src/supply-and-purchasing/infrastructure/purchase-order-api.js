import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const purchaseOrdersEndpointPath = import.meta.env.VITE_PURCHASE_ORDERS_ENDPOINT_PATH ?? '/purchase-orders';
const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';

let mockPurchaseOrders = [
    {
        id: 301,
        code: 'PO-24031',
        supplierId: 201,
        supplierName: 'Golden Wok Produce',
        restaurantName: 'Gran Dragon Chifa',
        orderDate: '2026-05-12',
        estimatedDate: '2026-05-14',
        priority: 'High',
        status: 'Pending',
        items: [
            { id: 1, inventoryItemId: null, productName: 'Arroz jazmin', quantity: 50, unitPrice: 3.2, unitType: 'Kg' }
        ]
    },
    {
        id: 302,
        code: 'PO-24032',
        supplierId: 202,
        supplierName: 'Andes Cold Chain',
        restaurantName: 'Gran Dragon Chifa',
        orderDate: '2026-05-13',
        estimatedDate: '2026-05-15',
        priority: 'Medium',
        status: 'In preparation',
        items: [
            { id: 2, inventoryItemId: null, productName: 'Pollo trozado', quantity: 35, unitPrice: 12.5, unitType: 'Kg' }
        ]
    },
    {
        id: 303,
        code: 'PO-24033',
        supplierId: 203,
        supplierName: 'Orient Pantry Co.',
        restaurantName: 'Gran Dragon Chifa',
        orderDate: '2026-05-11',
        estimatedDate: '2026-05-13',
        priority: 'Low',
        status: 'Delivered',
        items: [
            { id: 3, inventoryItemId: null, productName: 'Aceite de sesamo', quantity: 24, unitPrice: 18.9, unitType: 'Ltr' }
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
                return this.#buildMockResponse({ purchaseOrders: mockPurchaseOrders });
            });
        }

        return Promise.resolve(this.#buildMockResponse({ purchaseOrders: mockPurchaseOrders }));
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
                console.warn('Remote purchase orders API unavailable, creating order in local fallback.', error);
                return this.#createMockPurchaseOrder(resource);
            });
        }

        return Promise.resolve(this.#createMockPurchaseOrder(resource));
    }

    #buildMockResponse(data) {
        return {
            status: 200,
            statusText: 'OK',
            data
        };
    }

    #createMockPurchaseOrder(resource) {
        const nextOrder = {
            ...resource,
            id: Date.now()
        };

        mockPurchaseOrders = [nextOrder, ...mockPurchaseOrders];

        return this.#buildMockResponse(nextOrder);
    }
}
