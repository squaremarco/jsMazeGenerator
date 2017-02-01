"use strict";

const Cell = function(i, j, cellSize, P5){
	//public properties
	this.i = i;
	this.j = j;
	this.cellSize = cellSize;
	this.P5 = P5; //referenced p5.js object

	//properties needed for maze generation
	this.visited = false;
	this.walls = [true, true]; //right, bottom

	//properties needed for pathfinding
	this.connectedTo = [];
	this.f = 0;
	this.g = 0;
	this.h = 0;
	this.previous = undefined;
};

Cell.prototype.draw = function(color){
	var x = this.i * this.cellSize;
	var y = this.j * this.cellSize;

	this.P5.stroke(color);

	if(this.walls[0]) {
		this.P5.line(x + this.cellSize, y, x + this.cellSize, y + this.cellSize); // Right
	}

	if(this.walls[1]) {
		this.P5.line(x, y + this.cellSize, x + this.cellSize, y + this.cellSize); // Bottom
	}
};

Cell.prototype.fill = function(color){
	var x = this.i * this.cellSize;
	var y = this.j * this.cellSize;
	this.P5.noStroke();
	this.P5.fill(color);
	this.P5.rect(x, y, this.cellSize, this.cellSize);
};

Cell.removeWalls = function(a, b){
	var i = b.i - a.i;
	var j = b.j - a.j;

	if(i === 1) a.walls[0] = false; //right
	if(i === -1) b.walls[0] = false; //right
	if(j === 1) a.walls[1] = false; //bottom
	if(j === -1) b.walls[1] = false; //bottom
};

module.exports = Cell;