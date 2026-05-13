import { UserAssembler } from './assemblers/user.assembler.js';

/**
 * Service class responsible for interacting with the IAM/Users API.
 */
export class IamApi {
  constructor() {
    this.baseUrl = import.meta.env.VITE_SUPPLYWOK_API_URL || 'http://localhost:3000/api/v1';
    this.endpoint = import.meta.env.VITE_SUPPLYWOK_API_USERS_ENDPOINT_PATH || '/supplywok/users';
  }

  /**
   * Internal helper to fetch JSON data.
   * @private
   */
  async _fetchData(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Retrieves all users from the API.
   * @returns {Promise<User[]>}
   */
  async getUsers() {
    try {
      const data = await this._fetchData(`${this.baseUrl}${this.endpoint}`);
      return UserAssembler.toEntitiesFromResponse(data);
    } catch (error) {
      console.error('Failed to get users:', error);
      return [];
    }
  }

  /**
   * Creates a new user in the system.
   * @param {User} userEntity The user entity to persist.
   * @returns {Promise<User|null>} The created user or null if failed.
   */
  async createUser(userEntity) {
    try {
      const resource = UserAssembler.toResourceFromEntity(userEntity);
      const data = await this._fetchData(`${this.baseUrl}${this.endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resource),
      });
      return UserAssembler.toEntityFromResource(data);
    } catch (error) {
      console.error('Failed to create user:', error);
      return null;
    }
  }
}
