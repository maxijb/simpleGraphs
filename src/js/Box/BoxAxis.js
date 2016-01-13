export function BoxAxis() {};

BoxAxis.prototype.generateAxis = function() { 

	if (this.options.xAxis) {
		
    var xAxis = d3.svg.axis()
                  .scale(this.scales.keys)
                  .orient("bottom")
                  .tickFormat((d, i) => this.keys[i] );

        this.svg.selectOrCreate('g', this.classNames.xAxis)
        	.applyTranslate(this.options.xAxisSpace, this.dimensions.height - this.options.yAxisSpace)
        	.call(xAxis);
    }

	if (this.options.yAxis) {
        var yAxis = d3.svg.axis()
                  .scale(this.scales.data)
                  .orient("left");
                  
        this.svg.selectOrCreate('g', this.classNames.yAxis)
        	.applyTranslate(this.options.yAxisSpace+this.options.paddingH, this.options.paddingV)
        	.call(yAxis);
	}

  return this;
	
}

BoxAxis.prototype.generateGrid = function() {
  
  if (this.options.grid) {
    
    var yAxisGrid = d3.svg.axis()
                  .scale(this.scales.data)
                  .orient("left");
        

    this.svg.selectOrCreate("g", this.classNames.grid)         
          .call(yAxisGrid
              .tickSize(-this.dimensions.width, 0, 0)
              .tickFormat("")
          );
  }

  return this;
}