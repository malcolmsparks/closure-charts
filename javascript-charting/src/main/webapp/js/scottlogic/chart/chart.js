goog.provide('scottlogic.chart.Chart');
goog.provide('scottlogic.chart.Chart.ChartClicked');
goog.provide('scottlogic.chart.Chart.Orientation');

goog.require('goog.array');
goog.require('goog.color');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.graphics');
goog.require('goog.math.Rect');
goog.require('scottlogic.chart.rendering.Context');
goog.require('scottlogic.chart.rendering.DiscontinuousDateTimeAxis');
goog.require('scottlogic.chart.rendering.Gridlines');
goog.require('scottlogic.chart.rendering.NonRenderedGraphicalAxis');
goog.require('scottlogic.chart.rendering.NumericalAxis');
goog.require('scottlogic.chart.rendering.RenderedGraphicalAxis');
goog.require('scottlogic.chart.rendering.Style');

/**
 * The Chart object is the manager of the Chart, instantiating all components
 * and allowing the user the redraw, edit the components directly etc.
 *
 * @extends {goog.events.EventTarget}
 * @param {string} id The element ID to draw to.
 * @param {Array.<number>} size The size to draw.
 * @constructor
 */
scottlogic.chart.Chart = function(id, size) {
  goog.events.EventTarget.call(this);
  /**
   * Has the Chart been initialized?
   *
   * @private
   * @type {boolean}
   */
  this.initialized_ = false;

  /**
   * Determines whether or not to render the X Axis
   * @private
   * @type {boolean}
   */
  this.renderX_ = true;

  /**
   * Determines whether or not to render the Y Axis
   * @private
   * @type {boolean}
   */
  this.renderY_ = true;

  /**
   * Get the canvas element from the HTML file, given as a parameter.
   *
   * @private
   * @type {Element}
   */
  this.canvas_ = goog.dom.$(id);

  /**
   * Create the graphics to be manipulated
   *
   * @private
   * @type {goog.graphics.AbstractGraphics}
   */
  this.graphics_ = goog.graphics.createGraphics(size[0], size[1]);

  /**
   * The style of the line series
   *
   * @const
   * @private
   * @type {scottlogic.chart.rendering.Style}
   */
  this.style_ = new scottlogic.chart.rendering.Style(null, null, null, null);

  /**
   * The Data Axis of the Chart (X)
   *
   * @public
   * @type {scottlogic.chart.rendering.AbstractAxis}
   */
  this.xAxisData = new scottlogic.chart.rendering.DiscontinuousDateTimeAxis();

  /**
   * The Data Axis of the Chart (Y)
   *
   * @public
   * @type {scottlogic.chart.rendering.AbstractAxis}
   */
  this.yAxisData = new scottlogic.chart.rendering.NumericalAxis();

  /**
   * The array of Line Series that the chart contains
   *
   * @private
   * @type {Array.<scottlogic.chart.rendering.LineSeries>}
   */
  this.series_ = [];

  this.generateGraphicalAxis_();

  /**
   * Gridlines of the chart
   *
   * @public
   * @type {scottlogic.chart.rendering.Gridlines}
   */
  this.gridlines = new scottlogic.chart.rendering.Gridlines(this.style_);

};
goog.inherits(scottlogic.chart.Chart, goog.events.EventTarget);



/**
 * Generates the graphical axis
 * @private
 */
scottlogic.chart.Chart.prototype.generateGraphicalAxis_ = function() {
  /**
   * The X Axis of the Chart
   *
   * @public
   * @type {scottlogic.chart.rendering.AbstractGraphicalAxis}
   */
  this.xAxis = this.renderX_ ?
      new scottlogic.chart.rendering.RenderedGraphicalAxis(
      scottlogic.chart.Chart.Orientation.X, this.xAxisData,
      this.style_, this.graphics_) :
      new scottlogic.chart.rendering.NonRenderedGraphicalAxis(
      scottlogic.chart.Chart.Orientation.X, this.xAxisData, this.graphics_);

  /**
   * The Y Axis of the Chart
   *
   * @public
   * @type {scottlogic.chart.rendering.AbstractGraphicalAxis}
   */
  this.yAxis = this.renderY_ ?
      new scottlogic.chart.rendering.RenderedGraphicalAxis(
      scottlogic.chart.Chart.Orientation.Y, this.yAxisData,
      this.style_, this.graphics_) :
      new scottlogic.chart.rendering.NonRenderedGraphicalAxis(
      scottlogic.chart.Chart.Orientation.Y, this.yAxisData, this.graphics_);
};

/**
 * Sets whether or not to render the X Axis
 * Rendering involves actually drawing the underlying component. If you try
 * to toggle rendering, you are essentially resetting the Axis and will lost
 * any style values.
 * If you wish to toggle the visibility of the Axis, but keep the underlying
 * graphical components, you should use showXAxis / showYAxis.
 * @param {boolean} input whether or not to render the x axis.
 * @public
 */
scottlogic.chart.Chart.prototype.setXRender = function(input) {
  if (typeof input === 'boolean') {
    this.renderX_ = input;
  }

  this.generateGraphicalAxis_();
};

/**
 * Returns the Array of Line Series associated with the chart
 * @return {Array.<scottlogic.chart.rendering.LineSeries>} all the series.
 * @public
 */
scottlogic.chart.Chart.prototype.getAllLineSeries = function() {
  return this.series_;
};

/**
 * Returns the number of line series on the chart
 * @return {number} number of line series.
 * @public
 */
scottlogic.chart.Chart.prototype.getSeriesCount = function() {
  return this.series_.length;
};

/**
 * Sets whether or not to render the Y Axis.
 * Rendering involves actually drawing the underlying component. If you try
 * to toggle rendering, you are essentially resetting the Axis and will lost
 * any style values.
 * If you wish to toggle the visibility of the Axis, but keep the underlying
 * graphical components, you should use showXAxis / showYAxis.
 * @param {boolean} input whether or not to render the y axis.
 * @public
 */
scottlogic.chart.Chart.prototype.setYRender = function(input) {
  if (typeof input === 'boolean') {
    this.renderY_ = input;
  }

  this.generateGraphicalAxis_();
};

/**
 * initializes and redraws the Chart
 *
 * @public
 */
scottlogic.chart.Chart.prototype.redraw = function() {
  /* Only skip the boundary computation if the user has defined both a min
   * AND a max, and they do not equal one another */
  if (!(this.xAxisData.userHasDefinedMin && this.xAxisData.userHasDefinedMax) ||
      this.xAxisData.min.equals(this.xAxisData.max)) {

    /** @type {Array.<goog.date.UtcDateTime>} */
    var xbounds = this.getXBounds_();

    if (!this.xAxisData.userHasDefinedMin) {
      this.xAxisData.setMinimum(xbounds[0]);
      this.xAxisData.userHasDefinedMin = false;
    }

    if (!this.xAxisData.userHasDefinedMax) {
      this.xAxisData.setMaximum(xbounds[1]);
      this.xAxisData.userHasDefinedMax = false;
    }
  }

  if (!(this.yAxisData.userHasDefinedMin && this.yAxisData.userHasDefinedMax) ||
      this.yAxisData.min === this.yAxisData.max) {
    /** @type {Array.<number>} */
    var ybounds = this.getYBounds_();

    if (!this.yAxisData.userHasDefinedMin) {
      this.yAxisData.setMinimum(ybounds[0]);
      this.yAxisData.userHasDefinedMin = false;
    }

    if (!this.yAxisData.userHasDefinedMax) {
      this.yAxisData.setMaximum(ybounds[1]);
      this.yAxisData.userHasDefinedMax = false;
    }
  }

  this.yAxisData.initialize();
  this.xAxisData.initialize();

  if (!this.initialized_) {
    // initialize_
    this.initialize_();
    this.initialized_ = true;
  }

  this.calculatePadding_();
  this.calculateBoundingBoxes_();

  this.context_.plotArea = this.plottingArea;


  // Redraw
  this.graphics_.suspend();

  this.xAxis.redraw(this.boundingboxX);
  this.yAxis.redraw(this.boundingboxY);
  this.gridlines.redraw(this.graphics_, this.plottingArea, this.xAxis,
      this.yAxis);

  // Draw each Line Series onto the canvas.
  for (var i = 0; i < this.series_.length; i++) {
    this.series_[i].redraw(this.graphics_, this.xAxis, this.yAxis,
        this.context_);
  }

  this.graphics_.resume();
};

/**
 * Calculates the padding values
 *
 * @private
 */
scottlogic.chart.Chart.prototype.calculatePadding_ = function() {
  // Force an estimation (To avoid previous data of the chart influencing
  // padding values)
  this.xAxisData.intervalStep = null;
  this.yAxisData.intervalStep = null;

  /**
   * Padding values
   *
   * @private
   * @type {number}
   */
  this.paddingX = Math.floor(
      (this.xAxis.getLabelHeight() + this.xAxis.tickLength) * 1.05) + 0.5;

  /**
   * Padding values
   *
   * @private
   * @type {number}
   */
  this.paddingY = Math.floor(
      (this.yAxis.getLabelWidth() + this.yAxis.tickLength) * 1.1) +
      (this.renderY_ ? 0.5 : 3);

  /**
   * Padding values
   *
   * @private
   * @type {number}
   */
  this.paddingTop = Math.floor(
      (this.yAxis.getLabelHeight() * 1.05)) + 0.5;

  /**
   * Padding values
   *
   * @private
   * @type {number}
   */
  this.paddingRight = Math.floor(
      (this.xAxis.getLabelWidth() * 1.05) / 2) + (this.renderX_ ? 0.5 : 3);
};

/**
 * Applies the given style to this style
 *
 * @param {scottlogic.chart.rendering.Style} inputStyle The style object to
 *        merge with the Chart.
 * @public
 */
scottlogic.chart.Chart.prototype.applyStyle = function(inputStyle) {
  // Protect against an incorrect parent being passed by the user
  this.style_.merge(new scottlogic.chart.rendering.Style(null, inputStyle
      .getStroke(), inputStyle.getFont(), inputStyle.getFontColour()));
};

/**
 * Calculate the bounding boxes and plotting area
 *
 * @private
 */
scottlogic.chart.Chart.prototype.calculateBoundingBoxes_ = function() {
  /**
   * Bounding boxes are supplied by the Chart for the GraphicalAxis. These will
   * be computed automatically based on the padding values entered above.
   *
   * @private
   * @type {goog.math.Rect}
   */
  this.boundingboxY = new goog.math.Rect(0, this.paddingTop, this.paddingY,
      (this.graphics_.getPixelSize().height - this.paddingX) - this.paddingTop);

  /**
   * @private
   * @type {goog.math.Rect}
   */
  this.boundingboxX = new goog.math.Rect(this.paddingY,
      this.graphics_.getPixelSize().height - this.paddingX,
      this.graphics_.getPixelSize().width - this.paddingY - this.paddingRight,
      this.paddingX);

  /**
   * Store the plotting area in a Rectangle (Used for gridlines and context)
   *
   * @private
   * @type {goog.math.Rect}
   */
  this.plottingArea = new goog.math.Rect(this.paddingY, this.paddingTop,
      this.graphics_.getPixelSize().width - this.paddingY - this.paddingRight,
      (this.graphics_.getPixelSize().height - this.paddingX) - this.paddingTop);
};

/**
 * initializes the chart
 *
 * @private
 */
scottlogic.chart.Chart.prototype.initialize_ = function() {
  /** @type {scottlogic.chart.Chart} */
  var that = this;

  // Render the graphics onto the canvas
  this.graphics_.render(this.canvas_);

  this.calculatePadding_();
  this.calculateBoundingBoxes_();

  /**
   * Defines the context in which lines can be drawn
   *
   * @private
   * @type {scottlogic.chart.rendering.Context}
   */
  this.context_ = new scottlogic.chart.rendering.Context(this.plottingArea);

  goog.events
      .listen(this.canvas_, goog.events.EventType.MOUSEMOVE,
          function(e) {
            /** @type {number} */
            var relativeMousePosition = e.clientX -
                                        goog.style
                                            .getClientPosition(that.canvas_).x;

            that.updateTrackballs(/** @type {goog.date.UtcDateTime} */
                (that.xAxis.convertCanvasToData(relativeMousePosition)));
            that.dispatchEvent(e);
          }, true);
};

/**
 * Updates the trackballs on all line series
 *
 * @param {goog.date.UtcDateTime} dataPoint
 *                          the data point to update the trackballs against.
 * @public
 */
scottlogic.chart.Chart.prototype.updateTrackballs = function(dataPoint) {
  // suspend the graphics whilst drawing takes place
  this.graphics_.suspend();

  for (var i = 0; i < this.series_.length; i++) {
    this.series_[i].updateTrackball(dataPoint);
  }
  this.graphics_.resume();
};

/**
 * Returns the minimum y value on the chart by analysing each line series
 *
 * @private
 * @return {Array.<number>} the y bounds.
 */
scottlogic.chart.Chart.prototype.getYBounds_ = function() {
  /** @type {*} */
  var min;

  /** @type {*} */
  var max;

  /** @type {*} */
  var currentMin;

  /** @type {*} */
  var currentMax;

  // for every line series
  for (var i = 0; i < this.series_.length; i++) {
    currentMin = this.series_[i].getMinimumY(
        this.xAxisData.min, this.xAxisData.max);
    currentMax = this.series_[i].getMaximumY(
        this.xAxisData.min, this.xAxisData.max);

    if (currentMin !== null &&
        (this.yAxisData.compare(currentMin, min) < 0 || min === undefined)) {
      min = currentMin;
    }

    if (currentMax !== null &&
        (this.yAxisData.compare(currentMax, max) > 0 || max === undefined)) {
      max = currentMax;
    }
  }

  return min === undefined || max === undefined ? [0, 1] :
      [this.yAxisData.padRight(min, min, max),
       this.yAxisData.padLeft(max, min, max)];
};

/**
 * Returns the computed minimum and maximum x bounds
 *
 * @private
 * @return {Array.<goog.date.UtcDateTime>} the x bounds.
 */
scottlogic.chart.Chart.prototype.getXBounds_ = function() {
  /** @type {*} */
  var min;

  /** @type {*} */
  var max;

  /** @type {*} */
  var currentMin;

  /** @type {*} */
  var currentMax;

  // for every line series
  for (var i = 0; i < this.series_.length; i++) {
    currentMin = this.series_[i].getMinimumX();
    currentMax = this.series_[i].getMaximumX();

    if (currentMin !== null &&
        (min === undefined || this.xAxisData.compare(currentMin, min) < 0)) {
      min = currentMin;
    }

    if (currentMax !== null &&
        (max === undefined || this.xAxisData.compare(currentMax, max) > 0)) {
      max = currentMax;
    }
  }

  if (min === undefined || max === undefined) {
    /** @type {goog.date.UtcDateTime} */
    var yester = new goog.date.UtcDateTime(new Date());
    yester.add(new goog.date.Interval(0, 0, -1));

    // Returning this time yesterday and current time
    return [yester, new goog.date.UtcDateTime(new Date())];
  } else {
    return [min, max];
  }
};

/**
 * Removes all the Line Series' from the Chart
 *
 * @public
 */
scottlogic.chart.Chart.prototype.removeAllLineSeries = function() {
  for (var i = 0; i < this.series_.length; i++) {
    this.series_[i].dispose();
  }
  this.series_.length = 0;
};

/**
 * Adds a Line Series to the Chart Will remove any previous Line Series with the
 * same ID (overwrite)
 *
 * @param {scottlogic.chart.rendering.LineSeries} lineSeriesIn The input values.
 * @public
 */
scottlogic.chart.Chart.prototype.addLineSeries = function(lineSeriesIn) {
  // Add the Line Series to the inner reference
  this.removeLineSeriesById(lineSeriesIn.id);
  lineSeriesIn.setGraphicalAxisX(this.xAxis);
  lineSeriesIn.setGraphicalAxisY(this.yAxis);
  this.series_[this.series_.length] = lineSeriesIn;
};

/**
 * Removes a Line Series from the Chart, by its Index
 *
 * @param {number} indexToRemove The index of the Line Series to remove.
 * @return {scottlogic.chart.rendering.LineSeries} the removed line series.
 * @private
 */
scottlogic.chart.Chart.prototype.removeLineSeriesByIndex_ = function(
    indexToRemove) {
  // Destroy the first matched element
  this.series_[indexToRemove].dispose();
  return /** @type {scottlogic.chart.rendering.LineSeries} */ (goog.array.
      splice(this.series_, indexToRemove, 1)[0]);
};

/**
 * Removes a line series by its Id
 *
 * @param {string} idToRemove The line series to remove.
 * @return {scottlogic.chart.rendering.LineSeries} the removed line series.
 * @public
 */
scottlogic.chart.Chart.prototype.removeLineSeriesById = function(idToRemove) {
  // Find the Line Series to remove
  for (var i = 0; i < this.series_.length; i++) {
    if (this.series_[i].id === idToRemove) {
      return this.removeLineSeriesByIndex_(i);
    }
  }
};

/**
 * Returns a line series matching the given id
 *
 * @param {string} id the id to search for.
 * @return {scottlogic.chart.rendering.LineSeries} The matched line series.
 * @public
 */
scottlogic.chart.Chart.prototype.getLineSeriesById = function(id) {
  for (var i = 0; i < this.series_.length; i++) {
    if (this.series_[i].id === id) { return this.series_[i]; }
  }
};

/**
 * Removes a line series
 *
 * @param {scottlogic.chart.rendering.LineSeries} lineSeriesToRemove the line
 *        series to remove.
 * @return {scottlogic.chart.rendering.LineSeries} the removed line series.
 * @public
 */
scottlogic.chart.Chart.prototype.removeLineSeries = function(
    lineSeriesToRemove) {
  // Find the Line Series to remove
  for (var i = 0; i < this.series_.length; i++) {
    if (this.series_[i] === lineSeriesToRemove) {
      return this.removeLineSeriesByIndex_(i);
    }
  }
};

/**
 * Enumerated type to represent orientation.
 *
 * @enum {number}
 */
scottlogic.chart.Chart.Orientation = {
  X: 0,
  Y: 1
};
