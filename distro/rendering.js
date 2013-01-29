var time = 0;

function draw_game() {
	time+=.1;
	ctx.save();
	ctx.translate(10,-10);
	ctx.rotate(Math.sin(time)/45);

	ctx.drawImage(background, Math.round(platform_x_movement*(0.5)%background.width-background.width), 0);
	ctx.drawImage(background, Math.round(platform_x_movement*(0.5)%background.width), 0);
	ctx.drawImage(background, Math.round(platform_x_movement*(0.5)%background.width+background.width), 0);

	ctx.drawImage(background2, Math.round(platform_x_movement*(0.8)%background.width-background.width), 0);
	ctx.drawImage(background2, Math.round(platform_x_movement*(0.8)%background.width), 0);
	ctx.drawImage(background2, Math.round(platform_x_movement*(0.8)%background.width+background.width), 0);

		//// DRAW EACH INDIVIDUAL TILE WHERE IT GOES
		for(var i = 0; i < map.length; i++){
			for(var k = 0; k*blocksize+platform_x_movement < 1400 && k<map[i].length; k++){
				if(imageMap[i][k] != null && k*blocksize+platform_x_movement >= -100 && (k+1)*blocksize + platform_x_movement < 1300) 
					ctx.drawImage(imageMap[i][k], k*blocksize+Math.floor(platform_x_movement), Math.floor(i*blocksize), blocksize, blocksize);
			}
		}

		//DRAW EACH COLLECTABLE
		for(var i = 0; i < collectable.length; i++){
			// handle collectables
			ctx.drawImage(Cell.image, collectable[i].x+Math.floor(platform_x_movement), Math.floor(collectable[i].y));
		}

		for(var i = 0; i < punchwall.length; i++){
			// handle collectables
			ctx.drawImage(Smash.image, punchwall[i].x+Math.floor(platform_x_movement), Math.floor(punchwall[i].y));
		}
	
//DRAW DAT BUCKY
	drawObject(CurrPlayer, ctx);

// DRAW UI
	drawUI(ctx);

//DRAW SEXY GRID

	if(grid){
		blocksWidth = map[0].length;
		blocksHeight = map.length;
		for(var i = 0; i * blocksize <= blocksWidth*blocksize; i++){
			ctx.stokeStyle = "rgb(0,0,0)";
			ctx.beginPath();
			ctx.moveTo(0,i * blocksize);
			ctx.lineTo(blocksWidth*blocksize,i*blocksize);
			ctx.stroke();

			ctx.stokeStyle = "rgb(0,0,0)";
			ctx.beginPath();
			ctx.moveTo(i * blocksize + platform_x_movement % blocksize,0);
			ctx.lineTo(i * blocksize + platform_x_movement % blocksize,blocksHeight * blocksize);
			ctx.stroke();

			ctx.stokeStyle = "rgb(0,0,0)";
		}
	}

	//DRAW LEVEL COMPLETE SCREEN
	if(levelcomplete){
	  console.log("level complete!");
	  ctx.drawImage(levelCompleteImg, 200, 100);
	  playerData.levels[playerData.currentLevel].best = collectable_count;
	  playerData.levels[playerData.currentLevel].beaten = true; 

	  if(Controller.attack){
	 	PlayerGame.state = GAMESTATE_LEVEL_SELECT;
	  }
	}
	ctx.restore();
}

function screenClear(){ 
	ctx.fillStyle = PlayerGame.clearColor;
	ctx.fillRect(0, 0,PlayerGame.x_boundary, PlayerGame.y_boundary);
}

//AVOID THIS SHIT
function drawObject(drawableObject, ctx){
	ctx.save();
	ctx.translate(drawableObject.x + drawableObject.width/2 ,drawableObject.y + drawableObject.height/2);
	//ctx.translate(drawableObject.width/2,drawableObject.height/2)
	ctx.rotate(drawableObject.rotation);
	ctx.drawImage(drawableObject.image, -drawableObject.width/2, -drawableObject.height/2, drawableObject.width, drawableObject.height);
	ctx.restore();	
}



//UP DRAWN TO SCREEN
function drawUI(context){
	if(debug) {
		// draw debugging UI
		context.font = '15px Calibri';
		context.fillStyle = "rgb(240,240,240)";
		context.fillText("FPS-Avg: " 			+ fps.toFixed(0), 											120, 	20);
		context.fillText("FPS-Imm: " 			+ thisFrameFPS.toFixed(2), 									120, 	35);
		context.fillText("Collided: " 			+ CurrPlayer.grounded || CurrPlayer.grounded_last_frame, 	600, 	35);
		context.fillText("Dist-Since-Change: " 	+ CurrPlayer.distance_since_sprite_change.toFixed(2), 		600, 	20);
	} else {
		// draw normal UI
		context.drawImage(Cell.image, 15, 12);
		context.font = '25px Calibri';
		context.fillStyle = "rgb(240,240,240)";
		context.fillText(" x ", 57, 42);
		context.fillText("   " + collectable_count, 60, 43);
	}

	if(CurrPlayer.dead){
		context.font = '30px Calibri';
		context.fillText("You dead bro?",																230,	35);
	}
	//context.font = '30px Calibri';
	//context.fillText("Level: " + currentLevel + " Complete:" + levelcomplete,430,35);

	if(document.activeElement.id != "draw_canvas" || !windowActive || Controller.p){ //Known Bug - can pause while jumped
				context.fillStyle = "rgba(50,50,50,0.5)";
				context.fillRect(527, 247, 145, 50);
				context.fillStyle = "rgb(240,240,240)";
				context.font = '30px Calibri';
				context.fillText("Paused",																		550,	280);
	}
}


function updateButtonText(){

	Button_Level_Select_One.text =  "Lvl1 - Best - " + playerData.levels[0].best + "/" + playerData.levels[0].max;

	
	if(playerData.levels[0].beaten){
		Button_Level_Select_Two.text =  "Lvl2 - Best - " + playerData.levels[1].best + "/" + playerData.levels[1].max;
	} 

	else{
		Button_Level_Select_Two.text =  "Locked (???)"
	}


	if(playerData.levels[1].beaten){
		Button_Level_Select_Three.text =  "Lvl3 - Best - " + playerData.levels[2].best + "/" + playerData.levels[2].max;
	} 

	else{
		Button_Level_Select_Three.text =  "Locked (???)"
	}


	if(playerData.levels[2].beaten){
		Button_Level_Select_Four.text =  "Lvl4 - Best - " + playerData.levels[2].best + "/" + playerData.levels[2].max;
	} 

	else{
		Button_Level_Select_Four.text =  "Locked (???)"
	}

}

//DRAW EVERYTHING
function draw_world() {  
	screenClear();
	if (PlayerGame.state == GAMESTATE_GAMEPLAY){
		draw_game();
		if(Button_Gameplay_Reset.update()){
			loadGame();
		}

		if(Button_Gameplay_Options.update()){
			PlayerGame.state = GAMESTATE_OPTIONS;
		}
	}

	else if(PlayerGame.state == GAMESTATE_OPTIONS){
		ctx.drawImage(optionsScreen, 0, 0);

		if(Button_Options_Start.update()){
			PlayerGame.state = GAMESTATE_START;
		}
	}

	else if(PlayerGame.state == GAMESTATE_START){
		ctx.drawImage(startScreen, 0, 0);

		if(Button_Start_Play.update() || Controller.space){

			PlayerGame.state = GAMESTATE_LEVEL_SELECT;
		}	
		
		if(Button_Start_Credits.update()){
			PlayerGame.state = GAMESTATE_CREDITS;
		}
		
		if(Button_Start_Options.update()){
			PlayerGame.state = GAMESTATE_OPTIONS;			
		}	
	}

	else if(PlayerGame.state == GAMESTATE_CREDITS){

		ctx.drawImage(creditScreen1, 0, 0);

		//Permanently display text to the screen
	    ctx.font           = 'bold 40px Calibri';
		ctx.fillStyle      = "rgb(0, 0, 0)";

		//Draw permanent names to Credit's canvas
	    ctx.fillText("MITCHELL LUTZKE", 210, 300);
		ctx.fillText("ALEX SOHAIL",     600, 350);
		ctx.fillText("NICK HEINDL",     210, 400);
		ctx.fillText("JASON'S GIRLFRIEND",    600, 450);
		ctx.fillText("JESSE KRIZENESKY",    210, 500);

		if(Button_Credits_MainMenu.update()){
			PlayerGame.state = GAMESTATE_START;
		}
	}
	
	else if(PlayerGame.state == GAMESTATE_LEVEL_SELECT){
		updateButtonText();
		ctx.drawImage(levelSelectBgImg,0,0);
		if(	Button_Level_Select_One.update()){
			PlayerGame.state = GAMESTATE_GAMEPLAY;
			playerData.currentLevel = 0;
			loadGame();
		}

		//for xbox	
		if(Controller.space){		
			PlayerGame.state = GAMESTATE_GAMEPLAY;
			loadGame();							
		}	

		if(	Button_Level_Select_Two.update()){
			PlayerGame.state = GAMESTATE_GAMEPLAY;
			playerData.currentLevel = 1;
			loadGame();
		}

		if(Button_Level_Select_Three.update()){
			PlayerGame.state = GAMESTATE_GAMEPLAY;
			playerData.currentLevel = 2;
			loadGame();
		}

		if(Button_Level_Select_Four.update()){
			PlayerGame.state = GAMESTATE_GAMEPLAY;
			playerData.currentLevel = 3;
			loadGame();
		}
	}
}