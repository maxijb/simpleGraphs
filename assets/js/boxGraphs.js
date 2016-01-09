import {default as commonInitialization, classNames} from './commonInitialization';
import {boxScaleFactory} from './scales';
import {displayBoxAxis} from './axis';


export function generateBarGraph(...args) {

		let {svg, keys, data, options, dimensions} = commonInitialization.apply(this, args);
		
		let scales = boxScaleFactory(keys, data, dimensions, options);
		displayBoxAxis(svg, keys, dimensions, scales, options);

		//select group and rects
		let graph = svg.selectOrCreate('g', classNames.graph + " bars");		
		graph.applyTranslate(options.xAxisSpace, options.paddingV); 
		

		let items = graph.selectAll("rect").data(data);

		//create new items as needed
		items
			.enter()
			.append("rect");

		items
		   .attr("x", (item, i) => scales.keys(i) - scales.barWidth /2)
		   .attr("y", (item) => item > 0 ? scales.data(item) : scales.data(0))
		   .attr("width", scales.barWidth)
		   .attr("height", (item, i) => Math.abs(scales.data(0) - scales.data(item))) 
		   .classed("negative", (item) => item < 0);

		//if axis need to be visible, must update the position of the graph


}
