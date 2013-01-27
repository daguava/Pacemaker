var GAMESTATE_START = 0;
var GAMESTATE_GAMEPLAY = 1;
var GAMESTATE_OPTIONS = 2;
var GAMESTATE_CREDITS = 3;


var canvas;

var background = new Image();
var background2 = new Image();
var blocksize = 50;
var collectable_count = 0;
var char_left = new Image();
var char_left_jump = new Image();
var char_left_second = new Image();
var char_right = new Image();
var char_right_jump = new Image();
var char_right_second = new Image();
var x_check;
var y_check;
var collectable = new Array();
var grav_const = 1;

var debug = true;
var grid = false;

var fpsWave = 60;
var gameHeight = 600;
var gameWidth = 1200;
var lastfps = 0;
var num_collisions = 0;
var platform_x_movement = 0;
var platforms = new Array();
var platform_update  = 0;
var thisFrameFPS     = 0;
var windowActive     = true;
var startScreen      = new Image();
var optionsScreen    = new Image();
var creditScreen     = new Image();

var sMitchellL = "MITCHELL LUTZKE";
var sAlexS     = "ALEX SOHAIL";
var sNickH     = "NICK HEINDL";
var sJasonA    = "JASON ALTEKRUSE";
var sJesseK    = "JESSE KRIZENESKY";

var sBuildMitchell = "";
var sBuildAlex     = "";
var sBuildNick     = ""; 
var sBuildJason    = "";
var sBuildJesse    = "";

var aMitchellL = new Array();
var aAlexS     = new Array();
var aNickH     = new Array();
var aJasonA    = new Array();
var aJesseK    = new Array();


//not an array because how would you know array[0] == mitchell's string
var iStringPositionMitchell = 0;
var iStringPositionAlex     = 0;
var iStringPositionNick     = 0;
var iStringPositionJason    = 0;
var iStringPositionJesse    = 0;




var bJesseK    = 0;
var bNickH     = 1;
var bMitchellL = 1;
var bAlexS     = 1;
var bJasonA    = 1;



var iXTextPosition = 50;
var iYTextPosition = 100;

var iCounter = 33;
var iCounterMitchell = 0;
var iCounterMin = 33;
var iCounterMax = 126;
var iArrayPosition = 0;

creditScreen.src =         "./Images/credits_screen.fw.png";


char_right_jump.src = 		"./Images/bucky_right_jump.gif";
char_left_jump.src = 		"./Images/bucky_left_jump.gif";
char_right.src = 			"./Images/bucky_right.gif";
char_left.src = 			"./Images/bucky_left.gif";
char_right_second.src = 	"./Images/bucky_right_second.gif";
char_left_second.src = 		"./Images/bucky_left_second.gif";
background.src = 			"./Images/test_background1.jpg";
startScreen.src = 			"./Images/start_screen.fw.png";
optionsScreen.src = 		"./Images/options_screen.fw.png";
background2.src = 			"./Images/test_background2.png";

	// nice little piece of code that uses a browser's native
	// request animation frame function if it exists. If it doesn't,
	// it reverts back to setTimeout

(function() {
    var lastTime = 0;
    //var vendors = ['ms', 'moz', 'webkit', 'o'];
    var vendors = ['pie'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelRequestAnimationFrame = window[vendors[x]+
          'CancelRequestAnimationFrame'];
    } 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            //var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
            	var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              16);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}())

	////////////////////////////////////////////////////////////////////////////////////////// SETTING THINGS UP INITIALLY
function begin_game() {

	canvas = document.getElementById("draw_canvas");
	ctx = canvas.getContext("2d");

	Controller = new Control();
	PlayerGame = new Game(ctx, gameWidth, gameHeight, 10);		// (context, x_boundary, y_boundary, ms_delay)
	PlayerGame.clearColor = "rgb(135,206,235)";
	CurrPlayer = new Player(50, 300);				// (x-position, y-position)

	Grass = new Platform();
	Grass.imageArray = new Array();
	Grass.imageArray[0] = new Image();
	Grass.imageArray[0].src = "./Images/grass_tile.png";
	Grass.imageArray[1] = new Image();
	Grass.imageArray[1].src = "./Images/grass_tile2.png";

	Dirt = new Platform();
	Dirt.imageArray = new Array();
	Dirt.imageArray[0] = new Image();
	Dirt.imageArray[0].src = "./Images/ground_tile.png";
	Dirt.imageArray[1] = new Image();
	Dirt.imageArray[1].src = "./Images/ground_tile2.png";

	Block = new Platform();
	Block2 = new Platform();
	Block3 = new Platform();
	Cell = new Item();

	Spike = new Platform();
	SpikeColumn = new Platform();
	Cell.image.src = "./Images/redbloodcell.png";

	//Block.image.src = "platform_placeholder.gif";
	Block.image.src 	  = "./Images/platform.png";
	Block2.image.src 	  = "./Images/platform_only.png";
	Block3.image.src 	  = "./Images/platform_underneath.png";
	Spike.image.src 	  = "./Images/spike_pit.png";	
	SpikeColumn.image.src = "./Images/spike_lower.png";

	CurrPlayer.image.src  = "./Images/bucky_small.gif";
	scorebar = new Image();
	scorebar.src = "./Images/scorebar.jpg";

	//Syntax for buttons --> What Gamestate it is at _ What Gamestate it is going to
	//GAMESTATE_START
	Button_Start_Play = new Button(916, 280, 120, 50, "Play Game", ctx, true);
	Button_Start_Options = new Button(856, 355, 180, 50, "Options", ctx, true);
	Button_Start_Credits = new Button(876, 430, 160, 50, "Credz", ctx, true);

	//GAMESTATE_GAMEPLAY
	Button_Gameplay_Reset = new Button(1000, 10, 120, 30, "Reset Game", ctx, false);
	Button_Gameplay_Options = new Button(850, 10, 100, 30, "Options", ctx, false);

	//GAMESTATE_OPTIONS
	Button_Options_Start = new Button(550, 500, 100, 30, "Main Menu", ctx, false);

	//GAMESTATE_CREDITS
	Button_Credits_MainMenu = new Button(500, 500, 100, 30, "Main Menu", ctx, false);

	imageMap = new Array(map.length);

	for(i = 0; i<map.length; i++){
		imageMap[i] = new Array(map[0].length);
	}

	

	for(var i = 0; i<map.length; i++){
		for(var k = 0; k<map[i].length; k++){
			


			// This fucking terrible mess draws the tiles, it looks like shit due to auto-tiling. If we dont
			// do tiling this will literally be like 4 if statements


				if(map[i][k]==1){
					if(i-1>=0){
						if(map[i-1][k]==1){
							imageMap[i][k] = Dirt.imageArray[Math.floor(Math.random()*Dirt.imageArray.length)]
						} else {
							imageMap[i][k] = Grass.imageArray[Math.floor(Math.random()*Grass.imageArray.length)];
						}
					} else {
						imageMap[i][k] = Grass.imageArray[Math.floor(Math.random()*Grass.imageArray.length)];
					}
				}
				// handle blue platforms
				if(map[i][k]==2){
					if(i-1>0 && i+1<map.length){
						if(map[i-1][k]==2 || map[i+1][k]==2){
							if(map[i-1][k] != 2){
								imageMap[i][k] = Block.image;
							} else {
								imageMap[i][k] = Block3.image;
							}
						} else {
							imageMap[i][k] = Block2.image;
						}
					} else {
						imageMap[i][k] = Block3.image;
					}
				}
				// handle spikes and their tiling
				if(map[i][k]==4){
					if(i-1>=0){
						if(map[i-1][k]==4){
							imageMap[i][k] = SpikeColumn.image;
						} else {
							imageMap[i][k] = Spike.image;
						}
					} else {
						imageMap[i][k] = Spike.image;
					}
				}
			
		if(imageMap[i][k] == undefined) imageMap[i][k] = null;
		}
	}

	////////////////////////////////////////////////////////////////////////////////////////// SEND COLLECTABLES TO AN ARRAY FROM MAP FILE
	for(var i = 0; i<map.length; i++){
		for(var k = 0; k<map[i].length; k++){
			if(map[i][k]!=0 && map[i][k]!=3 && map[i][k] != 5){
				platforms.push(new Platform(k*blocksize, i*blocksize, map[i][k]));
			}
			if(map[i][k]==3){
				collectable.push(new Item(k*blocksize, i*blocksize));
			}
		}
	}
	frame();
}
