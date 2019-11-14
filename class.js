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

		this.maxSpd = 6;
		this.gravity = 0.1;

		this.chuteSpd = 1;
		this.fallSpd = this.chuteSpd;
	
		this.hasChute = true;

		this.chuteTime = 300;
		this.chuteTimer = 0;

		this.hit = false;

		this.friction = 0.05;
		this.hsp = 0;
	}

	update() {
		this.updateMovement();
		if (!this.dead) {
	 		super.update();
	 		if (this.hasChute) {
		 		this.drawChute();
		 	}
	 	}

	 	if (this.hasChute) {
	 		this.chuteTimer++;
	 		if (this.chuteTimer >= this.chuteTime) {
	 			this.hasChute = false;
	 		}
	 	}
		this.checkLost();

	}

	hitUp() {
		this.fallSpd = -10;
		this.hit = true;
	}

	// Draw the parachute
	drawChute() {
		ctx.drawImage(chute, this.x-this.width/2, this.y-80);
	}

	// Make it fall down
	updateMovement() {
		if (this.hsp > 0) {
			this.hsp -= this.friction;
		}

		if (this.hit && this.fallSpd >= 0) {
			this.hit = false;
		}
		if (this.hasChute) {
			this.fallSpd = this.chuteSpd
		} else {
			if (this.fallSpd < this.maxSpd) {
				this.fallSpd += this.gravity;
			}
		}
		this.y += this.fallSpd;
		this.x += this.hsp;
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
		this.chuteTime = 200;
	}

	update() {
		super.update();
	}
}

class PurplePresent extends Present {
		constructor(x, y, width, height, img) {
		super(x, y, img.width, img.height, img);
		this.dead = false;
		this.chuteTime = 100;
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
				//console.log("dashing done");
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
					ctx.drawImage(dash, this.x-this.width/2,this.y-this.height/2+40);
				} else {
					ctx.drawImage(dashR, this.x-this.width/2,this.y-this.height/2+40);
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
			//console.log("yes stunned");
			if (this.stunTimer >= this.stunTime) {
				this.stunned = false;
				this.stunTimer = 0;
				//console.log("shud be false");
			} else {
				this.stunTimer++;
				//console.log("plussed");
			}	
		}
	}

	// Checks if player touched a rock
	checkTouchRock() {
		if (!this.stunned) {
			for (var i = 0; i < rockArray.length; i++) {
				if (rockArray[i].collideWith(this)) {
					this.stunned = true;
					this.hsp = 0;
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
			if (this.x+this.hsp >= 0 && this.x+this.hsp <= 1200) {
				this.x += this.hsp;
			}
			this.applyFriction();
		}
	}
}


class MechSpawner {
	constructor() {
		this.mech = -1;
		this.spawning = false;

		this.timer = 0;
	}
	update() {
		if (this.spawning) {

			// Spawn green + blue present
			if (this.mech == 1) {
				if (this.timer == 0) {
					//create a green present
					presArray.push(new Present(300, -50, img2.width, img2.height, img2));
				} else if (this.timer == 50) {
					//create blue present
					presArray.push(new BluePresent(700, -50, bluePres.width, bluePres.height, bluePres));
					this.spawning = false;
					console.log("back to idle state");
				}

			// Spawn green, blue and purple present
			} else if (this.mech == 2) {
				if (this.mech2 <= 0.3) {
					if (this.timer == 0) {
						presArray.push(new Present(300, -50, img2.width, img2.height, img2));
					} else if (this.timer == 50) {
						presArray.push(new BluePresent(600, -50, bluePres.width, bluePres.height, bluePres));
					} else if (this.timer == 100) {
						presArray.push(new PurplePresent(900, -50, purplePres.width, purplePres.height, purplePres));
						this.spawning = false;
					}
				} else if (this.mech2 > 0.3 && this.mech <= 0.6) {
					if (this.timer == 0) {
						presArray.push(new Present(600, -50, img2.width, img2.height, img2));
					} else if (this.timer == 50) {
						presArray.push(new BluePresent(300, -50, bluePres.width, bluePres.height, bluePres));
					} else if (this.timer == 100) {
						presArray.push(new PurplePresent(900, -50, purplePres.width, purplePres.height, purplePres));
						this.spawning = false;
					}				
				} else {
					if (this.timer == 0) {
						presArray.push(new Present(900, -50, img2.width, img2.height, img2));
					} else if (this.timer == 50) {
						presArray.push(new BluePresent(300, -50, bluePres.width, bluePres.height, bluePres));
					} else if (this.timer == 100) {
						presArray.push(new PurplePresent(600, -50, purplePres.width, purplePres.height, purplePres));
						this.spawning = false;
					}		
				}

			// Two green presents
			} else if (this.mech == 3) {
				if (this.timer == 0) {
					presArray.push(new Present(300, -50, img2.width, img2.height, img2));
				} else if (this.timer == 100) {
					presArray.push(new Present(800, -50, img2.width, img.height, img2));
					this.spawning = false;
				}

			// Rock predict the movement
			} else if (this.mech == 4) {
				if (this.timer == 0) {
					presArray.push(new Present(this.mech5, -50, img2.width, img2.height, img2));
				} else if (this.timer == 230) {
					console.log("playerX = " + player.x);
					console.log("playerHSP = " + player.hsp);
					var xPos;
					if (player.x - this.mech5 <= 200) {
						xPos = this.mech5;
					} else {
						//predict movement
						xPos = player.x+800/6*player.hsp
						if (xPos < 0 || xPos > 1200) {
							xPos = this.mech5;
							console.log("xPos reset");
						}			
					}
			
					console.log("xPos = " + xPos);
					rockArray.push(new Rock(xPos, -50, spike.width-10, spike.height-10, spike));
					this.spawning = false;
				}
			}
			if (this.timer == this.spikeRand) {
				rockArray.push(new Rock(Math.random()*1200, -50, spike.width-10,spike.height-10,spike));
			}
			this.timer++;
		}
	}
	spawnMech(type) {
		if (this.spawning) {
			console.log("failed to spawn - spawn in progress");
		} else {
			this.mech = type;
			this.spawning = true;
			this.timer = 0;

			this.mech2 = Math.random();
			this.mech5 = Math.random()*1200;

			this.spikeRand = Math.ceil(Math.random()*100);
			console.log("spawning type " + type);
		}
	}
}


class Spawner {
	constructor() {
		this.numPres = 30;
		this.numSpike = 20;
		this.start = false;

		this.delay = 100;
		this.delayTimer = 0;		

		this.lastPresX = 0;
	}
	update() {
		if (this.start && (this.numPres > 0 || this.numSpike > 0)) {
			if (this.delayTimer >= this.delay) {
				this.delayTimer = 0;
				
				var temp = Math.random();
				if (temp <= 0.5 && this.numSpike > 0) {

					rockArray.push(new Rock(this.lastPresX-150+Math.floor(Math.random()*300), 
						        -50, spike.width, spike.height, spike));
					this.numSpike--;
					console.log("spawner - created a rock");
					this.deplayTimer = 100;
				} else if (temp > 0.5 && this.numPres > 0) {
					this.lastPresX = Math.floor(Math.random()*1200); 

					var fuck = Math.random();
					if (fuck <= 0.7) {
						presArray.push(new Present(this.lastPresX, -50, img2.width, img2.height, img2));
					} else {
						presArray.push(new BluePresent(this.lastPresX,
				                 -50, bluePres.width, bluePres.height, bluePres));
					}
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