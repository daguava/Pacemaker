////////////////////////////////////////////////////////////////////////////////////////// GAME CLASS
function Game(ctx, x_boundary, y_boundary, frame_delay){
	this.ctx = ctx;					// canvas context
	this.frame_delay = frame_delay;	// ms delay between drawing
	this.x_boundary = x_boundary;	// x-coord boundary
	this.y_boundary = y_boundary;	// y-coord boundary
	this.clearColor = "rgba(100, 100, 100, 0.01)";			// initial clear color is null
	this.state = GAMESTATE_START;
	this.resetGame = resetGame;
			////////////////////////////////////////////////////////////////////////////////////// RESET GAME
	function resetGame(){
		collectable_count = 0;
		collectable_count = 0;
		collectable = new Array();
		imageMap = null;
		lastfps = 0;
		platform_x_movement = 0;
		platforms = new Array();
		platform_update = 0;
		grav_const = 1;
		ControllerUse = false;
		begin_game(currentLevel);
		clearTimeout(gametimeout);/////////////is this affected?

		
	}
}
