//  Copyright 2010 Scott Logic Ltd.
//  http://www.scottlogic.co.uk
//
//  This file is part of Closure Charts.
//
//  Closure Charts is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  Closure Charts is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with Closure Charts.  If not, see <http://www.gnu.org/licenses/>.

goog.provide('scottlogic.chart.rendering.AbstractGraphicalAxis');

goog.require('goog.Disposable');

/**
 * This GraphicalAxis object will contain the data representing the graphical
 * axis. It is the duty of the graphical axis to be able to convert between
 * normalized values and canvas points, it should be the only canvas that knows
 * of the context and how to convert between canvas and data.
 *
 * @extends {goog.Disposable}
 * @param {scottlogic.chart.rendering.AbstractAxis} axis
 *                                                    the underlying axis data.
 * @param {scottlogic.chart.rendering.Style} style The parent style of this
 *        style.
 * @param {!scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment} 
 *        alignment of the axis. 
 * @constructor
 */
scottlogic.chart.rendering.AbstractGraphicalAxis = function(axis, 
    style, alignment) {
  goog.Disposable.call(this);
  
  /**
   * The alignment of the axis
   *
   * @protected
   * @type {!scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment}
   */
  this.alignment = alignment;

  /**
   * The axis to draw / pull data from
   *
   * @public
   * @type {scottlogic.chart.rendering.AbstractAxis}
   */
  this.axis = axis;

  /**
   * Array storing the labels
   *
   * @public
   * @type {Array.<scottlogic.chart.rendering.Label>}
   */
  this.labels = [];
};
goog.inherits(
    scottlogic.chart.rendering.AbstractGraphicalAxis, goog.Disposable);

/**
 * Sets the alignment of the axis
 *
 * @param {!scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment} alignment The alignment to set.
 * @export
 * @public
 */
scottlogic.chart.rendering.AbstractGraphicalAxis.prototype.setAlignment =
    function(alignment) {
  this.alignment = alignment;
};

/**
 * Gets the alignment of the axis
 *
 * @return {!scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment} alignment The alignment to set.
 * @export
 * @public
 */
scottlogic.chart.rendering.AbstractGraphicalAxis.prototype.getAlignment =
    function() {
  return this.alignment;
};

/**
 * Sets the stroke of the axis
 *
 * @param {!goog.graphics.Stroke} stroke The stroke to set.
 * @export
 * @public
 */
scottlogic.chart.rendering.AbstractGraphicalAxis.prototype.setAxisStroke =
    goog.abstractMethod;

/**
 * Sets the graphics
 *
 * @param {goog.graphics.AbstractGraphics} graphics The graphics to use whilst
 *        rendering.
 * @export
 * @public
 */
scottlogic.chart.rendering.AbstractGraphicalAxis.prototype.addGraphics =
    goog.abstractMethod;

/**
 * Sets the font of the label style
 *
 * @param {!goog.graphics.Font} font The font to set.
 * @export
 * @public
 */
scottlogic.chart.rendering.AbstractGraphicalAxis.prototype.setLabelFont =
    goog.abstractMethod;

/**
 * Sets the font colour of the label style
 *
 * @param {string} fontColour The font colour to set.
 * @export
 * @public
 */
scottlogic.chart.rendering.AbstractGraphicalAxis.prototype.setLabelFontColour =
    goog.abstractMethod;

/**
 * Sets the label stroke
 *
 * @param {!goog.graphics.Stroke} stroke The stroke to set.
 * @export
 * @public
 */
scottlogic.chart.rendering.AbstractGraphicalAxis.prototype.setLabelStroke =
    goog.abstractMethod;


/**
 * If the Graphical Axis has not been intialized, this function will initialize
 * it. Either way, rebuilds the Graphical Axis.
 *
 * @private
 * @param {goog.math.Rect} boundingBox the bounding box to use when drawing the
 *        axis.
 */
scottlogic.chart.rendering.AbstractGraphicalAxis.prototype.rebuild = function(
    boundingBox) {
 
  /**
   * The bounding box of the axis.
   *
   * @protected
   * @type {goog.math.Rect}
   */
  this.boundingBox = boundingBox;

  // Reassign the beginning and ending with new bounding box
  this.assignBeginAndEnd();

  /**
   * Store the normalized minimum value (used in conversion)
   *
   * @private
   * @type {number}
   */
  this.normalizedMin_ = this.axis.normalize(this.axis.min);

  /**
   * Store the normalized maximum value (used in conversion)
   *
   * @private
   * @type {number}
   */
  this.normalizedMax_ = this.axis.normalize(this.axis.max);

  this.rebuildInternal();
};

/**
 * Redraw for axis
 * @param {goog.math.Rect} boundingBox the bounding box to use when drawing the
 *        axis.
 * @public
 * @export
 */
scottlogic.chart.rendering.AbstractGraphicalAxis.prototype.redraw = function(
	    boundingBox) {
	  this.rebuild(boundingBox);
	  this.redrawInternal();
	};

/**
 * Assigns the beginning and ending co-ordinates. Also assigns the axis length
 *
 * @protected
 */
scottlogic.chart.rendering.AbstractGraphicalAxis.prototype.assignBeginAndEnd =
    function() {
  /**
   * Length of the axis in pixels
   *
   * @protected
   * @type {number}
   */
  this.axisLength = 0;

  // Assign the beginning and ending co-ordinates of the axis
 
  if (this.alignment === scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment.BOTTOMOUTSIDE) {
	  this.begin_ = [this.boundingBox.left, this.boundingBox.top];
	  this.ending_ = [(this.boundingBox.left + this.boundingBox.width),
	                  this.boundingBox.top];
	  this.axisLength = this.ending_[0] - this.begin_[0];
  } 
  if (this.alignment === scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment.TOPINSIDE) {
	  this.begin_ = [this.boundingBox.left, this.boundingBox.top];
	  this.ending_ = [(this.boundingBox.left + this.boundingBox.width),
	                  this.boundingBox.top];
	  this.axisLength = this.ending_[0] - this.begin_[0];
  } 
  if (this.alignment === scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment.TOPOUTSIDE) {
	  this.begin_ = [this.boundingBox.left, this.boundingBox.top + this.boundingBox.height];
	  this.ending_ = [(this.boundingBox.left + this.boundingBox.width),
	                  this.boundingBox.top + this.boundingBox.height];
	  this.axisLength = this.ending_[0] - this.begin_[0];
  }
  if (this.alignment === scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment.BOTTOMINSIDE) {
	  this.begin_ = [this.boundingBox.left, this.boundingBox.top + this.boundingBox.height];
	  this.ending_ = [(this.boundingBox.left + this.boundingBox.width),
	                  this.boundingBox.top + this.boundingBox.height];
	  this.axisLength = this.ending_[0] - this.begin_[0];
  }
  if (this.alignment === scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment.RIGHTOUTSIDE) {
    this.begin_ = [this.boundingBox.left,
		       	      this.boundingBox.top];
    this.ending_ = [this.boundingBox.left,
		       	      this.boundingBox.top + this.boundingBox.height];
    this.axisLength = this.ending_[1] - this.begin_[1];
  }
  
  if (this.alignment === scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment.LEFTOUTSIDE) {
	  this.begin_ = [this.boundingBox.left + this.boundingBox.width,
	       	      this.boundingBox.top];
	  this.ending_ = [this.boundingBox.left + this.boundingBox.width,
	       	      this.boundingBox.top + this.boundingBox.height];
	  this.axisLength = this.ending_[1] - this.begin_[1];
  }
  
  if (this.alignment === scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment.RIGHTINSIDE) {
	  this.begin_ = [this.boundingBox.left + this.boundingBox.width,
		       	      this.boundingBox.top];
		  this.ending_ = [this.boundingBox.left + this.boundingBox.width,
		       	      this.boundingBox.top + this.boundingBox.height];
		  this.axisLength = this.ending_[1] - this.begin_[1];
  }
  
  if (this.alignment === scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment.LEFTINSIDE) {
	  this.begin_ = [this.boundingBox.left,
		       	      this.boundingBox.top];
	  this.ending_ = [this.boundingBox.left,
		       	      this.boundingBox.top + this.boundingBox.height];
	  this.axisLength = this.ending_[1] - this.begin_[1];
  }

};

/**
 * This performs any internal redraw, and is called when redraw
 * is called
 *
 * @protected
 */
scottlogic.chart.rendering.AbstractGraphicalAxis.prototype.redrawInternal =
    goog.abstractMethod;

/**
 * Returns the pixel size of the label width.
 *
 * @public
 * @return {number} the width in pixels.
 */
scottlogic.chart.rendering.AbstractGraphicalAxis.prototype.getLabelWidth =
    goog.abstractMethod;

/**
 * Returns the pixel size of the label height
 *
 * @public
 * @return {number} the height in pixels.
 */
scottlogic.chart.rendering.AbstractGraphicalAxis.prototype.getLabelHeight =
    goog.abstractMethod;

/**
 * Shows the Axis. Note this differs from the Axis being rendered, as when an
 * Axis is hidden, the underlying structure remains.
 * @public
 */
scottlogic.chart.rendering.AbstractGraphicalAxis.prototype.show =
    goog.abstractMethod;

/**
 * Hides the Axis. Note this differs from the Axis being rendered, as when an
 * Axis is hidden, the underlying structure remains.
 * @public
 */
scottlogic.chart.rendering.AbstractGraphicalAxis.prototype.hide =
    goog.abstractMethod;

/**
 * @public
 * @export
 * @return {boolean} if the chart is an x axis
 */
scottlogic.chart.rendering.AbstractGraphicalAxis.prototype.isXAxis =
    function() {
  return this.alignment === scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment.TOPOUTSIDE
	|| this.alignment === scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment.TOPINSIDE
	|| this.alignment === scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment.BOTTOMOUTSIDE
	|| this.alignment === scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment.BOTTOMINSIDE;
};

/**
 * @public
 * @export
 * @return {boolean} if the chart is a y axis
 */
scottlogic.chart.rendering.AbstractGraphicalAxis.prototype.isYAxis =
    function() {
  return this.alignment === scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment.RIGHTOUTSIDE
	|| this.alignment === scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment.RIGHTINSIDE
	|| this.alignment === scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment.LEFTOUTSIDE
	|| this.alignment === scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment.LEFTINSIDE;
};

/**
 * Converts a canvas point into a data point
 *
 * @public
 * @param {number} input the canvas point to convert.
 * @return {*} the data object represented.
 */
scottlogic.chart.rendering.AbstractGraphicalAxis.prototype.convertCanvasToData =
    function(
    input) {
  /** @type {number} */
  var tempMax = this.normalizedMax_ - this.normalizedMin_;

  /** @type {number} */
  var relative;

  // Get the relative value
  if (this.isXAxis()) {
    relative = (input - this.boundingBox.left) / this.axisLength;
  } else if (this.isYAxis()) {
    relative = (this.height -
            (input +
            (this.height -
            (this.boundingBox.top + this.boundingBox.height)))) /
               this.axisLength;
  } else {
    throw 'INVALID_ORIENTATION ' + this.alignment;
  }

  if (relative < 0) {
    relative = 0;
  } else if (relative > 1) {
    relative = 1;
  }

  return this.axis.denormalize(this.normalizedMin_ + (relative * tempMax));
};

/**
 * Converts an array of data points into an array of canvas points
 *
 * Applies filtering, so only the values between the min and max plus a padding
 * value are normalized, the rest have their index filled as undefined
 * @param {Array.<number>} input the points to convert.
 * @return {Array.<number>} the converted points.
 */
scottlogic.chart.rendering.AbstractGraphicalAxis.prototype.convertArray =
    function(input) {
  /** @type {Array.<number>} */
  var result = [];

  /** @type {scottlogic.chart.rendering.AbstractGraphicalAxis} */
  var that = this;

  /** @type {number} */
  var minPos = Math.abs(goog.array.binarySearch(input, this.axis.min,
      function(a, b) {
        return that.axis.compare(a, b);
      }) + 1);

  // we need to go to the one before the min position
  minPos = minPos <= 0 ? 0 : minPos - 1;

  /** @type {number} */
  var maxPos = Math.abs(goog.array.binarySearch(
      input.slice(minPos, input.length),
      this.axis.max,
      function(a, b) {
        return that.axis.compare(a, b);
      }) + 1) + minPos;

  // we need to go to the one after the max position
  maxPos = maxPos >= input.length - 1 ? input.length - 1 : maxPos + 1;

  for (var i = minPos; i <= maxPos; i++) {
    /* this will fill the array in the correct places, leaving all other
     * values as undefined */
    result[i] = this.convert(input[i]);
  }

  return result;
};

/**
 * Converts a data point into a canvas point
 *
 * @public
 * @param {*} input the point to convert.
 * @return {number} the converted point.
 */
scottlogic.chart.rendering.AbstractGraphicalAxis.prototype.convert = function(
    input) {
  return this.convertNormalized(this.axis.normalize(input));
};

/**
 * Converts a normalized value into a relative one
 *
 * @public
 * @param {number} input the value to convert.
 * @return {number} the new co-ordinate.
 */
scottlogic.chart.rendering.AbstractGraphicalAxis.prototype.convertNormalized =
    function(input) {
  /** @type {number} */
  var tempMax = this.normalizedMax_ - this.normalizedMin_;

  /** @type {number} */
  var tempVal = input - this.normalizedMin_;

  // finally get a value between 0 and 1 which is the relative position
  input = tempVal / tempMax;

  // Now convert relative position into a canvas point
  if (this.isXAxis()) {
    return Math.floor(
        (this.axisLength * input) + this.boundingBox.left);
  } else if (this.isYAxis()) {
    return Math
        .floor((this.height -
               (this.axisLength * input)) -
               (this.height -
               (this.boundingBox.top + this.boundingBox.height)));
  } else {
    // Throw an exception if an unrecognised orientation appears
    throw 'INVALID_ORIENTATION ' + this.alignment;
  }
};

/**
 * @inheritDoc
 * @protected
 */
scottlogic.chart.rendering.AbstractGraphicalAxis.prototype.disposeInternal =
    function() {
  scottlogic.chart.rendering.AbstractGraphicalAxis.superClass_.disposeInternal
      .call(this);
};

/**
 * Enumerated type to represent axis alignment.
 *
 * @enum {number}
 */
scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment = {
  TOPOUTSIDE: 0,
  TOPINSIDE: 1,
  RIGHTOUTSIDE: 2,
  RIGHTINSIDE: 3,
  BOTTOMOUTSIDE: 4,
  BOTTOMINSIDE: 5,
  LEFTOUTSIDE: 6,
  LEFTINSIDE: 7
};
