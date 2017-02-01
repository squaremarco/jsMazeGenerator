"use strict";

const P5 = require("p5");
const Maze = require("./maze.js");

const sketch = function(P5){
	let width = 30;
	let height = 30;
	let cellSize = 15;
	let maze;

	P5.setup = () => {
		let backgroundColor = P5.color(255);
		let strokeColor = P5.color(0);
		let startColor = P5.color(0, 255, 0)
		let endColor = P5.color(255, 0, 0);

		maze = new Maze(width, height, cellSize, P5);
		maze.generateMaze();
		
		P5.pixelDensity(2);
		P5.background(backgroundColor);
		maze.drawPath(startColor, endColor);
		maze.drawMaze(strokeColor, startColor, endColor);
	}

	P5.draw = () => {
		P5.noLoop();
	}
}

new P5(sketch);