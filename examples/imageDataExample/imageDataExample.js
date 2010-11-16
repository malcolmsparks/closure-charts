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

goog.require('goog.math.Coordinate');
goog.require('goog.math.Size');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventHandler');
goog.require('goog.events');
goog.require('goog.style');

/**
 * @param {string} id The id of the canvas element
 */
scottlogic.chart.examples.imageDataExample.load = function (id) {
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
				// build the chart data
				/** @type {Array.<number>} */
				var red = [];
				/** @type {Array.<number>} */
				var	green = [];
				/** @type {Array.<number>} */
				var blue = [];
				for (var i = 0; i < length; i++) {
					var xIndex = Math.floor(startPos.x + (endPos.x - startPos.x) * i / length);
					var yIndex = Math.floor(startPos.y + (endPos.y - startPos.y) * i / length);
					var index = yIndex * size.width * 4 + xIndex * 4;
					red.push(canvasPixelArray[index]);
					green.push(canvasPixelArray[index + 1]);
					blue.push(canvasPixelArray[index + 2]);
				}
				console.log(red, green, blue);
			}
		}
	});
	goog.events.listen(window.document.body, 'mouseup', function () {
		startPos = null;
	});

	///** @type {scottlogic.chart.Chart} */
	// var chart = new scottlogic.chart.Chart(id, [400, 300]);
	// chart.gridlines.setGridlineStroke(new goog.graphics.Stroke(1, '#eee'));
	// chart.getXAxis().setAlignment(scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment.BOTTOMOUTSIDE);
	// chart.getYAxis().setAlignment(scottlogic.chart.rendering.AbstractGraphicalAxis.Alignment.RIGHTINSIDE);
	
	
	// /** @type {goog.i18n.DateTimeFormat} */
	// var formatter = new goog.i18n.DateTimeFormat(goog.i18n.DateTimeFormat.Format.SHORT_TIME);
	// chart.xAxisData.setFormatter(goog.bind(formatter.format, formatter));
	
	// chart.yAxisData.setFormatter(function(yValue) {
		// return yValue.toFixed(2);;
	// });
	
	// var data = [];
	// var generate = (function generate() {
		// data.length = 0;
		// for (var hour = 8; hour < 16; hour += 1) {
			// for (var minute = 0; minute < 60; minute += 15) {
				// var date = new goog.date.UtcDateTime(2010, goog.date.month.AUG, 5, hour, minute, 0, 0);
				// data.push([date, Math.random() * 20 - 10]);
			// }
		// }
		// var date = new goog.date.UtcDateTime(2010, goog.date.month.AUG, 5, hour, 0, 0, 0);
		// data.push([date, Math.random() * 20 - 10]);
		// return generate;
	// }());
	
	// var series = new scottlogic.chart.rendering.LineSeries("test", data);
	// chart.addLineSeries(series);

	// setInterval(function() {
		// generate();
		// series.redraw();
	// }, 50);
	
	// chart.redraw();
};

goog.exportSymbol('scottlogic.chart.examples.imageDataExample.load', scottlogic.chart.examples.imageDataExample.load);