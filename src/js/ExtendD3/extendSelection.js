export default {}

/* ----------------- Extending D3 library ------------- */

	/* Selects and object with an optional class child of the previous selection. 
		If it doesn't find it, then creates it
		@param child: type of object "svg", "rect"
		@param className: String containing the name of the class for the new object

		@return found or created element
	*/
	d3.selection.prototype.selectOrCreate = function(child, className) {
		let classes = !className ? [] : className.split(' ');
		let selection = this.selectAll(child);
		if (className) selection = selection.filter('.'+classes.join('.'));
		
		if (!selection.size()) {
			selection = this.append(child);
			classes.map(x => selection.classed(x, true));
		}
		return selection;

	}

	d3.selection.prototype.applyTranslate = function(left, top) {
		this.style('transform', "translate("+left+"px, "+top+"px)");
		return this;
	}