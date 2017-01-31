var P5 = require("p5/lib/p5.min.js");

var sketch = function($){
	var cols, rows;
	var cellSize = 15;
	var grid;
	var currentCell;
	var nextCell;
	var stack;
	var generate = true;
	var start;
	var end;
	var path;
	var tick;

	function generateNewMaze(){
		var s, e;
		cols = $.floor($.width / cellSize);
		rows = $.floor($.height / cellSize);

		generate = true;
		grid = [];
		stack = [];

		for(var j = 0; j < rows; j++){
			for(var i = 0; i < cols; i++){
				grid.push(new Cell(i, j, cellSize));
			}
		}

		currentCell = grid[0];
		currentCell.visited = true;

		while(generate){
			if((nextCell = currentCell.getNext(grid, cols, rows))){
				nextCell.visited = true;
				nextCell.neighbors.push(currentCell);
				currentCell.neighbors.push(nextCell);
				
				stack.push(currentCell);

				Cell.removeWalls(currentCell, nextCell);
				currentCell = nextCell;
			} else if (stack.length > 0) {
				currentCell = stack.pop();
			} else {
				generate = false;
			}
		}

		while(s === e){
			s = $.floor($.random(0, grid.length - 1));
			e = $.floor($.random(0, grid.length - 1));
		}
		start = grid[s];
		end = grid[e];
	}

	function getOptimalPath(start, end){
		var openSet = [];
		var closedSet = [];
		var path = [];
		var current;

		openSet.push(start);
		while(openSet.length > 0){
			var lowestIndex = 0;
			
			for(var k = 0; k < openSet.length; k++){
				if(openSet[k].f < openSet[lowestIndex].f) lowestIndex = k;
			}
			current = openSet[lowestIndex];

			if(current === end){
				path.push(current);
				while(current.previous){
					path.push(current.previous);
					current = current.previous;
				}
				return path;
			}

			for(var k = openSet.length -1; k >= 0; k--){
				if(openSet[k] === current) openSet.splice(k, 1);
			}
			closedSet.push(current);

			current.neighbors.forEach(function(e){
				if(!closedSet.includes(e)){
					var temp = current.g + 1;
					if(openSet.includes(e)){
						e.g = (temp < e.g) ? temp : e.g;
					} else {
						e.g = temp;
						openSet.push(e);
					}
					e.h = $.dist(e.i, e.j, end.i, end.j);
					e.f = e.g + e.h;
					e.previous = current;
				}
			});
		}
	}

	$.setup = function(){
		var canvas = $.createCanvas(600, 600);
		$.background(255);
		canvas.mouseClicked(function(){
			$.background(255);
			generateNewMaze();
			path = getOptimalPath(start, end);
			tick = path.length - 1;
			$.redraw();
		});
		generateNewMaze();
		path = getOptimalPath(start, end);
		tick = path.length - 1;
	};

	$.draw = function(){
		if(tick >= 0){
			path[tick].highlight(255 * (path.length - tick) / path.length, 255 * tick / path.length, 0, 255);
			tick--;
		} else {
			$.background(255);
			generateNewMaze();
			path = getOptimalPath(start, end);
			tick = path.length - 1;
			$.redraw();
		}

		start.highlight(0, 255, 0, 255);
		end.highlight(255, 0, 0, 255);

		for(var k = 0; k < grid.length; k++){
			grid[k].show();
		}

		//$.noLoop();
	};

	var Cell = function(i, j, size){
		this.i = i;
		this.j = j;
		this.f = 0;
		this.g = 0;
		this.h = 0;
		this.size = size;
		this.visited = false;
		this.neighbors = [];
		this.previous = undefined;
		this.walls = {
			right: true, 
			bottom: true
		};
	};

	Cell.index = function(i, j, cols, rows) {
		if(i < 0 || j < 0 || i > cols - 1 || j > rows - 1) return -1;
		return i + j * cols;
	};

	Cell.getNeighbors = function(grid, i, j, cols, rows){
		return [
			grid[Cell.index(i, j - 1, cols, rows)],
			grid[Cell.index(i + 1, j, cols, rows)],
			grid[Cell.index(i, j + 1, cols, rows)],
			grid[Cell.index(i - 1, j, cols, rows)]
		];
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

	Cell.prototype.getNext = function(grid, cols, rows){
		var check = Cell.getNeighbors(grid, this.i, this.j, cols, rows);
		var result = [];

		check.forEach(function(e){
			if(e && !e.visited) result.push(e);
		});

		if(result.length > 0) return result[$.floor($.random(result.length))];
	};

	Cell.prototype.highlight = function(r, g, b, a){
		var x = this.i * this.size;
		var y = this.j * this.size;
		$.noStroke();
		$.fill(r, g, b, a);
		$.rect(x, y, this.size, this.size);
	};
};

new P5(sketch);