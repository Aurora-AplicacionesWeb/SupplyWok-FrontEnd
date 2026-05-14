import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const purchaseOrdersEndpointPath = import.meta.env.VITE_PURCHASE_ORDERS_ENDPOINT_PATH;

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
        this.#purchaseOrdersEndpoint = new BaseEndpoint(this, purchaseOrdersEndpointPath);
    }

    /**
     * Retrieves purchase order resources.
     *
     * @returns {Promise<import('axios').AxiosResponse<Array<Object>|{purchaseOrders:Array<Object>}>>}
     */
    getPurchaseOrders() {
        return this.#purchaseOrdersEndpoint.getAll();
    }

    /**
     * Persists a new purchase order resource.
     *
     * @param {Object} resource - Purchase order data to persist.
     * @returns {Promise<import('axios').AxiosResponse<Object>>}
     */
    createPurchaseOrder(resource) {
        return this.#purchaseOrdersEndpoint.create(resource);
    }
}
