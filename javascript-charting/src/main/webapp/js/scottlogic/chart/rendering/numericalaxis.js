goog.provide('scottlogic.chart.rendering.NumericalAxis');

goog.require('scottlogic.chart.rendering.AbstractAxis');

/**
 * @inheritDoc
 * @extends {scottlogic.chart.rendering.AbstractAxis}
 * @constructor
 */
scottlogic.chart.rendering.NumericalAxis = function() {
  scottlogic.chart.rendering.AbstractAxis.call(this);

  // Set some default values for the min and max
  /**
   * @type {number}
   * @public
   */
  this.min = 0;

  /**
   * @type {number}
   * @public
   */
  this.max = 1;
};
goog.inherits(scottlogic.chart.rendering.NumericalAxis,
    scottlogic.chart.rendering.AbstractAxis);

/**
 * Rounds down to two decimal places.
 *
 * @inheritDoc
 */
scottlogic.chart.rendering.NumericalAxis.prototype.setIntervalStep = function(
    input) {
  /**
   * The effective interval step, which is based on the number of labels and the
   * minimum and maximum
   *
   * @type {number}
   */
  var effectiveIntervalStep = (this.max - this.min) / input;

  /**
   * Next lowest is what is considered the next ideal value. This is used to
   * calculate how many decimal places the interval step should go to.
   *
   * So if the range is 1000, nextLowest will be 100, meaning that the interval
   * would be rounded to the nearest hundred.
   *
   * @type {number}
   */
  var nextLowest = Math.abs(this.max - this.min) / 10;

  /**
   * Calculates the position of the first significant digit, relative to the
   * decimal point. So 1000.0 would return -4, and 0.1 would return 1.
   *
   * This allows us round the input to the correct number of decimal places.
   *
   * @type {number}
   */
  var position = 0;

  // Inverted powers of 10 are needed for values less than 1
  if (nextLowest < 1) {
    for (var i = nextLowest; i < 1; i = i * 10) {
      position++;
    }
  } else {
    for (var j = nextLowest; j >= 10; j = j / 10) {
      position--;
    }
  }

  // Finally round the proposed interval step by the correct value computed
  // above.
  this.intervalStep = Math.ceil(
      effectiveIntervalStep * Math.pow(10, position)) / Math.pow(10, position);
};

/**
 * @override
 */
scottlogic.chart.rendering.NumericalAxis.prototype.denormalize =
    function(input) {
  // default is the input
  return input;
};

/**
 * @override
 */
scottlogic.chart.rendering.NumericalAxis.prototype.estimateWidestLabel =
    function() {
  // default is the maximum, as a negative number
  return this.normalize(this.max) * -10.1;
};

/**
 * @override
 */
scottlogic.chart.rendering.NumericalAxis.prototype.initializeInternal =
    goog.nullFunction;

/**
 * @override
 */
scottlogic.chart.rendering.NumericalAxis.prototype.normalize = function(input) {
  return Number(input);
};

/**
 * @override
 */
scottlogic.chart.rendering.NumericalAxis.prototype.getFirstLabelTick =
    function() {
  return this.normalize(this.min);
};

/**
 * @override
 */
scottlogic.chart.rendering.NumericalAxis.prototype.increment = function(input) {
  // default is just adding the interval step
  return input + this.intervalStep;
};

/**
 * @override
 */
scottlogic.chart.rendering.NumericalAxis.prototype.getFirstLabelTick =
    function() {
  return (Math.ceil(this.min / this.intervalStep) * this.intervalStep);
};


/**
 * @override
 */
scottlogic.chart.rendering.NumericalAxis.prototype.padLeft =
    function(obj, opt_rangeMin, opt_rangeMax) {
  /** @type {number} */
  var range = (opt_rangeMax && opt_rangeMin) ?
      /** @type {number} */ (opt_rangeMax) -
      /** @type {number} */ (opt_rangeMin) : this.max - this.min;

  return /** @type {number} */ (obj) + (range * 0.05);
};

/**
 * @override
 */
scottlogic.chart.rendering.NumericalAxis.prototype.padRight =
    function(obj, opt_rangeMin, opt_rangeMax) {
  /** @type {number} */
  var range = (opt_rangeMax && opt_rangeMin) ?
      /** @type {number} */ (opt_rangeMax) -
      /** @type {number} */ (opt_rangeMin) : this.max - this.min;

  return /** @type {number} */ (obj) - (range * 0.05);
};

/**
 * @override
 */
scottlogic.chart.rendering.NumericalAxis.prototype.compare = function(
    obj1, obj2) {
  if (obj1 > obj2) {
    return 1;
  } else if (obj2 > obj1) {
    return -1;
  } else {
    return 0;
  }
};
