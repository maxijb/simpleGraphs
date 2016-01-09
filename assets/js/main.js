d3.simpleGraphs = (() => {
	
	let bars = (...args) => {
		let start = Function.prototype.bind.apply(generateBarGraph, [this].concat(args));
		start();
		window.addEventListener('resize', start);
	};

	function generateBarGraph(...args) {

		let {svg, keys, data, options, dimensions} = parseCommonParams.apply(this, args);
		
		let scales = generateBarScales(keys, data, dimensions, options);

		//select group and rects
		let graph = svg.selectOrCreate('g', classNames.graph + " bars");		
		let items = graph.selectAll("rect").data(data);

		//create new items as needed
		items.enter().append("rect");

		items
		   .attr("x", (item, i) => scales.keys(i) - scales.barWidth /2)
		   .attr("y", (item) => item > 0 ? scales.data(item) : scales.data(0))
		   .attr("width", scales.barWidth)
		   .attr("height", (item, i) => Math.abs(scales.data(0) - scales.data(item))) 
		   .classed("negative", (item) => item < 0);

		//if axis need to be visible, must update the position of the graph
		graph.applyTranslate(options.xAxisSpace, options.paddingV); 

		if (options.xAxis) {
			var xAxis = d3.svg.axis()
	                  .scale(scales.keys)
	                  .orient("bottom")
	                  .tickFormat(function(d, i){
					    return keys[i];
					  });
	        svg.selectOrCreate('g', classNames.xAxis)
	        	.applyTranslate(options.xAxisSpace, dimensions.height-options.yAxisSpace)
	        	.call(xAxis);
	    }

		if (options.yAxis) {
	        var yAxis = d3.svg.axis()
	                  .scale(scales.data)
	                  .orient("left");
	                  
	        svg.selectOrCreate('g', classNames.yAxis)
	        	.applyTranslate(options.yAxisSpace+options.paddingH, options.paddingV)
	        	.call(yAxis);
		}
	}





	function generateBarScales(keys, data, dimensions, options) {
		let k, d, 
			keysItem = keys;

		//if non numeric keys
		if (isNaN(keys[0]) || options.equalSpaceBetweenKeys) {
			k = d3.scale.linear().domain([0, keys.length-1]);
		} else {
			k = d3.scale.linear().domain([d3.min(keys), d3.max(keys)]);
		}

		//find padding and make it count when calculating range and barWidth
		let paddingH = options.paddingH;
		//xAxis space
		paddingH += options.xAxis ? options.xAxisSpace : 0;
		let barWidth = options.barWidth || (dimensions.width - 2 * paddingH) / (options.barSpace * keys.length);

		k.range([0 + paddingH, dimensions.width - paddingH - barWidth/2]);

		//get min data value
		let min = !options.forceZeroAsStart ? d3.min(data) : Math.min(0, d3.min(data));
		let negativeNumbers = min < 0;

		//calculate padding
		let paddingV = options.paddingV + options.yAxisSpace;

		//create vertvial scale
		console.log(data);
		console.log("seting data scale from: ",min, d3.max(data), "to", (dimensions.height - paddingV), (0+paddingV));
		window.d = d = d3.scale.linear()
				.domain([min, d3.max(data)])
				.range([dimensions.height - paddingV, 0]);

		return {keys: k, data: d, barWidth, negativeNumbers, paddingH, paddingV};
	}




	/* ---------------------------------- Common ------------------ */

	/* 
	   Parses the common parameters.
	   @Receives two up to four params
	   Node root, [{key: string, value: number}] data
	   Node root, [string] keys, [number] values
	   Node root, [string] keys, [number] values, {} options
	   Node root, [{key: string, value: number}] data, {} options

	   @return {svg, keys, data, options}
	*/
	function parseCommonParams(...args) {

		// find options
		let importedOptions = typeof args[3] !== "undefined" ? args[3] :
						 typeof args[2] == "object" && !Array.isArray(args[2]) ? args[2] : {};
		
		//merge with default options
		let options = normalizeOptions(Object.assign(getDefaultOptions(), importedOptions));

		//svg frame
		if (!args[0] || !args[0].nodeType) {
			throw "Dom node not selected";
		}
		
		//find and remove existing svg
		let parent = d3.select(args[0]);

		let svg = parent.selectOrCreate('svg', classNames.svg);
		
		if (options.width) svg.style('width', options.width);
		if (options.height) svg.style('height', options.height);

		//calculate dimensions
		let dimensions = svg.node().getBoundingClientRect();



		//data and keys
		let data, keys;
		//if two separate arrays
		if (Array.isArray(args[2])) {
			keys = args[1];
			data = args[2];
		} else {
			//if {key, value} format
			let source = args[1];
			if (source[0].key && source[0].value) {
				key  = source.map(x => x.key);
				data = source.map(x => x.value);
			} else {
			//else just values
				data = source;
				keys = [];
			}
		}


		return {svg, keys, data, options, dimensions};
	}



	function getDefaultOptions() {
		return {
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
		};
	}

	//class names for the dom objects
	const classNames = {
		svg: 'simpleGraph_svg',
		graph: 'simpleGraph_graph',
		xAxis: 'simpleGraph_xAxis simpleGraph_axis',
		yAxis: 'simpleGraph_yAxis simpleGraph_axis'

	}

	const toNormalize = [
			["xAxis", "axis"],
			["yAxis", "axis"],
			["xAxisSpace", "axisSpace"],
			["yAxisSpace", "axisSpace"],
			["paddingH", "padding"],
			["paddingV", "padding"]
		];

	function normalizeOptions(options) {
		for (let i = 0; i < toNormalize.length; i++) {
			if (typeof options[toNormalize[i][0]] == "undefined") options[toNormalize[i][0]] = options[toNormalize[i][1]];
		}

		if (!options.xAxis) options.xAxisSpace = 0;
		if (!options.yAxis) options.yAxisSpace = 0;

		return options;
	}


	/* ----------------- Extending D3 library ------------- */

	/* Selects and object with an optional class child of the previous selection. 
		If it doesn't find it, then creates it
		@param child: type of object "svg", "rect"
		@param className: String containing the name of the class for the new object

		@return found or created element
	*/
	d3.selection.prototype.selectOrCreate = function(child, className) {
		let classes = className.split(' ');
		let selection = this.select(child);
		if (className) selection = selection.filter('.'+classes.join('.'));
		
		if (!selection.size()) {
			selection = this.append(child);
			classes.map(x => selection.classed(x, true));
		}
		return selection;

	}

	d3.selection.prototype.applyTranslate = function(left, top) {
		this.style('transform', "translate("+left+"px, "+top+"px)");
		return this;
	}


	return {bars}
})();