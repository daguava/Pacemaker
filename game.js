
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
		clearTimeout(gametimeout);/////////////is this affected?
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
