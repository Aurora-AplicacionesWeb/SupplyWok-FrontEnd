/**
 * Reusable infrastructure endpoint adapter with CRUD operations.
 *
 * @class BaseEndpoint
 */
export class BaseEndpoint {
    /**
     * @param {import('./base-api.js').BaseApi} baseApi - Base API adapter exposing the HTTP client.
     * @param {string} endpointPath - Relative endpoint path.
     */
    constructor(baseApi, endpointPath) {
        this.http = baseApi.http;
        this.endpointPath = endpointPath;
    }

    /**
     * Retrieves a collection resource from the endpoint.
     *
     * @returns {Promise<import('axios').AxiosResponse<Array<Object>|Object>>}
     */
    getAll() {
        return this.http.get(this.endpointPath);
    }

    /**
     * Creates a new resource.
     *
     * @param {Object} resource - Resource payload.
     * @returns {Promise<import('axios').AxiosResponse<Object>>}
     */
    create(resource) {
        return this.http.post(this.endpointPath, resource);
    }
}