export function Tooltip() {};

Tooltip.prototype.bindTooltip = function() {
	
	if (!this.options.showTooltip) return this;

	this.graph.selectAll('.'+this.classNames.trigger)
		.on(this.options.showTooltip, function() {
			console.log('show Tooltip'); 
		});

}