import {defineStore} from "pinia";
import {computed, ref} from "vue";
import { SupplyManagementApi } from "../infrastructure/supply-management-api.js";
import {OrdersAssembler} from "../infrastructure/orders.assembler.js";
import {CatalogItemAssembler} from "../infrastructure/catalog-item.assembler.js";
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

    // ── Catalog Supplier section ──────────────────────────────────────────────
    // State and use cases for the supplier's product catalog (CatalogItem aggregate).

    const catalogItems = ref([]);
    const catalogItemsLoaded = ref(false);

    /**
     * Number of loaded catalog items.
     *
     * @type {import('vue').ComputedRef<number>}
     */
    const catalogItemsCount =
        computed(()=> catalogItemsLoaded.value ? catalogItems.value.length : 0);

    /**
     * Loads the supplier's catalog items from infrastructure and updates local state.
     *
     * @returns {void}
     */
    function fetchCatalogItems(){
        supplierManagementApi.getCatalogItems().then(response=>{
            catalogItems.value = CatalogItemAssembler.toEntitiesFromResponse(response);
            catalogItemsLoaded.value = true;
        }).catch(error=>{
            errors.value.push(error);
        });
    }

    /**
     * Finds a catalog item by its identifier from the local state.
     *
     * @param {string|number} id - Catalog item identifier.
     * @returns {import('../domain/model/catalog-item.entity.js').CatalogItem|undefined}
     */
    function getCatalogItemById(id){
        let idNum = parseInt(id);
        return catalogItems.value.find(item => item['id'] === idNum);
    }

    /**
     * Creates a catalog item through infrastructure and appends it to local state.
     *
     * @param {import('../domain/model/catalog-item.entity.js').CatalogItem} item - Catalog item entity to persist.
     * @returns {void}
     */
    function addCatalogItem(item){
        supplierManagementApi.createCatalogItem(item).then(response=>{
            const resource = response.data;
            const newItem = CatalogItemAssembler.toEntityFromResource(resource);
            catalogItems.value.push(newItem);
        }).catch(error=>{
            errors.value.push(error);
        });
    }

    /**
     * Updates a catalog item through infrastructure and replaces it in local state.
     *
     * @param {import('../domain/model/catalog-item.entity.js').CatalogItem} item - Catalog item entity to update.
     * @returns {void}
     */
    function updateCatalogItem(item){
        supplierManagementApi.updateCatalogItem(item.id, item).then(response=>{
            const resource = response.data;
            const updatedItem = CatalogItemAssembler.toEntityFromResource(resource);
            const index = catalogItems.value.findIndex(i => i['id'] === updatedItem.id);
            if(index !== -1){
                catalogItems.value[index] = updatedItem;
            }
        }).catch(error=>{
            errors.value.push(error);
        });
    }

    /**
     * Deletes a catalog item through infrastructure and removes it from local state.
     *
     * @param {string|number} id - Catalog item identifier.
     * @returns {void}
     */
    function deleteCatalogItem(id){
        supplierManagementApi.deleteCatalogItem(id).then(()=>{
            const index = catalogItems.value.findIndex(i => i['id'] === id);
            if(index !== -1){
                catalogItems.value.splice(index, 1);
            }
        }).catch(error=>{
            errors.value.push(error);
        });
    }
    // ── End Catalog Supplier section ──────────────────────────────────────────

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
        // ── Catalog Supplier exports ──
        catalogItems,
        catalogItemsLoaded,
        catalogItemsCount,
        fetchCatalogItems,
        getCatalogItemById,
        addCatalogItem,
        updateCatalogItem,
        deleteCatalogItem,
    }
});

export default useSupplierManagementStore;
