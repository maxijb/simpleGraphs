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
	export default function initialization(...args) {

		// find options 
		let importedOptions = typeof args[3] !== "undefined" ? args[3] :
						 typeof args[2] == "object" && !Array.isArray(args[2]) ? args[2] : {};
		
		//merge with default options
		let options = normalizeOptions(Object.assign({}, defaultOptions, importedOptions));

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


	//class names for the dom objects
	export const classNames = {
		svg: 'simpleGraph_svg',
		graph: 'simpleGraph_graph',
		xAxis: 'simpleGraph_xAxis simpleGraph_axis',
		yAxis: 'simpleGraph_yAxis simpleGraph_axis',
		grid: 'simpleGraph_grid'
	}

	const defaultOptions ={
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

