// Clicking
document.getElementById("ui").addEventListener("click", function(event) {
	console.log("lala");

	var mouseX = event.clientX-300;
	var mouseY = event.clientY;
	console.log(mouseX + "  " + mouseY);
/*
	if (createType == "rock") {
		rockArray.push(new Rock(mouseX,mouseY,spike.width,spike.height,spike));
	} else if (createType == "pres") {
		presArray.push(new Present(mouseX,mouseY,img2.width,img2.height,img2));
	} else if (createType == "bluePres") {
		presArray.push(new BluePresent(mouseX,mouseY,bluePres.width,bluePres.height,bluePres));
	} else if (createType == "purplePres") {
		presArray.push(new PurplePresent(mouseX,mouseY,purplePres.width,purplePres.height,purplePres));
	}*/
});