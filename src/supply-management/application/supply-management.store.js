import {defineStore} from "pinia";
import {computed, ref} from "vue";
import { SupplyManagementApi } from "../infrastructure/supply-management-api.js";
import {OrdersAssembler} from "../infrastructure/orders.assembler.js";
const supplierManagementApi = new supplierManagementApi();

const useSupplierManagementStore = defineStore('supplierManagement', () => {
    // state
    const errors=ref([]);
    const purchaseOrders = ref([]);
    const purchaseOrdersLoaded = ref(false);
    //getters
    const purchaseOrdersCount =
        computed(()=> purchaseOrdersLoaded ? purchaseOrders.value.length:0);
    function fetchPurchaseOrders(){
        supplierManagementApi.getOrders().then(response=>{
            purchaseOrders.value=OrdersAssembler.toEntitiesFromResponse(response);
            purchaseOrdersLoaded.value=true;
            console.log(purchaseOrders.value);
            console.log(purchaseOrdersLoaded.value);
        }).catch(error=>{
            errors.value.push(error);
        })
    }
})