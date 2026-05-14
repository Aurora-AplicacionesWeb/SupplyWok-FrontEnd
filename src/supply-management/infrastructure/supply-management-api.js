import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const ordersEndpointPath = import.meta.env.VITE_PURCHASE_ORDERS_ENDPOINT_PATH;
const catalogItemsEndpointPath = import.meta.env.VITE_CATALOG_ITEMS_ENDPOINT_PATH;
const clientsEndpointPath = import.meta.env.VITE_CLIENTS_ENDPOINT_PATH;
const alertsEndpointPath = import.meta.env.VITE_ALERTS_ENDPOINT_PATH;
const demandForecastsEndpointPath = import.meta.env.VITE_DEMAND_FORECASTS_ENDPOINT_PATH;
const deliveryRoutesEndpointPath = import.meta.env.VITE_DELIVERY_ROUTES_ENDPOINT_PATH;
const supplierSettingsEndpointPath = import.meta.env.VITE_SUPPLIER_SETTINGS_ENDPOINT_PATH;
const supplierSubscriptionsEndpointPath = import.meta.env.VITE_SUPPLIER_SUBSCRIPTIONS_ENDPOINT_PATH;

export class SupplyManagementApi extends BaseApi {
    #supplyManagementEndpoint;
    #catalogItemsEndpoint;
    #clientsEndpoint;
    #alertsEndpoint;
    #demandForecastsEndpoint;
    #deliveryRoutesEndpoint;
    #supplierSettingsEndpoint;
    #supplierSubscriptionsEndpoint;
    constructor(){
        super();
        this.#supplyManagementEndpoint= new BaseEndpoint(this,ordersEndpointPath);
        this.#catalogItemsEndpoint= new BaseEndpoint(this,catalogItemsEndpointPath);
        this.#clientsEndpoint= new BaseEndpoint(this,clientsEndpointPath);
        this.#alertsEndpoint= new BaseEndpoint(this,alertsEndpointPath);
        this.#demandForecastsEndpoint= new BaseEndpoint(this,demandForecastsEndpointPath);
        this.#deliveryRoutesEndpoint= new BaseEndpoint(this,deliveryRoutesEndpointPath);
        this.#supplierSettingsEndpoint= new BaseEndpoint(this,supplierSettingsEndpointPath);
        this.#supplierSubscriptionsEndpoint= new BaseEndpoint(this,supplierSubscriptionsEndpointPath);
    }
    getOrders(){
        return this.#supplyManagementEndpoint.getAll();
    }
    getOrderById(id){
        return this.#supplyManagementEndpoint.getById(id);
    }
    createOrder(order){
        return this.#supplyManagementEndpoint.create(order);
    }
    updateOrder(id,order){
        return this.#supplyManagementEndpoint.update(id,order);
    }
    deleteOrder(id){
        return this.#supplyManagementEndpoint.delete(id);
    }
    getOrderItems(id){
        return this.#supplyManagementEndpoint.getById(id);
    }

    // ── Catalog Supplier section ──────────────────────────────────────────────
    // Endpoints for the supplier's product catalog (CatalogItem aggregate).
    getCatalogItems(){
        return this.#catalogItemsEndpoint.getAll();
    }
    getCatalogItemById(id){
        return this.#catalogItemsEndpoint.getById(id);
    }
    createCatalogItem(item){
        return this.#catalogItemsEndpoint.create(item);
    }
    updateCatalogItem(id,item){
        return this.#catalogItemsEndpoint.update(id,item);
    }
    deleteCatalogItem(id){
        return this.#catalogItemsEndpoint.delete(id);
    }
    // ── End Catalog Supplier section ──────────────────────────────────────────

    getClients(){
        return this.#clientsEndpoint.getAll();
    }

    getAlerts(){
        return this.#alertsEndpoint.getAll();
    }

    updateAlert(id, alert){
        return this.#alertsEndpoint.update(id, alert);
    }

    getDemandForecast(){
        return this.#demandForecastsEndpoint.getAll();
    }

    getDeliveryRoutes(){
        return this.#deliveryRoutesEndpoint.getAll();
    }

    getSupplierSettings(){
        return this.#supplierSettingsEndpoint.getAll();
    }

    updateSupplierSettings(id, settings){
        return this.#supplierSettingsEndpoint.update(id, settings);
    }

    getSupplierSubscription(){
        return this.#supplierSubscriptionsEndpoint.getAll();
    }
}
