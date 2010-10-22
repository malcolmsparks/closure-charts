goog.provide('scottlogic.chart.rendering.RenderedGraphicalAxis');

goog.require('goog.dom');
goog.require('goog.graphics');
goog.require('goog.math');
goog.require('scottlogic.chart.rendering.AbstractGraphicalAxis');
goog.require('scottlogic.chart.rendering.Label');

/**
 * A Graphical Axis that will render itself on the Chart
 *
 * @extends {scottlogic.chart.rendering.AbstractGraphicalAxis}
 * @param {scottlogic.chart.Chart.Orientation} orientation the orientation of
 *        the axis.
 * @param {scottlogic.chart.rendering.AbstractAxis} axis
 *    the underlying axis data.
 * @param {scottlogic.chart.rendering.Style} style The parent style of this
 *        style.
 * @param {goog.graphics.AbstractGraphics} graphics The graphics to use whilst
 *        rendering.
 * @constructor
 */
scottlogic.chart.rendering.RenderedGraphicalAxis = function(orientation, axis,
    style, graphics) {
  scottlogic.chart.rendering.AbstractGraphicalAxis.call(this,
      orientation, axis, style, graphics);
  /**
   * The style of the graphical axis
   *
   * @private
   * @type {scottlogic.chart.rendering.Style}
   */
  this.style_ = new scottlogic.chart.rendering.Style(style, null, null, null);

  /**
   * The style of the label
   *
   * @private
   * @type {scottlogic.chart.rendering.Style}
   */
  this.labelStyle_ = new scottlogic.chart.rendering.Style(this.style_, null,
      null, null);

  /**
   * The length of the tick
   *
   * @public
   * @type {number}
   */
  this.tickLength = 7;

  /**
   * Beginning co-ordinate.
   *
   * @private
   * @type {Array.<number>}
   */
  this.begin_ = [];

  /**
   * Ending co-ordinate.
   *
   * @private
   * @type {Array.<number>}
   */
  this.ending_ = [];

  /**
   * Array storing the labels
   *
   * @public
   * @type {Array.<scottlogic.chart.rendering.Label>}
   */
  this.labels = [];

  /**
   * Hold the zero line label
   *
   * @public
   * @type {scottlogic.chart.rendering.Label}
   */
  this.zeroLineLabel = null;

  /**
   * Defined the size of a label. This is either the height or width, depending
   * on the axis
   *
   * @private
   * @type {number}
   */
  this.labelSize_ = 0;
};
goog.inherits(scottlogic.chart.rendering.RenderedGraphicalAxis,
    scottlogic.chart.rendering.AbstractGraphicalAxis);

/**
 * @override
 */
scottlogic.chart.rendering.RenderedGraphicalAxis.prototype.setAxisStroke =
    function(stroke) {
  this.style_.setStroke(stroke);
};

/**
 * @override
 */
scottlogic.chart.rendering.RenderedGraphicalAxis.prototype.setLabelFont =
    function(font) {
  this.labelStyle_.setFont(font);
};

/**
 * @override
 */
scottlogic.chart.rendering.RenderedGraphicalAxis.prototype.setLabelFontColour =
    function(fontColour) {
  this.labelStyle_.setFontColour(fontColour);
};

/**
 * @override
 */
scottlogic.chart.rendering.RenderedGraphicalAxis.prototype.setLabelStroke =
    function(stroke) {
  this.labelStyle_.setStroke(stroke);
};

/**
 * @override
 */
scottlogic.chart.rendering.RenderedGraphicalAxis.prototype.redrawInternal =
    function() {

  // Clear the path, and then redraw it
  this.path_.clear();
  this.labelTicks_.clear();

  this.path_.moveTo(this.begin_[0], this.begin_[1]);
  // Draw just one line to the end of the path
  this.path_.lineTo(this.ending_[0], this.ending_[1]);

  this.drawnPath_.setPath(this.path_);

  // Reset the labels
  for (var i = 0; i < this.labels.length; i++) {
    this.labels[i].dispose();
  }

  // Clear the labels store
  this.labels.length = 0;
  this.zeroLineLabel = null;

  if (this.orientation === scottlogic.chart.Chart.Orientation.X) {
    this.labelSize_ = this.getLabelWidth() * 1.1;
  } else if (this.orientation === scottlogic.chart.Chart.Orientation.Y) {
    this.labelSize_ = this.getLabelHeight() * 1.1;
  } else {
    throw 'INVALID_ORIENTATION ' + this.orientation;
  }

  // Set the interval on the axis
  this.axis.setIntervalStep(Math.floor(this.axisLength / this.labelSize_));

  /**
   * The rectangle in which to draw the label
   *
   * @type {goog.math.Rect}
   */
  var labelArea = null;

  // Start at the beginning of the axis, and finish at the end, letting the
  // axis handle incrementing

  /** @type {Array.<number>} */
  var labelValues = this.generateLabelValues_();

  for (var j = 0; j < labelValues.length; j++) {
    if (this.orientation === scottlogic.chart.Chart.Orientation.X) {
      // Create the label area. Rectangle in which to draw the label
      labelArea = new goog.math.Rect(
          this.convertNormalized(labelValues[j]) - (this.labelSize_ / 2),
          this.boundingBox.top,
          this.labelSize_,
          this.boundingBox.height);

      // Create a new label with the appropriate dimensions and add to the
      // array of Labels
      this.labels[j] = new scottlogic.chart.rendering.Label(this.axis
          .getLabel(labelValues[j]), labelArea,
          scottlogic.chart.Chart.Orientation.X, this.tickLength,
          this.labelStyle_);

      this.labelTicks_.moveTo(labelArea.left + (labelArea.width / 2),
          labelArea.top);
      this.labelTicks_.lineTo(labelArea.left + (labelArea.width / 2),
          labelArea.top + this.tickLength);

      // Try to assign the zero line
      if (goog.math.nearlyEquals(Math.abs(labelValues[j]), Number(0),
          0.0000000000001)) {
        this.zeroLineLabel = this.labels[this.labels.length - 1];
      }
    } else if (this.orientation === scottlogic.chart.Chart.Orientation.Y) {
      // Create the label area. Rectangle in which to draw the label.
      labelArea = new goog.math.Rect(
          0,
          this.convertNormalized(labelValues[j]) - (this.labelSize_ / 2),
          this.boundingBox.width, this.labelSize_);

      this.labels[j] = new scottlogic.chart.rendering.Label(this.axis
          .getLabel(labelValues[j]), labelArea,
          scottlogic.chart.Chart.Orientation.Y, this.tickLength,
          this.labelStyle_);

      this.labelTicks_.moveTo(labelArea.left + (labelArea.width),
          labelArea.top + (labelArea.height / 2));

      this.labelTicks_.lineTo(
          (labelArea.left + labelArea.width) - (this.tickLength),
          labelArea.top + (labelArea.height / 2));

      // Try to assign the zero line
      if (goog.math.nearlyEquals(Math.abs(labelValues[j]), Number(0),
          0.0000000000001)) {
        this.zeroLineLabel = this.labels[this.labels.length - 1];
      }

    } else {
      throw 'INVALID_ORIENTATION ' + this.orientation;
    }
  }

  this.drawnLabelTicks_.setPath(this.labelTicks_);

  // Draw all the labels that have been initialized
  for (var k = 0; k < this.labels.length; k++) {
    // Draw the label
    this.labels[k].redraw(this.graphics);
  }
};

/**
 * Returns an array of the normalized values of each Label
 *
 * @return {Array.<number>} the array of normalized values for each label.
 * @private
 */
scottlogic.chart.rendering.RenderedGraphicalAxis.prototype.
    generateLabelValues_ = function() {
  /** @type {Array.<number>} */
  var result = [];

  /**
     * The starting point for label creation (normalized)
     *
     * @type {number}
     */
  var labelStartingPoint = this.axis.getFirstLabelTick();

  /**
     * The ending point for label creation (normalized)
     *
     * @type {?number}
     */
  var labelEndingPoint = this.axis.normalize(this.axis.max);

  for (var i = labelStartingPoint; i <= labelEndingPoint; i = this.axis
        .increment(i)) {
    result[result.length] = i;
  }

  return result;
};

/**
 * @override
 */
scottlogic.chart.rendering.RenderedGraphicalAxis.prototype.initializeInternal =
    function() {
  /**
   * The labels tick path
   *
   * @private
   * @type {goog.graphics.Path}
   */
  this.labelTicks_ = new goog.graphics.Path();

  /**
   * The drawn path for the label ticks
   *
   * @private
   * @type {goog.graphics.PathElement}
   */
  this.drawnLabelTicks_ = this.graphics.drawPath(this.labelTicks_,
      this.style_.getStroke(), null);

  /**
     * The path that represents the axis
     *
     * @private
     * @type {goog.graphics.Path}
     */
  this.path_ = new goog.graphics.Path();

  /**
     * Create the drawn path to match the underlying path
     *
     * @private
     * @type {goog.graphics.PathElement}
     */
  this.drawnPath_ = this.graphics.drawPath(this.path_,
      this.style_.getStroke(), null);
};

/**
 * @override
 */
scottlogic.chart.rendering.RenderedGraphicalAxis.prototype.getLabelWidth =
    function() {
  /** @type {Array.<number>} */
  var labelValues = [];

  // Use the actual labels if initialized, otherwise, use the Axis to "guess"
  // what the widest String may be
  if (this.axis.intervalStep) {
    labelValues = this.generateLabelValues_();
  } else {
    labelValues = [this.axis.estimateWidestLabel()];
  }

  /** @type {number} */
  var maximum = this.graphics.getTextWidth(
      this.axis.getLabel(labelValues[0]), this.labelStyle_.getFont());

  for (var i = 1; i < labelValues.length; i++) {
    /** @type {number} */
    var current = this.graphics.getTextWidth(
        this.axis.getLabel(labelValues[i]), this.labelStyle_.getFont());

    if (current > maximum) {
      maximum = current;
    }
  }

  return maximum;
};

/**
 * @override
 */
scottlogic.chart.rendering.RenderedGraphicalAxis.prototype.getLabelHeight =
    function() {
  return this.style_.getFont().size;
};

/**
 * @override
 */
scottlogic.chart.rendering.RenderedGraphicalAxis.prototype.show = function() {
  if (this.drawnPath_) {
    this.drawnPath_.setStroke(this.style_.getStroke());
  }

  for (var i = 0; i < this.labels.length; i++) {
    this.labels[i].show();
  }
};

/**
 * @override
 */
scottlogic.chart.rendering.RenderedGraphicalAxis.prototype.hide = function() {
  if (this.drawnPath_) {
    this.drawnPath_.setStroke(new goog.graphics.Stroke(0, '#000000'));
  }

  for (var i = 0; i < this.labels.length; i++) {
    this.labels[i].hide();
  }
};

/**
 * @override
 */
scottlogic.chart.rendering.RenderedGraphicalAxis.prototype.disposeInternal =
    function() {
  scottlogic.chart.rendering.RenderedGraphicalAxis.superClass_.disposeInternal
      .call(this);

  if (this.initialized) {
    this.path_.clear();
    this.graphics.removeElement(this.drawnPath_);
    for (var i = 0; i < this.labels.length; i++) {
      this.labels[i].dispose();
    }
  }
};
