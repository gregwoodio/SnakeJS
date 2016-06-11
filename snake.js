/*
Snake by Greg Wood
June 8 2016

Board size 80 * 48

*/
$(document).ready(function() {
	//direction constants
	var UP = 0;
	var DOWN = 1;
	var LEFT = 2;
	var RIGHT = 3;

	//snake info
	var currentDir = RIGHT;
	var snakeX = 10;
	var snakeY = 30;
	var snakePos = [];
	var score;

	//thinking with portals
	var portal1;
	var portal2;

	//canTurn is just to prevent you from mashing two turning keys too quickly and 
	//crashing into yourself before the board can even draw.
	var canTurn = true;

	//board values
	var board = [];
	var height = 48;
	var width = 80;

	//timing
	var gameTimer;
	var speed = 40;
	var superAppleTimer;
	var superAppleLocation = [];

	//canvas for drawing
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	//colors
	var background = "#ffffff";
	var snakeColor = "#00FF00";
	var appleColor = "#FF0000";
	var superAppleColor = "#FFDF00";
	var portalOrangeColor = "#ff6600";
	var portalBlueColor = "#4c4cff";

	//keyboard controls 
	document.addEventListener('keydown', function(event) {
	    if (event.keyCode == 37 || event.keyCode == 65) {
	        //moveLeft();
	        if (currentDir != RIGHT && canTurn) {
	        	currentDir = LEFT;
	        	canTurn = false;
	        }
	    }
	    else if (event.keyCode == 39 || event.keyCode == 68) {
	        //moveRight();
	        if (currentDir != LEFT && canTurn) {
	        	currentDir = RIGHT;
	        	canTurn = false;
	        }
	    }
	    
	    else if (event.keyCode == 38 || event.keyCode == 87) {
	        //moveUp();
	        if (currentDir != DOWN && canTurn) {
	        	currentDir = UP;
	        	canTurn = false;
	        }
	    }
	    
	    else if (event.keyCode == 40 || event.keyCode == 83) {
	        //moveDown();
	        if (currentDir != UP && canTurn) {
	        	currentDir = DOWN;
	        	canTurn = false;
	        }
	    }

	    else if (event.keyCode == 82) {
	    	//restart game
	    	setupBoard();
	    	drawBoard();
	    	
	    	clearInterval(gameTimer);
	    	clearInterval(superAppleTimer);

	    	gameTimer = setInterval(function() {
				switch (currentDir) {
					case UP:
						moveUp();
						break;
					case DOWN:
						moveDown();
						break;
					case LEFT:
						moveLeft();
						break;
					case RIGHT:
						moveRight();
						break;
				}
			}, speed);
	    }
	});

	function setupBoard() {
		board = [];
		for (i = 0; i < width; i++) {
			board.push([]);
			for (j = 0; j < height; j++) {
				board[i].push(0);
			}
		}

		//start at board[30][10];
		snakeX = 10;
		snakeY = 30;
		board[snakeX][snakeY] = 1;
		board[snakeX-1][snakeY] = 1;
		board[snakeX-2][snakeY] = 1;
		currentDir = RIGHT;

		snakePos = [];
		snakePos.push([snakeX, snakeY]);
		snakePos.push([snakeX-1, snakeY]);
		snakePos.push([snakeX-2, snakeY]);

		score = 0;
		addApple();
		addSuperApple();
		makePortals();
	}

	function drawBoard() {
		//clear everything to start
		ctx.fillStyle = background;
		ctx.fillRect(0,0,width*10,height*10);

		//draw everything else
		for (i = 0; i < width; i++) {
			for (j = 0; j < height; j++) {
				if (board[i][j] == 1) {
					ctx.fillStyle = snakeColor;
					ctx.fillRect(i*10, j*10, 10,10);
				} else if (board[i][j] == 2) {
					ctx.fillStyle = appleColor;
					ctx.fillRect(i*10, j*10, 10,10);
				} else if (board[i][j] == 3) {
					ctx.fillStyle = superAppleColor;
					ctx.fillRect(i*10, j*10, 10,10);
				} else if (board[i][j] == 4) {
					if (i == portal1[0] && j == portal1[1]) {
						ctx.fillStyle = portalOrangeColor;
						ctx.fillRect(i*10, j*10, 10,10);
					} else {
						ctx.fillStyle = portalBlueColor;
						ctx.fillRect(i*10, j*10, 10,10);
					}
					//ctx.arc(i*10 + 5, j*10 + 5, 5, 0, 2*Math.PI);
				}
			}
		}

		//score
		document.getElementById("score").innerHTML = score;
	}

	function eatApple(x,y) {
		//increase length of snakePos
		snakePos.unshift([x,y]);
		board[x][y] = 1;
		score++;

		//add new apple
		addApple();
	}

	function addApple() {
		var x = 0;
		var y = 0;
		do {
			x = Math.floor(Math.random() * width);
			y = Math.floor(Math.random() * height);
		} while (board[x][y] != 0);

		board[x][y] = 2;
	}

	function eatSuperApple(x, y) {
		//increase length of snakePos
		snakePos.unshift([x,y]);
		board[x][y] = 1;
		score += 5;

		//add new super apple
		clearInterval(superAppleTimer);
		addSuperApple();
	}

	function addSuperApple() {
		//super apples are worth 5 points, but only last 5 seconds
		var x = 0;
		var y = 0;
		do {
			x = Math.floor(Math.random() * width);
			y = Math.floor(Math.random() * height);
		} while (board[x][y] != 0);

		board[x][y] = 3;
		superAppleLocation = [x, y];

		superAppleTimer = setTimeout(function() {
			//clearInterval(superAppleTimer);
			board[superAppleLocation[0]][superAppleLocation[1]] = 0;
			addSuperApple();
		}, 5000);
	}

	function tail(x, y) {
		//shift everything back
		snakePos.unshift([x,y]);
		board[x][y] = 1;
		arr = snakePos.pop();
		board[arr[0]][arr[1]] = 0;
	}

	function makePortals() {
		
		if (portal1 != undefined && portal2 != undefined) {
			if (snakeX == portal1[0] && snakeY == portal1[1]) {
				board[portal1[0]][portal1[1]] == 0;
				board[portal2[0]][portal2[1]] == 1;
			} else {
				board[portal1[0]][portal1[1]] == 1;
				board[portal2[0]][portal2[1]] == 0;
			}	
		}
		

		var x = 0;
		var y = 0;
		do {
			x = Math.floor(Math.random() * width);
			y = Math.floor(Math.random() * height);
		} while (board[x][y] != 0);
		portal1 = [x,y];
		board[x][y] = 4;

		do {
			x = Math.floor(Math.random() * width);
			y = Math.floor(Math.random() * height);
		} while (board[x][y] != 0);
		portal2 = [x,y];
		board[x][y] = 4;
	}

	function gameOver() {
		//stop timers

		//alert("Game over!\nYou scored: " + score);
		clearTimeout(gameTimer);

		ctx.fillStyle = "black";
		ctx.font = "30px Arial";
		ctx.fillText("Press R to play again", 215, 250);
		ctx.fillText("or S to submit your score", 185, 300);
	}

	//movement
	function moveUp() {
		snakeY--;
		move();	
		currentDir = UP;
		drawBoard();
	}

	function moveDown() {
		snakeY++;
		move();
		currentDir = DOWN;
		drawBoard();
	}

	function moveRight() {
		snakeX++;
		move();
		currentDir = RIGHT;
		drawBoard();
	}

	function moveLeft() {
		snakeX--;
		move();
		currentDir = LEFT;
		drawBoard();
	}

	function move() {
		if (snakeX < 0 || snakeY < 0 || snakeX >= width || snakeY >= height) {
			//out of bounds
			gameOver();
		} else if (board[snakeX][snakeY] == 1) {
			//hit the tail
			gameOver();
		} else if (board[snakeX][snakeY] == 0) {
			//open space
			tail(snakeX, snakeY);
		} else if (board[snakeX][snakeY] == 2) {
			//apple
			eatApple(snakeX, snakeY);
		} else if (board[snakeX][snakeY] == 3) {
			//super apple
			eatSuperApple(snakeX, snakeY);
		} else if (board[snakeX][snakeY] == 4) {
			//time for some portals
			if (snakeX == portal1[0] && snakeY == portal1[1]) {
				snakeX = portal2[0];
				snakeY = portal2[1];
				if (contains(portal1[0], portal1[1])) {
					board[portal1[0]][portal1[1]] = 1;
				} else {
					board[portal1[0]][portal1[1]] = 0;
				}
				tail(portal2[0], portal2[1]);
			} else {
				snakeX = portal1[0];
				snakeY = portal1[1];
				if (contains(portal2[0], portal2[1])) {
					board[portal2[0]][portal2[1]] = 1;
				} else {
					board[portal2[0]][portal2[1]] = 0;
				}
				tail(portal1[0], portal1[1]);
			}
			makePortals();
		}
		canTurn = true;
	}

	function contains(x,y) {
		//function to check to see if the snake contains a particular index of the board
		for (i = 0; i < snakePos.length; i++) {
			if (snakePos[i][0] == x && snakePos[i][1] == y) {
				return true;
			}
		}
		return false;
	}

	//hi score table functions
	function showScores() {
		$.ajax({
			url: "getscore.php",
			type: "POST",
			dataType: "html",
			success: function(data) {
				$("#hiscorestable").html(data);
			}
		});
	}

	function submitScore() {
		var username = prompt("Enter your name:");
		username = username.replace(/[^a-zA-Z0-9 ]/g, "");

		$.ajax({
			url: "logscore.php",
			type: "POST",
			data: {"username": username, "score": score},
			success: function() {
				showScores();
			}
		});	
	}

	setupBoard();
	drawBoard();

	gameTimer = setInterval(function() {
		switch (currentDir) {
			case UP:
				moveUp();
				break;
			case DOWN:
				moveDown();
				break;
			case LEFT:
				moveLeft();
				break;
			case RIGHT:
				moveRight();
				break;
		}
	}, speed);
});