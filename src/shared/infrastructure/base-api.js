import axios from "axios";

const platformApi = import.meta.env.VITE_SUPPLY_WOK_API_URLi;

/**
 * Shared infrastructure base class that owns the configured Axios client.
 * Bounded-context adapters extend this class to access a consistent HTTP gateway.
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
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        });
    }

    /**
     * Axios client used by infrastructure endpoint adapters.
     * @returns {import('axios').AxiosInstance}
     */
    get http() {
        return this.#http;
    }
}