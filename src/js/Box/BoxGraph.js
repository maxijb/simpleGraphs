import {GenericGraph} from '../Common/GenericGraph';
import {BoxScales} from './BoxScales';
import {BoxAxis} from './BoxAxis';


export function BoxGraph(...args) {
	GenericGraph.apply(this, args);
	this.render();
}

BoxGraph.prototype.boxRender = function() {
	
	this.generateScales()
		.generateAxis()
		.generateGrid();

	//select group and rects
	this.graph = this.svg
					.selectOrCreate('g', this.classNames.graph + " bars")
					.applyTranslate(this.options.xAxisSpace, this.options.paddingV); 
	
}

BoxGraph.prototype.render = function() {
	throw "'render()' method must be implemented by a final class";
}

BoxGraph.prototype = Object.assign({},
			  						GenericGraph.prototype, 
			  						BoxScales.prototype, 
			  						BoxAxis.prototype,
			  						BoxGraph.prototype);