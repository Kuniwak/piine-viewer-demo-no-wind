// This script licensed under the MIT.
// http://orgachem.mit-license.org


/**
 * @fileoverview A web app class for the piine viewer.
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('piine.App');

goog.require('goog.events.EventType');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.Timer');
goog.require('piine.View');



/**
 * A web app class for the piine.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
piine.App = function() {
  goog.base(this);
  this.handler_ = this.createHandler();
  this.view_ = this.createView();

  this.attachEvents();

  this.render();
};
goog.inherits(piine.App, goog.events.EventTarget);
goog.addSingletonGetter(piine.App);


/**
 * ID attribute for the piine view element.
 * @type {string}
 * @const
 */
piine.App.VIEW_ID = 'piine-view';


/**
 * Duration time of ovation.
 * @const
 * @type {number}
 */
piine.App.OVATION_DURATION = 2000;


/**
 * Max simultaneous piine count in ovation.
 * @const
 * @type {number}
 */
piine.App.MAX_SIMULTANEOUS_PIINE_IN_OVATION = 5;


/**
 * Event type string for the app.
 * @enum {string}
 */
piine.App.EventType = {
  RECEIVE_PIINE: 'receive_piine',
  LEAVE: 'leave',
  JOIN: 'join'
};


/**
 * Users count number.
 * @type {number}
 * @private
 */
piine.App.prototype.userCount_ = 0;


/**
 * View copoment for the app.
 * @type {goog.ui.Control}
 * @private
 */
piine.App.prototype.view_ = null;


/**
 * Event handler for the app.
 * @type {goog.events.EventHandler}
 * @private
 */
piine.App.prototype.handler_ = null;


/**
 * Whether events are already attached.
 * @type {boolean}
 * @private
 */
piine.App.prototype.attached_ = false;


/** @override */
piine.App.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.view_.dispose();
  this.handler_.dispose();
};


/**
 * Attaches all events.
 */
piine.App.prototype.attachEvents = function() {
  if (!this.attached_) {
    this.handler_.listen(
        window,
        goog.events.EventType.UNLOAD,
        this.handleUnload);
    this.handler_.listen(
        goog.dom.getElement('add-user'),
        goog.events.EventType.CLICK,
        this.handleJoin);
    this.handler_.listen(
        goog.dom.getElement('remove-user'),
        goog.events.EventType.CLICK,
        this.handleLeave);
    this.handler_.listen(
        goog.dom.getElement('react-user'),
        goog.events.EventType.CLICK,
        this.handleReceivePiine);
    this.handler_.listen(
        goog.dom.getElement('ovation'),
        goog.events.EventType.CLICK,
        this.handleOvation);
    this.attached_ = true;
  }
};


/**
 * Detaches all events.
 */
piine.App.prototype.detachEvents = function() {
  if (this.attached_) {
    this.handler_.removeAll();
    this.attached_ = false;
  }
};


/**
 * Creates a view component.
 * @protected
 */
piine.App.prototype.createView = function() {
  return new piine.View();
};


/**
 * Creates an event handler.
 * @protected
 */
piine.App.prototype.createHandler = function() {
  return new goog.events.EventHandler(this);
};


/**
 * Renders the view.
 */
piine.App.prototype.render = function() {
  var viewElem = goog.dom.getElement(piine.App.VIEW_ID);
  this.view_.decorate(viewElem);
};


/**
 * Handles an unload event.
 * @param {goog.events.Event} e The event to handle.
 * @protected
 */
piine.App.prototype.handleUnload = function(e) {
  this.dispose();
};


/**
 * Handles a server response.
 * @param {Object} e The event to handle.
 * @protected
 */
piine.App.prototype.handleJoin = function(e) {
  this.view_.addUser(this.userCount_++);
};


/**
 * Handles a server response.
 * @param {Object} e The event to handle.
 * @protected
 */
piine.App.prototype.handleLeave = function(e) {
  if (this.userCount_ > 0) {
    this.view_.removeUser(this.userCount_--);
  }
};


/**
 * Handles a server response.
 * @protected
 */
piine.App.prototype.handleReceivePiine = function(e) {
  if (this.userCount_ > 0) {
    this.view_.reactUser(0);
  }
};


/**
 * Handles an ovation-button click event.
 * @param {Object} e The event to handle.
 * @protected
 */
piine.App.prototype.handleOvation = function(e) {
  this.ovation(piine.App.OVATION_DURATION);
};


/**
 * Ovations between the specified duration.
 * @param {number} duration Ovation time duration.
 */
piine.App.prototype.ovation = function(duration) {
  var timer = new goog.Timer(100);
  timer.start();
  timer.addEventListener(goog.Timer.TICK, this.handleTick, false, this);
  setTimeout(function() {
    timer.stop();
    timer.dispose();
  }, duration);
};


/**
 * Handles a timer tick.
 * @protected
 */
piine.App.prototype.handleTick = function() {
  var max = Math.random() * piine.App.MAX_SIMULTANEOUS_PIINE_IN_OVATION;
  for (var i = 0; i < max; i++) {
    this.view_.reactUser(Math.floor(Math.random() * this.userCount_));
  }
};
