function page_load() {
	// this code adds an event listener for mouse scrolling, it will call the mouse_scroll function every time an event is throw (the mouse is scrolled)
	var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x 
	if (document.attachEvent) //if IE (and Opera depending on user setting)
		document.attachEvent("on"+mousewheelevt, function(e) {mouse_scroll(e)}, false);
	else if (document.addEventListener) //WC3 browsers
		document.addEventListener(mousewheelevt, function(e) {mouse_scroll(e)}, false);
	
	begin_game();	// Begin the game
}

function mouse_scroll(event) {
	var evt=window.event || event //equalize event object
	var delta=evt.detail? evt.detail*(-120) : evt.wheelDelta //check for detail first so Opera uses that instead of wheelDelta
	// delta now holds the amount that the wheel was scrolled
}

function mouse_move(event) {
	Controller.mouse_x = event.offsetX?(event.offsetX):event.pageX-document.getElementById("draw_canvas").offsetLeft;
	Controller.mouse_y = event.offsetY?(event.offsetY):event.pageY-document.getElementById("draw_canvas").offsetTop;
	
	// x and y now hold the position onscreen of the mouse after the mouse was moved
}

function mouse_press(event) {
	Controller.click_mouse_x = event.offsetX?(event.offsetX):event.pageX-document.getElementById("draw_canvas").offsetLeft;
	Controller.click_mouse_y = event.offsetY?(event.offsetY):event.pageY-document.getElementById("draw_canvas").offsetTop;
	
	// x and y now hold the position onscreen of the mouse click
}

	////////////////////////////////////////////////////////////////////////////////////////// KEY PRESSED DOWN
function key_event(event) {
	if(!ControllerUse){
		switch(event.keyCode){
			case 16:				Controller.shift = true;		break;		// shift
			case 32:				Controller.space = true;		break;		// space
			case 39: case 68:		Controller.right = true;		break;		// right
			case 37: case 65:		Controller.left = true;			break;		// left
			case 38: case 87:		Controller.up = true; 			break;		// up
			case 40: case 83:		Controller.down = true;			break;		// down
			case 80:                Controller.p = !Controller.p;   break;      // p - pause
			case 90: 				Controller.attack = true; 		break;		// z - attack
		}
	}
}
	////////////////////////////////////////////////////////////////////////////////////////// KEY COMES BACK UP
function key_event_up(event) {
	if(!ControllerUse){
		switch(event.keyCode){
			case 16:				Controller.shift = false;	break;		// shift
			case 32:				Controller.space = false;	break;		// space
			case 39: case 68:		Controller.right = false;	break;		// right
			case 37: case 65:		Controller.left = false;	break;		// left
			case 38: case 87:		Controller.up = false; 		break;		// up
			case 40: case 83:		Controller.down = false;	break;		// down
			case 90: 				Controller.attack = false; 	break;		// z - attack
		}
	}
}

function mouse_up(event) {
	switch(event.which){
		case 1: Controller.mouse_left = false; break;
		case 2: Controller.mouse_middle = false; break;
		case 3: Controller.mouse_right = false; break;
	}
}

function mouse_down(event) {
	switch(event.which){
		case 1: Controller.mouse_left = true; break;
		case 2: Controller.mouse_middle = true; break;
		case 3: Controller.mouse_right = true; break;
	}
}
