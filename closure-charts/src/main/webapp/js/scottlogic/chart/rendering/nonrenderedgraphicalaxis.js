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

goog.provide('scottlogic.chart.rendering.NonRenderedGraphicalAxis');

goog.require('scottlogic.chart.rendering.AbstractGraphicalAxis');

/**
 * A Graphical Axis that will not render itself on the Chart.
 *
 * @extends {scottlogic.chart.rendering.AbstractGraphicalAxis}
 * @param {scottlogic.chart.Chart.Orientation} orientation
 * 		the orientation of the axis.
 * @param {scottlogic.chart.rendering.AbstractAxis} axis 
 * 		the underlying axis data.
 * @param {scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment} alignment
 * 		the alignment of the axis.
 * @constructor
 */
scottlogic.chart.rendering.NonRenderedGraphicalAxis = function(orientation, 
    axis, alignment) {
  scottlogic.chart.rendering.AbstractGraphicalAxis.call(this,
      orientation, axis, null, alignment);
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
