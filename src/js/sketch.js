"use strict";

const P5 = require("p5");
const Maze = require("./maze.js");

const sketch = function(P5){
	let width = 40;
	let height = 40;
	let cellSize = 10;
	let maze;
	let path;
	let tick;

	let backgroundColor;
	let strokeColor;
	let startColor
	let endColor;

	P5.setup = () => {
		backgroundColor = P5.color(255);
		strokeColor = P5.color(0);
		startColor = P5.color(0, 255, 0);
		endColor = P5.color(255, 0, 0);

		P5.createCanvas(width * cellSize, height * cellSize);
		P5.pixelDensity(2);

		maze = new Maze(width, height, cellSize, P5);

		maze.generateMaze();
		path = maze.getOptimalPath().reverse();
		tick = 0;

		P5.background(backgroundColor);
	}

	P5.draw = () => {
		if(tick < path.length){
			path[tick++].fill(P5.lerpColor(startColor, endColor, tick / path.length))
		} else {
			maze.generateMaze();
			path = maze.getOptimalPath().reverse();
			tick = 0;
			P5.background(backgroundColor);
		}
		maze.drawMaze(strokeColor, startColor, endColor);
		//P5.noLoop();
	}
}

new P5(sketch);