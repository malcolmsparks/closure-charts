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

goog.provide('scottlogic.chart.examples.example1');

goog.require('goog.date.UtcDateTime');
goog.require('goog.graphics.Stroke');
goog.require('goog.i18n.DateTimeFormat');
goog.require('scottlogic.chart.Chart');
goog.require('scottlogic.chart.rendering.LineSeries');

/**
 * @param {string} id The id of the dom element in which to place the chart
 */
scottlogic.chart.examples.example1.load = function (id) {
	/** @type {scottlogic.chart.Chart} */
	var chart = new scottlogic.chart.Chart(id, [400, 300]);
	chart.gridlines.setGridlineStroke(new goog.graphics.Stroke(1, '#eee'));
	chart.getXAxis().setAlignment(scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment.BOTTOMOUTSIDE);
	chart.getYAxis().setAlignment(scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment.RIGHTINSIDE);
	
	
	/** @type {goog.i18n.DateTimeFormat} */
	var formatter = new goog.i18n.DateTimeFormat(goog.i18n.DateTimeFormat.Format.SHORT_TIME);
	chart.xAxisData.setFormatter(goog.bind(formatter.format, formatter));
	
	chart.yAxisData.setFormatter(function(yValue) {
		return yValue.toFixed(2);;
	});
	
	var x1 = new goog.date.UtcDateTime(2010, goog.date.month.AUG, 5, 8, 0, 0, 0);
	var x2 = new goog.date.UtcDateTime(2010, goog.date.month.AUG, 5, 12, 0, 0, 0);
	var x3 = new goog.date.UtcDateTime(2010, goog.date.month.AUG, 5, 16, 0, 0, 0);
	
	var series = new scottlogic.chart.rendering.LineSeries("test", [[x1, 0],[x2, 10],[x3, -5]]);
	chart.addLineSeries(series);

	var series2 = new scottlogic.chart.rendering.LineSeries("test2", [[x1, 5],[x2, 1],[x3, 10]]);
	chart.addLineSeries(series2);
	
	chart.redraw();
};

goog.exportSymbol('scottlogic.chart.examples.example1.load', scottlogic.chart.examples.example1.load);