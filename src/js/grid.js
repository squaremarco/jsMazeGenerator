"use strict";

const Cell = require("./cell.js");

const Grid = function(cols, rows, cellSize, P5){
	this.cols = cols;
	this.rows = rows;
	this.cellSize = cellSize;
	this.P5 = P5; //referenced p5.js object

	this.height = rows * cellSize;
	this.width = cols * cellSize;
	this.grid = [];
};

Grid.prototype.coordsToIndex = function(i, j){
	if(i < 0 || j < 0 || i > this.cols - 1 || j > this.rows - 1) return -1;
	return i + j * this.cols;
};

Grid.prototype.resetGrid = function(){
	this.grid = [];

	//populate grid
	for(var j = 0; j < this.rows; j++){
		for(var i = 0; i < this.cols; i++){
			this.grid.push(new Cell(i, j, this.cellSize, this.P5));
		}
	}
}

Grid.prototype.getCell = function(i, j){
	return this.grid[this.coordsToIndex(i, j)];
};

Grid.prototype.draw = function(color){
	this.P5.stroke(color);
	this.grid.forEach((e) => e.draw(color));
}

Grid.prototype.getUnfilteredNeighbors = function(i, j){
	return [
	this.grid[this.coordsToIndex(i, j - 1)],
	this.grid[this.coordsToIndex(i + 1, j)],
	this.grid[this.coordsToIndex(i, j + 1)],
	this.grid[this.coordsToIndex(i - 1, j)]
	];
};

Grid.prototype.getFilteredNeighbors = function(i, j, filter){
	return this.getUnfilteredNeighbors(i, j).filter(filter ? filter : (e) => !!e);
}

Grid.prototype.getRandomNeighbor = function(i, j, filter){
	var neighbors = this.getFilteredNeighbors(i, j, filter);

	if(neighbors.length > 0) {
		return neighbors[this.P5.floor(this.P5.random(neighbors.length))];
	}
};

module.exports = Grid;