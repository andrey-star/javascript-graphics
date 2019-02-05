var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
let width = canvas.width;
 
function Snake() {
 
    this.body;
    this.dir;
 
    this.addCell = function(cell) {
        this.body.push(cell);
    }
 
    this.changeDir = function(direction) {
        this.dir = direction;
    }
 
    this.checkSide = function() {
        for (var i = 0; i < this.body.length; i++) {
            if (this.body[i].y > width && this.dir == "down") {
                this.body[i] = new Cell(this.body[0].x, this.body[0].y - width);
            }
 
            if (this.body[i].y < 0 && this.dir == "up") {
                this.body[i] = new Cell(this.body[0].x, this.body[0].y + width);
            }
 
            if (this.body[i].x > width && this.dir == "right") {
                this.body[i] = new Cell(this.body[0].x - width, this.body[0].y);
            }
 
            if (this.body[i].x < 0 && this.dir == "left") {
                this.body[i] = new Cell(this.body[0].x + width, this.body[0].y);
            }
            for (var i = 1; i < this.body.length; i++) {
                if (this.body[0].x == this.body[i].x && this.body[0].y == this.body[i].y) {
                    for (var j = i - 1; j <= this.body.length; j++) {
                        this.body.pop();
                    }
                    break;
                }
            }
        }
    }
 
    this.move = function() {
   
        var foodEaten = false;
        if (this.body[0].x == food.x && this.body[0].y == food.y) {
            foodEaten = true;
            foodSpawned = false;
        }
       
        if (this.dir == "up") {
            this.body.unshift(new Cell(this.body[0].x, this.body[0].y - this.body[0].side));
            if (!foodEaten) {
                this.body.pop();
            }
        }
 
        if (this.dir == "down") {
            this.body.unshift(new Cell(this.body[0].x, this.body[0].y + this.body[0].side));
            if (!foodEaten) {
                this.body.pop();
            }
        }
 
        if (this.dir == "right") {
            this.body.unshift(new Cell(this.body[0].x + this.body[0].side, this.body[0].y));
            if (!foodEaten) {
                this.body.pop();
            }
        }
 
        if (this.dir == "left") {
            this.body.unshift(new Cell(this.body[0].x - this.body[0].side, this.body[0].y));
            if (!foodEaten) {
                this.body.pop();
            }
        }
    }
 
    this.drawSnake = function() {
        for (var i = 0; i < this.body.length; i++) {
            if (i == 0) {
                this.body[i].drawCell("#26a526");
            } else {
                this.body[i].drawCell("black");
            }
        }
    }
}
 
function Cell(x, y) {
    this.x = x;
    this.y = y;
    this.side = cellSide;
 
    this.drawCell = function(color) {
        ctx.beginPath();
        ctx.moveTo(this.x - this.side/2, this.y - this.side/2);
        ctx.lineTo(this.x + this.side/2, this.y - this.side/2);
        ctx.lineTo(this.x + this.side/2, this.y + this.side/2);
        ctx.lineTo(this.x - this.side/2, this.y + this.side/2);
        ctx.lineTo(this.x - this.side/2, this.y - this.side/2);
        ctx.fillStyle = color;
        ctx.fill();
    }
}
 
spawnFood = function() {
    mark: while (true) {
        var newFood = new Cell(Math.round(Math.random()*(width/cellSide - 1))*cellSide + cellSide/2, Math.round(Math.random()*(width/cellSide - 1))*cellSide + cellSide/2);
        for (var i = 0; i < snake.body.length; i++) {
            if (snake.body[i].x == newFood.x && snake.body[i].y == newFood.y) {
                continue mark;
            }
        }
        break;
    }
    food = newFood;
    foodSpawned = true;
   
}
 
var snake = new Snake();
snake.body = [];
snake.dir = "up";
var cellSide = 16;
var recentDirChange = false;
var foodSpawned = false;
var food;
for (var i = 0; i < 5; i++) {
    if ((width/2)%cellSide == 0) {
        snake.addCell(new Cell(width/2 + cellSide/2, i * cellSide + width/cellSide/2));
    } else {
        snake.addCell(new Cell(width/2, i * cellSide + cellSide/2 + cellSide*Math.round(width/cellSide/2)));
    }
}
 
turn = function(direction) {
    switch (direction) {
        case "left":
            if (snake.dir != "right" && !recentDirChange) {
                recentDirChange = true;
                snake.dir = "left";
            }
        break;
        case "up":
            if (snake.dir != "down" && !recentDirChange) {
                recentDirChange = true;
                snake.dir = "up";
            }
        break;
        case "right":
            if (snake.dir != "left" && !recentDirChange) {
                recentDirChange = true;
                snake.dir = "right";
            }
        break;
        case "down":
            if (snake.dir != "up" && !recentDirChange) {
                recentDirChange = true;
                snake.dir = "down";
            }
        break;
    }
}
 
document.onkeydown = function() {
    if (window.event.keyCode == 32) {
        pause();
    }
    if (!isPaused) {
        switch (window.event.keyCode) {
        case 37:
            turn("left");
            break;
        case 38:
            turn("up");
            break;
        case 39:
            turn("right");
            break;
        case 40:
            turn("down");
            break;
        }
    }
};
 
var touches;
 
newTouch = function(x, y) {
 
    if (y < x && y < 400 - x) {
        turn("up");
    } else if (y > x && y > 400 - x){
        turn("down");
    } else if (y < x && y > 400 - x){
        turn("right");
    } else if (y > x && y < 400 - x){
        turn("left");
    }
}
 
function handleStart(evt) {
  evt.preventDefault();
  var el = document.getElementsByTagName("canvas")[0];
  var ctx = el.getContext("2d");
  touches = evt.changedTouches;
  newTouch(touches[0].pageX, touches[0].pageY);
}
 
 
 
function startup() {
    var el = document.getElementsByTagName("canvas")[0];
    el.addEventListener("touchstart", handleStart, false);
}
 
pause = function() {
    isPaused = !isPaused;
    if (isPaused) {
        document.getElementById('pause').innerHTML = "Play";
    } else {
        document.getElementById('pause').innerHTML = "Pause";
    }
}
 
var isPaused = true;
 
setInterval(function() {
   
    ctx.clearRect(0, 0, width, width);
    if (!isPaused) {
        if (!foodSpawned) {
            spawnFood();
        }
        recentDirChange = false;
        snake.move();
        snake.checkSide();
    }
    if (typeof food != "undefined") {
        food.drawCell("red");
    }
    snake.drawSnake();
    ctx.strokeRect(0, 0, width, width);
 
}, 100);