d3.simpleGraphs = (() => {
	

	import {default} from './ExtendD3/extendSelection';
	import {BarGraph} from './Box/BarGraph';
	
	//every type of graph and its constructor
	const constructors = {
		"bars": BarGraph
	};

	
	//creates a new instance of the selected type of graph, passing all paramteres along
	function createGraph(Type, args) {
		return new (Function.prototype.bind.apply(Type, [this].concat(args)));
	}

	
	/* Returns an object whose keys are all types of graphs, 
	   its values the function to generate the generate the graph.
	   THIS IS THE EXPOSED PUBLIC API 
	*/
	return Object.keys(constructors).reduce((map, key) => {
    	map[key] = (...args) => { return createGraph(constructors[key], args); };
    	return map;
	}, {});


})();