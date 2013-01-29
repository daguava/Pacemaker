var canvas; 
var ctx;

//constants
var blocksize = 50;
var grav_const = 1;
var gamepadSupport = true;
var fpsWave = 60;
var gameHeight = 600;
var gameWidth = 1200;
var ControllerUse = false;
var collectable_count = 0;
var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
var EndOfMap = 0;
var levelcomplete = false;
var x_check;
var y_check;
var collectable = new Array();
var punchwall = new Array();
var grav_const = 1;
var gamepadSupport = true;
var currentLevel = 0;

var wiper = new Transition();

var attack_occurring = false;
var attack_timer = 0;
var debug = false;
var grid = false;
var lastfps = 0;
var num_collisions = 0;
var platform_x_movement = 0;
var platforms = new Array();
var platform_update = 0;
var thisFrameFPS = 0;
var windowActive = true;
var gamepad = new Gamepad();

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

//Called whenever we need to (re)load the level and begin a new run.
function loadGame(){

Controller = new Control();
collectable_count = 0;
collectable = new Array();
punchwall = new Array();
lastfps = 0;
platform_x_movement = 0;
platforms = new Array();
platform_update = 0;
grav_const = 1;
ControllerUse = false;
levelcomplete = false;
CurrPlayer.init();

map = maps[currentLevel];

imageMap = new Array(map.length);

	for(i = 0; i<map.length; i++){
		imageMap[i] = new Array(map[0].length);
	}

	for(var i = 0; i<map.length; i++){
		for(var k = 0; k<map[i].length; k++){


				if(map[i][k]==1){
					imageMap[i][k] = Ground.image;
				}
				// handle blue platforms
				if(map[i][k]==2){
					imageMap[i][k] = Jump.image;
				}
				if(map[i][k]==3){
					imageMap[i][k] = Duck.image;
				}
				// handle spikes and their tiling
				//if(map[i][k]==4){
				//	imageMap[i][k] = Smash.image;
				//}
				if(map[i][k]==5){
					imageMap[i][k] = Switch.image;
				}
			
				if(map[i][k]==7){
					EndOfMap = k * blocksize;
				}
		if(imageMap[i][k] == undefined) imageMap[i][k] = null;
		}
	}

	// SEND COLLECTABLES TO AN ARRAY FROM MAP FILE
	for(var i = 0; i < map.length; i++){
		for(var k = 0; k < map[i].length; k++){
			if(map[i][k] !=0 && map[i][k] != 6 && map[i][k] != 4 && map[i][k] != 7){
				platforms.push(new Platform(k * blocksize, i * blocksize, map[i][k]));
				platforms[platforms.length-1].type = map[i][k];
			}
			if(map[i][k] == 6){
				collectable.push(new Item(k * blocksize, i * blocksize));
			}
			if(map[i][k] == 4){
				punchwall.push(new PunchWall(k * blocksize, i * blocksize));
			}
		}
	}
}

function load_resources(){

startScreen   = new Image();
optionsScreen = new Image();
levelSelectBgImg = new Image();
levelCompleteImg = new Image();
creditScreen1      = new Image();
background = new Image();
background2 = new Image();

char_left 			= new Image();
char_left_jump	 	= new Image();
char_left_second 	= new Image();
char_right_top 		= new Image();
char_right_top2 	= new Image();
char_right 			= new Image();
char_right_jump 	= new Image();
char_right_second 	= new Image();
char_attack 		= new Image();
char_attack_top	 	= new Image();
char_hurt 			= new Image();

soundLevel1 	= new buzz.sound("./sounds/BEATI011.wav");
soundLevel12 	= new buzz.sound("./sounds/BEATI01.wav");
soundLevel2 	= new buzz.sound("./sounds/BEATI02.wav");
soundLevel3 	= new buzz.sound("./sounds/BEATI03.wav");
soundLevel4 	= new buzz.sound("./sounds/BEATI04.wav");
soundLevelSanic = new buzz.sound("./sounds/BEATI05.wav");

soundLevel1.load();
soundLevel2.load();
soundLevel3.load();
soundLevel4.load();
soundLevelSanic.load();

soundLevel1.loop().play().mute();
soundLevel2.loop().play().mute();
soundLevel3.loop().play().mute();
soundLevel4.loop().play().mute();
soundLevelSanic.loop().play().mute();

creditScreen1.src 		=  "./Images/credits_screen_bg.png";

levelSelectBgImg.src 	= 	"./Images/state_level_select_bg.png";
levelCompleteImg.src 	= 	"./Images/levelcomplete.png"

char_right_jump.src 	=	"./Images/cellman_jumping.png";
char_right.src 			= 	"./Images/cellman_running.png";
char_right_top.src 		= 	"./Images/cellman_running_top.png";
char_right_second.src 	= 	"./Images/cellman_running2.png";
char_right_top2.src 	=	"./Images/cellman_running_top2.png";
char_hurt.src 			= 	"./Images/cellman_hurt.png"

char_attack.src 		=	"./Images/cellman_smashing.png";
char_attack_top.src 	=	"./Images/cellman_smashing_top.png";

background.src 			=	"./Images/vein_background.jpg";
background2.src 		= 	"./Images/outer_vein_wall.png";
startScreen.src 		= 	"./Images/start_screen_bg.png";

optionsScreen.src 		= 	"./Images/controls_screen_bg.png";

Ground = new Platform();					// 1 = ground
Ground.image = new Image();
Ground.image.src = "./Images/platform.fw.png";

Jump = new Platform();						// 2 = jump
Jump.image = new Image();
Jump.image.src = "./Images/deadcells.png";

Duck = new Platform();						// 3 = duck
Duck.image = new Image();
Duck.image.src = "./Images/duck.fw.png";

Smash = new Platform();						// 5 = switch
Smash.image = new Image();
Smash.image.src = "./Images/smash.fw.png";

Switch = new Platform();					// 4 = smash
Switch.image = new Image();
Switch.image.src = "./Images/switch.fw.png";

Blood  = new Platform();					// 6 = collectable
Blood.image  = new Image();
Blood.image.src = "./Images/redbloodcell.png";

Grass = new Platform();
Grass.image = new Image();
Grass.image.src = "./Images/grass_tile.png";

Dirt = new Platform();
Dirt.image = new Image();
Dirt.image.src = "./Images/ground_tile.png";

Block = new Platform();
Block.image.src 	  = "./Images/platform.png";

Block2 = new Platform();
Block2.image.src 	  = "./Images/platform_only.png";

Block3 = new Platform();
Block3.image.src 	  = "./Images/platform_underneath.png";

Cell = new Item();
Cell.image.src 		  = "./Images/redbloodcell.png";

Spike = new Platform();
Spike.image.src 	  = "./Images/spike_pit.png";	

SpikeColumn = new Platform();
SpikeColumn.image.src = "./Images/spike_lower.png";

scorebar = new Image();
scorebar.src = "./Images/scorebar.jpg";

//Syntax for buttons --> What Gamestate it is at _ What Gamestate it is going to
//GAMESTATE_START
Button_Start_Play = new Button(900, 280, 120, 50, "Play",  false, "#000000");
Button_Start_Options = new Button(900, 355, 180, 50, "Options", false, "#000000");
Button_Start_Credits = new Button(900, 430, 160, 50, "Credz",  false, "#000000");

//GAMESTATE_GAMEPLAY
Button_Gameplay_Reset = new Button(1000, 10, 120, 30, "Reset", false, "#FFFFFF");
Button_Gameplay_Options = new Button(850, 10,150, 30, "Controls",  false,"#FFFFFF" );

Button_Level_Select_One = new Button(280,270,550,60,"Lvl1 - Best: 0/26",  true, "#000000");
Button_Level_Select_Two = new Button(280,340,550,60,"Locked",  true, "#000000");
Button_Level_Select_Three = new Button(280,410,550,60,"Locked", true, "#000000");
Button_Level_Select_Four = new Button(280,480,550,60,"Locked",  true, "#000000");

//GAMESTATE_OPTIONS
Button_Options_Start = new Button(550, 500, 100, 30, "Menu", false, "#000000");

//GAMESTATE_CREDITS
Button_Credits_MainMenu = new Button(550, 550, 100, 30, "Menu",  false, "#000000");
}

//Sets up a game.
function begin_game(){
	load_resources();
	Controller = new Control();

	PlayerGame = new Game(ctx, gameWidth, gameHeight, 10);		// (context, x_boundary, y_boundary, ms_delay)
	PlayerGame.clearColor = "rgb(50,43,32)";
	CurrPlayer = new Player(50, 400);				// (x-position, y-position)

	loadGame();
	frame();
}
