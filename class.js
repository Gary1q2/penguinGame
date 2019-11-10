// Just an entity/sprite with a position in the world
class Entity {
	constructor(x, y, img) {
		this.x = x;
		this.y = y;
		this.img = img;
	}
	draw() {
		ctx.drawImage(this.img, this.x, this.y);
	}
	update() {
		this.draw();
	}
}

class Present extends Entity {
	constructor(x, y, img) {
		super(x, y, img);
	}
	update() {
		this.updateMovement();
		super.update();
	}

	updateMovement() {
		this.y += 5;
	}
}


class Player extends Entity {
	constructor(x, y, img) {
		super(x, y, img);
		this.maxSpd = 4;
		this.accelSpd = 0.5;
		this.hsp = 0;
		this.friction = 0.1;
	}
	update() {
		this.updateMovement();
		super.update();
	}
	// Accelerate player to max speed
	applyAccelerate() {
		if (pressLeft && !pressRight) {
			this.hsp -= this.accelSpd;
			if (this.hsp < -this.maxSpd) {
				this.hsp = -this.maxSpd;
			}
		} else if (pressRight && !pressLeft) {
			this.hsp += this.accelSpd;
			if (this.hsp > this.maxSpd) {
				this.hsp = this.maxSpd;
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
		this.applyAccelerate();
		this.x += this.hsp;
		this.applyFriction();
		// Correct to 1 decimal place
		//this.x = +(this.x).toFixed(1);
		//this.hsp = +(this.hsp).toFixed(1);
	}
}