import {classNames} from './commonInitialization';

export function boxScaleFactory(keys, data, dimensions, options) {
		let k, d, 
			keysItem = keys;

		//if non numeric keys
		if (isNaN(keys[0]) || options.equalSpaceBetweenKeys) {
			k = d3.scale.linear().domain([0, keys.length-1]);
		} else {
			k = d3.scale.linear().domain([d3.min(keys), d3.max(keys)]);
		}

		//find padding and make it count when calculating range and barWidth
		let paddingH = options.paddingH;
		//xAxis space
		paddingH += options.xAxis ? options.xAxisSpace : 0;
		let barWidth = options.barWidth || (dimensions.width - 2 * paddingH) / (options.barSpace * keys.length);

		k.range([0 + paddingH, dimensions.width - paddingH - barWidth/2]);

		//get min data value
		let min = !options.forceZeroAsStart ? d3.min(data) : Math.min(0, d3.min(data));
		let negativeNumbers = min < 0;

		//calculate padding
		let paddingV = options.paddingV + options.yAxisSpace;

		//create vertvial scale
		d = d3.scale.linear()
			.domain([min, d3.max(data)])
			.range([dimensions.height - paddingV, 0]);

		return {keys: k, data: d, barWidth, negativeNumbers, paddingH, paddingV};
	}