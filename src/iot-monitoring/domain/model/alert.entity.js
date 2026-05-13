import { Sensor } from './sensor.entity.js';

/**
 * Represents a business alert generated from a sensor reading.
 */
export class Alert {
  /**
   * Creates an instance of Alert.
   * @param {Object} alert - The raw alert data or properties.
   */
  constructor(alert) {
    this._id = alert.id;
    this._sensorId = alert.sensorId;
    this._titleKey = alert.titleKey;
    this._messageKey = alert.messageKey;
    this._messageParams = alert.messageParams || {};
    this._severity = alert.severity;
    this._timestamp = alert.timestamp;
    this._status = alert.status || 'Open';
    this._source = alert.source || 'Unknown';
  }

  get id() { return this._id; }
  set id(value) { this._id = value; }

  get sensorId() { return this._sensorId; }
  set sensorId(value) { this._sensorId = value; }

  get titleKey() { return this._titleKey; }
  get messageKey() { return this._messageKey; }
  get messageParams() { return this._messageParams; }

  get title() { return this._titleKey; }
  get message() { return this._messageKey; }

  get severity() { return this._severity; }
  set severity(value) { this._severity = value; }

  get timestamp() { return this._timestamp; }
  set timestamp(value) { this._timestamp = value; }

  get status() { return this._status; }
  set status(value) { this._status = value; }

  get source() { return this._source; }
  set source(value) { this._source = value; }

  /**
   * Marks the alert as resolved.
   */
  resolve() {
    this._status = 'Resolved';
  }

  /**
   * Marks the alert as acknowledged.
   */
  acknowledge() {
    this._status = 'Acknowledged';
  }

  /**
   * Factory method to generate an Alert if a Sensor reading is out of bounds.
   * @param {Sensor} sensor - The sensor to evaluate.
   * @returns {Alert|null} - An Alert instance or null if no alert is needed.
   */
  static fromSensor(sensor) {
    if (!sensor.enabled) return null;

    const now = new Date();

    // Temperature Alerts (Kitchen/Storage)
    if (sensor.type === 'kitchen-temperature' || sensor.type === 'storage-temperature') {
      if (sensor.lastValue > sensor.maxValue || sensor.lastValue < sensor.minValue) {
        const isColdStorage = sensor.type === 'storage-temperature';
        const titleKey = isColdStorage ? 'iot.alerts.cold-storage-breach-title' : 'iot.alerts.kitchen-temp-breach-title';
        const messageKey = sensor.lastValue > sensor.maxValue ? 'iot.alerts.temp-exceeded-msg' : 'iot.alerts.temp-dropped-msg';
        
        return new Alert({
          id: parseInt(`${sensor.id}${now.getTime().toString().slice(-4)}`, 10),
          sensorId: sensor.id,
          titleKey: titleKey,
          messageKey: messageKey,
          messageParams: {
            sensorName: sensor.name,
            lastValue: sensor.lastValue,
            minValue: sensor.minValue,
            maxValue: sensor.maxValue
          },
          severity: isColdStorage ? 'Critical' : 'Low',
          source: isColdStorage ? 'Storage sensor' : 'Kitchen sensor',
          timestamp: now,
          status: 'Open'
        });
      }
    }

    // Low Stock Alerts (Pressure)
    if (sensor.type === 'storage-pressure') {
      if (sensor.lastValue <= sensor.minValue) {
        return new Alert({
          id: parseInt(`${sensor.id}${now.getTime().toString().slice(-4)}`, 10),
          sensorId: sensor.id,
          titleKey: 'iot.alerts.low-stock-title',
          messageKey: 'iot.alerts.low-stock-msg',
          messageParams: {
            sensorName: sensor.name,
            lastValue: sensor.lastValue,
            minValue: sensor.minValue
          },
          severity: 'High',
          source: 'Inventory sensor',
          timestamp: now,
          status: 'Open'
        });
      }
    }

    // Occupancy Alerts (Table pressure)
    if (sensor.type === 'table-pressure') {
       if (sensor.lastValue >= sensor.maxValue * 0.9 && sensor.maxValue > 0) {
          return new Alert({
            id: parseInt(`${sensor.id}${now.getTime().toString().slice(-4)}`, 10),
            sensorId: sensor.id,
            titleKey: 'iot.alerts.high-occupancy-title',
            messageKey: 'iot.alerts.high-occupancy-msg',
            messageParams: {
              sensorName: sensor.name,
              lastValue: sensor.lastValue
            },
            severity: 'Medium',
            source: 'Dining Room sensor',
            timestamp: now,
            status: 'Open'
          });
       }
    }

    return null;
  }
}
