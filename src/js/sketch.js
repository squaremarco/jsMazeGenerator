var P5 = require("p5");

var sketch = function($){
	var cols, rows;
	var cellSize = 20;
	var grid = [];
	var currentCell;
	var nextCell;
	var stack = [];
	var loop = true;

	$.setup = function(){
		$.createCanvas(500, 500);
		// $.frameRate(1);
		cols = $.floor($.width / cellSize);
		rows = $.floor($.height / cellSize);

		for(var j = 0; j < rows; j++){
			for(var i = 0; i < cols; i++){
				grid.push(new Cell(i, j, cellSize));
			}
		}

		currentCell = grid[0];
		currentCell.visited = true;

		while(loop){
			if((nextCell = currentCell.getNext())){
				nextCell.visited = true;

				stack.push(currentCell);

				Cell.removeWalls(currentCell, nextCell);

				currentCell = nextCell;
			} else if (stack.length > 0) {
				currentCell = stack.pop();
			} else {
				loop = false;
			}
		}
	};

	$.draw = function(){
		$.background(255);

		for(var i = 0; i < grid.length; i++){
			grid[i].show();
		}

		// currentCell.highlight();

		// if((nextCell = currentCell.getNext())){
		// 	nextCell.visited = true;

		// 	stack.push(currentCell);

		// 	Cell.removeWalls(currentCell, nextCell);

		// 	currentCell = nextCell;
		// } else if (stack.length > 0) {
		// 	currentCell = stack.pop();
		// }
	};

	var Cell = function(i, j, size){
		this.i = i;
		this.j = j;
		this.size = size;
		this.visited = false;
		this.walls = {
			right: true, 
			bottom: true
		};
	};

	Cell.index = function(i, j) {
		if(i < 0 || j < 0 || i > cols - 1 || j > rows - 1) return -1;
		return i + j * cols;
	};

	Cell.removeWalls = function(a, b){
		var i = b.i - a.i;
		var j = b.j - a.j;

		if(i === 1) a.walls.right = false;

		if(i === -1) b.walls.right = false;

		if(j === 1) a.walls.bottom = false;

		if(j === -1) b.walls.bottom = false;
	};

	Cell.prototype.show = function(){
		var x = this.i * this.size;
		var y = this.j * this.size;
		$.stroke(0);

		if(this.walls.right) {
			$.line(x + this.size, y, x + this.size, y + this.size); // Right
		}

		if(this.walls.bottom) {
			$.line(x, y + this.size, x + this.size, y + this.size); // Bottom
		}
	};

	Cell.prototype.getNext = function(){
		var i = this.i;
		var j = this.j;
		var neighbors = [];
		var check = [
		grid[Cell.index(i, j - 1)],
		grid[Cell.index(i + 1, j)],
		grid[Cell.index(i, j + 1)],
		grid[Cell.index(i - 1, j)]
		];

		check.forEach(function(e){
			if(e && !e.visited) neighbors.push(e);
		});

		if(neighbors.length > 0) return neighbors[$.floor($.random(neighbors.length))];
	};

	Cell.prototype.highlight = function(){
		var x = this.i * this.size;
		var y = this.j * this.size;
		$.noStroke();
		$.fill(18, 129, 109, 200);
		$.rect(x, y, this.size, this.size);
	}
};

new P5(sketch);