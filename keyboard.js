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
			break;

		// Spawn a spike rock
		case 48:
			createType = "rock";
			//rockArray.push(new Rock(Math.floor(Math.random()*1200),
			//                     -50, spike.width, spike.height, spike));
			//console.log("sawp nrock");
			break;

		// Spawn normal present
		case 49:
			createType = "pres";

			mechSpawn.spawnMech(4);
			//presArray.push(new Present(Math.floor(Math.random()*1200),
			//                     -50, img2.width, img2.height, img2));
			break;

		// Spawn blue present
		case 50:
			createType = "bluePres";
			//presArray.push(new BluePresent(Math.floor(Math.random()*1200),
			//                     -50, bluePres.width, bluePres.height, bluePres));
			break;

		// Spawn purple present
		case 51:
			createType = "purplePres";
			//presArray.push(new PurplePresent(Math.floor(Math.random()*1200),
			//                     -50, purplePres.width, purplePres.height, purplePres));
			break;

		// Press c to remove chutes from all parachutes
		case 67:
			for (var i = 0; i < presArray.length; i++) {
				presArray[i].hasChute = false;
			}
			break;

		// Press space to dash
		case 32:
			if (canDash) {
				//console.log("DASHED BOIZ");
				canDash = false;
				dashing = true;
			}
			break;

		// Press w for wind
		case 87:
			for (var i = 0; i < presArray.length; i++) {
				var wind = Math.ceil(Math.random()*2);
				presArray[i].hsp = wind+2;
			}
			break;
	}
}