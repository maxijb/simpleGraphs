(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.displayBoxAxis = displayBoxAxis;

var _commonInitialization = require('./commonInitialization');

function displayBoxAxis(svg, keys, dimensions, scales, options) {
  if (options.xAxis) {
    var xAxis = d3.svg.axis().scale(scales.keys).orient("bottom").tickFormat(function (d, i) {
      return keys[i];
    });
    svg.selectOrCreate('g', _commonInitialization.classNames.xAxis).applyTranslate(options.xAxisSpace, dimensions.height - options.yAxisSpace).call(xAxis);
  }

  if (options.yAxis) {
    var yAxis = d3.svg.axis().scale(scales.data).orient("left");

    svg.selectOrCreate('g', _commonInitialization.classNames.yAxis).applyTranslate(options.yAxisSpace + options.paddingH, options.paddingV).call(yAxis);
  }

  if (options.grid) {
    var yAxisGrid = d3.svg.axis().scale(scales.data).orient("left");

    svg.selectOrCreate("g", _commonInitialization.classNames.grid).call(yAxisGrid.tickSize(-dimensions.width, 0, 0).tickFormat(""));
  }
}

},{"./commonInitialization":3}],2:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.generateBarGraph = generateBarGraph;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _commonInitialization = require('./commonInitialization');

var _commonInitialization2 = _interopRequireDefault(_commonInitialization);

var _scales = require('./scales');

var _axis = require('./axis');

function generateBarGraph() {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
		}

		var _commonInitialization$apply = _commonInitialization2['default'].apply(this, args);

		var svg = _commonInitialization$apply.svg;
		var keys = _commonInitialization$apply.keys;
		var data = _commonInitialization$apply.data;
		var options = _commonInitialization$apply.options;
		var dimensions = _commonInitialization$apply.dimensions;

		var scales = _scales.boxScaleFactory(keys, data, dimensions, options);
		_axis.displayBoxAxis(svg, keys, dimensions, scales, options);

		//select group and rects
		var graph = svg.selectOrCreate('g', _commonInitialization.classNames.graph + " bars");
		graph.applyTranslate(options.xAxisSpace, options.paddingV);

		var items = graph.selectAll("rect").data(data);

		//create new items as needed
		items.enter().append("rect");

		items.attr("x", function (item, i) {
				return scales.keys(i) - scales.barWidth / 2;
		}).attr("y", function (item) {
				return item > 0 ? scales.data(item) : scales.data(0);
		}).attr("width", scales.barWidth).attr("height", function (item, i) {
				return Math.abs(scales.data(0) - scales.data(item));
		}).classed("negative", function (item) {
				return item < 0;
		});

		//if axis need to be visible, must update the position of the graph
}

},{"./axis":1,"./commonInitialization":3,"./scales":6}],3:[function(require,module,exports){
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
"use strict";

exports.__esModule = true;
exports["default"] = initialization;

function initialization() {

	// find options
	var importedOptions = typeof arguments[3] !== "undefined" ? arguments[3] : typeof arguments[2] == "object" && !Array.isArray(arguments[2]) ? arguments[2] : {};

	//merge with default options
	var options = normalizeOptions(Object.assign({}, defaultOptions, importedOptions));

	//svg frame
	if (!arguments[0] || !arguments[0].nodeType) {
		throw "Dom node not selected";
	}

	//find and remove existing svg
	var parent = d3.select(arguments[0]);

	var svg = parent.selectOrCreate('svg', classNames.svg);

	if (options.width) svg.style('width', options.width);
	if (options.height) svg.style('height', options.height);

	//calculate dimensions
	var dimensions = svg.node().getBoundingClientRect();

	//data and keys
	var data = undefined,
	    keys = undefined;
	//if two separate arrays
	if (Array.isArray(arguments[2])) {
		keys = arguments[1];
		data = arguments[2];
	} else {
		//if {key, value} format
		var source = arguments[1];
		if (source[0].key && source[0].value) {
			key = source.map(function (x) {
				return x.key;
			});
			data = source.map(function (x) {
				return x.value;
			});
		} else {
			//else just values
			data = source;
			keys = [];
		}
	}

	return { svg: svg, keys: keys, data: data, options: options, dimensions: dimensions };
}

//class names for the dom objects
var classNames = {
	svg: 'simpleGraph_svg',
	graph: 'simpleGraph_graph',
	xAxis: 'simpleGraph_xAxis simpleGraph_axis',
	yAxis: 'simpleGraph_yAxis simpleGraph_axis',
	grid: 'simpleGraph_grid'
};

exports.classNames = classNames;
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

var toNormalize = [["xAxis", "axis"], ["yAxis", "axis"], ["xAxisSpace", "axisSpace"], ["yAxisSpace", "axisSpace"], ["paddingH", "padding"], ["paddingV", "padding"]];

function normalizeOptions(options) {
	for (var i = 0; i < toNormalize.length; i++) {
		if (typeof options[toNormalize[i][0]] == "undefined") options[toNormalize[i][0]] = options[toNormalize[i][1]];
	}

	if (!options.xAxis) options.xAxisSpace = 0;
	if (!options.yAxis) options.yAxisSpace = 0;

	return options;
}

},{}],4:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

d3.simpleGraphs = (function () {
	var _extendSelection = require('./extendSelection');

	var _extendSelection2 = _interopRequireDefault(_extendSelection);

	var _boxGraphs = require('./boxGraphs');

	var mainGenerator = function mainGenerator(generator) {
		for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			args[_key - 1] = arguments[_key];
		}

		var start = Function.prototype.bind.apply(generator, [undefined].concat(args));
		start();

		//if options.responsive === false, do not bind window.resize
		if (typeof args[args.length - 1] === "object" && args[args.length - 1].responsive === false) {
			return;
		} else {
			window.addEventListener('resize', start);
		}
	};

	return {
		bars: function bars() {
			for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				args[_key2] = arguments[_key2];
			}

			mainGenerator.apply(undefined, [_boxGraphs.generateBarGraph].concat(args));
		}
	};
})();

},{"./boxGraphs":2,"./extendSelection":5}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.boxScaleFactory = boxScaleFactory;

var _commonInitialization = require('./commonInitialization');

function boxScaleFactory(keys, data, dimensions, options) {
	var k = undefined,
	    d = undefined,
	    keysItem = keys;

	//if non numeric keys
	if (isNaN(keys[0]) || options.equalSpaceBetweenKeys) {
		k = d3.scale.linear().domain([0, keys.length - 1]);
	} else {
		k = d3.scale.linear().domain([d3.min(keys), d3.max(keys)]);
	}

	//find padding and make it count when calculating range and barWidth
	var paddingH = options.paddingH;
	//xAxis space
	paddingH += options.xAxis ? options.xAxisSpace : 0;
	var barWidth = options.barWidth || (dimensions.width - 2 * paddingH) / (options.barSpace * keys.length);

	k.range([0 + paddingH, dimensions.width - paddingH - barWidth / 2]);

	//get min data value
	var min = !options.forceZeroAsStart ? d3.min(data) : Math.min(0, d3.min(data));
	var negativeNumbers = min < 0;

	//calculate padding
	var paddingV = options.paddingV + options.yAxisSpace;

	//create vertvial scale
	d = d3.scale.linear().domain([min, d3.max(data)]).range([dimensions.height - paddingV, 0]);

	return { keys: k, data: d, barWidth: barWidth, negativeNumbers: negativeNumbers, paddingH: paddingH, paddingV: paddingV };
}

},{"./commonInitialization":3}]},{},[4]);
