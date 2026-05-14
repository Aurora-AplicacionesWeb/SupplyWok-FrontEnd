import { User } from '../../domain/model/user.entity.js';

/**
 * Assembler class responsible for transforming user data between the 
 * Infrastructure layer (DTOs) and the Domain layer (Entities).
 */
export class UserAssembler {
  /**
   * Transforms an API response object into a collection of domain entities.
   * @param {Object} response The raw API response.
   * @returns {User[]} An array of User instances.
   */
  static toEntitiesFromResponse(response) {
    const usersArray = Array.isArray(response) ? response : (response.users || []);
    return usersArray.map(resource => this.toEntityFromResource(resource));
  }

  /**
   * Transforms a single API resource (DTO) into a domain entity.
   * @param {Object} resource The raw resource data from the API.
   * @returns {User} A new instance of User.
   */
  static toEntityFromResource(resource) {
    return new User({
      id: resource.id,
      email: resource.email,
      password: resource.password,
      phoneNumber: resource.phoneNumber,
      role: resource.role,
      subscription: resource.subscription,
    });
  }

  /**
   * Transforms a domain entity back into a resource format suitable for API requests.
   * @param {User} entity The domain entity to convert.
   * @returns {Object} A DTO.
   */
  static toResourceFromEntity(entity) {
    return {
      id: entity.id,
      email: entity.email,
      password: entity.password,
      phoneNumber: entity.phoneNumber,
      role: entity.role,
      subscription: entity.subscription,
    };
  }
}
