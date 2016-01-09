import {classNames} from './commonInitialization';

export function displayBoxAxis(svg, keys, dimensions, scales, options) { 
	if (options.xAxis) {
		var xAxis = d3.svg.axis()
                  .scale(scales.keys)
                  .orient("bottom")
                  .tickFormat(function(d, i){
				    return keys[i];
				  });
        svg.selectOrCreate('g', classNames.xAxis)
        	.applyTranslate(options.xAxisSpace, dimensions.height-options.yAxisSpace)
        	.call(xAxis);
    }

	if (options.yAxis) {
        var yAxis = d3.svg.axis()
                  .scale(scales.data)
                  .orient("left");
                  
        svg.selectOrCreate('g', classNames.yAxis)
        	.applyTranslate(options.yAxisSpace+options.paddingH, options.paddingV)
        	.call(yAxis);
	}

	if (options.grid) {
		var yAxisGrid = d3.svg.axis()
                  .scale(scales.data)
                  .orient("left");
        

		svg.selectOrCreate("g", classNames.grid)         
	        .call(yAxisGrid
	            .tickSize(-dimensions.width, 0, 0)
	            .tickFormat("")
	        );
	}
}