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

goog.provide('scottlogic.chart.examples.imageDataExample');
goog.require('scottlogic.chart.Chart');
goog.require('scottlogic.chart.rendering.LineSeries');

goog.require('goog.math.Coordinate');
goog.require('goog.math.Size');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventHandler');
goog.require('goog.events');
goog.require('goog.style');

/**
 * @param {string} id The id of the canvas element
 * @param {string} chartid The id of the chart element
 */
scottlogic.chart.examples.imageDataExample.load = function (id, chartid) {
	
	// Chart initialisation
	scottlogic.chart.examples.imageDataExample.chart = new scottlogic.chart.Chart(chartid, [280, 200], 
			new scottlogic.chart.rendering.NumericalAxis(), 
			new scottlogic.chart.rendering.NumericalAxis(), false, true);
	
	scottlogic.chart.examples.imageDataExample.chart.yAxisData.setMinimum(0);
	scottlogic.chart.examples.imageDataExample.chart.gridlines.setGridlineStroke(new goog.graphics.Stroke(1,
	 "#ededed"));
	scottlogic.chart.examples.imageDataExample.chart.gridlines.setZeroLineStroke(new goog.graphics.Stroke(1,
	  "#b0c1d0"));
	
	scottlogic.chart.examples.imageDataExample.chart.xAxisData.setFormatter(function(input) {
			    input = input.toFixed(0);
			    return input;
	});
		  
	scottlogic.chart.examples.imageDataExample.chart.yAxisData.setFormatter(function(input) {
	    input = input.toFixed(0);
	    return input;
	});
	
	scottlogic.chart.examples.imageDataExample.chart.getYAxis().setAxisStroke(new goog.graphics.Stroke(1,
	 "#999999"));
	scottlogic.chart.examples.imageDataExample.chart.getYAxis().setLabelStroke(new goog.graphics.Stroke(1,
	 "#999999"));
	scottlogic.chart.examples.imageDataExample.chart.getYAxis().setLabelFont(new goog.graphics.Font(10,
 "Arial,helvetica,sans-serif"));
	scottlogic.chart.examples.imageDataExample.chart.getYAxis().setLabelFontColour("#0b333c");
	  
	// initialise line series for charts. no values yet.
	scottlogic.chart.examples.imageDataExample.seriesRed = new scottlogic.chart.rendering.LineSeries("red", []);
	scottlogic.chart.examples.imageDataExample.seriesGreen = new scottlogic.chart.rendering.LineSeries("green", []);
	scottlogic.chart.examples.imageDataExample.seriesBlue = new scottlogic.chart.rendering.LineSeries("blue", []);
	
	scottlogic.chart.examples.imageDataExample.seriesRed.setStroke(new goog.graphics.Stroke(1, "#C00000"));
	scottlogic.chart.examples.imageDataExample.seriesGreen.setStroke(new goog.graphics.Stroke(1, "#00C000"));
	scottlogic.chart.examples.imageDataExample.seriesBlue.setStroke(new goog.graphics.Stroke(1, "#0000C0"));
	
	scottlogic.chart.examples.imageDataExample.seriesRed.setMarkerPointsRender(false);
	scottlogic.chart.examples.imageDataExample.seriesGreen.setMarkerPointsRender(false);
	scottlogic.chart.examples.imageDataExample.seriesBlue.setMarkerPointsRender(false);
	
	scottlogic.chart.examples.imageDataExample.seriesRed.setTrackballRender(false);
	scottlogic.chart.examples.imageDataExample.seriesGreen.setTrackballRender(false);
	scottlogic.chart.examples.imageDataExample.seriesBlue.setTrackballRender(false);
	
	scottlogic.chart.examples.imageDataExample.chart.addLineSeries(scottlogic.chart.examples.imageDataExample.seriesRed);
	scottlogic.chart.examples.imageDataExample.chart.addLineSeries(scottlogic.chart.examples.imageDataExample.seriesGreen);
	scottlogic.chart.examples.imageDataExample.chart.addLineSeries(scottlogic.chart.examples.imageDataExample.seriesBlue);
	
	/** @type {Element} */
	var canvas = document.getElementById(id);
	/** @type {goog.math.Size} */
	var size = new goog.math.Size(canvas.width, canvas.height);
	/** @type {CanvasRenderingContext2D} */
	var ctx = canvas.getContext("2d");
	/** @type {CanvasPixelArray} */
	var canvasPixelArray;
	/** @type {Image} */
	var image = new Image();
	image.src = "kitten.png";
	image.onload = function () {
		ctx.lineWidth = 3;
		ctx.drawImage(image, 0, 0);
		canvasPixelArray = ctx.getImageData(0, 0, size.width, size.height).data;
	};
	
	/** @type {goog.math.Coordinate} */
	var startPos = null;
	goog.events.listen(canvas, 'mousedown', function (e) {
		/** @type {goog.math.Coordinate} */
		var canvasPos = goog.style.getClientPosition(canvas);
		startPos = new goog.math.Coordinate(e.clientX - canvasPos.x, e.clientY - canvasPos.y);
		e.preventDefault();
	});
	goog.events.listen(canvas, 'mousemove', function (e) {
		if (startPos) {
			/** @type {goog.math.Coordinate} */
			var canvasPos = goog.style.getClientPosition(canvas);
			/** @type {goog.math.Coordinate} */
			var endPos = new goog.math.Coordinate(e.clientX - canvasPos.x, e.clientY - canvasPos.y);
			// compute length of line
			/** @type {number} */
			var length = Math.floor(Math.sqrt(Math.pow(startPos.x - endPos.x, 2) +
						   Math.pow(startPos.y - endPos.y, 2)));
			if (length > 1) {
				// draw the visible line
				ctx.drawImage(image, 0, 0);
				ctx.beginPath();
				ctx.moveTo(startPos.x, startPos.y);
				ctx.lineTo(endPos.x, endPos.y);
				ctx.closePath();
				ctx.stroke();
				
				// rebuild the chart data
				/** @type {Array.<[*, *]>} */
				scottlogic.chart.examples.imageDataExample.seriesRed.points = [];
				/** @type {Array.<[*, *]>} */
				scottlogic.chart.examples.imageDataExample.seriesGreen.points = [];
				/** @type {Array.<[*, *]>} */
				scottlogic.chart.examples.imageDataExample.seriesBlue.points = [];
				for (var i = 0; i < length; i++) {
					var xIndex = Math.floor(startPos.x + (endPos.x - startPos.x) * i / length);
					var yIndex = Math.floor(startPos.y + (endPos.y - startPos.y) * i / length);
					var index = yIndex * size.width * 4 + xIndex * 4;
					scottlogic.chart.examples.imageDataExample.seriesRed.points.push([i,canvasPixelArray[index]]);
					scottlogic.chart.examples.imageDataExample.seriesGreen.points.push([i,canvasPixelArray[index + 1]]);
					scottlogic.chart.examples.imageDataExample.seriesBlue.points.push([i,canvasPixelArray[index + 2]]);
				}
				
				// update the chart display
				scottlogic.chart.examples.imageDataExample.chart.redraw();
			}
		}
	});
	goog.events.listen(window.document.body, 'mouseup', function () {
		startPos = null;
	});

};


goog.exportSymbol('scottlogic.chart.examples.imageDataExample.load', scottlogic.chart.examples.imageDataExample.load);