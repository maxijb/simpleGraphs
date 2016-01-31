import {GenericGraph} from '../Common/GenericGraph';
import {BoxScales} from './BoxScales';
import {BoxAxis} from './BoxAxis';
import {Tooltip} from '../Common/Tooltip';


export function BoxGraph(...args) {
	GenericGraph.apply(this, args);
	this.render();
	this.bindTooltip();
}


BoxGraph.prototype = Object.assign({},
			  						GenericGraph.prototype, 
			  						BoxScales.prototype, 
			  						BoxAxis.prototype,
			  						Tooltip.prototype);


BoxGraph.prototype.boxRender = function() {
	
	this.generateScales()
		.generateAxis()
		.generateGrid();

	//select group and rects
	this.graph = this.svg
					.selectOrCreate('g', this.classNames.graph + " " + this.type)
					.applyTranslate(this.options.xAxisSpace + this.options.paddingH, this.options.paddingV); 
	
}


BoxGraph.prototype.render = function() {
	throw "'render()' method must be implemented by a final class";
}

