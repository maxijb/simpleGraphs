import {BoxGraph} from './BoxGraph';
import {LineGraph} from './LineGraph';


export function AreaGraph(...args) {
	this.type = 'area';
	BoxGraph.apply(this, args);
}

AreaGraph.prototype = Object.assign({}, BoxGraph.prototype, LineGraph.prototype);

AreaGraph.prototype.render = function() {
	
	this.boxRender();

	let line = this.graph.selectOrCreate("path", 'area');

	//line at the top of the area
	if (this.options.showTopLine) LineGraph.prototype.render.call(this);
	
	let {lineData, lineData0} = this.getFormattedData();
	//for circles
	let origData = lineData.slice();

	//add start and finishing point of the area
	const firstPoint = {x: this.scales.keys(0), y: this.scales.data.range()[0]};
	const lastPoint = {x: this.scales.keys(this.keys.length-1), y: this.scales.data.range()[0]};

	lineData.unshift(firstPoint);
	lineData.push(lastPoint);
	lineData0.unshift(firstPoint);
	lineData0.push(lastPoint);


	if (this.options.animation) {
		line = line.attr('d', this.lineFunction(lineData0))
				.transition()
				.duration(this.options.duration)

		if (this.options.showHandlers) {
			line.each('end', this.addCircles(origData));
		}
				
	} 
	
	line.attr('d', this.lineFunction(lineData));

	if (!this.options.animation && this.options.showHandlers) {
			line.each('end', this.addCircles(origData));
	}


	

}

