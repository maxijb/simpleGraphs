export function BoxScales() {};

BoxScales.prototype.generateScales = function()  {
		
		//scales to be returned
		let k = d3.scale.linear(),
		 	d = d3.scale.linear(); 

		//find padding and make it count when calculating range and barWidth
		//calculate padding

		this.graphDimensions = {
			width: this.dimensions.width - this.options.yAxisSpace - 2 * this.options.paddingH,
			height: this.dimensions.height - this.options.xAxisSpace - 2 * this.options.paddingV 
		};

		let barWidth = this.options.barWidth || this.graphDimensions.width / this.keys.length / this.options.barSpace;
		
		let kDomain = (isNaN(this.keys[0]) || this.options.equalSpaceBetweenKeys) ?
				[0, this.keys.length-1]
				:
				[d3.min(this.keys), d3.max(this.keys)];

		//if non numeric keys
		k.domain(kDomain)
		 .range([0, this.graphDimensions.width - barWidth]);

		//get min data value
		let dMin = !this.options.forceZeroAsStart ? d3.min(this.data) : Math.min(0, d3.min(this.data));

		//create vertvial scale
		d.domain([dMin * this.options.yScaleExceed, d3.max(this.data) * this.options.yScaleExceed ])
		  .range([this.graphDimensions.height, 0]);

		this.scales = {
			keys: k,
			data: d,
			barWidth
		};

		return this;
}