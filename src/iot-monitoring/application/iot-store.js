import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Alert } from '../domain/model/alert.entity.js';
import { IotMonitoringApi } from '../infrastructure/iot-monitoring.api.js';

/**
 * Pinia store for managing IoT Monitoring state.
 * Handles sensor data fetching, alert generation, and derived metrics.
 */
export const iotStore = defineStore('iot', () => {
  const api = new IotMonitoringApi();

  // --- State ---
  const sensors = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // --- Computed Properties (Getters) ---
  
  /** Total number of sensors registered. */
  const sensorsCount = computed(() => sensors.value.length);

  /** 
   * List of all active alerts generated from current sensor readings. 
   * Sorted by severity (Critical first) and then by timestamp (newest first).
   */
  const activeAlerts = computed(() => {
    const alerts = [];
    for (const sensor of sensors.value) {
      const alert = Alert.fromSensor(sensor);
      if (alert) {
        alerts.push(alert);
      }
    }
    return alerts.sort((a, b) => {
      if (a.severity === 'Critical' && b.severity !== 'Critical') return -1;
      if (a.severity !== 'Critical' && b.severity === 'Critical') return 1;
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  });

  /** The 3 most recent alerts for quick display. */
  const recentAlerts = computed(() => {
    const alerts = [...activeAlerts.value];
    return alerts
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 3);
  });

  /** Top 5 critical alerts for summary views. */
  const topCriticalAlerts = computed(() => {
    return activeAlerts.value.slice(0, 5);
  });

  /** Count of storage items with low stock levels. */
  const lowStockStorageCount = computed(() => {
    const storage = sensors.value.filter(s => s.type === 'storage-pressure');
    if (storage.length === 0) return 0;
    return storage.filter(s => s.lastValue <= s.minValue).length;
  });

  /** Count of sensors with readings outside of defined thresholds. */
  const outOfRangeTemperatureCount = computed(() => {
    const tempSensors = sensors.value.filter(
      s => s.type === 'kitchen-temperature' || s.type === 'storage-temperature'
    );
    if (tempSensors.length === 0) return 0;
    return tempSensors.filter(
      s => s.lastValue > s.maxValue || s.lastValue < s.minValue
    ).length;
  });

  /** Average temperature in the kitchen area. */
  const averageKitchenTemperature = computed(() => {
    const active = sensors.value.filter(
      s => s.type === 'kitchen-temperature' && s.enabled
    );
    if (active.length === 0) return null;
    const sum = active.reduce((acc, s) => acc + s.lastValue, 0);
    return Math.round((sum / active.length) * 10) / 10;
  });

  /** Average temperature in cold storage areas. */
  const averageStorageTemperature = computed(() => {
    const active = sensors.value.filter(
      s => s.type === 'storage-temperature' && s.enabled
    );
    if (active.length === 0) return null;
    const sum = active.reduce((acc, s) => acc + s.lastValue, 0);
    return Math.round((sum / active.length) * 10) / 10;
  });

  /** Percentage of tables currently occupied. */
  const occupiedTablePercentage = computed(() => {
    const tables = sensors.value.filter(s => s.type === 'table-pressure');
    if (tables.length === 0) return null;
    const occupied = tables.filter(s => s.lastValue > s.minValue).length;
    return Math.round((occupied / tables.length) * 100);
  });

  // --- Actions ---

  /** 
   * Fetches the latest sensor data from the API.
   */
  const loadSensors = async () => {
    loading.value = true;
    error.value = null;
    try {
      sensors.value = await api.getSensors();
    } catch (err) {
      error.value = formatError(err, 'Failed to load sensors');
    } finally {
      loading.value = false;
    }
  };

  /**
   * Helper to find a specific sensor by its ID.
   * @param {number} id - Sensor ID.
   */
  const getSensorById = (id) => {
    return computed(() => id ? sensors.value.find(sensor => sensor.id === id) : undefined);
  };

  /**
   * Adds a new sensor to the local state (Mock API integration).
   * @param {Object} sensor - New sensor data.
   */
  const addSensor = async (sensor) => {
    loading.value = true;
    error.value = null;
    try {
      sensors.value.push(sensor);
    } catch (err) {
      error.value = formatError(err, 'Failed to create sensor');
    } finally {
      loading.value = false;
    }
  };

  /**
   * Updates an existing sensor in the local state (Mock API integration).
   * @param {Object} updatedSensor - Updated sensor data.
   */
  const updateSensor = async (updatedSensor) => {
    loading.value = true;
    error.value = null;
    try {
      const index = sensors.value.findIndex(s => s.id === updatedSensor.id);
      if (index !== -1) {
        sensors.value.splice(index, 1, updatedSensor);
      }
    } catch (err) {
      error.value = formatError(err, 'Failed to update sensor');
    } finally {
      loading.value = false;
    }
  };

  /**
   * Deletes a sensor from the local state (Mock API integration).
   * @param {number} id - Sensor ID to remove.
   */
  const deleteSensor = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      sensors.value = sensors.value.filter(s => s.id !== id);
    } catch (err) {
      error.value = formatError(err, 'Failed to delete sensor');
    } finally {
      loading.value = false;
    }
  };

  /**
   * Formats error messages for UI display.
   * @private
   */
  const formatError = (err, fallback) => {
    if (err instanceof Error) {
      return err.message.includes('Resource not found') ? `${fallback}: Not found` : err.message;
    }
    return fallback;
  };

  // Auto-initialize store
  loadSensors();

  return {
    sensors,
    loading,
    error,
    sensorsCount,
    activeAlerts,
    recentAlerts,
    topCriticalAlerts,
    lowStockStorageCount,
    outOfRangeTemperatureCount,
    averageKitchenTemperature,
    averageStorageTemperature,
    occupiedTablePercentage,
    loadSensors,
    getSensorById,
    addSensor,
    updateSensor,
    deleteSensor
  };
});
