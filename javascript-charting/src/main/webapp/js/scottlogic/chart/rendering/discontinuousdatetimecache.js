goog.provide('scottlogic.chart.rendering.DiscontinuousDateTimeCache');

goog.require('goog.date.UtcDateTime');

/**
 * Provides a cache object to store DateTime's and their discontinuous ms
 * @param {scottlogic.chart.rendering.AbstractAxis} axis the axis to use.
 * @constructor
 */
scottlogic.chart.rendering.DiscontinuousDateTimeCache = function(axis) {
  /**
   * Keys, which should be the ms of each date from 1970
   * @type {Array.<number>}
   * @private
   */
  this.keys_ = [];

  /**
   * Values, which should be the working ms of each date in the keys_
   * @type {Array.<number>}
   * @private
   */
  this.vals_ = [];

  /**
   * The axis the cache is for
   * @type {scottlogic.chart.rendering.AbstractAxis}
   * @private
   */
  this.axis_ = axis;
};

/**
 * Generates the values for the cache
 * @public
 */
scottlogic.chart.rendering.DiscontinuousDateTimeCache.prototype.generate =
    function() {
  /** @type {goog.date.UtcDateTime} */
  var currentDate = new goog.date.UtcDateTime(2007, goog.date.month.JAN, 1,
      this.axis_.getStartOfHours().getHours(),
      this.axis_.getStartOfHours().getMinutes(),
      this.axis_.getStartOfHours().getSeconds());

  /** @type {goog.date.UtcDateTime} */
  var currentVal = this.axis_.normalizeFrom_(currentDate,
      new goog.date.UtcDateTime(new Date(0)));

  /** @type {goog.date.UtcDateTime} */
  var now = new goog.date.UtcDateTime(new Date());

  /** @type {goog.date.Interval} */
  var increment = new goog.date.Interval(0, 0, 1);

  /** @type {number} */
  var count = 0;

  while (currentDate.getTime() < now.getTime()) {
    if (!this.axis_.isWeekend(currentDate)) {
      this.keys_[count] = currentDate.getTime();
      this.vals_[count] = currentVal;
      currentVal += this.axis_.millisecondsInAWorkingDay_;
      count++;
    }

    currentDate.add(increment);
  }
};

/**
 * Returns the index of a given date
 * @param {goog.date.UtcDateTime} d the date to get the value of.
 * @return {number} index of that date.
 */
scottlogic.chart.rendering.DiscontinuousDateTimeCache.prototype.findKey =
    function(d) {
  var index = Math.abs(goog.array.binarySearch(this.keys_, d.getTime()) + 1);

  return index - 1;
};

/**
 * Returns the key at a given index (null if invalid index)
 * @param {number} i the index in which to get the value from.
 * @return {?goog.date.UtcDateTime} the date at that index, or null.
 */
scottlogic.chart.rendering.DiscontinuousDateTimeCache.prototype.getKey =
    function(i) {
  /** @type {goog.date.UtcDateTime} */
  var date = new goog.date.UtcDateTime(new Date(this.keys_[i]));

  return date || null;
};

/**
 * Returns the value at a given index (null if invalid index)
 * @param {number} i the index in which to get the value from.
 * @return {?number} the value at that index, or null.
 */
scottlogic.chart.rendering.DiscontinuousDateTimeCache.prototype.getVal =
    function(i) {
  return this.vals_[i] || null;
};

/**
 * Returns the index of a given value
 * @param {number} v the value to get the date from.
 * @return {number} the date of the start of day of the value.
 */
scottlogic.chart.rendering.DiscontinuousDateTimeCache.prototype.findVal =
    function(v) {
  var index = Math.abs(goog.array.binarySearch(this.vals_, v) + 1);

  return index - 1;
};
