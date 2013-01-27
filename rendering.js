function draw_game() {
	ctx = canvas.getContext("2d");
	ctx.drawImage(background, Math.round(platform_x_movement*(0.5)%background.width-background.width), 0);
	ctx.drawImage(background, Math.round(platform_x_movement*(0.5)%background.width), 0);
	ctx.drawImage(background, Math.round(platform_x_movement*(0.5)%background.width+background.width), 0);

	ctx.drawImage(background2, Math.round(platform_x_movement*(0.8)%background.width-background.width), 0);
	ctx.drawImage(background2, Math.round(platform_x_movement*(0.8)%background.width), 0);
	ctx.drawImage(background2, Math.round(platform_x_movement*(0.8)%background.width+background.width), 0);

		////////////////////////////////////////////////////////////////////////////////////////// DRAW EACH INDIVIDUAL TILE WHERE IT GOES
		for(var i = 0; i<map.length; i++){
			for(var k = 0; k<map[i].length; k++){
				if(imageMap[i][k] != null) ctx.drawImage(imageMap[i][k], k*blocksize+Math.floor(platform_x_movement), Math.floor(i*blocksize), blocksize, blocksize);
			}
		}

		////////////////////////////////////////////////////////////////////////////////////////// DRAW EACH COLLECTABLE
		for(var i = 0; i<collectable.length; i++){
			// handle collectables
			if(!collectable[i].hidden){
				ctx.drawImage(Cell.image, collectable[i].x+Math.floor(platform_x_movement), Math.floor(collectable[i].y));
			}
		}
	
		////////////////////////////////////////////////////////////////////////////////////////// DRAW DAT BUCKY
	drawObject(CurrPlayer, ctx);

		////////////////////////////////////////////////////////////////////////////////////////// DRAW UI
	drawUI(ctx);

		////////////////////////////////////////////////////////////////////////////////////////// DRAW BUTTON
	Button_Gameplay_Reset.draw();
	Button_Gameplay_Options.draw();

	//**************************************************************************************************** Buttons
	if(Button_Gameplay_Reset.update()){
		PlayerGame.resetGame();
	}

	if(Button_Gameplay_Options.update()){
		PlayerGame.state = GAMESTATE_OPTIONS;
	}
		////////////////////////////////////////////////////////////////////////////////////////// DRAW SEXY GRID
	if(grid){
		blocksWidth = map[0].length;
		blocksHeight = map.length;
		for(var i = 0; i*blocksize<=blocksWidth*blocksize; i++){
			ctx.stokeStyle = "rgb(0,0,0)";
			ctx.beginPath();
			ctx.moveTo(0,i*blocksize);
			ctx.lineTo(blocksWidth*blocksize,i*blocksize);
			ctx.stroke();

			ctx.stokeStyle = "rgb(0,0,0)";
			ctx.beginPath();
			ctx.moveTo(i*blocksize+platform_x_movement%blocksize,0);
			ctx.lineTo(i*blocksize+platform_x_movement%blocksize,blocksHeight*blocksize);
			ctx.stroke();

			ctx.stokeStyle = "rgb(0,0,0)";
		}
	}
}

function screenClear(currentGame){ 
	ctx.fillStyle = currentGame.clearColor;
	ctx.fillRect(0, 0, currentGame.x_boundary, currentGame.y_boundary);
	return true;
}

		////////////////////////////////////////////////////////////////////////////////////////// AVOID THIS SHIT
function drawObject(drawableObject, ctx){
	ctx.save();
	ctx.translate(drawableObject.x + drawableObject.width/2 ,drawableObject.y + drawableObject.height/2);
	//ctx.translate(drawableObject.width/2,drawableObject.height/2)
	ctx.rotate(drawableObject.rotation) ;
	ctx.drawImage(drawableObject.image, -drawableObject.width/2, -drawableObject.height/2, drawableObject.width, drawableObject.height);
	ctx.restore();	
	return true;
}


	////////////////////////////////////////////////////////////////////////////////////////// DRAW EVERYTHING
function draw_world() {  

	var canvas = document.getElementById("draw_canvas");

	if (PlayerGame.state == GAMESTATE_GAMEPLAY){
		draw_game();
	}else if(PlayerGame.state == GAMESTATE_OPTIONS){
		ctx.drawImage(optionsScreen, 0, 0);
		//Button_Options_Start.draw();

		if(Button_Options_Start.update()){
			PlayerGame.resetGame();              //reset the game so that you don't start a game at your previous progress/death
			PlayerGame.state = GAMESTATE_START;
		}
	}else if(PlayerGame.state == GAMESTATE_START){
		ctx.drawImage(startScreen, 0, 0);
		//Button_Start_Options.draw();
		//Button_Start_Credits.draw();
		//Button_Start_Play.draw();

		if(Button_Start_Play.update()){
			PlayerGame.state = GAMESTATE_GAMEPLAY;			
		}	
		
		if(Button_Start_Credits.update()){
			PlayerGame.state = GAMESTATE_CREDITS;	
		}
		
		if(Button_Start_Options.update()){
			PlayerGame.state = GAMESTATE_OPTIONS;			
		}	

	}else if(PlayerGame.state == GAMESTATE_CREDITS){
		ctx.drawImage(creditScreen1, 0, 0);
		//ctx.drawImage(creditScreen2, 0, 0)
		//left side
	    ctx.drawImage(creditNameMitchell, 50, 100, 100, 30);
		ctx.drawImage(creditNameAlex, 50, 350);
		ctx.drawImage(creditNameNick, 50, 550);
		//right side
        ctx.drawImage(creditNameJason, 350, 100);
        ctx.drawImage(creditNameJesse, 350, 350);
		
		//Button_Credits_MainMenu.draw();

		if(Button_Credits_MainMenu.update()){
			PlayerGame.state = GAMESTATE_START;
		}
	}
	wiper.update();
}

