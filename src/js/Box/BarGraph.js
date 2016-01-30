import {BoxGraph} from './BoxGraph';


export function BarGraph(...args) {
	this.type =  'bars';
	BoxGraph.apply(this, args);
}

BarGraph.prototype = Object.assign({}, BoxGraph.prototype);

BarGraph.prototype.render = function() {
	
	this.boxRender();

	let items = this.graph.selectAll("rect").data(this.data);

	//create new items as needed
	items
		.enter()
		.append("rect");

	items
	   .attr("x", (item, i) => this.scales.keys(i))
	   .attr("width", this.scales.barWidth)
	   .classed("negative", (item) => item < 0)
	   .classed(this.classNames.trigger, true);

	if (this.options.animation) {
		items = items.attr("y", (item) => this.scales.data(0))
			   .attr('height', 0)
			   .transition()
			   .duration(this.options.duration);
	}
	   
	   items
	   .attr("height", (item, i) => Math.abs(this.scales.data(0) - this.scales.data(item))) 
	   .attr("y", (item) => item > 0 ? this.scales.data(item) : this.scales.data(0))

}


BarGraph.prototype.adjustLabels = function() {
	let axis = this.svg.select("g."+this.classNames.xAxis.replace(" ", "."));

	axis.applyTranslate(this.options.yAxisSpace + this.options.paddingH + this.scales.barWidth / 2, this.graphDimensions.height + this.options.paddingV)

	axis.select("path")
		.attr('d', "M"+(-this.options.yAxisSpace - this.scales.barWidth / 2)+",0H"+(this.graphDimensions.width - this.scales.barWidth / 2));

	//axis.select(".tick").applyTranslate(this.scales.barWidth / 2, 0);

	return this;
}			