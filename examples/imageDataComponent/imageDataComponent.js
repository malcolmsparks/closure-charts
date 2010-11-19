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

goog.provide('scottlogic.chart.examples.ImageDataComponent');

goog.require('scottlogic.chart.Chart');
goog.require('scottlogic.chart.rendering.LineSeries');

goog.require('goog.math.Coordinate');
goog.require('goog.math.Size');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');
goog.require('goog.events');
goog.require('goog.style');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.ui.Component');

/**
 * A component which demonstrates closure-charts rendering RGB data 
 * from an image.
 
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper to use.
 *
 * @extends {goog.ui.Component}
 * @constructor
 */

scottlogic.chart.examples.ImageDataComponent = function(opt_domHelper) {
	goog.ui.Component.call(this, opt_domHelper);
};
goog.inherits(scottlogic.chart.examples.ImageDataComponent, goog.ui.Component);

/**
 * Invoked on 'render'. This should not happen for this component.
 * Instead, 'decorator' pattern is used. 
 */
scottlogic.chart.examples.ImageDataComponent.prototype.createDom = function() {
	throw "Unexpected invocation of createDom";
};

/**
 * 
 * @param element
 * element is a DOM element, first child must be a div element,
 * next child must be a canvas element. 
 * 
 */
scottlogic.chart.examples.ImageDataComponent.prototype.decorateInternal = function(element) {
  this.element_ = element;
  
  // html page expected to contain a div for container (element)
  // whose first child is a div element for the RGB chart and whose
  // next child is a canvas element for rendering the image. 
 
  /** @type {Element} */
  var chartElement = goog.dom.getFirstElementChild(this.element_);
  /** @type {Element} */
  this.canvas = goog.dom.getNextElementSibling(chartElement);
  
  //Chart initialisation
  /** @type {scottlogic.chart.Chart} */
	this.chart = new scottlogic.chart.Chart(chartElement, [280, 200], 
			scottlogic.chart.rendering.NumericalAxis, 
			scottlogic.chart.rendering.NumericalAxis);
	
	this.chart.yAxisData.setMinimum(0);
	this.chart.gridlines.setGridlineStroke(new goog.graphics.Stroke(1,
	 "#ededed"));
	this.chart.gridlines.setZeroLineStroke(new goog.graphics.Stroke(1,
	  "#b0c1d0"));
	
	this.chart.xAxisData.setFormatter(this.axisFormatter);	  
	this.chart.yAxisData.setFormatter(this.axisFormatter);

	this.chart.setXRender(false);
	
	this.chart.getYAxis().setAxisStroke(new goog.graphics.Stroke(1,
	 "#999999"));
	this.chart.getYAxis().setLabelStroke(new goog.graphics.Stroke(1,
	 "#999999"));
	this.chart.getYAxis().setLabelFont(new goog.graphics.Font(10,
 "Arial,helvetica,sans-serif"));
	this.chart.getYAxis().setLabelFontColour("#0b333c");
	  
	// initialise line series for charts. no values yet.
	/** @type {scottlogic.chart.rendering.LineSeries} */
	this.seriesRed = new scottlogic.chart.rendering.LineSeries("red", []);
	/** @type {scottlogic.chart.rendering.LineSeries} */
	this.seriesGreen = new scottlogic.chart.rendering.LineSeries("green", []);
	/** @type {scottlogic.chart.rendering.LineSeries} */
	this.seriesBlue = new scottlogic.chart.rendering.LineSeries("blue", []);
	
	this.seriesRed.setStroke(new goog.graphics.Stroke(1, "#C00000"));
	this.seriesGreen.setStroke(new goog.graphics.Stroke(1, "#00C000"));
	this.seriesBlue.setStroke(new goog.graphics.Stroke(1, "#0000C0"));
	
	this.seriesRed.setMarkerPointsRender(false);
	this.seriesGreen.setMarkerPointsRender(false);
	this.seriesBlue.setMarkerPointsRender(false);
	
	this.seriesRed.setTrackballRender(false);
	this.seriesGreen.setTrackballRender(false);
	this.seriesBlue.setTrackballRender(false);
	
	this.chart.addLineSeries(this.seriesRed);
	this.chart.addLineSeries(this.seriesGreen);
	this.chart.addLineSeries(this.seriesBlue);
	
	/** @type {goog.math.Size} */
	this.size = new goog.math.Size(this.canvas.width, this.canvas.height);
	/** @type {CanvasRenderingContext2D} */
	this.ctx = this.canvas.getContext("2d");
	this.ctx.lineWidth = 3;
	
	/** @type {Image} */
	this.image = new Image();
	this.image.src = "kitten.png";
	
	/** @type {goog.math.Coordinate} */
	this.startPos = null;
	
};

/**
 * 
 * @param input
 * @return {string} 
 */
scottlogic.chart.examples.ImageDataComponent.prototype.axisFormatter = function(input) {
	 input = input.toFixed(0);
   return input;
};


/**
 * Handles the image LOAD event.
 * @param {!goog.events.BrowserEvent} e The event.
 * @private
 */
scottlogic.chart.examples.ImageDataComponent.prototype.handleImageLoad_ = function(e) {
	this.ctx.drawImage(this.image, 0, 0);
	/** @type {CanvasPixelArray} */
	this.canvasPixelArray = this.ctx.getImageData(0, 0, this.size.width, this.size.height).data;
};

/**
 * Handles the mouse move event.
 * @param {!goog.events.BrowserEvent} e The event.
 * @private
 */
scottlogic.chart.examples.ImageDataComponent.prototype.handleMouseMove_ = function(e) {
	
	if (this.startPos) {
		/** @type {goog.math.Coordinate} */
		var canvasPos = goog.style.getClientPosition(this.canvas);
		/** @type {goog.math.Coordinate} */
		var endPos = new goog.math.Coordinate(e.clientX - canvasPos.x, e.clientY - canvasPos.y);
		// compute length of line
		/** @type {number} */
		var length = Math.floor(Math.sqrt(Math.pow(this.startPos.x - endPos.x, 2) +
					   Math.pow(this.startPos.y - endPos.y, 2)));
		if (length > 1) {
		// draw the visible line
			this.drawUpdate(endPos, length);
		}
	}
};

/**
 * Handles the mouse down event.
 * @param {!goog.events.BrowserEvent} e The event.
 * @private
 */
scottlogic.chart.examples.ImageDataComponent.prototype.handleMouseDown_ = function (e) {
	/** @type {goog.math.Coordinate} */
	var canvasPos = goog.style.getClientPosition(this.canvas);
	this.startPos = new goog.math.Coordinate(e.clientX - canvasPos.x, e.clientY - canvasPos.y);
	e.preventDefault();
};

/**
 * Handles the mouse up event.
 * @param {!goog.events.BrowserEvent} e The event.
 * @private
 */
scottlogic.chart.examples.ImageDataComponent.prototype.handleMouseUp_ = function (e) {
	this.startPos = null;
};

/**
 * Add event handlers
 */
scottlogic.chart.examples.ImageDataComponent.prototype.enterDocument = function() {
	scottlogic.chart.examples.ImageDataComponent.superClass_.enterDocument.call(this);
	this.getHandler().listen(this.image, goog.events.EventType.LOAD, this.handleImageLoad_);
	this.getHandler().listen(this.canvas, goog.events.EventType.MOUSEDOWN, this.handleMouseDown_);
	this.getHandler().listen(this.canvas, goog.events.EventType.MOUSEMOVE, this.handleMouseMove_);
	this.getHandler().listen(this.canvas, goog.events.EventType.MOUSEUP, this.handleMouseUp_);
	
};

/**
 * Draw a line between start point and specified end point
 * startPos is a member variable
 * 
 * @param endPos
 * @param lineLength
 */
scottlogic.chart.examples.ImageDataComponent.prototype.drawUpdate = function (endPos, lineLength) {
	this.ctx.drawImage(this.image, 0, 0);
	this.ctx.beginPath();
	this.ctx.moveTo(this.startPos.x, this.startPos.y);
	this.ctx.lineTo(endPos.x, endPos.y);
	this.ctx.closePath();
	this.ctx.stroke();
	
	// rebuild the chart data
	
	this.seriesRed.points.length = 0;
	this.seriesGreen.points.length = 0;
	this.seriesBlue.points.length = 0;
	for (var i = 0; i < lineLength; i++) {
		/** @type {number} */
		var xIndex = Math.floor(this.startPos.x + (endPos.x - this.startPos.x) * i / lineLength);
		/** @type {number} */
		var yIndex = Math.floor(this.startPos.y + (endPos.y - this.startPos.y) * i / lineLength);
		/** @type {number} */
		var index = yIndex * this.size.width * 4 + xIndex * 4;
		this.seriesRed.points.push([i,this.canvasPixelArray[index]]);
		this.seriesGreen.points.push([i,this.canvasPixelArray[index + 1]]);
		this.seriesBlue.points.push([i,this.canvasPixelArray[index + 2]]);
	}
	
	// update the chart display
	this.chart.redraw();
};


/**
 * Bootstap function. 
 * @param {string} id parent DOM element for component. 
 */
scottlogic.chart.examples.ImageDataComponent.bootstrap = function(id) {
	var theDemo = new scottlogic.chart.examples.ImageDataComponent(
			goog.dom.getDomHelper(goog.dom.getElement(id)));
	theDemo.decorate(goog.dom.getElement(id));
};
goog.exportSymbol('bootstrap', scottlogic.chart.examples.ImageDataComponent.bootstrap);