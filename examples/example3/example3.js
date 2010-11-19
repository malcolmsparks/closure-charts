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

goog.provide('scottlogic.chart.examples.example3');

goog.require('goog.date.UtcDateTime');
goog.require('goog.graphics.Stroke');
goog.require('scottlogic.chart.Chart');
goog.require('scottlogic.chart.rendering.LineSeries');

/**
 * @param {string} id The id of the dom element in which to place the chart
 */
scottlogic.chart.examples.example3.load = function (id) {
  /** 
   * @type {scottlogic.chart.Chart}
   * @private 
   */

  scottlogic.chart.examples.example3.chart = new scottlogic.chart.Chart(id, [600, 300], scottlogic.chart.rendering.NumericalAxis, 
		  scottlogic.chart.rendering.NumericalAxis);
  
  scottlogic.chart.examples.example3.chart.getXAxis().setAxisStroke(new goog.graphics.Stroke(1, "#999999"));
  scottlogic.chart.examples.example3.chart.getYAxis().setAxisStroke(new goog.graphics.Stroke(1, "#999999"));
  scottlogic.chart.examples.example3.chart.getXAxis().setLabelFont(new goog.graphics.Font(10,
    "Arial,helvetica,sans-serif"));
  scottlogic.chart.examples.example3.chart.getYAxis().setLabelFont(new goog.graphics.Font(10,
    "Arial,helvetica,sans-serif"));
  scottlogic.chart.examples.example3.chart.getXAxis().setLabelFontColour("#0b333c");
  scottlogic.chart.examples.example3.chart.getYAxis().setLabelFontColour("#0b333c");
  scottlogic.chart.examples.example3.chart.gridlines.setGridlineStroke(new goog.graphics.Stroke(1,
   "#ededed"));
  scottlogic.chart.examples.example3.chart.gridlines.setZeroLineStroke(new goog.graphics.Stroke(1,
    "#b0c1d0"));
  
  scottlogic.chart.examples.example3.chart.xAxisData.setFormatter(function(input) {
	    input = input.toFixed(0);
	    return input;
  });
  
  scottlogic.chart.examples.example3.chart.yAxisData.setFormatter(function(input) {
	    input = input.toFixed(0);
	    return input;
  });
  
  scottlogic.chart.examples.example3.chart.yAxisData.setMinimum(0);
  
	scottlogic.chart.examples.example3.series = new scottlogic.chart.rendering.LineSeries("test", scottlogic.chart.examples.example3.generateLineSeriesData());
	scottlogic.chart.examples.example3.series2 = new scottlogic.chart.rendering.LineSeries("test2", scottlogic.chart.examples.example3.generateLineSeriesData());
	scottlogic.chart.examples.example3.series3 = new scottlogic.chart.rendering.LineSeries("test3", scottlogic.chart.examples.example3.generateLineSeriesData());
	
	scottlogic.chart.examples.example3.series.setStroke(new goog.graphics.Stroke(1, "#ff0000"));
	scottlogic.chart.examples.example3.series2.setStroke(new goog.graphics.Stroke(1, "#00ff00"));
	scottlogic.chart.examples.example3.series3.setStroke(new goog.graphics.Stroke(1, "#0000ff"));
	
	scottlogic.chart.examples.example3.series.setMarkerPointsRender(false);
	scottlogic.chart.examples.example3.series2.setMarkerPointsRender(false);
	scottlogic.chart.examples.example3.series3.setMarkerPointsRender(false);
	
	scottlogic.chart.examples.example3.series.setTrackballRender(false);
	scottlogic.chart.examples.example3.series2.setTrackballRender(false);
	scottlogic.chart.examples.example3.series3.setTrackballRender(false);
	
	scottlogic.chart.examples.example3.chart.addLineSeries(scottlogic.chart.examples.example3.series);
	scottlogic.chart.examples.example3.chart.addLineSeries(scottlogic.chart.examples.example3.series2);
	scottlogic.chart.examples.example3.chart.addLineSeries(scottlogic.chart.examples.example3.series3);
	
	scottlogic.chart.examples.example3.chart.redraw();
	
	scottlogic.chart.examples.example3.generateNewLineData();
};

scottlogic.chart.examples.example3.start = function() {
	// prevent multiple timeouts from stacking up.
	scottlogic.chart.examples.example3.stop();
	scottlogic.chart.examples.example3.timeout = setTimeout(scottlogic.chart.examples.example3.generateNewLineData, 10);
};

scottlogic.chart.examples.example3.stop = function() {
	clearTimeout(scottlogic.chart.examples.example3.timeout);
};

/**
 * Generates a new dataset for each of the line series on the chart.
 * and redraws the chart
 * 
 * @private
 */

scottlogic.chart.examples.example3.generateNewLineData = function() {
	scottlogic.chart.examples.example3.series.points = scottlogic.chart.examples.example3.generateLineSeriesData();
	scottlogic.chart.examples.example3.series2.points = scottlogic.chart.examples.example3.generateLineSeriesData();
	scottlogic.chart.examples.example3.series3.points = scottlogic.chart.examples.example3.generateLineSeriesData();
	scottlogic.chart.examples.example3.chart.redraw();
	scottlogic.chart.examples.example3.start();
};

/**
 * Returns an array of [x,y] data points, y value is a random number in specified range.
 * 
 * @private
 */
scottlogic.chart.examples.example3.generateLineSeriesData = function() {
	
	// xPoints: number of equally spaced points on x-axis.
	var xPoints = 344;
	
	// maxY value
	var maxY = 255;
	
	var lineSeries = [];
	
	var yVal;
	for (var i=0; i < xPoints; i++) {
		lineSeries.push([i, Math.floor(Math.random()*maxY)]);
	}
	
	return lineSeries;
};


goog.exportSymbol('scottlogic.chart.examples.example3.load', scottlogic.chart.examples.example3.load);
goog.exportSymbol('scottlogic.chart.examples.example3.start', scottlogic.chart.examples.example3.start);
goog.exportSymbol('scottlogic.chart.examples.example3.stop', scottlogic.chart.examples.example3.stop);