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
			// handle booze collectables
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
	if(Button_Gameplay_Reset.clicked()){
		PlayerGame.resetGame();
	}

	if(Button_Gameplay_Options.clicked()){
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

	////////////////////////////////////////////////////////////////////////////////////////// DRAW EVERYTHING
function draw_world() {  

	var canvas = document.getElementById("draw_canvas");

	if (PlayerGame.state == GAMESTATE_GAMEPLAY) {
		draw_game();
				////////////////////////////////////////////////////////////////////////////////////////// SPLASH SCREEN IF-BLOCK

	} else if(PlayerGame.state == GAMESTATE_OPTIONS){

		ctx.drawImage(optionsScreen, 0, 0);
		Button_Options_Start.draw();

		if(Button_Options_Start.clicked()){
			PlayerGame.resetGame();              //reset the game so that you don't start a game at your previous progress/death
			PlayerGame.state = GAMESTATE_START;
		}

	} 

	else if(PlayerGame.state == GAMESTATE_START){
		ctx.drawImage(startScreen, 0, 0);
		Button_Start_Options.draw();
		Button_Start_Credits.draw();
		Button_Start_Play.draw();


		if(Button_Start_Play.clicked()){
			PlayerGame.state = GAMESTATE_GAMEPLAY;
					
		}	
		
		
		if(Button_Start_Credits.clicked())
		{
			PlayerGame.state = GAMESTATE_CREDITS;	
		}
		

		if(Button_Start_Options.clicked()){
			PlayerGame.state = GAMESTATE_OPTIONS;
					
		}	

	}else if(PlayerGame.state == GAMESTATE_CREDITS){
		ctx.drawImage(creditScreen, 0, 0);

		IntToAscii(750, 200);
		
		//Permanently display text to the screen
	    ctx.font           = 'bold 40px Calibri';
		ctx.fillStyle      = "rgb(0, 0, 0)";
		ctx.strokeStyle    = 'black';
		ctx.lineWidth      = 10;
		//Draw permanent names to Credit's canvas
		if(aMitchellL != null)
		{
	        ctx.fillText(sBuildMitchell, 210, 320);
		}
		if(aAlexS != null){
			ctx.fillText(sBuildAlex, 260, 250);
		}
		if(aNickH != null){
			ctx.fillText(sBuildNick, 310, 350);
		}
		if(aJasonA != null){
			ctx.fillText(sBuildJason, 360, 450);
		}
		if(aJesseK != null){
			ctx.fillText(sBuildJesse, 420, 550);
		}
		
		
		
		
		Button_Credits_MainMenu.draw();




		if(Button_Credits_MainMenu.clicked()){
			PlayerGame.state = GAMESTATE_START;
		}
		
		
	}
//end function draw_world()
}

function screenClear(currentGame){
	ctx.fillStyle = currentGame.clearColor;
	ctx.fillRect(0, 0, currentGame.x_boundary, currentGame.y_boundary);
	return true;
}

function IntToAscii(iXStartPosition, iYStartPosition){
	
		//var iXTextPosition = 0;
        //var iYTextPosition = 0;
		var x = String.fromCharCode(iCounter);
		

		//ctx.drawImage(creditNameNick,     50, 250, 200, 100);
		if(bMitchellL == 0){
		    //iStringPosition = sMitchellL.length;
		    
			if(iStringPositionMitchell < sMitchellL.length){
				if(x == sMitchellL.charAt(iStringPositionMitchell)){
					
					ctx.font = 'bold 40px Calibri';
				    ctx.strokeStyle = 'black';
		            ctx.lineWidth   = 10;
	                ctx.fillText(x, iXTextPosition, iYTextPosition);
	                	                
	                aMitchellL[iStringPositionMitchell] = x;         

	                sBuildMitchell += x;
	                
	                iXTextPosition += 40;
	                iCounter = 32;
	                iStringPositionMitchell++;
	                
	                
				}
				//x is a literal character, 
				else if(x != sMitchellL.charAt(iStringPositionMitchell)){
					iCounter++;
				}
				

			}
			
		}
		
		
		if(bJasonA == 0){
			//alert("in bJasonA's loop");

			if(iStringPositionJason < sJasonA.length){
				if(x == sJasonA.charAt(iStringPositionJason)){
					ctx.fillText(x, iXTextPosition, 350);
					
					aJasonA[iStringPositionJason] = x;
					
					sBuildJason += x;
					
					iXTextPosition +=40;
					iCounter = 32;
					iStringPositionJason++;	
				}
				else if(x != sJasonA.charAt(iStringPositionJason)){
					iCounter++;
				}
			}
		}

		
		
	
		if(bAlexS == 0){
			if(iStringPositionAlex < sAlexS.length){
				if(x == sAlexS.charAt(iStringPositionAlex)){
					ctx.fillText(x, iXTextPosition, 350);
					
					aAlexS[iStringPositionAlex] = x;
					
					sBuildAlex += x;
					
					iXTextPosition +=40;
					iCounter = 32;
					iStringPositionAlex++;	
				}
				else if(x != sAlexS.charAt(iStringPositionAlex)){
					iCounter++;
				}
			}
		}
		
		if(bNickH == 0){
			if(iStringPositionNick < sNickH.length){
				if(x == sNickH.charAt(iStringPositionNick)){
					ctx.fillText(x, iXTextPosition, 350);
					
					aNickH[iStringPositionNick] = x;
					
					sBuildNick += x;
					
					iXTextPosition +=40;
					iCounter = 32;
					iStringPositionNick++;	
				}
				else if(x != sNickH.charAt(iStringPositionNick)){
					iCounter++;
				}
			}
		}
		
		if(bJesseK == 0)
		{
			if(iStringPositionJesse < sJesseK.length){
				if(x == sJesseK.charAt(iStringPositionJesse)){
					ctx.fillText(x, iXTextPosition, 350);
					
					aJesseK[iStringPositionJesse] = x;
					
					sBuildJesse += x;
					
					iXTextPosition +=40;
					iCounter = 32;
					iStringPositionJesse++;	
				}
				else if(x != sJesseK.charAt(iStringPositionJesse)){
					iCounter++;
				}
			}
		}
		
		
	
}

