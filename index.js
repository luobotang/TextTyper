var extend = require('extend')
var EventEmitter = require('eventemitter').EventEmitter

var defaults = {
	speed: 200 //  打印一个字的时间，单位 ms
}

var EVENT_PRINT_START = 'printStart'
var EVENT_PRINT_PAUSE = 'printPause'
var EVENT_PRINT_END = 'printEnd'

function TextTyper(container, options) {
	// 检查是否为 HTMLElement
	if (container && container.nodeType === 1) {
		this.el = container
	} else {
		throw new Error('need param <container> as {HTMLElment}')
	}

	this.opts = extend({}, defaults, options)
	this.printing = false
	this._queue = []
	this._event = new EventEmitter()
}

TextTyper.prototype.print = function (text) {
	var paragraphs = isArray(text) ? text : [text]
	this._queue = this._queue.concat(paragraphs)
	this._print()
	return this
}

TextTyper.prototype._print = function () {
	if (this.printing) return
	var pText = this._queue.shift()
	if (typeof pText === 'string' && pText.length > 0) {
		this.printing = true
		this._event.emit(EVENT_PRINT_START)
		var self = this
		var p = this._createParagraph()
		var i = 0
		var all = pText.length
		var timer = this._printTimer = setInterval(function () {
			if (i < all) {
				p.appendChild(self._createCharacter(pText[i]))
				i++
			} else {
				self.printing = false
				clearInterval(timer)
				self._print() // 继续打印下一段落
			}
		}, this.opts.speed);
	} else {
		this._event.emit(EVENT_PRINT_END)
	}
	return this
}

TextTyper.prototype._createParagraph = function () {
	var p = document.createElement('p')
	this.el.appendChild(p)
	return p
}

TextTyper.prototype._createCharacter = function (ch) {
	return document.createTextNode(ch)
}

TextTyper.prototype.pause = function () {
	if (this.printing) {
		this.printing = false
		clearInterval(this._printTimer)
		this._event.emit(EVENT_PRINT_PAUSE)
		this._event.emit(EVENT_PRINT_END)
	}
	return this
}

TextTyper.prototype.onStart = function (cb) {
	this._event.on(EVENT_PRINT_START, cb)
	return this
}

TextTyper.prototype.onPause = function (cb) {
	this._event.on(EVENT_PRINT_PAUSE, cb)
	return this
}

TextTyper.prototype.onEnd = function (cb) {
	this._event.on(EVENT_PRINT_END, cb)
	return this
}

function isArray(o) {
	return Object.prototype.toString.call(o) === '[object Array]'
}

module.exports = function (container, options) {
	return new TextTyper(container, options)
}