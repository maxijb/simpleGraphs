import {BoxGraph} from './BoxGraph';


export function BarGraph(...args) {
	BoxGraph.apply(this, args);
}

BarGraph.prototype.render = function() {
	
	this.boxRender();

	let items = this.graph.selectAll("rect").data(this.data);

	//create new items as needed
	items
		.enter()
		.append("rect");

	items
	   .attr("x", (item, i) => this.scales.keys(i) - this.scales.barWidth / 2)
	   .attr("y", (item) => item > 0 ? this.scales.data(item) : this.scales.data(0))
	   .attr("width", this.scales.barWidth)
	   .attr("height", (item, i) => Math.abs(this.scales.data(0) - this.scales.data(item))) 
	   .classed("negative", (item) => item < 0);

}

BarGraph.prototype = Object.assign({}, BoxGraph.prototype, BarGraph.prototype);
			