goog.provide('scottlogic.chart.rendering.Label');

goog.require('goog.Disposable');
goog.require('goog.graphics');

/**
 * Represents a label object. A label is a graphical component and so follows
 * the redraw/initialize structure.
 *
 * @param {string} text The text to display.
 * @param {goog.math.Rect} rect the rectangle in which to display the label.
 * @param {scottlogic.chart.Chart.Orientation} axis The orientation of the axis.
 * @param {number} tickLength the length of the tick on the label.
 * @param {scottlogic.chart.rendering.Style} style The style of the label.
 * @extends {goog.Disposable}
 * @constructor
 */
scottlogic.chart.rendering.Label = function(
    text, rect, axis, tickLength, style) {

  goog.Disposable.call(this);

  /**
   * @private
   * @type {boolean}
   */
  this.initialized_ = false;

  /**
   * The style of the Label
   *
   * @const
   * @private
   * @type {scottlogic.chart.rendering.Style}
   */
  this.style_ = style;

  /**
   * @private
   * @type {string}
   */
  this.text_ = text;

  /**
   * The x co-ordinate of the top left
   *
   * @private
   * @type {number}
   */
  this.x_ = rect.left;

  /**
   * The y co-ordinate of the top left
   *
   * @private
   * @type {number}
   */
  this.y_ = rect.top;

  /**
   * The width of the label
   *
   * @private
   * @type {number}
   */
  this.width_ = rect.width;

  /**
   * The height of the label
   *
   * @private
   * @type {number}
   */
  this.height_ = rect.height;

  /**
   * The orientation of the axis
   *
   * @private
   * @type {scottlogic.chart.Chart.Orientation}
   */
  this.axisOrientation_ = axis;

  /**
   * The object that represents the Label
   *
   * @private
   * @type {goog.graphics.TextElement}
   */
  this.labelText_ = null;

  /**
   * The centre co-ordinate of the Label
   *
   * @public
   * @type {Array.<number>}
   */
  this.center = [];

  /**
   * The length of the tick
   *
   * @private
   * @type {number}
   */
  this.tickLength_ = tickLength;
};
goog.inherits(scottlogic.chart.rendering.Label, goog.Disposable);

/**
 * Initializes the Label if it has not been initialized already, then redraws
 * the Label
 *
 * @param {goog.graphics.AbstractGraphics} graphics the graphics on which to
 *        draw upon.
 * @public
 */
scottlogic.chart.rendering.Label.prototype.redraw = function(graphics) {
  if (!this.initialized_) {
    this.initialize_(graphics);
    this.initialized_ = true;
  }

  if (this.axisOrientation_ === scottlogic.chart.Chart.Orientation.X) {
    this.labelText_ = graphics.drawText(this.text_, this.x_,
        this.y_ + (this.tickLength_ * 1.1), this.width_, this.height_ -
                                                        this.tickLength_,
        'center', 'bottom', this.style_.getFont(), this.textStroke_,
        this.textFill_);

    this.center[0] = this.x_ + (this.width_ / 2);
    this.center[1] = this.y_;
  } else if (this.axisOrientation_ === scottlogic.chart.Chart.Orientation.Y) {
    this.labelText_ = graphics.drawText(this.text_, this.x_, this.y_,
        this.width_ - this.tickLength_ - 3, this.height_, 'right', 'middle',
        this.style_.getFont(), this.textStroke_, this.textFill_);

    this.center[0] = this.x_ + (this.width_);
    this.center[1] = this.y_ + (this.height_ / 2);
  } else {
    // Throw an exception if an unrecognised orientation appears
    throw 'INVALID_ORIENTATION ' + this.axisOrientation_;
  }
};

/**
 * Initializes the label
 *
 * @param {goog.graphics.AbstractGraphics} graphics The graphics to draw upon.
 * @private
 */
scottlogic.chart.rendering.Label.prototype.initialize_ = function(graphics) {

  /**
   * The graphics to drawn upon
   *
   * @private
   * @type {goog.graphics.AbstractGraphics}
   */
  this.graphics_ = graphics;

  /**
   * The fill of the text
   *
   * @private
   * @type {goog.graphics.Fill}
   */
  this.textFill_ = new goog.graphics.SolidFill(this.style_.getFontColour());

  /**
   * The stroke of the text
   *
   * @private
   * @type {goog.graphics.Stroke}
   */
  this.textStroke_ = new goog.graphics.Stroke(0, this.style_.getFontColour());
};

/**
 * Shows the Label.
 * @public
 */
scottlogic.chart.rendering.Label.prototype.show = function() {
  this.labelText_.setStroke(this.textStroke_);
  this.labelText_.setFill(this.textFill_);
};

/**
 * Hides the Label.
 * @public
 */
scottlogic.chart.rendering.Label.prototype.hide = function() {
  this.labelText_.setStroke(new goog.graphics.Stroke(0, '#FFFFFF'));
  this.labelText_.setFill(null);
};

/**
 * Removes the Label from the canvas
 *
 * @override
 * @protected
 */
scottlogic.chart.rendering.Label.prototype.disposeInternal = function() {
  scottlogic.chart.rendering.Label.superClass_.disposeInternal.call(this);
  if (this.initialized_) {
    this.graphics_.removeElement(this.labelText_);
  }
};
