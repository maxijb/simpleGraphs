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
	export function GenericGraph(...args) {

		// if no svg parent throw
		if (!args[0] || !args[0].nodeType) {
			throw "Dom node not selected";
		}

		// find options on the last paramenter, or empty options
		let importedOptions = Array.isArray(args[args.length - 1]) ? {} : args[args.length - 1];
		
		//merge with default options
		this.options = 		normalizeOptions(Object.assign({}, defaultOptions, importedOptions));
		this.classNames = 	Object.assign({}, defaultClassNames, this.options.classNames);
		this.svg = 			d3.select(args[0]).selectOrCreate('svg', this.classNames.svg);
		

		//if two separate arrays
		if (Array.isArray(args[2])) {
		
			this.keys = args[1];
			this.data = args[2];
		
		} else {
			//if {key, value} format
			let source = args[1];
			if (source[0].key && source[0].value) {
				this.key  = source.map(x => x.key);
				this.data = source.map(x => x.value);
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



	GenericGraph.prototype.onResize = function() {
		this.setDimensions();
		this.render();
	}

	GenericGraph.prototype.setDimensions = function() {
		if (this.options.width) this.svg.style('width', this.options.width);
		if (this.options.height) this.svg.style('height', this.options.height);

		//calculate dimensions
		this.dimensions = this.svg.node().getBoundingClientRect();
		return this;
	}


	/* ----------------------------------------- Private methods and data --------------- */

	//class names for the dom objects
	const defaultClassNames = {
		svg: 'simpleGraph_svg',
		graph: 'simpleGraph_graph',
		xAxis: 'simpleGraph_xAxis simpleGraph_axis',
		yAxis: 'simpleGraph_yAxis simpleGraph_axis',
		grid: 'simpleGraph_grid',
		trigger: 'simpleGraph_trigger',

	};

	//default options for all graphs
	const defaultOptions ={
			padding: 20,
			//paddingH and V override general padding
			paddingH: undefined,
			paddingV: undefined,
			barSpace: 1.2,
			yScaleExceed: 1.1,
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
			grid: true,
			//animation
			animation: true,
			duration: 600,
			//events
			showTooltip: 'mouseover',
			showHandlers: 'true',
			//area
			showTopLine: false

	};

	// normalize options when a general option like axis can override both xAxis and yAxis
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

