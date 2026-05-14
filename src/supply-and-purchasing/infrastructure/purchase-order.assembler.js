import { PurchaseOrder } from '../domain/model/purchase-order.entity.js';
import { OrderItem } from '../domain/model/order-item.entity.js';

/**
 * Maps Supply and Purchasing purchase order resources into domain entities.
 *
 * @class PurchaseOrderAssembler
 */
export class PurchaseOrderAssembler {

    /**
     * @param {{id: number|string, supplierId: number|string, orderDate: string, priority: string, status: string, items?: Array<Object>}} resource - Purchase order resource payload.
     * @returns {PurchaseOrder} Purchase order entity.
     */
    static toEntityFromResource(resource) {
        return new PurchaseOrder({
            ...resource,
            items: Array.isArray(resource.items)
                ? resource.items.map(item => new OrderItem({ ...item }))
                : []
        });
    }

    /**
     * Parses purchase order resources from a response and maps them into entities.
     *
     * @param {import('axios').AxiosResponse<Array<Object>|{purchaseOrders:Array<Object>}>} response - HTTP response with purchase order resources.
     * @returns {PurchaseOrder[]} Purchase order entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }

        let resources = response.data instanceof Array
            ? response.data
            : response.data['purchaseOrders'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}