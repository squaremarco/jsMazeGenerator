"use strict";

const Cell = require("./cell.js");
const Grid = require("./grid.js");

const Maze = function(cols, rows, cellSize, P5){
	Grid.call(this, cols, rows, cellSize, P5);

	this.start = undefined;
	this.end = undefined;
};

//maze extends grid
Maze.prototype = Object.create(Grid.prototype);
Maze.prototype.constructor = Maze;

Maze.prototype.generateMaze = function(){
	let looping = true;
	let stack = [];
	let s, e;

	let currentCell = this.grid[0];
	currentCell.visited = true;

	while(looping){
		let nextCell = this.getRandomNeighbor(
			currentCell.i, 
			currentCell.j,
			(e) => !!e && !e.visited
		);
		if(nextCell){
			nextCell.visited = true;
			nextCell.connectedTo.push(currentCell);
			currentCell.connectedTo.push(nextCell);
			
			stack.push(currentCell);

			Cell.removeWalls(currentCell, nextCell);
			currentCell = nextCell;
		} else if (stack.length > 0) {
			currentCell = stack.pop();
		} else {
			looping = false;
		}
	}

	//choose random start and end
	while(s === e){
		s = this.P5.floor(this.P5.random(0, this.grid.length - 1));
		e = this.P5.floor(this.P5.random(0, this.grid.length - 1));
	}
	this.start = this.grid[s];
	this.end = this.grid[e];
};

Maze.prototype.getOptimalPath = function(){
	let openSet = [];
	let closedSet = [];
	let path = [];
	let currentCell;

	openSet.push(this.start);
	while(openSet.length > 0){
		let lowestIndex = 0;
			
		for(let k = 0; k < openSet.length; k++){
			if(openSet[k].f < openSet[lowestIndex].f) lowestIndex = k;
		}
		currentCell = openSet[lowestIndex];

		if(currentCell === this.end){
			path.push(currentCell);
			while(currentCell.previous){
				path.push(currentCell.previous);
				currentCell = currentCell.previous;
			}
			return path;
		}

		for(let k = openSet.length -1; k >= 0; k--){
			if(openSet[k] === currentCell) openSet.splice(k, 1);
		}
		closedSet.push(currentCell);

		currentCell.connectedTo.forEach((e) => {
			if(!closedSet.includes(e)){
				let temp = currentCell.g + 1;
				if(openSet.includes(e)){
					e.g = (temp < e.g) ? temp : e.g;
				} else {
					e.g = temp;
					openSet.push(e);
				}
				e.h = this.P5.dist(e.i, e.j, this.end.i, this.end.j);
				e.f = e.g + e.h;
				e.previous = currentCell;
			}
		}, this);
	}
};

Maze.prototype.drawMaze = function(strokeColor, startFillColor, endFillColor){
	this.start.fill(startFillColor);
	this.end.fill(endFillColor);
	this.grid.forEach((e) => e.draw(strokeColor));
};

Maze.prototype.drawPath = function(startFillColor, endFillColor){
	let path = this.getOptimalPath();
	for(let k = path.length - 1; k >= 0; k--) path[k].fill(this.P5.lerpColor(endFillColor, startFillColor, k / path.length));
};

module.exports = Maze;