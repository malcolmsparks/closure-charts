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

goog.provide('scottlogic.chart.examples.example2');

goog.require('goog.date.UtcDateTime');
goog.require('goog.graphics.Stroke');
goog.require('goog.i18n.DateTimeFormat');
goog.require('scottlogic.chart.Chart');
goog.require('scottlogic.chart.rendering.LineSeries');

/**
 * @param {string} id The id of the dom element in which to place the chart
 */
scottlogic.chart.examples.example2.load = function (id) {
  /** 
   * @type {scottlogic.chart.Chart}
   * @private 
   */
  var chart = new scottlogic.chart.Chart(id, [600, 300]);
  
  // Here we can set some styles on the Chart
  chart.xAxisData.setStartOfHours(new goog.date.UtcDateTime(1990, 0, 0, 7, 0,
      0, 0));
  chart.xAxisData.setEndOfHours(new goog.date.UtcDateTime(1990, 0, 0, 15, 30,
      0, 0));
  chart.xAxis.setAxisStroke(new goog.graphics.Stroke(1, "#999999"));
  chart.yAxis.setAxisStroke(new goog.graphics.Stroke(1, "#999999"));
  chart.xAxis.setLabelFont(new goog.graphics.Font(10,
    "Arial,helvetica,sans-serif"));
  chart.yAxis.setLabelFont(new goog.graphics.Font(10,
    "Arial,helvetica,sans-serif"));
  chart.xAxis.setLabelFontColour("#0b333c");
  chart.yAxis.setLabelFontColour("#0b333c");
  chart.gridlines.setGridlineStroke(new goog.graphics.Stroke(1,
    "#ededed"));
  chart.gridlines.setZeroLineStroke(new goog.graphics.Stroke(1,
    "#b0c1d0"));
  
  chart.yAxisData.setFormatter(function(input) {
    var input = input.toFixed(2);
    if(input.indexOf("-0") !== -1) {
      input = input.substring(1, input.length);
    }
    return input + "%";
  });
  chart.xAxisData.setFormatter(function(input) {
    return goog.string.padNumber(input.getHours(), 2) + ':' + 
        goog.string.padNumber(input.getMinutes(), 2);
  });
  
  var x1 = new goog.date.UtcDateTime(2010, goog.date.month.AUG, 5, 8, 0, 0, 0);
  var x2 = new goog.date.UtcDateTime(2010, goog.date.month.AUG, 5, 12, 0, 0, 0);
  var x3 = new goog.date.UtcDateTime(2010, goog.date.month.AUG, 5, 16, 0, 0, 0);
  
  // We can also set styles on the Series of a Chart before adding it to the Chart
  var series = new scottlogic.chart.rendering.LineSeries("test", [[x1, 0],[x2, 10],[x3, -5]]);
  series.setStroke(new goog.graphics.Stroke(1, "#895b18"));
  chart.addLineSeries(series);

  var series2 = new scottlogic.chart.rendering.LineSeries("test2", [[x1, 5],[x2, 1],[x3, 10]]);
  series2.setStroke(new goog.graphics.Stroke(1, "#265e89"));
  chart.addLineSeries(series2);
  
  var series3 = new scottlogic.chart.rendering.LineSeries("test3", [[x1, 7],[x2, -2],[x3, 0]]);
  chart.addLineSeries(series3);
  
  // and we can change a series that has already been added
  chart.getLineSeriesById("test3").setStroke(new goog.graphics.Stroke(1, "#669900"));
  
  // all this is done before the redraw - so no graphic processing has been done yet
  chart.redraw();
};

goog.exportSymbol('scottlogic.chart.examples.example2.load', scottlogic.chart.examples.example2.load);