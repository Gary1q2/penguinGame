// Pressing keys
document.onkeydown = function(event) {
	switch (event.keyCode) {
		// Press left
		case 65:
			pressLeft = true;
			break;
		// Press right
		case 68:
			pressRight = true;
			break
	}
}

// Releasing keys
document.onkeyup = function(event) {
	switch (event.keyCode) {
		// Released left
		case 65:
			pressLeft = false;
			break;
		// Released right
		case 68:
			pressRight = false;
			break;

		// Spawn a spike rock
		case 48:
			rockArray.push(new Rock(Math.floor(Math.random()*1200),
			                     -50, spike.width, spike.height, spike));
			console.log("sawp nrock");
			break;

		// Spawn normal present
		case 49:
			presArray.push(new Present(Math.floor(Math.random()*1200),
			                     -50, img2.width, img2.height, img2));
			break;

		// Spawn blue present
		case 50:
			presArray.push(new BluePresent(Math.floor(Math.random()*1200),
			                     -50, bluePres.width, bluePres.height, bluePres));
			break;

		// Spawn purple present
		case 51:
			presArray.push(new PurplePresent(Math.floor(Math.random()*1200),
			                     -50, purplePres.width, purplePres.height, purplePres));
			break;
	}
}