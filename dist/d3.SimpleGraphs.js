(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.BarGraph = BarGraph;

var _BoxGraph = require('./BoxGraph');

function BarGraph() {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	_BoxGraph.BoxGraph.apply(this, args);
}

BarGraph.prototype.render = function () {
	var _this = this;

	this.boxRender();

	var items = this.graph.selectAll("rect").data(this.data);

	//create new items as needed
	items.enter().append("rect");

	items.attr("x", function (item, i) {
		return _this.scales.keys(i) - _this.scales.barWidth / 2;
	}).attr("y", function (item) {
		return item > 0 ? _this.scales.data(item) : _this.scales.data(0);
	}).attr("width", this.scales.barWidth).attr("height", function (item, i) {
		return Math.abs(_this.scales.data(0) - _this.scales.data(item));
	}).classed("negative", function (item) {
		return item < 0;
	});
};

BarGraph.prototype = Object.assign({}, _BoxGraph.BoxGraph.prototype, BarGraph.prototype);

},{"./BoxGraph":3}],2:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.BoxAxis = BoxAxis;

function BoxAxis() {}

;

BoxAxis.prototype.generateAxis = function () {
  var _this = this;

  if (this.options.xAxis) {

    var xAxis = d3.svg.axis().scale(this.scales.keys).orient("bottom").tickFormat(function (d, i) {
      return _this.keys[i];
    });

    this.svg.selectOrCreate('g', this.classNames.xAxis).applyTranslate(this.options.xAxisSpace, this.dimensions.height - this.options.yAxisSpace).call(xAxis);
  }

  if (this.options.yAxis) {
    var yAxis = d3.svg.axis().scale(this.scales.data).orient("left");

    this.svg.selectOrCreate('g', this.classNames.yAxis).applyTranslate(this.options.yAxisSpace + this.options.paddingH, this.options.paddingV).call(yAxis);
  }

  return this;
};

BoxAxis.prototype.generateGrid = function () {

  if (this.options.grid) {

    var yAxisGrid = d3.svg.axis().scale(this.scales.data).orient("left");

    this.svg.selectOrCreate("g", this.classNames.grid).call(yAxisGrid.tickSize(-this.dimensions.width, 0, 0).tickFormat(""));
  }

  return this;
};

},{}],3:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.BoxGraph = BoxGraph;

var _CommonGenericGraph = require('../Common/GenericGraph');

var _BoxScales = require('./BoxScales');

var _BoxAxis = require('./BoxAxis');

function BoxGraph() {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	_CommonGenericGraph.GenericGraph.apply(this, args);
	this.render();
}

BoxGraph.prototype.boxRender = function () {

	this.generateScales().generateAxis().generateGrid();

	//select group and rects
	this.graph = this.svg.selectOrCreate('g', this.classNames.graph + " bars").applyTranslate(this.options.xAxisSpace, this.options.paddingV);
};

BoxGraph.prototype.render = function () {
	throw "'render()' method must be implemented by a final class";
};

BoxGraph.prototype = Object.assign({}, _CommonGenericGraph.GenericGraph.prototype, _BoxScales.BoxScales.prototype, _BoxAxis.BoxAxis.prototype, BoxGraph.prototype);

},{"../Common/GenericGraph":5,"./BoxAxis":2,"./BoxScales":4}],4:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.BoxScales = BoxScales;

function BoxScales() {}

;

BoxScales.prototype.generateScales = function () {

		//scales to be returned
		var k = d3.scale.linear(),
		    d = d3.scale.linear();

		//find padding and make it count when calculating range and barWidth
		//calculate padding
		var paddingH = this.options.paddingH + this.options.xAxisSpace;
		var paddingV = this.options.paddingV + this.options.yAxisSpace;
		var barWidth = this.options.barWidth || (this.dimensions.width - 2 * paddingH) / (this.options.barSpace * this.keys.length);

		var kDomain = isNaN(this.keys[0]) || this.options.equalSpaceBetweenKeys ? [0, this.keys.length - 1] : [d3.min(this.keys), d3.max(this.keys)];

		//if non numeric keys
		k.domain(kDomain).range([paddingH, this.dimensions.width - paddingH - barWidth / 2]);

		//get min data value
		var dMin = !this.options.forceZeroAsStart ? d3.min(this.data) : Math.min(0, d3.min(this.data));

		//create vertvial scale
		d.domain([dMin, d3.max(this.data)]).range([this.dimensions.height - paddingV, 0]);

		this.scales = {
				keys: k,
				data: d,
				barWidth: barWidth
		};

		return this;
};

},{}],5:[function(require,module,exports){
/* ---------------------------------- Common Initialization------------------ */
/* 
   Parses the common parameters.
   @Receives two up to four params
   Node root, [{key: string, value: number}] data
   Node root, [string] keys, [number] values
   Node root, [string] keys, [number] values, {} options
   Node root, [{key: string, value: number}] data, {} options
	   @return {svg, keys, data, options}
*/
'use strict';

exports.__esModule = true;
exports.GenericGraph = GenericGraph;

function GenericGraph() {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	// if no svg parent throw
	if (!args[0] || !args[0].nodeType) {
		throw "Dom node not selected";
	}

	// find options on the last paramenter, or empty options
	var importedOptions = Array.isArray(args[args.length - 1]) ? {} : args[args.length - 1];

	//merge with default options
	this.options = normalizeOptions(Object.assign({}, defaultOptions, importedOptions));
	this.classNames = Object.assign({}, defaultClassNames, this.options.classNames);
	this.svg = d3.select(args[0]).selectOrCreate('svg', this.classNames.svg);

	//if two separate arrays
	if (Array.isArray(args[2])) {

		this.keys = args[1];
		this.data = args[2];
	} else {
		//if {key, value} format
		var source = args[1];
		if (source[0].key && source[0].value) {
			this.key = source.map(function (x) {
				return x.key;
			});
			this.data = source.map(function (x) {
				return x.value;
			});
		} else {
			//else just values
			this.data = source;
			this.keys = [];
		}
	}

	//if responsive add onResize event
	if (this.options.responsive !== false) {
		window.addEventListener('resize', this.onResize.bind(this));
	}

	return this.setDimensions();
}

GenericGraph.prototype.onResize = function () {
	this.setDimensions();
	this.render();
};

GenericGraph.prototype.setDimensions = function () {
	if (this.options.width) this.svg.style('width', this.options.width);
	if (this.options.height) this.svg.style('height', this.options.height);

	//calculate dimensions
	this.dimensions = this.svg.node().getBoundingClientRect();
	return this;
};

/* ----------------------------------------- Private methods and data --------------- */

//class names for the dom objects
var defaultClassNames = {
	svg: 'simpleGraph_svg',
	graph: 'simpleGraph_graph',
	xAxis: 'simpleGraph_xAxis simpleGraph_axis',
	yAxis: 'simpleGraph_yAxis simpleGraph_axis',
	grid: 'simpleGraph_grid'
};

//default options for all graphs
var defaultOptions = {
	padding: 20,
	//paddingH and V override general padding
	paddingH: undefined,
	paddingV: undefined,
	barSpace: 1.2,
	axis: true,
	//xAxis and yAxis override general axis propertie
	xAxis: undefined,
	yAxis: undefined,
	axisSpace: 30,
	//space in pixels reserved to axis
	xAxisSpace: undefined,
	yAxisSpace: undefined,
	equalSpaceBetweenKeys: false,
	forceZeroAsStart: true,
	grid: true
};

// normalize options when a general option like axis can override both xAxis and yAxis
var toNormalize = [["xAxis", "axis"], ["yAxis", "axis"], ["xAxisSpace", "axisSpace"], ["yAxisSpace", "axisSpace"], ["paddingH", "padding"], ["paddingV", "padding"]];

function normalizeOptions(options) {
	for (var i = 0; i < toNormalize.length; i++) {
		if (typeof options[toNormalize[i][0]] == "undefined") options[toNormalize[i][0]] = options[toNormalize[i][1]];
	}

	if (!options.xAxis) options.xAxisSpace = 0;
	if (!options.yAxis) options.yAxisSpace = 0;

	return options;
}

},{}],6:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = {};

/* ----------------- Extending D3 library ------------- */

/* Selects and object with an optional class child of the previous selection. 
	If it doesn't find it, then creates it
	@param child: type of object "svg", "rect"
	@param className: String containing the name of the class for the new object
		@return found or created element
*/
d3.selection.prototype.selectOrCreate = function (child, className) {
	var classes = className.split(' ');
	var selection = this.selectAll(child);
	if (className) selection = selection.filter('.' + classes.join('.'));

	if (!selection.size()) {
		selection = this.append(child);
		classes.map(function (x) {
			return selection.classed(x, true);
		});
	}
	return selection;
};

d3.selection.prototype.applyTranslate = function (left, top) {
	this.style('transform', "translate(" + left + "px, " + top + "px)");
	return this;
};
module.exports = exports['default'];

},{}],7:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

d3.simpleGraphs = (function () {
	var _ExtendD3ExtendSelection = require('./ExtendD3/extendSelection');

	var _ExtendD3ExtendSelection2 = _interopRequireDefault(_ExtendD3ExtendSelection);

	var _BoxBarGraph = require('./Box/BarGraph');

	//every type of graph and its constructor
	var constructors = {
		"bars": _BoxBarGraph.BarGraph
	};

	//creates a new instance of the selected type of graph, passing all paramteres along
	function createGraph(Type, args) {
		return new (Function.prototype.bind.apply(Type, [this].concat(args)))();
	}

	/* Returns an object whose keys are all types of graphs, 
    its values the function to generate the generate the graph.
    THIS IS THE EXPOSED PUBLIC API 
 */
	return Object.keys(constructors).reduce(function (map, key) {
		map[key] = function () {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			return createGraph(constructors[key], args);
		};
		return map;
	}, {});
})();

},{"./Box/BarGraph":1,"./ExtendD3/extendSelection":6}]},{},[7]);
