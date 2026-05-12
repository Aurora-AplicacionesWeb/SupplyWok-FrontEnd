import { IotMonitoringRepository } from '../../domain/repositories/iot-monitoring.repository.js';
import { Sensor } from '../../domain/model/sensor.entity.js';

export class IotMonitoringApi extends IotMonitoringRepository {
  constructor() {
    super();
    this.baseUrl = import.meta.env.VITE_SUPPLY_WOK_API_URL || 'http://localhost:3000/api/v1';
    this.endpoint = import.meta.env.VITE_IOT_SENSORS_ENDPOINT_PATH || '/sensors';
  }

  async _fetchData(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    return response.json();
  }

  async getSensors() {
    try {
      const data = await this._fetchData(`${this.baseUrl}${this.endpoint}`);
      // Asumiendo que la API devuelve un array de sensores directamente, o anidado en data.sensors
      const sensorsArray = Array.isArray(data) ? data : (data.sensors || []);
      return sensorsArray.map(sensorData => new Sensor(sensorData));
    } catch (error) {
      console.error('Failed to get sensors:', error);
      return [];
    }
  }

  async _getSensorsByType(type) {
    const sensors = await this.getSensors();
    return sensors.filter(sensor => sensor.type === type);
  }

  async getKitchenTemperatureSensors() {
    return this._getSensorsByType('kitchen-temperature');
  }

  async getStorageTemperatureSensors() {
    return this._getSensorsByType('storage-temperature');
  }

  async getTablePressureSensors() {
    return this._getSensorsByType('table-pressure');
  }

  async getStoragePressureSensors() {
    return this._getSensorsByType('storage-pressure');
  }
}
