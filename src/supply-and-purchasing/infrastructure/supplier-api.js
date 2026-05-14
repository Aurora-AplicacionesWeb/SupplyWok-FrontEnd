import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const suppliersEndpointPath = import.meta.env.VITE_SUPPLIERS_ENDPOINT_PATH ?? '';
const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';

const mockSuppliers = [
    { id: 201, name: 'Golden Wok Produce', contactName: 'Mariela Soto', phone: '+51 999 111 222', category: 'Grains and pantry' },
    { id: 202, name: 'Andes Cold Chain', contactName: 'Luis Cardenas', phone: '+51 999 333 444', category: 'Cold products' },
    { id: 203, name: 'Orient Pantry Co.', contactName: 'Zhen Liu', phone: '+51 999 555 666', category: 'Asian sauces and oils' }
];

/**
 * Infrastructure adapter for supplier directory endpoints.
 * Falls back to local records so the directory and order form stay usable in frontend-first mode.
 */
export class SupplierApi extends BaseApi {
    /** @type {BaseEndpoint|null} */
    #suppliersEndpoint;

    constructor() {
        super();
        this.#suppliersEndpoint = suppliersEndpointPath && !useMockApi
            ? new BaseEndpoint(this, suppliersEndpointPath)
            : null;
    }

    /**
     * Retrieves suppliers from the configured endpoint or from the local fallback collection.
     *
     * @returns {Promise<import('axios').AxiosResponse<Array<Object>|{suppliers:Array<Object>}>>}
     */
    getSuppliers() {
        if (this.#suppliersEndpoint) {
            return this.#suppliersEndpoint.getAll().catch((error) => {
                console.warn('Remote suppliers API unavailable, using local fallback.', error);
                return {
                    status: 200,
                    statusText: 'OK',
                    data: { suppliers: mockSuppliers }
                };
            });
        }

        return Promise.resolve({
            status: 200,
            statusText: 'OK',
            data: { suppliers: mockSuppliers }
        });
    }
}
