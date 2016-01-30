import {BoxGraph} from './BoxGraph';


export function LineGraph(...args) {
	this.type = 'line';
	BoxGraph.apply(this, args);
}

LineGraph.prototype = Object.assign({}, BoxGraph.prototype);


LineGraph.prototype.render = function() {
	
	//area graphs inherit this method
	if (this.type == 'line') this.boxRender();

	let {lineData, lineData0} = this.getFormattedData();

	let line = this.graph.selectOrCreate("path", 'line');

	if (this.options.animation) {
		line = line.attr('d', this.lineFunction(lineData0))
				.transition()
				.duration(this.options.duration)

		if (this.type == 'line' && this.options.showHandlers) {
			line.each('end', this.addCircles(lineData));
		}
				
	} 
	
	line.attr('d', this.lineFunction(lineData));

	if (this.type == 'line' && !this.options.animation && this.options.showHandlers) {
			line.each('end', this.addCircles(lineData));
	}

}


LineGraph.prototype.getFormattedData = function() {
	
	return {
		
		lineData: this.data.map((item, i) => {
			return {
				x: this.scales.keys(i), 
				y: this.scales.data(item)
			}
		}),

		lineData0: this.data.map((item, i) => {
			return {
				x: this.scales.keys(i), 
				y: this.scales.data.range()[0]
			}
		})
	};
}

LineGraph.prototype.lineFunction = d3.svg.line()
									.x(d => d.x)
									.y(d => d.y)
									.interpolate('monotone');


LineGraph.prototype.addCircles = function(data) {
	
	let items = this.graph
					.selectAll('circle')
					.data(data);

	items.enter().append('circle')
					.classed(this.classNames.trigger, true);

	items
		.attr('cx', d => d.x)
		.attr('cy', d => d.y)
		.attr('r', 6);
}


LineGraph.prototype.adjustLabels = function() {
	let axis = this.svg.select("g."+this.classNames.xAxis.replace(" ", "."));

	axis.applyTranslate(this.options.yAxisSpace + this.options.paddingH, this.graphDimensions.height + this.options.paddingV)

	axis.select("path")
		.attr('d', "M"+(-this.options.yAxisSpace)+",0H"+(this.graphDimensions.width - this.scales.barWidth / 2));

	return this;
}			