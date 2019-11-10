// Pressing keys
document.onkeydown = function(event) {
	switch (event.keyCode) {
		// Press left
		case 37:
			pressLeft = true;
			break;
		// Press right
		case 39:
			pressRight = true;
			break
	}
}

// Releasing keys
document.onkeyup = function(event) {
	switch (event.keyCode) {
		// Released left
		case 37:
			pressLeft = false;
			break;
		// Released right
		case 39:
			pressRight = false;
			break
	}
}