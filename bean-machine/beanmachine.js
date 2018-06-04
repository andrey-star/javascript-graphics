var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
	
function Ball(x, y, r, speed) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.speed = speed;
	this.stack;
	this.row;
	this.stacked = false;

	this.draw = function() {
		drawCircle(this);
	}
	
	this.move = function() {
		this.x += this.speed.x;
		this.y += this.speed.y;
	}
	
	this.moveRight = function() {
		this.x++;
	}
	
	this.moveLeft = function() {
		this.x--;
	}
	
	this.moveUp = function() {
		this.y--;
	}
		
	this.moveDown = function() {
		this.y++;
	}
	
	this.stackBall = function() {
		if (ballStacks[this.stack] == 0) {
			if (this.y > 400 - 2*this.r) {
				this.speed.y = 0;
				ballStacks[this.stack].push(this);
			}
			
		} else if (this.y > ballStacks[this.stack][ballStacks[this.stack].length - 1].y - 3*this.r) {
			this.speed.y = 0;
			ballStacks[this.stack].push(this);
		}
	}
	
	this.turn = function() {
		
		if (this.row == squareRows) {
			if ((this.x - (squares[squareRows - 1][0].x - squares[0][0].diag))%(squares[0][0].diag*2) == 0) {
				this.speed.x = 0;
				this.stacked = true;
			}
		}
		
		for (var i = 0; i < squareRows; i++) {
			for (var j = 0; j < (i + 2)*(i + 1)/2 - (i + 1)*i/2; j++) {
				if (this.row == 0) {
					if (this.y + this.r == squares[i][j].y) {
						var sign = Math.sign(Math.random() - 0.5);
						this.speed.x = sign;
						this.row++;
						this.stack += sign;
					}
				} else if (this.row == i) {
					if (this.y + this.r == squares[i][j].y && this.x == squares[i][j].x) {
						var sign = Math.sign(Math.random() - 0.5);
						this.speed.x = sign;
						this.row++;
						if (this.row == squareRows) {
							 if (sign == -1) {
								 this.stack = j;
							 } else {
								 this.stack = j + 1;
							 }
						} 
					}
				}
			}
		}
	}
	
}
	
	
function Square(x, y, diag) {
	// x, y - upper vertex cooordinates
	this.x = x; 
	this.y = y; 
	this.diag = diag;
	
	this.draw = function() {
		drawSquare(this);
	}
}


function Speed(x, y) {
	this.x = x;
	this.y = y;
}

var balls = [];
var squares = [[]];
var squareDiagonal = 30;
squares[0][0] = new Square(200, 20, squareDiagonal);
var squareRows = 6;
var counter = 1;
for (var i = 1; i < squareRows; i++) {
	squares[i] = [];
	for (var j = 0; j < (i + 2)*(i + 1)/2 - (i + 1)*i/2; j++) {
		squares[i][j] = new Square(400/2 - i*squareDiagonal + 2*j*squareDiagonal, 20 + i*squareDiagonal, squareDiagonal);
		counter++;
	}
}
let quantity = 50;
var radius = 3;
var ballStacks = [];
for (var i = 0; i < squareRows + 1; i++) {
	ballStacks[i] = [];
}

for (var i = 0; i < quantity; i++) {
	balls[i] = new Ball(200, -radius - i*6*radius, radius, new Speed(0, 1))
	balls[i].stack = Math.round((squareRows + 1)/2);
	balls[i].row = 0;
}

function drawCircle(circle) {
	ctx.beginPath();
	ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
	ctx.fill();
}

function drawSquare(square) {
	ctx.beginPath();
	ctx.moveTo(square.x, square.y);
	ctx.lineTo(square.x + square.diag/2, square.y + square.diag/2);
	ctx.lineTo(square.x, square.y + square.diag);
	ctx.lineTo(square.x - square.diag/2, square.y + square.diag/2);
	ctx.lineTo(square.x, square.y);
	ctx.fill();
}

setInterval (function() {
	
	ctx.clearRect(0, 0, 400, 400);
	for (var i = 0; i < quantity; i++) {
		balls[i].move();
		if (!balls[i].stacked) {
			balls[i].turn();
		}
		balls[i].stackBall();
		balls[i].draw();
	}
	
	for (var i = 0; i < squareRows; i++) {
		for (var j = 0; j < (i + 2)*(i + 1)/2 - (i + 1)*i/2; j++) {
			squares[i][j].draw();
		}
	}
	
	squares[0][0].draw();
	ctx.strokeRect(0, 0, 400, 400);
	
}, 20);
	
	
