export class Sensor {
  constructor(sensor) {
    this._id = sensor.id;
    this._name = sensor.name;
    this._minValue = sensor.minValue;
    this._maxValue = sensor.maxValue;
    this._enabled = sensor.enabled;
    this._lastValue = sensor.lastValue;
    this._type = sensor.type;
  }

  get id() { return this._id; }
  set id(value) { this._id = value; }

  get name() { return this._name; }
  set name(value) { this._name = value; }

  get minValue() { return this._minValue; }
  set minValue(value) { this._minValue = value; }

  get maxValue() { return this._maxValue; }
  set maxValue(value) { this._maxValue = value; }

  get enabled() { return this._enabled; }
  set enabled(value) { this._enabled = value; }

  get lastValue() { return this._lastValue; }
  set lastValue(value) { this._lastValue = value; }

  get type() { return this._type; }
  set type(value) { this._type = value; }
}
