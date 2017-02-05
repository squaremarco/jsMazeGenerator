"use strict";

const Cell = require("./cell.js");
const Grid = require("./grid.js");

//maze extends the grid class
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
	let s = 0;
	let e = 0;

	this.resetGrid();

	//start visiting the grid from a random cell
	let currentCell = this.grid[this.P5.floor(this.P5.random(0, this.grid.length - 1))];

	currentCell.visited = true;

	//loop until you visited each cell
	while(looping){
		//choose a random neighbor from the current cell
		let nextCell = this.getRandomNeighbor(
			currentCell.i, 
			currentCell.j,
			(e) => !!e && !e.visited
		);
		//if it exists visit it
		if(nextCell){
			nextCell.visited = true;
			nextCell.connectedTo.push(currentCell);
			currentCell.connectedTo.push(nextCell);
			
			//push current cell in the stack so you can backtrack to it
			stack.push(currentCell);

			Cell.removeWalls(currentCell, nextCell);
			currentCell = nextCell;
		} else if (stack.length > 0) {
			//if it doesn't exists backtrack
			currentCell = stack.pop();
		} else {
			//if the stack is empty you finished visiting the grid
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

	//push start node
	openSet.push(this.start);
	//loop until openset has at least one element inside
	while(openSet.length > 0){
		//find the element in open set with the lowest f value
		let lowestIndex = 0;	
		for(let k = 0; k < openSet.length; k++){
			if(openSet[k].f < openSet[lowestIndex].f) lowestIndex = k;
		}
		//visit that element
		currentCell = openSet[lowestIndex];
		//if that element is the end node
		if(currentCell === this.end){
			//create the final path	
			path.push(currentCell);
			while(currentCell.previous){
				path.push(currentCell.previous);
				currentCell = currentCell.previous;
			}
			return path;
		}
		//remove the current node from the openset
		for(let k = openSet.length -1; k >= 0; k--){
			if(openSet[k] === currentCell) openSet.splice(k, 1);
		}
		//push the current node in the closed set
		closedSet.push(currentCell);

		//add the connected neighbors to the open set if they are not already in it
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
	for(let k = path.length - 1; k >= 0; k--){
		path[k].fill(this.P5.lerpColor(endFillColor, startFillColor, k / path.length));
	}
};

module.exports = Maze;