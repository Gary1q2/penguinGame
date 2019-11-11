// Just an entity/sprite with a position in the world
class Entity {
	constructor(x, y, width, height, img) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.img = img;
	}
	draw() {
		ctx.drawImage(this.img,this.x-this.width/2,this.y-this.height/2);
		ctx.beginPath();
		ctx.rect(this.x-this.width/2,this.y-this.height/2,this.width,this.height);
		ctx.stroke();
	}
	update() {
		this.draw();
	}

	// Check collision with another object
	collideWith(other) {
		var rect1 = {
			x: this.x - this.width/2,
			y: this.y - this.height/2,
			width: this.width,
			height: this.height
		};
		var rect2 = {
			x: other.x - other.width/2,
			y: other.y - other.height/2,
			width: other.width,
			height: other.height
		};
		return testCollisionRectRect(rect1, rect2);
	}
}

class Rock extends Entity {
	constructor(x, y, width, height, img) {
		super(x, y, img.width, img.height, img);
		this.dead = false;

		this.fallSpd = 2;
		this.maxSpd = 6;
		this.gravity = 0.1;
	}
	update() {
		this.updateMovement();
		this.checkLost();
		super.update();
	}

	updateMovement() {
		if (this.fallSpd < this.maxSpd) {
			this.fallSpd += this.gravity;
		}
		this.y +=  this.fallSpd;
	}
	checkLost() {
	 	if (this.y >= 800 && !this.dead) {
	 		this.dead = true;
	 	}
	}
}

class Present extends Entity {
	constructor(x, y, width, height, img) {
		super(x, y, img.width, img.height, img);
		this.dead = false;

		this.maxSpd = 8;
		this.gravity = 0.1;

		this.fallSpd = 3;
		this.chuteSpd = 2;
		this.hasChute = true;
	}

	update() {
		this.updateMovement();
		if (!this.dead) {
	 		super.update();
	 		if (this.hasChute) {
		 		this.drawChute();
		 	}
	 	}
		this.checkLost();

	}

	// Draw the parachute
	drawChute() {
		ctx.drawImage(chute, this.x-this.width/2, this.y-80);
	}

	// Make it fall down
	updateMovement() {
		if (this.hasChute) {
			this.y += this.chuteSpd
		} else {
			if (this.fallSpd < this.maxSpd) {
				this.fallSpd += this.gravity;
			}
			this.y += this.fallSpd;
		}
	}

	// Check if it reached the bottom
	checkLost() {
	 	if (this.y >= 800 && !this.dead) {
	 		this.dead = true;
	 		lost++;
	 	}
	}
}

class BluePresent extends Present {
		constructor(x, y, width, height, img) {
		super(x, y, img.width, img.height, img);
		this.dead = false;
		this.fallSpd = 4;
	}

	update() {
		super.update();
	}
}

class PurplePresent extends Present {
		constructor(x, y, width, height, img) {
		super(x, y, img.width, img.height, img);
		this.dead = false;
		this.fallSpd = 5;
	}

	update() {
		super.update();
	}
}


class Player extends Entity {
	constructor(x, y, width, height, img) {
		super(x, y, width, height, img);
		this.maxSpd = 6;
		this.accelSpd = 0.8;
		this.hsp = 0;
		this.friction = 0.2;

		this.stunned = false;
		this.stunTime = 120;
		this.stunTimer = 0;


		this.facing = "left";
		this.dashTime = 20;
		this.dashTimer = 0;
	}


	update() {
		this.updateMovement();

		this.checkTouchRock();
		this.tickStunTime();
	
		if (dashing) {
			if (this.dashTimer < this.dashTime) {
				this.dashTimer++;
			} else {
				dashing = false;
				canDash = true;
				this.dashTimer = 0;
				console.log("dashing done");
			}
		}

		this.draw();
	}

	draw() {
		if (this.stunned) {
			ctx.drawImage(stunned, this.x-this.width/2,this.y-this.height/2);
		} else {
			if (dashing) {
				if (this.facing == "left") {
					ctx.drawImage(dash, this.x-this.width/2,this.y-this.height/2);
				} else {
					ctx.drawImage(dashR, this.x-this.width/2,this.y-this.height/2);
				}
			} else {
				if (this.facing == "left") {
					ctx.drawImage(img, this.x-this.width/2,this.y-this.height/2);
				} else {
					ctx.drawImage(pengR, this.x-this.width/2,this.y-this.height/2);
				}
			}
		}

		// Draw collision boundary
		ctx.beginPath();
		ctx.rect(this.x-this.width/2,this.y-this.height/2,this.width,this.height);
		ctx.stroke();
	}

	tickStunTime() {
		if (this.stunned) {
			console.log("yes stunned");
			if (this.stunTimer >= this.stunTime) {
				this.stunned = false;
				this.stunTimer = 0;
				console.log("shud be false");
			} else {
				this.stunTimer++;
				console.log("plussed");
			}	
		}
	}

	// Checks if player touched a rock
	checkTouchRock() {
		if (!this.stunned) {
			for (var i = 0; i < rockArray.length; i++) {
				if (rockArray[i].collideWith(this)) {
					this.stunned = true;
				} else {
				}
			}
		}
	}

	// Accelerate player to max speed
	applyAccelerate() {
		if (!dashing) {
			if (pressLeft && !pressRight) {
				this.facing = "left";
				this.hsp -= this.accelSpd;
				if (this.hsp < -this.maxSpd) {
					this.hsp = -this.maxSpd;
				}
			
			} else if (pressRight && !pressLeft) {
				this.facing = "right";
				this.hsp += this.accelSpd;
				if (this.hsp > this.maxSpd) {
					this.hsp = this.maxSpd;
				}
			}
		} else {
			if (this.facing == "left") {
				this.hsp -= 2;
				if (this.hsp < -10) {
					this.hsp = -10;
				}
			} else {
				this.hsp += 2;
				if (this.hsp > 10) {
					this.hsp = 10;
				}
			}
		}
	}

	// Apply friction to player movement
	applyFriction() {
		if (this.hsp > 0) {
			if (this.hsp - this.friction >= 0) {
				this.hsp -= this.friction;
			} else {
				this.hsp = 0;
			}
		} else if (this.hsp < 0) {
			if (this.hsp += this.friction <= 0) {
				this.hsp += this.friction;
			} else {
				this.hsp = 0;
			}
		}
	}

	// Update player movement
	updateMovement() {
		if (!this.stunned) {
			this.applyAccelerate();
			this.x += this.hsp;
			this.applyFriction();
		}
	}
}

class Spawner {
	constructor() {
		this.numPres = 20;
		this.numSpike = 12;
		this.start = false;

		this.delay = 120;
		this.delayTimer = 0;		

		this.lastPresX = 0;
	}
	update() {
		if (this.start && (this.numPres > 0 || this.numSpike > 0)) {
			if (this.delayTimer >= this.delay) {
				this.delayTimer = 0;
				
				var temp = Math.random();
				if (temp <= 0.45 && this.numSpike > 0) {

					rockArray.push(new Rock(this.lastPresX-150+Math.floor(Math.random()*300), 
						        -50, spike.width, spike.height, spike));
					this.numSpike--;
					console.log("spawner - created a rock");
					this.deplayTimer = 100;
				} else if (temp > 0.3 && this.numPres > 0) {
					this.lastPresX = Math.floor(Math.random()*1200); 
					presArray.push(new Present(this.lastPresX,
				                 -50, img2.width, img2.height, img2));
					this.numPres--;
					console.log("spawner - created a present");

				// Give a chance to repick it
				} else {
					this.delayTimer = this.delay;
				}
			} else {
				this.delayTimer++;
			}
		}
	}

	startSpawn() {
		console.log("Level 1 spawner started");
		this.start = true;
	}
}