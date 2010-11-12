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
 * @param {scottlogic.chart.Chart.Orientation} orientation
 * 		the orientation of the axis.
 * @param {scottlogic.chart.rendering.AbstractAxis} axis
 * 		the underlying axis data.
 * @param {scottlogic.chart.rendering.Style} style
 * 		the parent style of this style.
 * @param {scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment} alignment 
 * 		the alignment of the axis. 
 * @constructor
 */
scottlogic.chart.rendering.RenderedGraphicalAxis = function(orientation, axis,
    style, alignment) {
  scottlogic.chart.rendering.AbstractGraphicalAxis.call(this,
      orientation, axis, style, alignment);
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
  
  /**
   * The labels tick path
   *
   * @private
   * @type {goog.graphics.Path}
   */
  this.labelTicks_ = new goog.graphics.Path();

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
scottlogic.chart.rendering.RenderedGraphicalAxis.prototype.addGraphics = function (graphics) {
	/**
	   * The graphics of the object
	   *
	   * @type {goog.graphics.AbstractGraphics}
	   * @private
	   */
	this.graphics = graphics;
	/**
	   * Height of the canvas
	   *
	   * @private
	   * @type {number}
	   */
	this.height = this.graphics.getPixelSize().height;
	
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
 * Rebuild the labels for this axis.
 */
scottlogic.chart.rendering.RenderedGraphicalAxis.prototype.rebuildInternal =
    function() {

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
          this.labelStyle_, this.alignment);

      // Try to assign the zero line
      if (goog.math.nearlyEquals(Math.abs(labelValues[j]), Number(0),
          0.0000000000001)) {
        this.zeroLineLabel = this.labels[this.labels.length - 1];
      }
    } else if (this.orientation === scottlogic.chart.Chart.Orientation.Y) {
      // Create the label area. Rectangle in which to draw the label.
    	
      if (this.alignment === scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment.RIGHT) {
	      labelArea = new goog.math.Rect(
	   		  	  this.boundingBox.left ,
	   	          this.convertNormalized(labelValues[j]) - (this.labelSize_ / 2),
	   	          this.boundingBox.width, this.labelSize_);
      } else {
	      labelArea = new goog.math.Rect(
	          0,
	          this.convertNormalized(labelValues[j]) - (this.labelSize_ / 2),
	          this.boundingBox.width, this.labelSize_);
      }

      this.labels[j] = new scottlogic.chart.rendering.Label(this.axis
          .getLabel(labelValues[j]), labelArea,
          scottlogic.chart.Chart.Orientation.Y, this.tickLength,
          this.labelStyle_);

      // Try to assign the zero line
      if (goog.math.nearlyEquals(Math.abs(labelValues[j]), Number(0),
          0.0000000000001)) {
        this.zeroLineLabel = this.labels[this.labels.length - 1];
      }

    } else {
      throw 'INVALID_ORIENTATION ' + this.orientation;
    }
  }

  //

};

/**
 * Performs just a redraw of the axis and of the labels. 
 * @override
 */

scottlogic.chart.rendering.RenderedGraphicalAxis.prototype.redrawInternal = 
	function() {
		this.path_.clear();
		this.labelTicks_.clear();
		this.path_.moveTo(this.begin_[0], this.begin_[1]);
		// Draw just one line to the end of the path
		this.path_.lineTo(this.ending_[0], this.ending_[1]);
		this.drawnPath_.setPath(this.path_);
		
		// now draw the labels and ticks
		for (var k = 0; k < this.labels.length; k++) {
		    // Draw the label
		    this.labels[k].addGraphics(this.graphics);
		    var labelArea = this.labels[k].getLabelArea();
		    //draw tick for label
		    if (this.orientation === scottlogic.chart.Chart.Orientation.X) {
		    	if (this.alignment === scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment.BOTTOM) {
		    		this.labelTicks_.moveTo(labelArea.left + (labelArea.width / 2),
		    				labelArea.top);
		    		this.labelTicks_.lineTo(labelArea.left + (labelArea.width / 2),
		    				labelArea.top + this.tickLength);
		    	} else {
		    		this.labelTicks_.moveTo(labelArea.left + (labelArea.width / 2),
		    				labelArea.top + labelArea.height);
		    		this.labelTicks_.lineTo(labelArea.left + (labelArea.width / 2),
		    				labelArea.top + labelArea.height - this.tickLength);
		    	}
		    	
		    } else if (this.orientation === scottlogic.chart.Chart.Orientation.Y) {
		    	if (this.alignment === scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment.RIGHT) {
			      this.labelTicks_.moveTo(labelArea.left,
			        labelArea.top + (labelArea.height / 2));
	
			      this.labelTicks_.lineTo(
			        labelArea.left  + (this.tickLength),
			        labelArea.top + (labelArea.height / 2));
		    	} else {
		    	  this.labelTicks_.moveTo(labelArea.left + (labelArea.width),
		    	    labelArea.top + (labelArea.height / 2));
			
				  this.labelTicks_.lineTo(
				    (labelArea.left + labelArea.width) - (this.tickLength),
					 labelArea.top + (labelArea.height / 2));   
		    	}
		    }          
		}
		
		this.drawnLabelTicks_.setPath(this.labelTicks_);
		
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
