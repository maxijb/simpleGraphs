export function BoxScales() {};

BoxScales.prototype.generateScales = function()  {
		
		//scales to be returned
		let k = d3.scale.linear(),
		 	d = d3.scale.linear(); 

		//find padding and make it count when calculating range and barWidth
		//calculate padding
		let paddingH = this.options.paddingH + this.options.xAxisSpace;
		let paddingV = this.options.paddingV + this.options.yAxisSpace;
		let barWidth = this.options.barWidth || (this.dimensions.width - 2 * paddingH) / (this.options.barSpace * this.keys.length);
		
		let kDomain = (isNaN(this.keys[0]) || this.options.equalSpaceBetweenKeys) ?
				[0, this.keys.length-1]
				:
				[d3.min(this.keys), d3.max(this.keys)];

		//if non numeric keys
		k.domain(kDomain)
		 .range([paddingH, this.dimensions.width - paddingH - barWidth / 2]);

		//get min data value
		let dMin = !this.options.forceZeroAsStart ? d3.min(this.data) : Math.min(0, d3.min(this.data));

		//create vertvial scale
		d.domain([dMin, d3.max(this.data)])
		  .range([this.dimensions.height - paddingV, 0]);

		this.scales = {
			keys: k,
			data: d,
			barWidth
		};

		return this;
}