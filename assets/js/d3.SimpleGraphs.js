d3.simpleGraphs = (() => {
	

	import {default} from './extendSelection';
	import {generateBarGraph} from './boxGraphs';
	
	let mainGenerator = (generator, ...args) => {
		let start = Function.prototype.bind.apply(generator, [this].concat(args));
		start();
		
		//if options.responsive === false, do not bind window.resize
		if (typeof args[args.length -1] === "object" && args[args.length -1].responsive === false) {
			return;
		} else {
			window.addEventListener('resize', start);
		}
	}
	

	return {
		bars: (...args) => { mainGenerator.apply(this, [generateBarGraph].concat(args)) }
	}
	

})();