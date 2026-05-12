import axios from 'axios';

const platformApi = import.meta.env.VITE_SUPPLY_WOK_API_URL ?? '';

/**
 * Shared infrastructure base class that owns the configured Axios client.
 *
 * @class BaseApi
 */
export class BaseApi {
    /** @type {import('axios').AxiosInstance} */
    #http;

    /** Initializes the shared Axios client with environment-driven configuration. */
    constructor() {
        this.#http = axios.create({
            baseURL: platformApi,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }

    /**
     * Axios client used by infrastructure endpoint adapters.
     *
     * @returns {import('axios').AxiosInstance}
     */
    get http() {
        return this.#http;
    }
}