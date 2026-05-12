import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Alert } from '../../domain/model/alert.entity.js';
import { IotMonitoringApi } from '../../infrastructure/api/iot-monitoring.api.js';

export const useIotStore = defineStore('iot', () => {
  const api = new IotMonitoringApi();

  const sensors = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Computed properties
  const sensorsCount = computed(() => sensors.value.length);

  const activeAlerts = computed(() => {
    const alerts = [];
    for (const sensor of sensors.value) {
      const alert = Alert.fromSensor(sensor);
      if (alert) {
        alerts.push(alert);
      }
    }
    // Sort by severity (Critical first) then timestamp
    return alerts.sort((a, b) => {
      if (a.severity === 'Critical' && b.severity !== 'Critical') return -1;
      if (a.severity !== 'Critical' && b.severity === 'Critical') return 1;
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  });

  const recentAlerts = computed(() => {
    const alerts = [...activeAlerts.value];
    return alerts
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 3);
  });

  const topCriticalAlerts = computed(() => {
    return activeAlerts.value.slice(0, 5);
  });

  const lowStockStorageCount = computed(() => {
    const storage = sensors.value.filter(s => s.type === 'storage-pressure');
    if (storage.length === 0) return 0;
    return storage.filter(s => s.lastValue <= s.minValue).length;
  });

  const outOfRangeTemperatureCount = computed(() => {
    const tempSensors = sensors.value.filter(
      s => s.type === 'kitchen-temperature' || s.type === 'storage-temperature'
    );
    if (tempSensors.length === 0) return 0;
    return tempSensors.filter(
      s => s.lastValue > s.maxValue || s.lastValue < s.minValue
    ).length;
  });

  const averageKitchenTemperature = computed(() => {
    const active = sensors.value.filter(
      s => s.type === 'kitchen-temperature' && s.enabled
    );
    if (active.length === 0) return null;
    const sum = active.reduce((acc, s) => acc + s.lastValue, 0);
    return Math.round((sum / active.length) * 10) / 10;
  });

  const averageStorageTemperature = computed(() => {
    const active = sensors.value.filter(
      s => s.type === 'storage-temperature' && s.enabled
    );
    if (active.length === 0) return null;
    const sum = active.reduce((acc, s) => acc + s.lastValue, 0);
    return Math.round((sum / active.length) * 10) / 10;
  });

  const occupiedTablePercentage = computed(() => {
    const tables = sensors.value.filter(s => s.type === 'table-pressure');
    if (tables.length === 0) return null;
    const occupied = tables.filter(s => s.lastValue > s.minValue).length;
    return Math.round((occupied / tables.length) * 100);
  });

  // Actions
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

  const getSensorById = (id) => {
    return computed(() => id ? sensors.value.find(sensor => sensor.id === id) : undefined);
  };

  // The following mock API methods since IotMonitoringApi might not implement create/update/delete yet
  const addSensor = async (sensor) => {
    // Mock implementation for API without real endpoint
    loading.value = true;
    error.value = null;
    try {
      // await api.createSensor(sensor);
      sensors.value.push(sensor);
    } catch (err) {
      error.value = formatError(err, 'Failed to create sensor');
    } finally {
      loading.value = false;
    }
  };

  const updateSensor = async (updatedSensor) => {
    loading.value = true;
    error.value = null;
    try {
      // await api.updateSensor(updatedSensor);
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

  const deleteSensor = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      // await api.deleteSensor(id);
      sensors.value = sensors.value.filter(s => s.id !== id);
    } catch (err) {
      error.value = formatError(err, 'Failed to delete sensor');
    } finally {
      loading.value = false;
    }
  };

  const formatError = (err, fallback) => {
    if (err instanceof Error) {
      return err.message.includes('Resource not found') ? `${fallback}: Not found` : err.message;
    }
    return fallback;
  };

  // Initialize store by loading sensors
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
