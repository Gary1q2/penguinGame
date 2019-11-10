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


class Player extends Entity {
	constructor(x, y, img) {
		super(x, y, img);
		this.speed = 3;
	}
	update() {
		this.updateMovement();
		super.update();
	}

	updateMovement() {
		if (pressLeft && !pressRight) {
			this.x -= this.speed;
		} else if (pressRight && !pressLeft) {
			this.x += this.speed;
		}
	}
}