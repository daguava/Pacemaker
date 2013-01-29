
var GAMESTATE_START = 0;
var GAMESTATE_GAMEPLAY = 1;
var GAMESTATE_OPTIONS = 2;
var GAMESTATE_CREDITS = 3;
var GAMESTATE_LEVEL_SELECT = 4;


////////////////////////////////////////////////////////////////////////////////////////// GAME CLASS
function Game(ctx, x_boundary, y_boundary, frame_delay){
	this.ctx = ctx;					// canvas context
	this.frame_delay = frame_delay;	// ms delay between drawing
	this.x_boundary = x_boundary;	// x-coord boundary
	this.y_boundary = y_boundary;	// y-coord boundary
	this.clearColor = "rgba(100, 100, 100, 0.01)";			// initial clear color is null
	this.state = GAMESTATE_START;
	this.resetGame = resetGame;


	function resetGame(){
		//if(is_chrome)
		//clearTimeout(gametimeout);/////////////is this affected?
	
		loadGame();
	}

	this.changeState = function(from, to){
		//this.state = to;
		if(to == GAMESTATE_GAMEPLAY){
			console.log("LOADAN GAME");
			loadGame();
		}

	}
}


function collectCell(){
	if(collectable_count == 0){
		soundLevel1.setVolume(20)
	}
	if(collectable_count == 2){
			soundLevel1.setVolume(40)
	}
	if(collectable_count == 4){
			soundLevel1.setVolume(60)
	}
	if(collectable_count == 6){
	soundLevel1.setVolume(80)
	}

	if(collectable_count == 8){ ////// Hard code to 8 because it should matter (FR goes fast enough) and #YOLOSWAG
			soundLevel2.unmute();
			soundLevel2.setVolume(20)
	}
	if(collectable_count == 10){
			soundLevel2.setVolume(40)
	}
	if(collectable_count == 12){
			soundLevel2.setVolume(60)
	}
	if(collectable_count == 14){
	soundLevel2.setVolume(80)
	}

	if(collectable_count == 16){ ////// Hard code to 16 because it should matter (FR goes fast enough) and #YOLOSWAG
			soundLevel3.unmute();
			soundLevel3.setVolume(20)
	}
	if(collectable_count == 18){
			soundLevel3.setVolume(40)
	}
	if(collectable_count == 20){
			soundLevel3.setVolume(60)
	}
	if(collectable_count == 22){
	soundLevel3.setVolume(80)
	}

	if(collectable_count == 24){ ////// Hard code to 24 because it should matter (FR goes fast enough) and #YOLOSWAG
			soundLevel4.unmute();
			soundLevel4.setVolume(20)
	}
	if(collectable_count == 26){
			soundLevel4.setVolume(40)
	}
	if(collectable_count == 28){
			soundLevel4.setVolume(60)
	}
	if(collectable_count == 30){
	soundLevel4.setVolume(80)
	}

	if(collectable_count == 32){ ////// Hard code to 32 because it should matter (FR goes fast enough) and #YOLOSWAG
		soundLevelSanic.unmute();
		soundLevelSanic.setVolume(20)
	}
	if(collectable_count == 34){
			soundLevelSanic.setVolume(40)
	}
	if(collectable_count == 36){
			soundLevelSanic.setVolume(60)
	}
	if(collectable_count == 38){
	soundLevelSanic.setVolume(80)
	}
}
