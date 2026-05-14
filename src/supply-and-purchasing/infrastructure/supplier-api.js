import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const suppliersEndpointPath = import.meta.env.VITE_SUPPLIERS_ENDPOINT_PATH ?? '';

export class SupplierApi extends BaseApi {
    #suppliersEndpoint;

    constructor() {
        super();
        this.#suppliersEndpoint = new BaseEndpoint(this, suppliersEndpointPath);
    }

    getSuppliers() {
        return this.#suppliersEndpoint.getAll();
    }
}
