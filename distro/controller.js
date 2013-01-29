function Control() {
	this.space = false;
	this.shift = false;
	this.left = false;
	this.right = false;
	this.up = false;
	this.down = false;
	this.mouse_left = false;
	this.mouse_right = false;
	this.mouse_middle = false;
	this.click_mouse_x = null;
	this.click_mouse_y = null;
	this.mouse_x = null;
	this.mouse_y = null;
	this.p = false;
	this.attack = false;
	initController();
}


function initController(){
	if (!gamepad.init()) {
    gamepadSupport = false;
}else{
	  // a new gamepad connected
	gamepad.bind(Gamepad.Event.CONNECTED, function(device) {
});

gamepad.bind(Gamepad.Event.DISCONNECTED, function(device) {
    // gamepad disconnected
});

gamepad.bind(Gamepad.Event.UNSUPPORTED, function(device) {
    // an unsupported gamepad connected (add new mapping)
});

gamepad.bind(Gamepad.Event.TICK, function(gamepads) {
    // gamepads were updated (around 60 times a second)
	for (control in gamepads[0].state) {
		//value = gamepads[i].state[control];

		if(gamepads[0].state['A']){
			ControllerUse = true;
			Controller.space = true;
		} else if(gamepadSupport && ControllerUse){
			Controller.space = false;
		}

		if(gamepads[0].state['X']){
			ControllerUse = true;
			Controller.shift = true;
		} else if(gamepadSupport && ControllerUse) {
			Controller.shift = false;
		}

		if(gamepads[0].state['DPAD_LEFT']){
			ControllerUse = true;
			Controller.left = true;
		} else if(gamepadSupport && ControllerUse) {
			Controller.left = false;
		}

		if(gamepads[0].state['DPAD_RIGHT']){
			ControllerUse = true;
			Controller.right = true;
		} else if(gamepadSupport && ControllerUse) {
			Controller.right = false;
		}

		if(gamepads[0].state['DPAD_UP']){
			ControllerUse = true;
			Controller.up = true;
		} else if(gamepadSupport && ControllerUse) {
			Controller.up = false;
		}

		if(gamepads[0].state['DPAD_DOWN']){
			ControllerUse = true;
			Controller.down = true;
		} else if(gamepadSupport && ControllerUse) {
			Controller.down = false;
		}

		if(gamepads[0].state['B']){
			ControllerUse = true;
			Controller.attack = true;
		} else if(gamepadSupport && ControllerUse) {
			Controller.attack = false;
		}

		if(gamepads[0].state['RIGHT_STICK']){
			ControllerUse = true;
			Controller.e = true;
		} else if(gamepadSupport && ControllerUse) {
			Controller.e = false;
		}

		if(gamepads[0].state['BACK']){
			ControllerUse = true;
			Controller.r = true;
		} else if(gamepadSupport && ControllerUse) {
			Controller.r = false;
		}

		if(gamepads[0].state['START'] && !pauseToggle){
			ControllerUse = true;
			Controller.p = !Controller.p;
			pauseToggle = true;
		}
		if(!gamepads[0].state['START']){
			pauseToggle = false;
		}
	}
});
}
}