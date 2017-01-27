// JavaScript Document
var width = 320,
//width of the canvas
  height = 500,
//height of the canvas
  gLoop,
  points = 0,
  state = true,
  
  c = document.getElementById('canv'), 
//canvas itself 

  ctx = c.getContext('2d');

c.width = width;
c.height = height;

//clear the canvas
var clear = function() {
	ctx.fillStyle = '#d0e7f9';	
	ctx.beginPath();
	ctx.rect(0,0,width,height);
	ctx.closePath();
	ctx.fill();
}
//clear();

var cloudNum = 10,
    circles = [];

for(var i = 0; i < cloudNum; i ++)
	//x, y, radius, transparency
	circles.push([Math.random()*width, Math.random()*height, Math.random()*100, Math.random()/2]);

var drawCircle = function() {
	for(var i = 0; i < cloudNum; i ++) {
		//white color and the random transparency
		ctx.fillStyle = 'rgba(255, 255, 255, ' + circles[i][3] + ')';
		ctx.beginPath();
		ctx.arc(circles[i][0], circles[i][1], circles[i][2], 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();
	}	
};

//drawCircle();
//move clouds
var moveCircles = function(pixel) {
	for(var i = 0; i < cloudNum; i ++) {
		if(circles[i][1] - circles[i][2] > height) {
			circles[i][0] = Math.random()*width;
			circles[i][2] = Math.random()*100;
			circles[i][3] = Math.random()/2;
			circles[i][1] = 0 - circles[i][2];
		}
		else {
			circles[i][1] += pixel;	
		}
	}
};
var player = new (function() {
	var that = this;
	that.image = new Image();
	that.image.src = "./image/pikachu.png";
	that.width = 65;
	that.height = 59;
	that.X = 0;
	that.Y = 0;
	that.frames = 1;
	that.actualFrame = 0;
	that.interval = 0;
	that.isJumping = false;
	that.isFalling = false;
	that.jumpSpeed = 0;
	that.fallSpeed = 0;
	that.jump = function() {
	if(!that.isJumping && !that.isFalling) {
		that.fallSpeed = 0;
		that.isJumping = true;
		that.jumpSpeed = 17;
	}	
	}
	that.checkJump = function() {
		if(that.Y > height * 0.4){
			that.setPosition(that.X, that.Y - that.jumpSpeed);
		} else {
			if(that.jumpSpeed > 10) {
				points ++;
			}
			moveCircles(that.jumpSpeed * 0.5);
			platforms.forEach(function(platform, ind){
				platform.y += that.jumpSpeed;
				
				if(platform.y > height) {
					var type = ~~(Math.random() * 5);
					if(type == 0) {
						type = 1;
					} else {
						type = 0;	
					}
					platforms[ind] = new Platform(Math.random() * (width - platformWidth), platform.y - height, type);
				}	
			});
		}

		that.jumpSpeed --;
		if(that.jumpSpeed == 0) {
			that.isJumping = false;
			that.isFalling = true;
			that.fallSpeed = 1;
		}
	}
	that.checkFall = function() {
		if(that.Y < height - that.height) {
			that.setPosition(that.X, that.Y + that.fallSpeed);
			that.fallSpeed ++;
		} else {	
			if(points == 0) {
				that.fallStop();
			}
			else {
				gameOver();	
			}
		}	
	}
	that.fallStop = function() {
		that.isFalling = false;
		that.fallSpeed = 0;
		that.jump();	
	}
	that.moveLeft = function() {
		if(that.X > 0) {
			that.setPosition(that.X - 5, that.Y);
		}	
	}
	that.moveRight = function() {
		if(that.X + that.width < width) {
			that.setPosition(that.X + 5, that.Y);
		}
	}
	that.moveKeyLeft = function() {
		if(that.X > 0) {
			that.setPosition(that.X - 15, that.Y);
		}	
	}
	that.moveKeyRight = function() {
		if(that.X + that.width < width) {
			that.setPosition(that.X + 15, that.Y);
		}
	}
	that.setPosition = function(x, y) {
		that.X = x;
		that.Y = y;
	}
	that.draw = function() {
		try {
			ctx.drawImage(that.image, 0, that.height * that.actualFrame, that.width, that.height, that.X, that.Y, that.width, that.height);
		} catch(e) {
		}
		if(that.interval ==4) {
			if(that.actualFrame == that.frames) {
				that.actualFrame = 0;
			} else {
				that.actualFrame ++;	
			}
			that.interval = 0;
		}
		that.interval ++;
	}
})();

player.setPosition(~~((width-player.width)/2),  ~~((height - player.height)/2));
player.jump();


var numPlatforms = 7, 
platforms = [],
platformWidth = 70,
platformHeight = 20;

var Platform = function(x, y, type) {
	var that = this;
	that.isMoving = ~~(Math.random() * 2);
	that.direction = ~~(Math.random() ? -1 : 1);
	that.firstColor = '#FF8C00';
	that.secondColor = '#EEEE00';
	that.onCollide = function(){
		player.fallStop();
	};
	if(type === 1) {
		that.firstColor = '#AADD00';
		that.secondColor = '#698B22';
		that.onCollide = function() {
			player.fallStop();
			player.jumpSpeed = 50;	
		};
	}
	that.x = ~~x;
	that.y = y;
	that.type = type;
	
	that.draw = function() {
		ctx.fillStyle = 'rgba(255, 255, 255, 1)';
		var gradient = ctx.createRadialGradient(that.x + (platformWidth / 2), that.y + (platformHeight / 2), 5, that.x + (platformWidth / 2), that.y + (platformHeight / 2), 45);
		gradient.addColorStop(0, that.firstColor);
		gradient.addColorStop(1, that.secondColor);
		ctx.fillStyle = gradient;
		ctx.fillRect(that.x, that.y, platformWidth, platformHeight);	
	};
	
	return that;
};

var generatePlatforms = function(){
	var position = 0, type;
	for(var i = 0; i < numPlatforms; i ++) {
		type = ~~(Math.random() * 5);
		if(type == 0){
			type = 1;	
		}
		else {
			type = 0;
		}
		platforms[i] = new Platform(Math.random() * (width - platformWidth), position, type);
		if (position < height - platformHeight) {
			position += ~~(height / numPlatforms);
		}
	}
}();

var checkCollision = function(){
	platforms.forEach(function(e, ind) {
		if((player.isFalling) && 
			(player.X < e.x + platformWidth) && 
			(player.X + player.width > e.x) && 
			(player.Y + player.height > e.y) && 
			(player.Y + player.height < e.y + platformHeight)) {
			e.onCollide();
		}
	})
}

var gameOver = function (){
	state = false;
	clearTimeout(gLoop);
	setTimeout(function() {
		clear();
		ctx.fillStyle = "Black";
		ctx.font = "10pt Arial";
		ctx.fillText("     GAME OVER", width / 2 - 60, height / 2 - 50);
		ctx.fillText("  YOUR RESULTS:" + points, width / 2 - 60, height / 2 - 30);	
	}, 100);
	document.getElementById("btn").style.display="block";
};

var reStart = function() {
	points = 0;
	state = true;
	clear();
    drawCircle();
    //moveCircles(5);
    if (player.isJumping) player.checkJump();
    if (player.isFalling) player.checkFall();
    
	
    
	platforms.forEach(function(platform, index){
		if(platform.isMoving) {
			if(platform.x < 0) {
				platform.direction = 1;
			} else if(platform.x > width - platformWidth) {
				platform.direction = -1;
			}
			platform.x += platform.direction * (index / 2) * ~~(points / 100);
		}
		platform.draw();
  	});
	
	player.draw();
	checkCollision();
	
	ctx.fillStyle = "Black";
	ctx.fillText("POINTS:" + points, 10, height - 10);
  	
	if(state) {
		gLoop = setTimeout(GameLoop, 1000 / 50);
	}
	document.getElementById("btn").style.display="none";
};

var GameLoop = function(){
	clear();
    drawCircle();
    //moveCircles(5);
    if (player.isJumping) player.checkJump();
    if (player.isFalling) player.checkFall();
    
	
    
	platforms.forEach(function(platform, index){
		if(platform.isMoving) {
			if(platform.x < 0) {
				platform.direction = 1;
			} else if(platform.x > width - platformWidth) {
				platform.direction = -1;
			}
			platform.x += platform.direction * (index / 2) * ~~(points / 100);
		}
		platform.draw();
  	});
	
	player.draw();
	checkCollision();
	
	ctx.fillStyle = "Black";
	ctx.fillText("POINTS:" + points, 10, height - 10);
  	
	if(state) {
		gLoop = setTimeout(GameLoop, 1000 / 50);
	}
}
GameLoop();

document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === 37) {
    player.moveKeyLeft()
  }
});

document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === 39) {
    player.moveKeyRight()
  }
});

document.onmousemove = function(e) {
	if(player.X + c.offsetLeft > e.pageX) {
		player.moveLeft();
	}
	if(player.X + c.offsetLeft < e.pageX) {
		player.moveRight();
	}
}
