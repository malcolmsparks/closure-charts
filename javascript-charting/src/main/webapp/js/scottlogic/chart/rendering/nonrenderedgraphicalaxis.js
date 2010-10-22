goog.provide('scottlogic.chart.rendering.NonRenderedGraphicalAxis');

goog.require('scottlogic.chart.rendering.AbstractGraphicalAxis');

/**
 * A Graphical Axis that will not render itself on the Chart.
 *
 * @extends {scottlogic.chart.rendering.AbstractGraphicalAxis}
 * @param {scottlogic.chart.Chart.Orientation} orientation the orientation of
 *        the axis.
 * @param {scottlogic.chart.rendering.AbstractAxis} axis
 *    the underlying axis data.
 * @param {goog.graphics.AbstractGraphics} graphics The graphics to use whilst
 *        rendering.
 * @constructor
 */
scottlogic.chart.rendering.NonRenderedGraphicalAxis = function(orientation, 
    axis, graphics) {
  scottlogic.chart.rendering.AbstractGraphicalAxis.call(this,
      orientation, axis, null, graphics);
  /**
   * The length of the tick
   *
   * @public
   * @type {number}
   */
  this.tickLength = 0;
};
goog.inherits(scottlogic.chart.rendering.NonRenderedGraphicalAxis,
    scottlogic.chart.rendering.AbstractGraphicalAxis);

/**
 * @override
 */
scottlogic.chart.rendering.NonRenderedGraphicalAxis.prototype.redrawInternal =
    goog.nullFunction;

/**
 * @override
 */
scottlogic.chart.rendering.NonRenderedGraphicalAxis.prototype.
    initializeInternal = goog.nullFunction;


/**
 * @override
 */
scottlogic.chart.rendering.NonRenderedGraphicalAxis.prototype.getLabelWidth =
    function() {
  return 0;
};

/**
 * @override
 */
scottlogic.chart.rendering.NonRenderedGraphicalAxis.prototype.getLabelHeight =
    function() {
  return 0;
};

/**
 * @override
 */
scottlogic.chart.rendering.NonRenderedGraphicalAxis.prototype.show =
    goog.nullFunction;

/**
 * @override
 */
scottlogic.chart.rendering.NonRenderedGraphicalAxis.prototype.hide =
    goog.nullFunction;

/**
 * @override
 */
scottlogic.chart.rendering.NonRenderedGraphicalAxis.prototype.setAxisStroke =
    goog.nullFunction;

/**
 * @override
 */
scottlogic.chart.rendering.NonRenderedGraphicalAxis.prototype.setLabelFont =
    goog.nullFunction;

/**
 * @override
 */
scottlogic.chart.rendering.NonRenderedGraphicalAxis.prototype.
    setLabelFontColour = goog.nullFunction;

/**
 * @override
 */
scottlogic.chart.rendering.NonRenderedGraphicalAxis.prototype.setLabelStroke =
    goog.nullFunction;

/**
 * @override
 */
scottlogic.chart.rendering.NonRenderedGraphicalAxis.prototype.disposeInternal =
    function() {
  scottlogic.chart.rendering.NonRenderedGraphicalAxis.superClass_.
      disposeInternal.call(this);
};
