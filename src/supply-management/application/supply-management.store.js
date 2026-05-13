import {defineStore} from "pinia";
import {computed, ref} from "vue";
import { SupplyManagementApi } from "../infrastructure/supply-management-api.js";
import {OrdersAssembler} from "../infrastructure/orders.assembler.js";
const supplierManagementApi = new SupplyManagementApi();

/**
 * Application service store for the `Supply Management` bounded context.
 * It coordinates supplier purchase order use cases and keeps UI-facing state.
 *
 * @module useSupplierManagementStore
 */
const useSupplierManagementStore = defineStore('supplierManagement', () => {
    const errors=ref([]);
    const purchaseOrders = ref([]);
    const purchaseOrdersLoaded = ref(false);

    /**
     * Number of loaded purchase orders.
     *
     * @type {import('vue').ComputedRef<number>}
     */
    const purchaseOrdersCount =
        computed(()=> purchaseOrdersLoaded ? purchaseOrders.value.length:0);

    /**
     * Loads supplier purchase orders from infrastructure and updates the application state.
     *
     * @returns {void}
     */
    function fetchPurchaseOrders(){
        supplierManagementApi.getOrders().then(response=>{
            purchaseOrders.value=OrdersAssembler.toEntitiesFromResponse(response);
            purchaseOrdersLoaded.value=true;
            console.log(purchaseOrders.value);
            console.log(purchaseOrdersLoaded.value);
        }).catch(error=>{
            errors.value.push(error);
        });
    }

    /**
     * Finds a purchase order by its identifier from the local state.
     *
     * @param {string|number} id - Purchase order identifier.
     * @returns {import('../domain/model/orders.entity.js').Orders|undefined} Matching purchase order, if found.
     */
    function getPurchaseOrdersById(id){
        let idNum=parseInt(id);
        return purchaseOrders.value.find(order=>order['id']===idNum);
    }

    /**
     * Creates a purchase order through infrastructure and appends it to local state.
     *
     * @param {import('../domain/model/orders.entity.js').Orders} order - Purchase order entity to persist.
     * @returns {void}
     */
    function addPurchaseOrders(order){
        supplierManagementApi.createOrder(order).then(response=>{
            const resource=response.data;
            const newOrder=OrdersAssembler.toEntityFromResource(resource);
            purchaseOrders.value.push(newOrder);
        }).catch(error=>{
            errors.value.push(error);
        });
    }

    /**
     * Updates a purchase order through infrastructure and replaces it in local state.
     *
     * @param {import('../domain/model/orders.entity.js').Orders} order - Purchase order entity to update.
     * @returns {void}
     */
    function updatePurchaseOrders(order){
        supplierManagementApi.updateOrder(order).then(response=> {
            const resource=response.data;
            const updatedOrder=OrdersAssembler.toEntityFromResource(resource);
            const index=purchaseOrders.value.findIndex(o=>o['id']===updatedOrder.id);
            if(index !== -1){
                purchaseOrders.value[index]=updatedOrder;
            }
        }).catch(error=>{
            errors.value.push(error);
        });
    }

    /**
     * Deletes a purchase order through infrastructure and removes it from local state.
     *
     * @param {string|number} id - Purchase order identifier.
     * @returns {void}
     */
    function deletePurchaseOrders(id){
        supplierManagementApi.deleteOrder(id).then(response=>{
            const index=purchaseOrders.value.findIndex(o=>o['id']===id);
            if(index !== -1){
                purchaseOrders.value.splice(index,1);
            }
        }).catch(error=>{
            errors.value.push(error);
        })
    }

    return{
        purchaseOrders,
        errors,
        purchaseOrdersLoaded,
        purchaseOrdersCount,
        fetchPurchaseOrders,
        getPurchaseOrdersById,
        addPurchaseOrders,
        updatePurchaseOrders,
        deletePurchaseOrders,
    }
});

export default useSupplierManagementStore;
