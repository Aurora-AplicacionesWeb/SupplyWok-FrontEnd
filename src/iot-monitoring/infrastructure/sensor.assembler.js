import { Sensor } from '../domain/model/sensor.entity.js';

/**
 * Assembler class responsible for transforming data between the Infrastructure layer (DTOs)
 * and the Domain layer (Entities).
 */
export class SensorAssembler {
  /**
   * Transforms an API response object into a collection of domain entities.
   * @param {Object} response The raw API response.
   * @returns {Sensor[]} An array of Sensor instances.
   */
  static toEntitiesFromResponse(response) {
    const sensorsArray = Array.isArray(response) ? response : (response.sensors || []);
    return sensorsArray.map(resource => this.toEntityFromResource(resource));
  }

  /**
   * Transforms a single API resource (DTO) into a domain entity.
   * @param {Object} resource The raw resource data from the API.
   * @returns {Sensor} A new instance of Sensor.
   */
  static toEntityFromResource(resource) {
    return new Sensor({
      id: resource.id,
      name: resource.name,
      minValue: resource.minValue,
      maxValue: resource.maxValue,
      enabled: resource.enabled,
      lastValue: resource.lastValue,
      type: resource.type,
    });
  }

  /**
   * Transforms a domain entity back into a resource format suitable for API requests.
   * @param {Sensor} entity The domain entity to convert.
   * @returns {Object} A DTO.
   */
  static toResourceFromEntity(entity) {
    return {
      id: entity.id,
      name: entity.name,
      minValue: entity.minValue,
      maxValue: entity.maxValue,
      enabled: entity.enabled,
      lastValue: entity.lastValue,
      type: entity.type,
    };
  }
}
